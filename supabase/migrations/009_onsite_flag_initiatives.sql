-- 009: Add is_onsite flag to volunteer_initiatives
-- Marks initiatives that require physical on-site presence in Venezuela
-- Run in Supabase SQL Editor → Execute

alter table public.volunteer_initiatives
  add column if not exists is_onsite boolean not null default false;

create index if not exists vi_onsite_idx on public.volunteer_initiatives(is_onsite);
