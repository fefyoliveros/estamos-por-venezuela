-- 011: initiative_needs — crowd-sourced real-time needs updates per initiative
-- Anyone in the field can add what is currently needed + urgency level
-- Run in Supabase SQL Editor → Execute

create table public.initiative_needs (
  id               uuid primary key default gen_random_uuid(),
  initiative_id    uuid not null references public.volunteer_initiatives(id) on delete cascade,
  updated_by       text not null,
  location_context text,
  needs_description text not null,
  urgency_level    text not null check (urgency_level in ('critical', 'high', 'medium', 'low')),
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

create index if not exists in_idx_initiative on public.initiative_needs(initiative_id);
create index if not exists in_idx_urgency    on public.initiative_needs(urgency_level);
create index if not exists in_idx_active     on public.initiative_needs(active);

alter table public.initiative_needs enable row level security;

-- public can read active needs
create policy "public read active initiative needs"
  on public.initiative_needs for select
  using (active = true);

-- anyone can insert (crowd-sourced field reports)
create policy "public insert initiative needs"
  on public.initiative_needs for insert
  with check (true);
