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

function html(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    if (req.method === 'GET') {
      const confirmationCode = url.searchParams.get('code') ?? 'pending';
      return html(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Data Deletion Status</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 24px;">
            <h1>Data deletion request received</h1>
            <p>Confirmation code: <strong>${confirmationCode}</strong></p>
          </body>
        </html>
      `);
    }

    const payload = await req.json().catch(() => null);
    const confirmationCode = crypto.randomUUID();
    const statusUrl = `${url.origin}${url.pathname}?code=${confirmationCode}`;

    console.log('Meta data deletion callback received', {
      method: req.method,
      url: req.url,
      payload,
      confirmationCode,
    });

    return json({
      url: statusUrl,
      confirmation_code: confirmationCode,
    });
  } catch (error: any) {
    console.error('Meta data deletion callback error', error);
    return json({ error: error.message ?? 'Unknown error' }, 400);
  }
});
