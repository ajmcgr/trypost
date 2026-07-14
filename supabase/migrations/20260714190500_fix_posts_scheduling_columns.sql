alter table public.posts
  add column if not exists content text,
  add column if not exists platforms text[] not null default '{}',
  add column if not exists status text not null default 'draft',
  add column if not exists scheduled_at timestamptz,
  add column if not exists results jsonb not null default '[]'::jsonb,
  add column if not exists media jsonb not null default '[]'::jsonb;

create index if not exists posts_user_id_created_at_idx on public.posts (user_id, created_at desc);
create index if not exists posts_status_idx on public.posts (status);
create index if not exists posts_scheduled_at_idx on public.posts (scheduled_at);

select pg_notify('pgrst', 'reload schema');
