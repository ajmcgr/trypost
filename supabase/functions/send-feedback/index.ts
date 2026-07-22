import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const SITE_URL = 'https://trypost.ai';

// Inline shared template so the function bundles without external imports.
interface EmailTemplateOptions {
  preheader?: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}

const LOGO_URL = 'https://trypost.ai/email-logo.png';

function renderEmail(opts: EmailTemplateOptions): string {
  const {
    preheader = '',
    heading,
    body,
    ctaLabel,
    ctaUrl,
    footerNote = "You're receiving this because you have an account with Post.",
  } = opts;

  const cta = ctaLabel && ctaUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 8px;">
        <tr><td>
          <a href="${ctaUrl}" style="display:inline-block;background:#136ed5;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px;">${ctaLabel}</a>
        </td></tr>
      </table>`
    : '';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${preheader}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6;padding:48px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;">
        <tr><td style="padding:36px 40px 24px;text-align:center;">
          <img src="${LOGO_URL}" alt="Post" height="32" style="height:32px;width:auto;display:inline-block;" />
        </td></tr>
        <tr><td style="padding:0 40px;"><div style="height:1px;background:#e5e7eb;"></div></td></tr>
        <tr><td style="padding:28px 40px 8px;">
          <h1 style="margin:0 0 12px;font-size:20px;line-height:1.35;font-weight:700;color:#0f172a;">${heading}</h1>
          <div style="font-size:15px;line-height:1.6;color:#334155;">${body}</div>
          ${cta}
        </td></tr>
        <tr><td style="padding:24px 40px 32px;"><div style="height:1px;background:#e5e7eb;margin-bottom:20px;"></div>
          <p style="margin:0;text-align:center;font-size:13px;color:#94a3b8;">${footerNote}</p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">© Post · <a href="${SITE_URL}" style="color:#94a3b8;text-decoration:none;">trypost.ai</a></p>
    </td></tr>
  </table>
</body></html>`;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeedbackRequest {
  feedback: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify authentication
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { feedback }: FeedbackRequest = await req.json();

    if (!feedback || feedback.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Feedback cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing feedback from:', user.email);

    // Send feedback email using Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    await resend.emails.send({
      from: 'Post Feedback <alex@trypost.ai>',
      to: ['alex@trypost.ai'],
      reply_to: user.email || undefined,
      subject: `New Feedback from ${user.email || 'User'}`,
      html: renderEmail({
        preheader: `New feedback from ${user.email || 'a user'}`,
        heading: '📬 New feedback received',
        body: `
          <p style="margin:0 0 12px;"><strong>From:</strong> ${user.email || 'Unknown'}<br/>
          <strong>User ID:</strong> ${user.id}</p>
          <div style="background:#f9fafb;border-left:3px solid #136ed5;padding:14px 16px;border-radius:8px;margin:16px 0;white-space:pre-wrap;">${feedback}</div>
          <p style="margin:0;color:#64748b;font-size:13px;">Submitted on ${new Date().toLocaleString()}</p>
        `,
        footerNote: 'Internal notification from the Post feedback form.',
      }),
    });

    console.log('Feedback email sent successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Feedback submitted successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
