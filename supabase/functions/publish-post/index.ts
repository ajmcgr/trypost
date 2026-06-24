// Unified social publishing API.
// Supports text + image + video across Twitter/X, Facebook, Instagram,
// LinkedIn, Threads, TikTok, YouTube. Per-user OAuth tokens are pulled
// from public.oauth_connections.

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Platform =
  | 'twitter' | 'facebook' | 'instagram'
  | 'linkedin' | 'threads' | 'tiktok' | 'youtube';

interface MediaRef { path: string; url: string; kind: 'image' | 'video'; mime?: string }

interface PublishRequest {
  content: string;
  platforms: Platform[];
  media?: MediaRef[];
  // Optional YouTube-only metadata
  title?: string;
  privacy?: 'public' | 'unlisted' | 'private';
}

interface PublishResult {
  platform: Platform;
  success: boolean;
  post_id?: string;
  url?: string;
  error?: string;
}

const PLATFORM_LIMITS: Record<Platform, number> = {
  twitter: 280,
  threads: 500,
  linkedin: 3000,
  facebook: 63206,
  instagram: 2200,
  tiktok: 2200,
  youtube: 5000,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    const body: PublishRequest = await req.json();
    const { content = '', platforms = [], media = [] } = body;

    if (!platforms.length) throw new Error('Select at least one platform');
    if (!content.trim() && media.length === 0) throw new Error('Empty post');

    const { data: connections, error: connErr } = await supabase
      .from('oauth_connections')
      .select('*')
      .eq('user_id', user.id)
      .in('platform', platforms)
      .eq('is_connected', true);
    if (connErr) throw connErr;

    const image = media.find((m) => m.kind === 'image');
    const video = media.find((m) => m.kind === 'video');

    const tasks = platforms.map(async (platform): Promise<PublishResult> => {
      try {
        if (content.length > PLATFORM_LIMITS[platform]) {
          return { platform, success: false, error: `Exceeds ${PLATFORM_LIMITS[platform]} char limit` };
        }
        const conn = connections?.find((c) => c.platform === platform);
        if (!conn) return { platform, success: false, error: 'Not connected' };

        switch (platform) {
          case 'twitter':  return await pubTwitter(conn, content, image, video);
          case 'facebook': return await pubFacebook(conn, content, image, video);
          case 'instagram':return await pubInstagram(conn, content, image, video);
          case 'linkedin': return await pubLinkedIn(conn, content, image, video);
          case 'threads':  return await pubThreads(conn, content, image, video);
          case 'tiktok':   return await pubTikTok(conn, content, video);
          case 'youtube':  return await pubYouTube(admin, conn, content, video, body.title, body.privacy);
        }
      } catch (e: any) {
        console.error(`publish ${platform} failed:`, e);
        return { platform, success: false, error: e.message ?? String(e) };
      }
    });

    const results = await Promise.all(tasks);

    await admin.from('posts').insert({
      user_id: user.id,
      content,
      platforms,
      results,
      media,
    });

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('publish-post error:', err);
    return new Response(
      JSON.stringify({ error: err.message ?? 'Publish failed' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ---------- shared helpers ----------

async function fetchBytes(url: string): Promise<Uint8Array> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to download media (${r.status})`);
  return new Uint8Array(await r.arrayBuffer());
}

function pct(n: number) { return encodeURIComponent(n.toString()); }

// ---------- Twitter / X ----------
// OAuth 1.0a user context. Images via v1.1 media/upload, then v2 /tweets.
function twSig(method: string, url: string, params: Record<string, string>, cs: string, ts: string) {
  const base = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(
    Object.entries(params).sort().map(([k, v]) => `${k}=${v}`).join('&')
  )}`;
  return createHmac('sha1', `${encodeURIComponent(cs)}&${encodeURIComponent(ts)}`).update(base).digest('base64');
}
function twAuthHeader(method: string, url: string, accessToken: string, accessSecret: string, extra: Record<string,string> = {}) {
  const apiKey = Deno.env.get('TWITTER_CONSUMER_KEY')!;
  const apiSecret = Deno.env.get('TWITTER_CONSUMER_SECRET')!;
  const oauth: Record<string,string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomUUID().replace(/-/g, ''),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };
  const sig = twSig(method, url, { ...oauth, ...extra }, apiSecret, accessSecret);
  return 'OAuth ' + Object.entries({ ...oauth, oauth_signature: sig })
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`).join(', ');
}
async function twUploadMedia(accessToken: string, accessSecret: string, bytes: Uint8Array, mime: string, isVideo: boolean): Promise<string> {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  // INIT
  const initParams = { command: 'INIT', total_bytes: bytes.length.toString(), media_type: mime, ...(isVideo ? { media_category: 'tweet_video' } : {}) };
  const initAuth = twAuthHeader('POST', url, accessToken, accessSecret, initParams);
  const initRes = await fetch(url, {
    method: 'POST',
    headers: { Authorization: initAuth, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: Object.entries(initParams).map(([k,v]) => `${k}=${pct(v as any)}`).join('&'),
  });
  const initJson = await initRes.json();
  if (!initRes.ok) throw new Error(`Twitter INIT: ${JSON.stringify(initJson)}`);
  const mediaId = initJson.media_id_string as string;

  // APPEND (chunked, 4MB)
  const chunkSize = 4 * 1024 * 1024;
  let segment = 0;
  for (let off = 0; off < bytes.length; off += chunkSize) {
    const chunk = bytes.slice(off, Math.min(off + chunkSize, bytes.length));
    const params = { command: 'APPEND', media_id: mediaId, segment_index: segment.toString() };
    const auth = twAuthHeader('POST', url, accessToken, accessSecret, params);
    const fd = new FormData();
    fd.append('command', 'APPEND');
    fd.append('media_id', mediaId);
    fd.append('segment_index', segment.toString());
    fd.append('media', new Blob([chunk], { type: 'application/octet-stream' }));
    const r = await fetch(url, { method: 'POST', headers: { Authorization: auth }, body: fd });
    if (!r.ok) throw new Error(`Twitter APPEND: ${await r.text()}`);
    segment++;
  }

  // FINALIZE
  const finParams = { command: 'FINALIZE', media_id: mediaId };
  const finAuth = twAuthHeader('POST', url, accessToken, accessSecret, finParams);
  const finRes = await fetch(url, {
    method: 'POST',
    headers: { Authorization: finAuth, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `command=FINALIZE&media_id=${mediaId}`,
  });
  const finJson = await finRes.json();
  if (!finRes.ok) throw new Error(`Twitter FINALIZE: ${JSON.stringify(finJson)}`);

  // Poll STATUS for video
  if (finJson.processing_info) {
    let info = finJson.processing_info;
    while (info.state === 'pending' || info.state === 'in_progress') {
      await new Promise((r) => setTimeout(r, (info.check_after_secs ?? 2) * 1000));
      const sUrl = `${url}?command=STATUS&media_id=${mediaId}`;
      const sAuth = twAuthHeader('GET', url, accessToken, accessSecret, { command: 'STATUS', media_id: mediaId });
      const s = await fetch(sUrl, { headers: { Authorization: sAuth } });
      const sj = await s.json();
      info = sj.processing_info;
      if (info?.state === 'failed') throw new Error(`Twitter media processing failed: ${JSON.stringify(info)}`);
      if (!info) break;
    }
  }
  return mediaId;
}
async function pubTwitter(conn: any, content: string, image?: MediaRef, video?: MediaRef): Promise<PublishResult> {
  const mediaIds: string[] = [];
  const m = video ?? image;
  if (m) {
    const bytes = await fetchBytes(m.url);
    const id = await twUploadMedia(conn.access_token, conn.access_token_secret, bytes, m.mime ?? (m.kind === 'video' ? 'video/mp4' : 'image/jpeg'), m.kind === 'video');
    mediaIds.push(id);
  }
  const url = 'https://api.x.com/2/tweets';
  const auth = twAuthHeader('POST', url, conn.access_token, conn.access_token_secret);
  const body: any = { text: content };
  if (mediaIds.length) body.media = { media_ids: mediaIds };
  const r = await fetch(url, { method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(j.detail || j.title || 'Twitter post failed');
  return { platform: 'twitter', success: true, post_id: j.data?.id, url: `https://x.com/i/web/status/${j.data?.id}` };
}

// ---------- Facebook ----------
async function pubFacebook(conn: any, content: string, image?: MediaRef, video?: MediaRef): Promise<PublishResult> {
  const token = conn.access_token;
  const pageId = conn.platform_user_id;
  if (video) {
    const r = await fetch(`https://graph-video.facebook.com/v18.0/${pageId}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_url: video.url, description: content, access_token: token }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error?.message || 'Facebook video failed');
    return { platform: 'facebook', success: true, post_id: j.id };
  }
  if (image) {
    const r = await fetch(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: image.url, caption: content, access_token: token }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error?.message || 'Facebook photo failed');
    return { platform: 'facebook', success: true, post_id: j.post_id ?? j.id };
  }
  const r = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content, access_token: token }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || 'Facebook post failed');
  return { platform: 'facebook', success: true, post_id: j.id };
}

// ---------- Instagram (Graph) ----------
async function igCreateContainer(igUserId: string, token: string, body: Record<string, string>) {
  const qs = new URLSearchParams({ ...body, access_token: token });
  const r = await fetch(`https://graph.facebook.com/v18.0/${igUserId}/media?${qs}`, { method: 'POST' });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || 'IG container failed');
  return j.id as string;
}
async function igPollContainer(containerId: string, token: string) {
  for (let i = 0; i < 30; i++) {
    const r = await fetch(`https://graph.facebook.com/v18.0/${containerId}?fields=status_code&access_token=${token}`);
    const j = await r.json();
    if (j.status_code === 'FINISHED') return;
    if (j.status_code === 'ERROR') throw new Error('IG processing error');
    await new Promise((res) => setTimeout(res, 2000));
  }
  throw new Error('IG container processing timeout');
}
async function pubInstagram(conn: any, content: string, image?: MediaRef, video?: MediaRef): Promise<PublishResult> {
  if (!image && !video) return { platform: 'instagram', success: false, error: 'Instagram requires an image or video' };
  const token = conn.access_token;
  const igUser = conn.platform_user_id;

  const params: Record<string,string> = { caption: content };
  if (video) { params.media_type = 'REELS'; params.video_url = video.url; }
  else { params.image_url = image!.url; }

  const containerId = await igCreateContainer(igUser, token, params);
  if (video) await igPollContainer(containerId, token);

  const pubRes = await fetch(`https://graph.facebook.com/v18.0/${igUser}/media_publish?creation_id=${containerId}&access_token=${token}`, { method: 'POST' });
  const pubJson = await pubRes.json();
  if (!pubRes.ok) throw new Error(pubJson.error?.message || 'IG publish failed');
  return { platform: 'instagram', success: true, post_id: pubJson.id };
}

// ---------- LinkedIn ----------
async function liRegisterUpload(token: string, owner: string, recipe: string) {
  const r = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: [recipe],
        owner,
        serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
      },
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`LinkedIn register: ${JSON.stringify(j)}`);
  return {
    uploadUrl: j.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl as string,
    asset: j.value.asset as string,
  };
}
async function pubLinkedIn(conn: any, content: string, image?: MediaRef, video?: MediaRef): Promise<PublishResult> {
  const token = conn.access_token;
  const owner = `urn:li:person:${conn.platform_user_id}`;
  let media: any[] = [];
  let category = 'NONE';

  const asset = video ?? image;
  if (asset) {
    const recipe = asset.kind === 'video' ? 'urn:li:digitalmediaRecipe:feedshare-video' : 'urn:li:digitalmediaRecipe:feedshare-image';
    const { uploadUrl, asset: urn } = await liRegisterUpload(token, owner, recipe);
    const bytes = await fetchBytes(asset.url);
    const up = await fetch(uploadUrl, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: bytes });
    if (!up.ok) throw new Error(`LinkedIn upload failed (${up.status})`);
    category = asset.kind === 'video' ? 'VIDEO' : 'IMAGE';
    media = [{ status: 'READY', media: urn }];
  }

  const r = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
    body: JSON.stringify({
      author: owner,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: content },
          shareMediaCategory: category,
          ...(media.length ? { media } : {}),
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.message || 'LinkedIn post failed');
  return { platform: 'linkedin', success: true, post_id: j.id };
}

// ---------- Threads ----------
async function threadsPollContainer(containerId: string, token: string) {
  for (let i = 0; i < 30; i++) {
    const r = await fetch(`https://graph.threads.net/v1.0/${containerId}?fields=status&access_token=${token}`);
    const j = await r.json();
    if (j.status === 'FINISHED') return;
    if (j.status === 'ERROR') throw new Error('Threads processing error');
    await new Promise((res) => setTimeout(res, 2000));
  }
  throw new Error('Threads container processing timeout');
}
async function pubThreads(conn: any, content: string, image?: MediaRef, video?: MediaRef): Promise<PublishResult> {
  const token = conn.access_token;
  const userId = conn.platform_user_id;
  const params: Record<string,string> = { text: content, access_token: token };
  if (video) { params.media_type = 'VIDEO'; params.video_url = video.url; }
  else if (image) { params.media_type = 'IMAGE'; params.image_url = image.url; }
  else { params.media_type = 'TEXT'; }

  const qs = new URLSearchParams(params);
  const cRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads?${qs}`, { method: 'POST' });
  const cJson = await cRes.json();
  if (!cRes.ok) throw new Error(cJson.error?.message || 'Threads container failed');

  if (video || image) await threadsPollContainer(cJson.id, token);

  const pRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish?creation_id=${cJson.id}&access_token=${token}`, { method: 'POST' });
  const pJson = await pRes.json();
  if (!pRes.ok) throw new Error(pJson.error?.message || 'Threads publish failed');
  return { platform: 'threads', success: true, post_id: pJson.id };
}

