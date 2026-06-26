# Implementation Plan

Nine separate items. Grouped by file area for efficiency.

## 1. Composer: Schedule + Search (items 1 & 2)
**File:** `src/pages/Composer.tsx`
- Replace the right-sidebar "Schedule post" switch with a full schedule card (per `schedule.png`): tabs **Pick a time** / **Add to queue**, date input, time input, quick-set chips (11:00 AM / 3:00 PM / 7:00 PM), Schedule button.
- Wire `handlePublish` to send `scheduled_at` ISO when schedule mode is on; insert into `posts` with `status='scheduled'` instead of invoking `publish-post`.
- "Add to queue" mode picks the next available slot from the user's queue schedule (see item 6) and saves as scheduled.
- **Search & Filter** dropdown: convert the dummy button into a real popover with a text input filtering the connections list by `platform` / `platform_username`, plus checkbox filters per platform. Filter state shapes the avatar row.

## 2. Homepage features section (item 3)
**File:** `src/pages/Index.tsx`
- Below the hero, add a `Features` section with 3 alternating rows (matching `features.png`):
  1. Cross-posting — "Post to all platforms instantly" + node graph illustration (SVG with platform icons radiating from a central post icon).
  2. Scheduling — "Schedule posts effortlessly" + screenshot placeholder card.
  3. Content management — "Manage content efficiently" + screenshot placeholder card.
- Use existing primary/secondary tokens. Section uses `max-w-6xl mx-auto`, `py-20`, grid `md:grid-cols-2 gap-16`.

## 3. Header changes (items 7 & 8a)
**File:** `src/pages/Index.tsx` (header block) and `src/components/Header.tsx`
- Remove `border-b` from the header element.
- Add `Resources` link (between Pricing and Log In) pointing to `/resources`, same styling as Pricing.

## 4. Translation dropdown (item 8b)
**New file:** `src/components/LanguageSwitcher.tsx`
- Dropdown trigger = current flag emoji + chevron.
- Options: 🇺🇸 English, 🇩🇪 Deutsch, 🇫🇷 Français, 🇪🇸 Español, 🇮🇹 Italiano, 🇵🇹 Português, 🇳🇱 Nederlands, 🇵🇱 Polski, 🇹🇷 Türkçe.
- Implementation: inject Google Website Translator (`https://translate.google.com/translate_a/element.js`) once on mount, render hidden `#google_translate_element` div, set the `googtrans` cookie + reload on selection. This is the standard Google Translate widget integration.
- Mount in `src/pages/Index.tsx` header (right of Resources) and in `src/components/Header.tsx`.

## 5. Bulk Image Upload (item 5)
**New file:** `src/pages/dashboard/BulkImageUpload.tsx` — modeled on `bulk-image.png`:
- Left: drag/drop folder zone + posts list with thumbnails and per-post captions.
- Right: Bulk Settings card (bulk caption + Apply to All), Start Date, Start Time, Posts per day (1–24), Apply Bulk Schedule. Confirm & Schedule All card at bottom.
- Posts inserted into `posts` with status `scheduled` and distributed across days using the bulk schedule.
- Replace existing `BulkTools.tsx` "Bulk Video Upload" card link target to point at the new routes.

## 6. Bulk Video Upload (item 4)
**New file:** `src/pages/dashboard/BulkVideoUpload.tsx` — modeled on `bulk-video.png`:
- Click-to-upload / drag-drop zone (up to 100 videos, max 500MB, 3s–5min).
- Right side: Bulk Schedule Settings (caption, dates, videos/day), Confirm & Schedule All, Save All as Drafts.
- Uses `upload-media` edge function for each video, then inserts scheduled rows.

Wire routes in `src/App.tsx`: `/dashboard/bulk/image` and `/dashboard/bulk/video`. Update `BulkTools.tsx` cards to link there.

## 7. Queue page + sidebar link (item 6)
**New file:** `src/pages/dashboard/Queue.tsx` — modeled on `queue.png`:
- Queue Schedule card: weekly grid (Time x Mon-Sun) with green check toggles per slot, Add time input, Timezone display, slot counter ("You have X slots to post during your week").
- Randomize posting time toggle card.
- Persist to a new `public.queue_settings` table (one row per user: `slots jsonb`, `randomize boolean`, `timezone text`). Provide SQL for user to run (Lovable Cloud disabled, so manual).
- Sidebar: add **Queue** entry under Posts section in `src/components/AppSidebar.tsx` linking to `/dashboard/queue`.

## Technical notes

- Translation: Google Translate widget is free and requires no API key. Cookie format: `googtrans=/auto/<lang>`; set on `.trypost.ai` and `trypost.ai` then `location.reload()`.
- Schedule storage: extend `posts` table with `scheduled_at timestamptz`, `status text` columns if not already present — provide SQL.
- Queue slot selection: pick the earliest enabled `(day, time)` in the user's timezone that is in the future and not already claimed.
- All new pages get `DashboardLayout` via the existing routing.

## SQL the user needs to run (will provide after build)

```sql
alter table public.posts
  add column if not exists scheduled_at timestamptz,
  add column if not exists status text default 'draft';

create table if not exists public.queue_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  slots jsonb not null default '[]'::jsonb,
  randomize boolean not null default false,
  timezone text not null default 'UTC',
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.queue_settings to authenticated;
grant all on public.queue_settings to service_role;
alter table public.queue_settings enable row level security;
create policy "own queue" on public.queue_settings
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
```
