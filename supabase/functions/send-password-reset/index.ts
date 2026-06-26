import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { renderEmail } from "../_shared/email-template.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResetRequest {
  email: string;
  redirectTo?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, redirectTo }: ResetRequest = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const finalRedirect = redirectTo || 'https://trypost.ai/reset-password';

    // Generate recovery link via Supabase Admin API
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: finalRedirect },
    });

    // Always respond success to avoid email enumeration
    if (error || !data?.properties?.action_link) {
      console.log('No reset link generated for', email, error?.message);
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const actionLink = data.properties.action_link;

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    await resend.emails.send({
      from: 'Post <alex@trypost.ai>',
      to: [email],
      subject: 'Reset your Post password',
      html: renderEmail({
        preheader: 'Reset your Post password',
        heading: 'Reset your password',
        body: `
          <p style="margin:0 0 12px;">We received a request to reset the password for your Post account.</p>
          <p style="margin:0 0 12px;">Click the button below to choose a new password. This link expires in 1 hour.</p>
          <p style="margin:16px 0 0;color:#64748b;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
        `,
        ctaLabel: 'Reset password',
        ctaUrl: actionLink,
        footerNote: 'You received this email because a password reset was requested for your Post account.',
      }),
    });

    console.log('Password reset email sent to', email);

    return new Response(
      JSON.stringify({ success: true }),
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
