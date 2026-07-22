// Sends branded notification emails via Resend.
// Supported types:
//   - connection_success: after a social account connects successfully
//   - post_failed:        when a post fails on one or more platforms

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@2.0.0';
import { renderEmail } from '../_shared/email-template.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-scheduler-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PLATFORM_LABELS: Record<string, string> = {
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  threads: 'Threads',
  tiktok: 'TikTok',
};

interface FailureResult { platform: string; success: boolean; error?: string }

interface NotifyRequest {
  type: 'connection_success' | 'post_failed';
  userId?: string;
  email?: string;
  platform?: string;
  platformUsername?: string | null;
  content?: string;
  results?: FailureResult[];
}

const SITE_URL = 'https://trypost.ai';

function labelFor(p: string) {
  return PLATFORM_LABELS[p] ?? p;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey);

    const body = (await req.json()) as NotifyRequest;
    if (!body?.type) throw new Error('Missing type');

    // Resolve recipient email.
    let email = body.email;
    let userId = body.userId;

    if (!email) {
      // Try to authenticate the caller and use their email.
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace(/^Bearer\s+/i, '');
        const { data: { user } } = await admin.auth.getUser(token);
        if (user) {
          email = user.email ?? undefined;
          userId = userId ?? user.id;
        }
      }
      if (!email && userId) {
        const { data } = await admin.auth.admin.getUserById(userId);
        email = data.user?.email ?? undefined;
      }
    }

    if (!email) throw new Error('Recipient email could not be resolved');

    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) throw new Error('RESEND_API_KEY not configured');
    const resend = new Resend(resendKey);

    let subject = '';
    let html = '';

    if (body.type === 'connection_success') {
      const name = labelFor(body.platform ?? '');
      subject = `${name} connected to Post`;
      const handle = body.platformUsername ? `<strong>@${body.platformUsername}</strong>` : 'Your account';
      html = renderEmail({
        preheader: `${name} is now connected to your Post account.`,
        heading: `${name} connected 🎉`,
        body: `
          <p style="margin:0 0 12px;">${handle} is now connected to Post. You can start scheduling and publishing to ${name} from your dashboard.</p>
          <p style="margin:0;color:#64748b;font-size:13px;">If you didn't connect this account, you can disconnect it any time from your dashboard.</p>
        `,
        ctaLabel: 'Create a post',
        ctaUrl: `${SITE_URL}/dashboard/composer`,
      });
    } else if (body.type === 'post_failed') {
      const failed = (body.results ?? []).filter((r) => !r.success);
      const rows = failed.map((r) => `
        <tr>
          <td style="padding:8px 0;color:#0f172a;font-weight:600;">${labelFor(r.platform)}</td>
          <td style="padding:8px 0;color:#b91c1c;">${r.error ?? 'Unknown error'}</td>
        </tr>
      `).join('') || `<tr><td style="padding:8px 0;color:#b91c1c;">Publishing failed. Please try again.</td></tr>`;

      const snippet = (body.content ?? '').trim().slice(0, 240);
      subject = failed.length
        ? `Your post failed on ${failed.map((r) => labelFor(r.platform)).join(', ')}`
        : 'Your post failed to publish';

      html = renderEmail({
        preheader: 'One or more platforms rejected your post.',
        heading: 'Your post didn\'t publish',
        body: `
          <p style="margin:0 0 12px;">We couldn't publish your post to the following platforms:</p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;font-size:14px;margin:8px 0 16px;">
            ${rows}
          </table>
          ${snippet ? `<p style="margin:0 0 8px;color:#334155;font-size:13px;"><strong>Your post:</strong></p>
          <div style="background:#f9fafb;border-left:3px solid #136ed5;padding:12px 14px;border-radius:8px;white-space:pre-wrap;color:#0f172a;font-size:14px;">${snippet}</div>` : ''}
        `,
        ctaLabel: 'Retry in composer',
        ctaUrl: `${SITE_URL}/dashboard/composer`,
      });
    } else {
      throw new Error(`Unsupported notification type: ${body.type}`);
    }

    await resend.emails.send({
      from: 'Post <alex@trypost.ai>',
      to: [email],
      subject,
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('send-notification-email error:', err);
    return new Response(JSON.stringify({ error: err.message ?? 'Failed to send' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
