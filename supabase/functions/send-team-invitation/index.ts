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

interface InvitationRequest {
  email: string;
  workspaceId: string;
  role?: 'member' | 'admin';
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

    const { email, workspaceId, role = 'member' }: InvitationRequest = await req.json();

    console.log('Processing invitation:', { email, workspaceId, role, invitedBy: user.id });

    // Verify user has permission to invite
    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership || !['owner', 'admin'].includes(membership.role)) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get workspace details
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('name')
      .eq('id', workspaceId)
      .single();

    if (workspaceError || !workspace) {
      return new Response(
        JSON.stringify({ error: 'Workspace not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists and is a member
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const invitedUser = existingUser.users.find(u => u.email === email);

    if (invitedUser) {
      const { data: existingMember } = await supabase
        .from('workspace_members')
        .select('id')
        .eq('workspace_id', workspaceId)
        .eq('user_id', invitedUser.id)
        .single();

      if (existingMember) {
        return new Response(
          JSON.stringify({ error: 'User is already a member of this workspace' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create or update invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('workspace_invitations')
      .upsert({
        workspace_id: workspaceId,
        email: email,
        role: role,
        invited_by: user.id,
        status: 'pending',
      }, {
        onConflict: 'workspace_id,email'
      })
      .select()
      .single();

    if (invitationError) {
      console.error('Invitation error:', invitationError);
      return new Response(
        JSON.stringify({ error: 'Failed to create invitation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email notification using Resend
    try {
      const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
      const appUrl = Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || 'https://app.lovable.app';
      
      await resend.emails.send({
        from: 'Post <alex@trypost.ai>',
        to: [email],
        subject: `You've been invited to join ${workspace.name} on Post`,
        html: renderEmail({
          preheader: `Join ${workspace.name} on Post`,
          heading: `You've been invited to join ${workspace.name} 🎉`,
          body: `
            <p style="margin:0 0 10px;">Hi there,</p>
            <p style="margin:0 0 10px;">You've been invited to join <strong>${workspace.name}</strong> on Post as a <strong>${role}</strong>.</p>
            <p style="margin:0;">Tap the button below to accept your invitation and start collaborating.</p>
          `,
          ctaLabel: 'Accept invitation',
          ctaUrl: `${appUrl}/dashboard/invitations`,
          footerNote: "If you didn't expect this invitation, you can safely ignore this email.",
        }),
      });
      console.log(`Invitation email sent to ${email} for workspace ${workspace.name}`);
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Continue even if email fails - invitation is still created
    }

    return new Response(
      JSON.stringify({
        success: true,
        invitation,
        message: `Invitation sent to ${email}`
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
