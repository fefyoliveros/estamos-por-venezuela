-- Migration 020: Supply coordination hub
-- Tables: supply_hubs (hospitals + centros de acopio) + supply_reports (shortage/surplus)

-- ── Tables ───────────────────────────────────────────────────────────────────

create table public.supply_hubs (
  id                uuid         default gen_random_uuid() primary key,
  name              text         not null,
  hub_type          text         not null check (hub_type in ('hospital', 'collection_point')),
  location          text         not null,
  city              text,
  contact_name      text,
  contact_whatsapp  text,
  contact_instagram text,
  description       text,
  verified          boolean      default true,
  active            boolean      default true,
  created_at        timestamptz  default now()
);

create table public.supply_reports (
  id          uuid        default gen_random_uuid() primary key,
  hub_id      uuid        not null references public.supply_hubs(id) on delete cascade,
  report_type text        not null check (report_type in ('shortage', 'surplus')),
  items       text[]      default '{}',
  description text,
  urgency     text        not null default 'medium'
              check (urgency in ('critical', 'high', 'medium', 'low')),
  updated_by  text        not null,
  active      boolean     default true,
  created_at  timestamptz default now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table public.supply_hubs    enable row level security;
alter table public.supply_reports enable row level security;

-- Public reads only active rows
create policy "public_read_supply_hubs"
  on public.supply_hubs for select using (active = true);

create policy "public_read_supply_reports"
  on public.supply_reports for select using (active = true);

-- Anyone can post a report (open, same model as NeedsPanel)
create policy "public_insert_supply_reports"
  on public.supply_reports for insert with check (true);

-- Admin (service role) bypasses RLS — no extra policy needed

-- ── Seed: hospitals from migration 018 ───────────────────────────────────────

insert into public.supply_hubs (name, hub_type, location, city, description, verified)
values
  (
    'Hospital Pérez Carreño',
    'hospital',
    'Caracas, Venezuela',
    'Caracas',
    'Hospital general. Alta demanda post-sismo.',
    true
  ),
  (
    'Hospital Lídice de Catia',
    'hospital',
    'Catia, Caracas, Venezuela',
    'Caracas',
    'Alta demanda por quemados.',
    true
  ),
  (
    'Hospital Universitario de Caracas (UCV)',
    'hospital',
    'Ciudad Universitaria, Caracas, Venezuela',
    'Caracas',
    null,
    true
  ),
  (
    'Instituto Anatómico UCV',
    'hospital',
    'Ciudad Universitaria, Caracas, Venezuela',
    'Caracas',
    null,
    true
  ),
  (
    'Hospital J.M. de los Ríos',
    'hospital',
    'Caracas, Venezuela',
    'Caracas',
    'Hospital pediátrico.',
    true
  ),
  (
    'Hospital Francisco Pimentel',
    'hospital',
    'Caracas, Venezuela',
    'Caracas',
    null,
    true
  ),
  (
    'Hospital Trinidad',
    'hospital',
    'Caracas, Venezuela',
    'Caracas',
    null,
    true
  ),
  (
    'Hospital Dr. Domingo Luciani',
    'hospital',
    'El Llanito, Caracas, Venezuela',
    'Caracas',
    null,
    true
  ),
  (
    'Hospital Vargas de Caracas',
    'hospital',
    'Caracas, Venezuela',
    'Caracas',
    null,
    true
  ),
  (
    'Hospital El Junquito',
    'hospital',
    'El Junquito, Caracas, Venezuela',
    'Caracas',
    null,
    true
  ),
  (
    'Hospital Magallanes de Catia',
    'hospital',
    'Catia, Caracas, Venezuela',
    'Caracas',
    null,
    true
  ),
  (
    'Materno Infantil de El Valle',
    'hospital',
    'El Valle, Caracas, Venezuela',
    'Caracas',
    'Centro de acopio activo. Hospital materno-infantil.',
    true
  ),
  (
    'Casa Bambi',
    'collection_point',
    'Caracas, Venezuela',
    'Caracas',
    'Casa hogar para bebés y niños. Recibe fórmula, pañales, ropa y artículos de higiene.',
    true
  ),
  (
    'Escuela de Medicina UCV — Centro de Acopio',
    'collection_point',
    'Ciudad Universitaria, Caracas, Venezuela',
    'Caracas',
    'Centro de acopio activo en la UCV.',
    true
  );

-- ── Seed: initial shortage reports from migration 018 data ───────────────────

-- Use a CTE to get the hub IDs by name, then insert the shortage reports
with hubs as (
  select id, name from public.supply_hubs
)
insert into public.supply_reports (hub_id, report_type, items, description, urgency, updated_by)
select
  h.id,
  'shortage',
  report.items,
  report.description,
  report.urgency,
  'Migración inicial (fuente: hospitalesenvenezuela.com / redes sociales)'
from (values
  (
    'Hospital Pérez Carreño',
    array['Losartán 50mg','Hidroclorotiazida','Metformina','Amlodipina','Ibuprofeno','Paracetamol','Sueros 0.9%','Ringer Lactato','Guantes','Gasas','Yelco #24','Jeringas #20','Suturas seda 2-0 y 3-0'],
    'Necesidades críticas de medicamentos e insumos. Ver lista completa en la descripción.',
    'critical'
  ),
  (
    'Hospital Lídice de Catia',
    array['Guantes','Gasas','Rollos para quemados','Adhesivo','Sulfadiazina de plata','Bacitracina','Cepillos quirúrgicos'],
    'Alta demanda por quemados. Insumos para curas urgentes.',
    'critical'
  ),
  (
    'Hospital Universitario de Caracas (UCV)',
    array['Gasas','Guantes','Solución 0.9%','Ringer Lactato','Jeringas #5','Jeringas #10','Jeringas #20','Compresas','Bacitracina'],
    'Recepción en área de Enfermería.',
    'high'
  ),
  (
    'Instituto Anatómico UCV',
    array['Cloruro de sodio inyectable','Bacitracina','Sulfadiazina de plata','Macrogoteros','Catéter IV','Jeringas #5','Jeringas #10','Jeringas #20','Guantes de nitrilo','Pañales adulto'],
    null,
    'high'
  ),
  (
    'Hospital J.M. de los Ríos',
    array['Glucómetros','Tiras reactivas','Teteros'],
    'Hospital pediátrico. Insumos para niños internados.',
    'high'
  ),
  (
    'Hospital Francisco Pimentel',
    array['Insumos para curas','Pañales niños','Leche NAN','Medicamentos pediátricos','Bolsas negras'],
    null,
    'high'
  ),
  (
    'Hospital Trinidad',
    array['Agua potable','Productos de higiene','Insumos médicos generales'],
    'Centro de acopio activo.',
    'medium'
  ),
  (
    'Materno Infantil de El Valle',
    array['Alcohol','Gasas','Yelcos','Jeringas','Medicamentos básicos'],
    'Centro de acopio activo. Urgente: insumos médicos y comida para niños hospitalizados.',
    'critical'
  ),
  (
    'Casa Bambi',
    array['Fórmula y alimentos bebé','Pañales','Toallas húmedas','Crema antipañalitis','Cobijas','Sábanas'],
    'Casa hogar para bebés y niños. Necesita artículos básicos de cuidado.',
    'high'
  ),
  (
    'Escuela de Medicina UCV — Centro de Acopio',
    array['Acetaminofén pediátrico jarabe','Cetirizina','Loratadina pediátrica','Sueros hidratación oral','Pañales','Inhaladores','Ibuprofeno pediátrico'],
    'Centro de acopio activo en la UCV.',
    'high'
  )
) as report(hub_name, items, description, urgency)
join hubs h on h.name = report.hub_name;
