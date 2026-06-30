import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function resolveRedirectUri(redirectUri: string | null | undefined, origin: string | null): string {
  const fallbackOrigin = origin ?? 'https://trypost.ai';
  const candidate = (redirectUri ?? fallbackOrigin).trim();
  return candidate.includes('/oauth/')
    ? candidate
    : `${candidate.replace(/\/+$/, '')}/oauth/tiktok/callback`;
}

function getTikTokClientKey(): string | null {
  return Deno.env.get('TIKTOK_CLIENT_KEY') ?? Deno.env.get('TIKTOK_CLIENT_ID');
}

async function readJsonResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { code, redirect_uri } = await req.json();

    if (!code) {
      // Return authorization URL
      const clientKey = getTikTokClientKey();
      const redirectUri = resolveRedirectUri(redirect_uri, req.headers.get('origin'));
      const scope = 'user.info.basic,video.publish';
      const csrfState = Math.random().toString(36).substring(2);

      if (!clientKey) {
        throw new Error('TikTok client key is not configured');
      }

      const authUrl = `https://www.tiktok.com/v2/auth/authorize?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${csrfState}`;
      
      return new Response(
        JSON.stringify({ authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Exchange code for token
    const clientKey = getTikTokClientKey();
    const clientSecret = Deno.env.get('TIKTOK_CLIENT_SECRET');
    const redirectUri = resolveRedirectUri(redirect_uri, req.headers.get('origin'));

    if (!clientKey || !clientSecret) {
      throw new Error('TikTok client credentials are not configured');
    }

    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: new URLSearchParams({
        client_key: clientKey!,
        client_secret: clientSecret!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await readJsonResponse(tokenResponse);
    
    if (!tokenResponse.ok) {
      console.error('TikTok token error:', tokenData);
      throw new Error(tokenData.error?.message || tokenData.error_description || tokenData.message || tokenData.raw || 'Failed to get access token');
    }

    // Get user info
    const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await readJsonResponse(userResponse);
    if (!userResponse.ok) {
      console.error('TikTok user info error:', userData);
      throw new Error(userData.error?.message || userData.error_description || userData.message || userData.raw || 'Failed to load TikTok profile');
    }

    const tikTokUser = userData.data?.user;
    if (!tikTokUser?.open_id) {
      console.error('TikTok user payload missing open_id:', userData);
      throw new Error('TikTok profile response did not include an open_id');
    }

    // Store connection
    const { error: dbError } = await supabase
      .from('oauth_connections')
      .upsert({
        user_id: user.id,
        platform: 'tiktok',
        platform_user_id: tikTokUser.open_id,
        platform_username: tikTokUser.display_name || 'TikTok User',
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        is_connected: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,platform'
      });

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({ success: true, username: tikTokUser.display_name || 'TikTok User' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