// ---------- TikTok ----------
async function pubTikTok(conn: any, content: string, video?: MediaRef): Promise<PublishResult> {
  if (!video) return { platform: 'tiktok', success: false, error: 'TikTok requires a video' };
  const token = conn.access_token;
  const bytes = await fetchBytes(video.url);
  const videoSize = bytes.length;
  const chunkSize = Math.min(videoSize, 10 * 1024 * 1024);
  const totalChunks = Math.ceil(videoSize / chunkSize);

  // INIT
  const initRes = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      post_info: { title: content.slice(0, 2200), privacy_level: 'SELF_ONLY', disable_duet: false, disable_comment: false, disable_stitch: false },
      source_info: { source: 'FILE_UPLOAD', video_size: videoSize, chunk_size: chunkSize, total_chunk_count: totalChunks },
    }),
  });
  const initJson = await initRes.json();
  if (!initRes.ok) throw new Error(initJson.error?.message || 'TikTok init failed');
  const { upload_url, publish_id } = initJson.data;

  // PUT chunks
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, videoSize) - 1;
    const chunk = bytes.slice(start, end + 1);
    const up = await fetch(upload_url, {
      method: 'PUT',
      headers: {
        'Content-Type': video.mime ?? 'video/mp4',
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Content-Length': chunk.length.toString(),
      },
      body: chunk,
    });
    if (!up.ok && up.status !== 201 && up.status !== 206) {
      throw new Error(`TikTok chunk upload failed (${up.status}): ${await up.text()}`);
    }
  }

  return { platform: 'tiktok', success: true, post_id: publish_id };
}

