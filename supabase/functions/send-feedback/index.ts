import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { renderEmail } from "../_shared/email-template.ts";

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
