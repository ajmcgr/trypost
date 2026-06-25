const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = req.method === 'POST' ? await req.json().catch(() => null) : null;
    console.log('Meta deauthorize callback received', {
      method: req.method,
      url: req.url,
      payload,
    });

    return json({ success: true });
  } catch (error: any) {
    console.error('Meta deauthorize callback error', error);
    return json({ error: error.message ?? 'Unknown error' }, 400);
  }
});
