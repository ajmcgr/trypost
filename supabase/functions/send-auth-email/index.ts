// Supabase "Send Email" Auth Hook → Resend with branded Post template.
// Configure in Supabase Dashboard → Authentication → Hooks → Send Email Hook.
// Set the URL to this function and paste the generated secret as SEND_EMAIL_HOOK_SECRET.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, webhook-id, webhook-timestamp, webhook-signature",
};

const LOGO_URL = "https://trypost.ai/email-logo.png";
const SITE_URL = "https://trypost.ai";

interface EmailTemplateOptions {
  preheader?: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}

function renderEmail(opts: EmailTemplateOptions): string {
  const { preheader = "", heading, body, ctaLabel, ctaUrl,
    footerNote = "You're receiving this because you have an account with Post." } = opts;
  const cta = ctaLabel && ctaUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 8px;">
        <tr><td><a href="${ctaUrl}" style="display:inline-block;background:#136ed5;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px;">${ctaLabel}</a></td></tr>
      </table>` : "";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
<span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${preheader}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6;padding:48px 16px;">
<tr><td align="center">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;">
<tr><td style="padding:36px 40px 24px;text-align:center;"><img src="${LOGO_URL}" alt="Post" height="32" style="height:32px;width:auto;display:inline-block;" /></td></tr>
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
</td></tr></table></body></html>`;
}

function copyFor(action: string, link: string, token: string) {
  switch (action) {
    case "signup":
      return { subject: "Confirm your email for Post",
        heading: "Welcome to Post 🚀",
        body: "Thanks for signing up. Click the button below to confirm your email and start scheduling.",
        ctaLabel: "Confirm email", ctaUrl: link };
    case "recovery":
      return { subject: "Reset your Post password",
        heading: "Reset your password",
        body: "We received a request to reset your password. Click below to choose a new one. If you didn't request this, you can ignore this email.",
        ctaLabel: "Reset password", ctaUrl: link };
    case "magiclink":
      return { subject: "Your Post sign-in link",
        heading: "Sign in to Post",
        body: "Click below to securely sign in to your Post account.",
        ctaLabel: "Sign in", ctaUrl: link };
    case "invite":
      return { subject: "You've been invited to Post",
        heading: "You're invited to Post",
        body: "You've been invited to join a workspace on Post. Click below to accept and set up your account.",
        ctaLabel: "Accept invite", ctaUrl: link };
    case "email_change":
      return { subject: "Confirm your new email",
        heading: "Confirm your new email",
        body: "Click below to confirm your new email address for your Post account.",
        ctaLabel: "Confirm email", ctaUrl: link };
    case "reauthentication":
      return { subject: `Your Post verification code: ${token}`,
        heading: "Your verification code",
        body: `Use this code to confirm your action: <strong style="font-size:18px;letter-spacing:2px;">${token}</strong>` };
    default:
      return { subject: "Notification from Post",
        heading: "Notification from Post",
        body: "Click below to continue.",
        ctaLabel: link ? "Continue" : undefined, ctaUrl: link || undefined };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not set");

    let data: any;
    if (hookSecret) {
      const wh = new Webhook(hookSecret.replace("v1,whsec_", "").replace("whsec_", ""));
      data = wh.verify(payload, headers);
    } else {
      data = JSON.parse(payload);
    }

    const { user, email_data } = data;
    const {
      token, token_hash, redirect_to, email_action_type,
      site_url,
    } = email_data;

    const base = site_url || SITE_URL;
    const link = `${base}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to || base}`;

    const tpl = copyFor(email_action_type, link, token);
    const html = renderEmail({
      preheader: tpl.subject,
      heading: tpl.heading,
      body: tpl.body,
      ctaLabel: tpl.ctaLabel,
      ctaUrl: tpl.ctaUrl,
    });

    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from: "Post <alex@trypost.ai>",
      to: [user.email],
      subject: tpl.subject,
      html,
    });
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-auth-email error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
