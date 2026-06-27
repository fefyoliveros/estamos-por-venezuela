-- ============================================================
-- Migration 005: Skill offers — volunteer matching system
-- Run in Supabase SQL Editor → Execute
-- ============================================================

create table if not exists public.skill_offers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  skill_category text not null check (skill_category in (
    'translator', 'medical', 'psychological', 'legal', 'it',
    'design', 'pr', 'logistics', 'construction', 'other'
  )),
  skill_description text not null,
  availability text not null check (availability in ('remote', 'local', 'both')),
  location text,
  contact_method text not null check (contact_method in ('whatsapp', 'email', 'phone')),
  contact_value text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists skill_offers_category_idx on public.skill_offers(skill_category);
create index if not exists skill_offers_active_idx on public.skill_offers(active);
create index if not exists skill_offers_created_idx on public.skill_offers(created_at desc);

alter table public.skill_offers enable row level security;

-- Anyone can read active skill offers
create policy "skill_offers_public_read"
  on public.skill_offers for select
  using (active = true);

-- Anyone can post a skill offer
create policy "skill_offers_public_insert"
  on public.skill_offers for insert
  with check (true);

-- Only admins can deactivate or delete
create policy "skill_offers_admin_update"
  on public.skill_offers for update
  using (auth.role() = 'authenticated');

create policy "skill_offers_admin_delete"
  on public.skill_offers for delete
  using (auth.role() = 'authenticated');
