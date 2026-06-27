-- ============================================================
-- Migration 006: Volunteer initiatives
-- Groups / orgs post activities. Contact hidden until participate.
-- Run in Supabase SQL Editor → Execute
-- ============================================================

create table if not exists public.volunteer_initiatives (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  location text not null,
  coordinator_name text not null,
  coordinator_contact text not null,      -- NEVER returned by public GET
  needed_skills text[] not null default '{}',
  spots_available integer,                -- null = unlimited
  category text not null check (category in (
    'logistics', 'medical', 'food', 'rescue',
    'psychosocial', 'translation', 'collection', 'coordination', 'other'
  )),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists vi_active_idx     on public.volunteer_initiatives(active);
create index if not exists vi_category_idx   on public.volunteer_initiatives(category);
create index if not exists vi_created_idx    on public.volunteer_initiatives(created_at desc);

alter table public.volunteer_initiatives enable row level security;

-- Public can read active initiatives (coordinator_contact is excluded at API level)
create policy "vi_public_read"
  on public.volunteer_initiatives for select
  using (active = true);

-- Anyone can post an initiative (moderated by active flag)
create policy "vi_public_insert"
  on public.volunteer_initiatives for insert
  with check (true);

-- Only authenticated (admin) can approve / deactivate
create policy "vi_admin_update"
  on public.volunteer_initiatives for update
  using (auth.role() = 'authenticated');

create policy "vi_admin_delete"
  on public.volunteer_initiatives for delete
  using (auth.role() = 'authenticated');

-- ---- Seed data: real initiatives from the community ----
insert into public.volunteer_initiatives
  (title, description, location, coordinator_name, coordinator_contact, needed_skills, category)
values
  (
    'Recogida medicamentos — Acción Directa Barcelona',
    'Coordinación de puntos de recogida de insumos médicos (H₂O₂, alcohol, guantes, gasas, medicamentos) en Barcelona. Necesitamos personas con coche para recoger donaciones y llevarlas al punto central.',
    'Barcelona (varios puntos)',
    'Acción Directa Barcelona',
    'https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
    ARRAY['logistics', 'driving'],
    'collection'
  ),
  (
    'Traductores inglés-español para voluntarios extranjeros',
    'Voluntarios internacionales on the ground necesitan traducción en tiempo real. Puedes participar 100% online. Turnos de 2h.',
    'Online / Remoto',
    'Interp-Aid',
    'https://www.interp-aid.lovable.app',
    ARRAY['english', 'spanish', 'translation'],
    'translation'
  ),
  (
    'Apoyo psicosocial — atención a familias afectadas',
    'Psicólogos y trabajadores sociales para atención de familias en shock. Sesiones online o coordinadas desde España con equipos en Venezuela.',
    'Online / Venezuela',
    'UCV Hospitalaria',
    'voluntarios@ucv.ve',
    ARRAY['psychology', 'social_work'],
    'psychosocial'
  ),
  (
    'Búsqueda de personas desaparecidas — base de datos',
    'Ayuda a cruzar datos entre listas de desaparecidos y albergues. Trabajo de oficina, online, con formularios y bases de datos. Buscan especialmente personas con experiencia en Excel o Google Sheets.',
    'Online',
    'Venezolanos en el Exterior',
    'info@venezolanos-en-el-exterior.com',
    ARRAY['data', 'excel', 'admin'],
    'coordination'
  ),
  (
    'Distribución de alimentos — zonas aisladas Vargas',
    'World Central Kitchen coordina reparto de comidas calientes en zonas cortadas por derrumbes. Necesitan conductores y repartidores con vehículo 4x4.',
    'Estado Vargas, Venezuela',
    'World Central Kitchen Venezuela',
    'volunteer@wck.org',
    ARRAY['driving', '4x4', 'physical'],
    'food'
  );
