import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

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
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>You're Invited! 🎉</h1>
                </div>
                <div class="content">
                  <p>Hi there!</p>
                  <p>You've been invited to join <strong>${workspace.name}</strong> on Post as a <strong>${role}</strong>.</p>
                  <p>Click the button below to accept your invitation and start collaborating:</p>
                  <div style="text-align: center;">
                    <a href="${appUrl}/dashboard/invitations" class="button">Accept Invitation</a>
                  </div>
                  <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">If you didn't expect this invitation, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Post. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
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
