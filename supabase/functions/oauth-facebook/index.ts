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

async function fetchMetaPages(userAccessToken: string) {
  const pagesResponse = await fetch(
    `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(userAccessToken)}`
  );
  const pagesData = await pagesResponse.json();
  if (!pagesResponse.ok) {
    console.error('Facebook pages error:', pagesData);
    throw new Error(pagesData.error?.message || 'Failed to load Facebook pages');
  }
  return pagesData.data ?? [];
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
      const appId = Deno.env.get('FACEBOOK_APP_ID');
      const redirectUri = resolveRedirectUri(redirect_uri, 'facebook', req.headers.get('origin'));
      const scope = 'pages_manage_posts,pages_read_engagement,pages_show_list,business_management';
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;
      
      return new Response(
        JSON.stringify({ authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const appId = Deno.env.get('FACEBOOK_APP_ID');
    const appSecret = Deno.env.get('FACEBOOK_APP_SECRET');
    const redirectUri = resolveRedirectUri(redirect_uri, 'facebook', req.headers.get('origin'));

    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`
    );

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Facebook token error:', tokenData);
      throw new Error('Failed to get access token');
    }

    const pages = await fetchMetaPages(tokenData.access_token);
    const page = pages[0];
    if (!page?.id || !page?.access_token) {
      throw new Error('No Facebook page was returned. Connect a page to this Meta app first.');
    }

    const { error: dbError } = await supabase
      .from('oauth_connections')
      .upsert({
        user_id: user.id,
        platform: 'facebook',
        platform_user_id: page.id,
        platform_username: page.name,
        access_token: page.access_token,
        is_connected: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,platform'
      });

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({ success: true, username: page.name }),
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
