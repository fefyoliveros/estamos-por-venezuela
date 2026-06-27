-- ============================================================
-- Migration 007: Active help request cases + onsite volunteers
-- Run in Supabase SQL Editor → Execute
-- ============================================================

-- ── Active help requests (real cases) ────────────────────────────────────────

insert into public.help_requests (full_name, location, needs, details, status)
values

(
  'Centro de Acopio — Coliseo La Urbina',
  'Coliseo La Urbina, Caracas',
  ARRAY['food']::text[],
  'Solicitan teteros y fórmulas de bebé con urgencia. Llevar directamente al coliseo.',
  'active'
),

(
  'Pareja atrapada — TorreOpp26',
  'TorreOpp26, El Caribe, Venezuela',
  ARRAY['trapped']::text[],
  'Una pareja sigue atrapada con vida. Coordinar con equipos de rescate antes de acudir.',
  'active'
),

(
  'Edificio Breogán — La Guaira',
  'Calle 16, La Guaira',
  ARRAY['trapped']::text[],
  'Se requiere maquinaria pesada para remover las vigas. No acudir sin equipo especializado.',
  'active'
),

(
  'Fundación Daniel Hers — Parque Naciones Unidas',
  'Avenida Páez, El Paraíso, Caracas',
  ARRAY['medicine', 'other']::text[],
  'Actividad 27 y 28 de junio. Necesitan: mantas, ropa, insumos médicos, herramientas (palas, picos), insumos médico neonatales (compresas, povidina, gel, coloides, analgésicos, yeso, vendas). IG: @fundaciondanielhers.',
  'active'
),

(
  'Campamento Médico — Parque del Este',
  'Estacionamiento lateral, Parque del Este, Caracas',
  ARRAY['medicine']::text[],
  'Faltan: cremas antibióticas, medicamentos para nebulizar, analgésicos y antialérgicos pediátricos.',
  'active'
),

(
  'Hospital Pérez Carreño',
  'Hospital Dr. Pérez Carreño, Caracas',
  ARRAY['medicine']::text[],
  'Necesitan urgente: conos para oxígeno, saturómetros portátiles, collarines pediátricos, vías centrales pediátricas, pitos para medición de orina, Ketoprofeno endovenoso.',
  'active'
),

(
  'Hospital Vargas',
  'Entregar en: Colegio Cristo Rey, Altamira, Caracas',
  ARRAY['medicine']::text[],
  'Materiales para el Hospital Vargas. Dejar en Colegio Cristo Rey, Altamira. Necesitan: cuentagotas, macrogotero, llave de 3 vías, guantes, vendas, batas quirúrgicas, solución dextrosa, tensiómetros, estetoscopios.',
  'active'
),

(
  'Punto de rescate — Los Palos Grandes',
  '1era Avenida de Los Palos Grandes, Caracas',
  ARRAY['other']::text[],
  'Se necesitan discos de cortar cemento, 14 pulgadas. Llevar al punto directamente.',
  'active'
);


-- ── Onsite volunteers table ───────────────────────────────────────────────────

create table if not exists public.onsite_volunteers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  origin_location text not null,
  available_from date not null,
  skills text not null,
  has_vehicle boolean not null default false,
  contact text not null,
  group_affiliation text,           -- UCV, Cruz Roja, etc. or null
  acknowledged_safety boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists ov_active_idx    on public.onsite_volunteers(active);
create index if not exists ov_avail_idx     on public.onsite_volunteers(available_from);
create index if not exists ov_created_idx   on public.onsite_volunteers(created_at desc);

alter table public.onsite_volunteers enable row level security;

-- Public read: active only (no contact revealed — contact is for admin coordination only)
create policy "ov_public_read"
  on public.onsite_volunteers for select
  using (active = true);

-- Anyone can register
create policy "ov_public_insert"
  on public.onsite_volunteers for insert
  with check (acknowledged_safety = true);  -- must confirm safety acknowledgement

-- Only admin can deactivate or update
create policy "ov_admin_update"
  on public.onsite_volunteers for update
  using (auth.role() = 'authenticated');

create policy "ov_admin_delete"
  on public.onsite_volunteers for delete
  using (auth.role() = 'authenticated');
