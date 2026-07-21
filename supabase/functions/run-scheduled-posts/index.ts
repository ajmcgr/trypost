import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-scheduler-secret',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

type Platform =
  | 'twitter' | 'facebook' | 'instagram'
  | 'linkedin' | 'threads' | 'tiktok' | 'youtube';

interface MediaRef {
  path: string;
  url: string;
  kind: 'image' | 'video';
  mime?: string;
  size?: number;
  width?: number;
  height?: number;
}

interface ScheduledPost {
  id: string;
  user_id: string;
  content: string | null;
  platforms: Platform[] | null;
  media: MediaRef[] | null;
  scheduled_at: string | null;
  status: string | null;
}

function createAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
}

function isAuthorized(req: Request) {
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const schedulerSecret = Deno.env.get('SCHEDULED_WORKER_SECRET') ?? Deno.env.get('CRON_SECRET');
  const bearer = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  const schedulerHeader = req.headers.get('x-scheduler-secret');

  return Boolean(
    (serviceRoleKey && bearer === serviceRoleKey) ||
      (schedulerSecret && schedulerHeader === schedulerSecret)
  );
}

function normalizeBatchSize(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 10;
  return Math.max(1, Math.min(25, Math.floor(parsed)));
}

async function requestBody(req: Request) {
  if (req.method !== 'POST') return {};
  try {
    return await req.json();
  } catch {
    return {};
  }
}

async function markFailed(admin: ReturnType<typeof createAdminClient>, post: ScheduledPost, error: string) {
  await admin
    .from('posts')
    .update({
      status: 'failed',
      results: (post.platforms ?? []).map((platform) => ({
        platform,
        success: false,
        status: 'failed',
        error,
      })),
    })
    .eq('id', post.id)
    .eq('user_id', post.user_id);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!isAuthorized(req)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const body = await requestBody(req);
    const batchSize = normalizeBatchSize((body as { batchSize?: unknown }).batchSize);
    const dryRun = (body as { dryRun?: unknown }).dryRun === true;
    const admin = createAdminClient();
    const now = new Date().toISOString();

    const { data: duePosts, error: dueError } = await admin
      .from('posts')
      .select('id,user_id,content,platforms,media,scheduled_at,status')
      .in('status', ['scheduled', 'queued'])
      .not('scheduled_at', 'is', null)
      .lte('scheduled_at', now)
      .order('scheduled_at', { ascending: true })
      .limit(batchSize);

    if (dueError) throw dueError;

    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          dry_run: true,
          checked_at: now,
          due: duePosts?.length ?? 0,
          posts: (duePosts ?? []).map((post) => ({
            id: post.id,
            status: post.status,
            scheduled_at: post.scheduled_at,
            platforms: post.platforms,
          })),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const publishUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/publish-post`;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const summaries = [];

    for (const post of (duePosts ?? []) as ScheduledPost[]) {
      const { data: claimed, error: claimError } = await admin
        .from('posts')
        .update({
          status: 'publishing',
          results: (post.platforms ?? []).map((platform) => ({
            platform,
            success: true,
            status: 'publishing',
          })),
        })
        .eq('id', post.id)
        .eq('user_id', post.user_id)
        .eq('status', post.status ?? 'scheduled')
        .select('id,user_id,content,platforms,media,scheduled_at,status')
        .maybeSingle();

      if (claimError) {
        summaries.push({ id: post.id, success: false, error: claimError.message });
        continue;
      }
      if (!claimed) {
        summaries.push({ id: post.id, success: false, skipped: true });
        continue;
      }

      try {
        const publishRes = await fetch(publishUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: claimed.user_id,
            draftId: claimed.id,
            content: claimed.content ?? '',
            platforms: claimed.platforms ?? [],
            media: claimed.media ?? [],
          }),
        });

        const publishJson = await publishRes.json().catch(() => ({}));

        if (!publishRes.ok) {
          const message = publishJson.error ?? `publish-post returned ${publishRes.status}`;
          await markFailed(admin, claimed as ScheduledPost, message);
          summaries.push({ id: claimed.id, success: false, error: message });
          continue;
        }

        summaries.push({
          id: claimed.id,
          success: true,
          status: publishJson.status,
          results: publishJson.results,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await markFailed(admin, claimed as ScheduledPost, message);
        summaries.push({ id: claimed.id, success: false, error: message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked_at: now,
        due: duePosts?.length ?? 0,
        processed: summaries.length,
        results: summaries,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('run-scheduled-posts error:', error);
    const message = error instanceof Error ? error.message : 'Scheduled worker failed';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
