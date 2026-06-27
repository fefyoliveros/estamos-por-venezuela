-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Resources: verified NGOs, campaigns, collection points, businesses
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in (
    'ngo', 'campaign', 'collection_point', 'psychological', 'medical',
    'animal_rescue', 'missing_persons', 'portal', 'business',
    'volunteer_coordinator', 'other'
  )),
  url text,
  instagram text,
  city text,
  country text not null default 'VE',
  description_es text,
  description_en text,
  contact text,
  verified boolean not null default false,
  active boolean not null default true,
  earthquake_specific boolean not null default true,
  is_government boolean not null default false,
  created_at timestamptz not null default now()
);

-- Submissions: user-proposed resources awaiting admin review
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in (
    'ngo', 'campaign', 'collection_point', 'psychological', 'medical',
    'animal_rescue', 'missing_persons', 'portal', 'business',
    'volunteer_coordinator', 'other'
  )),
  name text not null,
  url text,
  instagram text,
  city text,
  country text not null default 'ES',
  description text,
  submitter_email text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  ai_verified boolean,
  ai_notes text,
  created_at timestamptz not null default now()
);

-- Help requests: people who need help
create table if not exists public.help_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  location text not null,
  needs text[] not null,
  details text,
  status text not null default 'active' check (status in ('active', 'resolved')),
  created_at timestamptz not null default now()
);

-- Businesses: self-listed, no verification required
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  description text not null,
  how_helping text not null,
  contact_url text,
  city text,
  country text not null default 'ES',
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists resources_type_idx on public.resources(type);
create index if not exists resources_country_idx on public.resources(country);
create index if not exists resources_active_verified_idx on public.resources(active, verified);
create index if not exists help_requests_status_idx on public.help_requests(status);
create index if not exists help_requests_created_idx on public.help_requests(created_at desc);
create index if not exists submissions_status_idx on public.submissions(status);

-- Enable RLS on all tables
alter table public.resources enable row level security;
alter table public.submissions enable row level security;
alter table public.help_requests enable row level security;
alter table public.businesses enable row level security;

-- RLS Policies: resources
-- Anyone can read active, verified resources
create policy "resources_public_read"
  on public.resources for select
  using (active = true);

-- Only authenticated admins can insert/update/delete
create policy "resources_admin_write"
  on public.resources for all
  using (auth.role() = 'authenticated');

-- RLS Policies: submissions
-- Anyone can submit
create policy "submissions_public_insert"
  on public.submissions for insert
  with check (true);

-- Only authenticated admins can read/update submissions
create policy "submissions_admin_read"
  on public.submissions for select
  using (auth.role() = 'authenticated');

create policy "submissions_admin_update"
  on public.submissions for update
  using (auth.role() = 'authenticated');

-- RLS Policies: help_requests
-- Anyone can read active help requests (ordered by date)
create policy "help_requests_public_read"
  on public.help_requests for select
  using (status = 'active');

-- Anyone can post a help request
create policy "help_requests_public_insert"
  on public.help_requests for insert
  with check (true);

-- Only admins can resolve
create policy "help_requests_admin_update"
  on public.help_requests for update
  using (auth.role() = 'authenticated');

-- RLS Policies: businesses
-- Anyone can read businesses
create policy "businesses_public_read"
  on public.businesses for select
  using (true);

-- Anyone can self-list a business
create policy "businesses_public_insert"
  on public.businesses for insert
  with check (true);

-- Only admins can update/delete
create policy "businesses_admin_write"
  on public.businesses for update
  using (auth.role() = 'authenticated');

create policy "businesses_admin_delete"
  on public.businesses for delete
  using (auth.role() = 'authenticated');
