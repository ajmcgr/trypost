// Creates a Supabase auth user (auto-confirmed) and sends a branded welcome
// email via Resend's REST API. Bypasses Supabase's built-in confirmation
// email entirely so it is not subject to Supabase's auth email rate limit.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOGO_URL = "https://trypost.ai/email-logo.png";
const SITE_URL = "https://trypost.ai";

function renderWelcomeEmail(fullName: string) {
  const name = fullName?.trim() || "there";
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Welcome to Post</title></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1d1d1f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <tr><td style="padding:32px 40px 0;text-align:left;">
          <img src="${LOGO_URL}" alt="Post" height="32" style="display:block;height:32px;">
        </td></tr>
        <tr><td style="padding:24px 40px 8px;">
          <h1 style="margin:0;font-size:24px;font-weight:600;color:#1d1d1f;">Welcome to Post 🚀</h1>
        </td></tr>
        <tr><td style="padding:8px 40px 24px;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3a3a3c;">Hi ${name},</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3a3a3c;">Your account is ready. You can start scheduling posts across X, LinkedIn, Instagram, Facebook, YouTube, Threads, and TikTok — all from one dashboard.</p>
          <p style="margin:24px 0;text-align:center;">
            <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#136ed5;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:12px;">Open dashboard →</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

interface SignupRequest {
  email: string;
  password: string;
  fullName?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return json({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in function env" }, 500);
    }

    let body: SignupRequest;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const { email, password, fullName } = body;
    if (!email || !password) {
      return json({ error: "Email and password are required" }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName ?? "" },
    });

    if (error) {
      return json({ error: error.message }, 400);
    }

    // Best-effort welcome email via Resend REST (no SDK to avoid boot-time imports).
    if (RESEND_API_KEY) {
      try {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Post <alex@trypost.ai>",
            to: [email],
            subject: "Welcome to Post 🚀",
            html: renderWelcomeEmail(fullName ?? ""),
          }),
        });
        if (!r.ok) {
          console.error("Resend send failed:", r.status, await r.text());
        }
      } catch (e) {
        console.error("Resend welcome email failed:", e);
      }
    } else {
      console.warn("RESEND_API_KEY not set — skipping welcome email");
    }

    return json({ success: true, user: data.user }, 200);
  } catch (err) {
    console.error("signup-user error:", err);
    return json({ error: (err as Error).message ?? "Unknown error" }, 500);
  }
});
