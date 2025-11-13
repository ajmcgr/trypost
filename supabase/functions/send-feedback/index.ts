import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

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
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
              .feedback-box { background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea; }
              .meta { color: #6b7280; font-size: 14px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>📬 New Feedback Received</h2>
              </div>
              <div class="content">
                <p><strong>From:</strong> ${user.email || 'Unknown'}</p>
                <p><strong>User ID:</strong> ${user.id}</p>
                <div class="feedback-box">
                  <p style="margin: 0; white-space: pre-wrap;">${feedback}</p>
                </div>
                <div class="meta">
                  <p>Submitted on: ${new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
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
