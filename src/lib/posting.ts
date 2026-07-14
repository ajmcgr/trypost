import { supabase } from '@/lib/supabase';
import { getFileMediaDimensions } from '@/lib/media';

export type PostStatus = 'draft' | 'queued' | 'scheduled' | 'posted' | 'failed';

export interface MediaRef {
  media_id?: string;
  path: string;
  url: string;
  mime?: string;
  kind: 'image' | 'video';
  size?: number;
  width?: number;
  height?: number;
}

export type QueueSlot = { time: string; days: boolean[] };

export interface PublishPostPayload {
  content: string;
  platforms: string[];
  media?: MediaRef[];
  scheduledFor?: string;
  queue?: boolean;
  draft?: boolean;
}

export const hasPostBody = (content: string, media: MediaRef[] = []) =>
  content.trim().length > 0 || media.length > 0;

export const compactMedia = (media: MediaRef[]) =>
  media.map(({ media_id, path, url, mime, kind, size, width, height }) => ({ media_id, path, url, mime, kind, size, width, height }));

export const uploadPostMedia = async (files: File[]): Promise<MediaRef[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const uploaded: MediaRef[] = [];
  const uploadEndpoint = `${(supabase as any).supabaseUrl}/functions/v1/upload-media`;
  const headers = {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };

  for (const file of files) {
    const dimensions = await getFileMediaDimensions(file);
    const initResponse = await fetch(uploadEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'init',
        fileName: file.name,
        mime: file.type,
        size: file.size,
        width: dimensions?.width,
        height: dimensions?.height,
      }),
    });

    const init = await initResponse.json();
    if (!initResponse.ok) throw new Error(init.error || 'Upload failed');

    const { error: uploadError } = await supabase.storage
      .from('post-media')
      .uploadToSignedUrl(init.path, init.token, file, {
        contentType: file.type || 'application/octet-stream',
      });

    if (uploadError) throw new Error(uploadError.message || 'Upload failed');

    const finalizeResponse = await fetch(uploadEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'finalize',
        media_id: init.media_id,
        path: init.path,
        mime: file.type,
        size: file.size,
        width: dimensions?.width,
        height: dimensions?.height,
      }),
    });

    const json = await finalizeResponse.json();
    if (!finalizeResponse.ok) throw new Error(json.error || 'Upload failed');
    uploaded.push({ ...json, ...(dimensions ?? {}) });
  }

  return uploaded;
};

export const publishPost = async (payload: PublishPostPayload) => {
  const media = compactMedia(payload.media ?? []);

  if (payload.draft || payload.scheduledFor || payload.queue) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const status: PostStatus = payload.draft ? 'draft' : payload.queue ? 'queued' : 'scheduled';
    const scheduledAt = payload.scheduledFor ?? null;
    const results = payload.platforms.map((platform) => ({
      platform,
      success: true,
      status,
      scheduled_for: scheduledAt,
    }));

    const { data, error } = await supabase.from('posts').insert({
      user_id: user.id,
      content: payload.content,
      platforms: payload.platforms,
      status,
      scheduled_at: scheduledAt,
      results,
      media,
    }).select().single();

    if (error) throw error;
    return { success: true, status, scheduled_for: scheduledAt, results, post: data };
  }

  const { data, error } = await supabase.functions.invoke('publish-post', {
    body: {
      ...payload,
      media,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

export const getScheduledDate = (date: string, time: string): Date => {
  if (!date) throw new Error('Pick a date');
  const scheduledAt = new Date(`${date}T${time || '12:00'}`);
  if (Number.isNaN(scheduledAt.getTime())) throw new Error('Pick a valid schedule time');
  if (scheduledAt <= new Date()) throw new Error('Schedule time must be in the future');
  return scheduledAt;
};

export const getNextQueueSlot = (slots: QueueSlot[]): Date | null => {
  if (!slots.length) return null;

  const now = new Date();
  const orderedSlots = [...slots].sort((a, b) => a.time.localeCompare(b.time));

  for (let offset = 0; offset < 14; offset += 1) {
    const day = new Date(now);
    day.setDate(now.getDate() + offset);
    const dayIndex = (day.getDay() + 6) % 7;

    for (const slot of orderedSlots) {
      if (!slot.days?.[dayIndex]) continue;
      const [hours, minutes] = slot.time.split(':').map(Number);
      const candidate = new Date(day);
      candidate.setHours(hours, minutes, 0, 0);
      if (candidate > now) return candidate;
    }
  }

  return null;
};
