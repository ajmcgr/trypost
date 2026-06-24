import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MAX_IMAGE = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO = 200 * 1024 * 1024; // 200 MB

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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) throw new Error('Missing file');

    const mime = file.type || 'application/octet-stream';
    const isImage = mime.startsWith('image/');
    const isVideo = mime.startsWith('video/');
    if (!isImage && !isVideo) throw new Error(`Unsupported mime type: ${mime}`);

    const limit = isImage ? MAX_IMAGE : MAX_VIDEO;
    if (file.size > limit) throw new Error(`File too large (max ${Math.round(limit / 1024 / 1024)}MB)`);

    const ext = (file.name.split('.').pop() || (isImage ? 'jpg' : 'mp4')).toLowerCase();
    const id = crypto.randomUUID();
    const path = `${user.id}/${id}.${ext}`;

    // Use service role to bypass RLS for the upload (we've already verified user)
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { error: upErr } = await admin.storage
      .from('post-media')
      .upload(path, file, { contentType: mime, upsert: false });
    if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

    // Return a long-lived signed URL the publisher can re-sign later
    const { data: signed, error: signErr } = await admin.storage
      .from('post-media')
      .createSignedUrl(path, 60 * 60 * 24); // 24h
    if (signErr) throw signErr;

    return new Response(
      JSON.stringify({
        media_id: id,
        path,
        url: signed.signedUrl,
        mime,
        size: file.size,
        kind: isImage ? 'image' : 'video',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('upload-media error:', err);
    return new Response(
      JSON.stringify({ error: err.message ?? 'Upload failed' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
