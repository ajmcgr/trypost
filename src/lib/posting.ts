import { supabase } from '@/lib/supabase';

export type PostStatus = 'draft' | 'queued' | 'scheduled' | 'posted' | 'failed';

export interface MediaRef {
  media_id?: string;
  path: string;
  url: string;
  mime?: string;
  kind: 'image' | 'video';
  size?: number;
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
  media.map(({ media_id, path, url, mime, kind, size }) => ({ media_id, path, url, mime, kind, size }));

export const uploadPostMedia = async (files: File[]): Promise<MediaRef[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const uploaded: MediaRef[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${(supabase as any).supabaseUrl}/functions/v1/upload-media`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: formData,
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.error || 'Upload failed');
    uploaded.push(json);
  }

  return uploaded;
};

export const publishPost = async (payload: PublishPostPayload) => {
  const { data, error } = await supabase.functions.invoke('publish-post', {
    body: {
      ...payload,
      media: compactMedia(payload.media ?? []),
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
