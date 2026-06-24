import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function resolveRedirectUri(redirectUri: string | null | undefined, platform: string, origin: string | null): string {
  const fallbackOrigin = origin ?? 'https://trypost.ai';
  const candidate = (redirectUri ?? fallbackOrigin).trim();
  return candidate.includes('/oauth/')
    ? candidate
    : `${candidate.replace(/\/+$/, '')}/oauth/${platform}/callback`;
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
      const appId = Deno.env.get('THREADS_APP_ID');
      const redirectUri = resolveRedirectUri(redirect_uri, 'threads', req.headers.get('origin'));
      const scope = 'threads_basic,threads_content_publish';
      const authUrl = `https://threads.net/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;
      
      return new Response(
        JSON.stringify({ authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const appId = Deno.env.get('THREADS_APP_ID');
    const appSecret = Deno.env.get('THREADS_APP_SECRET');
    const redirectUri = resolveRedirectUri(redirect_uri, 'threads', req.headers.get('origin'));

    const tokenResponse = await fetch(
      `https://graph.threads.net/oauth/access_token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: appId!,
          client_secret: appSecret!,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Threads token error:', tokenData);
      throw new Error('Failed to get access token');
    }

    const meResponse = await fetch(
      `https://graph.threads.net/v1.0/me?fields=id,username&access_token=${tokenData.access_token}`
    );
    const meData = await meResponse.json();

    const { error: dbError } = await supabase
      .from('oauth_connections')
      .upsert({
        user_id: user.id,
        platform: 'threads',
        platform_user_id: meData.id,
        platform_username: meData.username,
        access_token: tokenData.access_token,
        is_connected: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,platform'
      });

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({ success: true, username: meData.username }),
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
