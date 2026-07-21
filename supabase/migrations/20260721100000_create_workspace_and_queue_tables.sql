create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'main',
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.workspace_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  invited_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days')
);

create table if not exists public.queue_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  slots jsonb not null default '[]'::jsonb,
  randomize boolean not null default false,
  timezone text not null default 'UTC',
  updated_at timestamptz not null default now()
);

create index if not exists workspaces_owner_id_idx on public.workspaces(owner_id);
create index if not exists workspace_members_user_id_idx on public.workspace_members(user_id);
create index if not exists workspace_invitations_workspace_status_idx on public.workspace_invitations(workspace_id, status);

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_invitations enable row level security;
alter table public.queue_settings enable row level security;

drop policy if exists "Users can read their workspaces" on public.workspaces;
create policy "Users can read their workspaces"
on public.workspaces for select
using (
  owner_id = auth.uid()
  or exists (
    select 1 from public.workspace_members
    where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = auth.uid()
  )
);

drop policy if exists "Users can create workspaces" on public.workspaces;
create policy "Users can create workspaces"
on public.workspaces for insert
with check (owner_id = auth.uid());

drop policy if exists "Owners and admins can update workspaces" on public.workspaces;
create policy "Owners and admins can update workspaces"
on public.workspaces for update
using (
  owner_id = auth.uid()
  or exists (
    select 1 from public.workspace_members
    where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin')
  )
)
with check (
  owner_id = auth.uid()
  or exists (
    select 1 from public.workspace_members
    where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin')
  )
);

drop policy if exists "Users can read workspace memberships" on public.workspace_members;
create policy "Users can read workspace memberships"
on public.workspace_members for select
using (user_id = auth.uid());

drop policy if exists "Owners and admins can manage members" on public.workspace_members;
create policy "Owners and admins can manage members"
on public.workspace_members for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Members can read workspace invitations" on public.workspace_invitations;
create policy "Members can read workspace invitations"
on public.workspace_invitations for select
using (
  exists (
    select 1 from public.workspace_members
    where workspace_members.workspace_id = workspace_invitations.workspace_id
      and workspace_members.user_id = auth.uid()
  )
);

drop policy if exists "Owners and admins can manage invitations" on public.workspace_invitations;
create policy "Owners and admins can manage invitations"
on public.workspace_invitations for all
using (
  exists (
    select 1 from public.workspace_members
    where workspace_members.workspace_id = workspace_invitations.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from public.workspace_members
    where workspace_members.workspace_id = workspace_invitations.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('owner', 'admin')
  )
);

drop policy if exists "Users can manage their queue settings" on public.queue_settings;
create policy "Users can manage their queue settings"
on public.queue_settings for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

insert into public.workspaces (name, owner_id)
select 'main', users.id
from auth.users users
where not exists (
  select 1 from public.workspaces
  where workspaces.owner_id = users.id
);

insert into public.workspace_members (workspace_id, user_id, role)
select workspaces.id, workspaces.owner_id, 'owner'
from public.workspaces
where not exists (
  select 1 from public.workspace_members
  where workspace_members.workspace_id = workspaces.id
    and workspace_members.user_id = workspaces.owner_id
);
