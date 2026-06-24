# Unified Social Publishing API

Rebuild `publish-post` into a clean, modular edge function that publishes per-user (via existing `oauth_connections`) to all 7 networks with text + image + video where the platform allows it. Add a media-upload pipeline backed by Supabase Storage so the frontend can attach files before calling publish.

## What gets built

### 1. Media pipeline (new)
- New Supabase Storage bucket `post-media` (private, signed URLs for platform fetches).
- New edge function `upload-media`: accepts multipart upload from Composer, validates mime/size, stores in `post-media/{user_id}/{uuid}.{ext}`, returns `{ media_id, url, mime, kind: image|video }`.
- Add `media` JSONB column to `posts` table to record attached assets per published post.

### 2. Refactored `publish-post` edge function
Single endpoint, per-platform handler modules:

```
supabase/functions/publish-post/
  index.ts            // auth, validation, fan-out, result aggregation
  lib/types.ts        // PublishRequest, PublishResult, MediaRef
  lib/media.ts        // signed URL + download helpers
  platforms/twitter.ts
  platforms/facebook.ts
  platforms/instagram.ts
  platforms/linkedin.ts
  platforms/threads.ts
  platforms/tiktok.ts
  platforms/youtube.ts
```

Request shape:
```ts
{ content: string; platforms: Platform[]; media?: { id: string; kind: 'image'|'video' }[] }
```

Behavior:
- Validates JWT via `getClaims`, loads that user's `oauth_connections` rows.
- Fans out in parallel; each handler returns `{ platform, success, post_id?, error? }`.
- Per-platform character-limit + media-requirement validation (e.g. IG requires media, TikTok/YouTube require video).
- Writes one row per platform result into `posts` with `media` + provider `post_id`.

### 3. Per-platform publishing logic

| Platform  | Text | Image | Video | API |
|-----------|------|-------|-------|-----|
| Twitter/X | yes  | yes (v1.1 media/upload → v2 tweets) | yes (chunked upload) | api.x.com |
| Facebook  | yes  | `/me/photos` | `/me/videos` (resumable) | Graph API |
| Instagram | media required | `/media` + `/media_publish` (IG Graph) | Reels container | Graph API |
| LinkedIn  | yes  | assets register + UGC post | assets register + UGC post | api.linkedin.com |
| Threads   | yes  | media container + publish | media container + publish | graph.threads.net |
| TikTok    | video required | — | `post/publish/video/init` + chunked upload | open.tiktokapis.com |
| YouTube   | video required (Shorts/video) | — | `videos.insert` resumable upload | googleapis.com/youtube/v3 |

Each handler:
1. Reads access token (and refresh token where applicable) from `oauth_connections`.
2. Refreshes token if expired (FB/IG/LI/Threads/TikTok/YouTube all support refresh; Twitter uses long-lived OAuth1).
3. Downloads media from signed Storage URL when the platform needs bytes (TikTok, YouTube, Twitter), or passes the public signed URL when the platform fetches it (IG, Threads, FB photo by URL).
4. Returns normalized result.

### 4. Frontend wiring (minimal)
- `Composer.tsx`: add image/video picker that calls `upload-media`, stores returned `media` refs, sends them in the `publish-post` invoke payload. No layout changes beyond an attachment row + thumbnails.
- Validation: disable platforms whose media requirements aren't met (e.g. greyed IG/TikTok/YouTube without media).

## Database changes
```sql
alter table public.posts add column if not exists media jsonb default '[]'::jsonb;

insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', false)
on conflict (id) do nothing;

create policy "Users upload own media"
on storage.objects for insert to authenticated
with check (bucket_id = 'post-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users read own media"
on storage.objects for select to authenticated
using (bucket_id = 'post-media' and (storage.foldername(name))[1] = auth.uid()::text);
```

## Secrets required
Already present from existing oauth functions: Twitter consumer keys, FB/IG app id+secret, LinkedIn client id+secret, Threads app id+secret, TikTok client key+secret, YouTube (Google) client id+secret. No new secrets needed — per-user tokens come from `oauth_connections`.

## Out of scope (call out)
- Scheduling (the Composer toggle stays UI-only for now).
- Carousel/multi-image IG (single asset first; can extend handler later).
- Analytics fetch-back (likes, views).

## Validation
After implementation: deploy functions, then run a Playwright check on `/dashboard/composer` to upload a test image, select two connected platforms, click Post now, and confirm the `/dashboard/posts` row shows both results. Console + network captured for any 4xx from providers.