// ---------- YouTube ----------
async function refreshGoogleToken(admin: SupabaseClient, conn: any): Promise<string> {
  if (conn.token_expires_at && new Date(conn.token_expires_at).getTime() - Date.now() > 60_000) {
    return conn.access_token;
  }
  if (!conn.refresh_token) return conn.access_token;
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID') ?? Deno.env.get('YOUTUBE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET') ?? Deno.env.get('YOUTUBE_CLIENT_SECRET');
  if (!clientId || !clientSecret) return conn.access_token;
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId, client_secret: clientSecret,
      refresh_token: conn.refresh_token, grant_type: 'refresh_token',
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`YouTube token refresh failed: ${j.error_description || j.error}`);
  await admin.from('oauth_connections').update({
    access_token: j.access_token,
    token_expires_at: new Date(Date.now() + j.expires_in * 1000).toISOString(),
  }).eq('id', conn.id);
  return j.access_token;
}
async function pubYouTube(admin: SupabaseClient, conn: any, content: string, video?: MediaRef, title?: string, privacy: 'public'|'unlisted'|'private' = 'public'): Promise<PublishResult> {
  if (!video) return { platform: 'youtube', success: false, error: 'YouTube requires a video' };
  const token = await refreshGoogleToken(admin, conn);
  const bytes = await fetchBytes(video.url);

  const metadata = {
    snippet: { title: (title ?? content.split('\n')[0] ?? 'Untitled').slice(0, 100), description: content.slice(0, 5000) },
    status: { privacyStatus: privacy, selfDeclaredMadeForKids: false },
  };

  // Resumable upload init
  const initRes = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Length': bytes.length.toString(),
      'X-Upload-Content-Type': video.mime ?? 'video/mp4',
    },
    body: JSON.stringify(metadata),
  });
  if (!initRes.ok) throw new Error(`YouTube init failed: ${await initRes.text()}`);
  const uploadUrl = initRes.headers.get('Location');
  if (!uploadUrl) throw new Error('YouTube did not return upload URL');

  const up = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': video.mime ?? 'video/mp4', 'Content-Length': bytes.length.toString() },
    body: bytes,
  });
  const upJson = await up.json();
  if (!up.ok) throw new Error(upJson.error?.message || 'YouTube upload failed');
  return { platform: 'youtube', success: true, post_id: upJson.id, url: `https://youtu.be/${upJson.id}` };
}
