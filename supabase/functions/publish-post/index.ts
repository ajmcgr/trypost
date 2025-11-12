import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PublishRequest {
  content: string;
  platforms: string[];
}

interface PublishResult {
  platform: string;
  success: boolean;
  error?: string;
  post_id?: string;
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

    const { content, platforms }: PublishRequest = await req.json();

    if (!content || !platforms || platforms.length === 0) {
      throw new Error('Missing content or platforms');
    }

    // Fetch OAuth tokens for selected platforms
    const { data: connections, error: connError } = await supabase
      .from('oauth_connections')
      .select('*')
      .eq('user_id', user.id)
      .in('platform', platforms)
      .eq('is_connected', true);

    if (connError) throw connError;

    const results: PublishResult[] = [];

    // Publish to each platform
    for (const platform of platforms) {
      const connection = connections?.find(c => c.platform === platform);
      
      if (!connection) {
        results.push({
          platform,
          success: false,
          error: 'Not connected to this platform',
        });
        continue;
      }

      try {
        let result;
        
        switch (platform) {
          case 'twitter':
            result = await publishToTwitter(content, connection.access_token, connection.access_token_secret);
            break;
          case 'facebook':
            result = await publishToFacebook(content, connection.access_token, connection.platform_user_id);
            break;
          case 'linkedin':
            result = await publishToLinkedIn(content, connection.access_token, connection.platform_user_id);
            break;
          case 'threads':
            result = await publishToThreads(content, connection.access_token, connection.platform_user_id);
            break;
          default:
            result = { success: false, error: 'Platform not supported yet' };
        }

        results.push({
          platform,
          ...result,
        });
      } catch (error: any) {
        console.error(`Error publishing to ${platform}:`, error);
        results.push({
          platform,
          success: false,
          error: error.message,
        });
      }
    }

    // Store post history
    await supabase.from('posts').insert({
      user_id: user.id,
      content,
      platforms,
      results,
    });

    return new Response(
      JSON.stringify({ success: true, results }),
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

// Twitter Publishing
function generateTwitterSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  const hmacSha1 = createHmac("sha1", signingKey);
  return hmacSha1.update(signatureBaseString).digest("base64");
}

async function publishToTwitter(content: string, accessToken: string, accessTokenSecret: string) {
  const apiKey = Deno.env.get('TWITTER_CONSUMER_KEY');
  const apiSecret = Deno.env.get('TWITTER_CONSUMER_SECRET');
  
  if (!apiKey || !apiSecret) {
    throw new Error('Twitter API credentials not configured');
  }

  const url = 'https://api.x.com/2/tweets';
  const method = 'POST';

  const oauthParams = {
    oauth_consumer_key: apiKey,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  const signature = generateTwitterSignature(method, url, oauthParams, apiSecret, accessTokenSecret);

  const authHeader = 'OAuth ' + Object.entries({ ...oauthParams, oauth_signature: signature })
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
    .join(', ');

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: content }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to post to Twitter');
  }

  return { success: true, post_id: data.data?.id };
}

// Facebook Publishing
async function publishToFacebook(content: string, accessToken: string, userId: string) {
  const response = await fetch(`https://graph.facebook.com/v18.0/${userId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: content,
      access_token: accessToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to post to Facebook');
  }

  return { success: true, post_id: data.id };
}

// LinkedIn Publishing
async function publishToLinkedIn(content: string, accessToken: string, userId: string) {
  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: `urn:li:person:${userId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to post to LinkedIn');
  }

  return { success: true, post_id: data.id };
}

// Threads Publishing
async function publishToThreads(content: string, accessToken: string, userId: string) {
  // Step 1: Create container
  const containerResponse = await fetch(
    `https://graph.threads.net/v1.0/${userId}/threads`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'TEXT',
        text: content,
        access_token: accessToken,
      }),
    }
  );

  const containerData = await containerResponse.json();

  if (!containerResponse.ok) {
    throw new Error(containerData.error?.message || 'Failed to create Threads container');
  }

  // Step 2: Publish container
  const publishResponse = await fetch(
    `https://graph.threads.net/v1.0/${userId}/threads_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: accessToken,
      }),
    }
  );

  const publishData = await publishResponse.json();

  if (!publishResponse.ok) {
    throw new Error(publishData.error?.message || 'Failed to publish to Threads');
  }

  return { success: true, post_id: publishData.id };
}
