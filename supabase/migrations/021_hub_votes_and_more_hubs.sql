-- Allow public hub submissions (unverified by default)
create policy "public_insert_hubs" on public.supply_hubs
  for insert with check (true);

-- Community trust / denounce votes on hubs
create table public.hub_votes (
  id         uuid         default gen_random_uuid() primary key,
  hub_id     uuid         not null references public.supply_hubs(id) on delete cascade,
  vote_type  text         not null check (vote_type in ('trust', 'denounce')),
  reason     text,
  created_at timestamptz  default now()
);
alter table public.hub_votes enable row level security;
create policy "public_read_hub_votes"   on public.hub_votes for select using (true);
create policy "public_insert_hub_votes" on public.hub_votes for insert with check (true);

-- Update existing hubs with contacts from ayudaencamino.com API
update public.supply_hubs
  set contact_whatsapp = '04127798402'
  where name ilike '%Pérez Carreño%' and contact_whatsapp is null;

update public.supply_hubs
  set contact_name = 'Anabella', contact_whatsapp = '04245206042'
  where name ilike '%Domingo Luciani%' and contact_whatsapp is null;

update public.supply_hubs
  set contact_name = 'Paula Cortiñas', contact_whatsapp = '04142420563'
  where name ilike '%Universitario de Caracas%' and contact_whatsapp is null;

update public.supply_hubs
  set contact_name = 'Ana Marcano', contact_whatsapp = '04249508354'
  where (name ilike '%J.M. de los Ríos%' or name ilike '%JM de los rios%') and contact_whatsapp is null;

update public.supply_hubs
  set contact_name = 'Melissa Savino', contact_whatsapp = '04243531964'
  where name ilike '%Vargas%' and contact_whatsapp is null;

-- New hubs from ayudaencamino.com organizations API
insert into public.supply_hubs
  (name, hub_type, location, city, contact_name, contact_whatsapp, verified, active)
values
  ('Hospital Periférico de Catia',               'hospital',         'Catia, Caracas, Venezuela',       'Caracas',   'Dr. Samuel Padrino', '4168879420',   true, true),
  ('Hospital Ana Francisca Pérez de León',       'hospital',         'Petare, Caracas, Venezuela',      'Caracas',   null,                  '04248503105',  true, true),
  ('Hospital San José de La Guaira',             'hospital',         'La Guaira, Venezuela',            'La Guaira', null,                  '04247313491',  true, true),
  ('El Hogar Clínica Madre Teresa',              'hospital',         'La Guaira, Venezuela',            'La Guaira', 'Alicia Hernández',    '04122442424',  true, true),
  ('Clínica La Floresta',                        'hospital',         'Caracas, Venezuela',              'Caracas',   'Jorge Makriniotis',   '04241938180',  true, true),
  ('Clínica Alfa La Guaira',                     'hospital',         'La Guaira, Venezuela',            'La Guaira', 'Massimiliano Luca',   '04142379608',  true, true),
  ('Hospital Victorino Santaella',               'hospital',         'Los Teques, Miranda, Venezuela',  'Miranda',   'Jesús Arias',         '04141433330',  true, true),
  ('Hospital Guarenas-Guatire',                  'hospital',         'Guatire, Miranda, Venezuela',     'Miranda',   null,                   null,           true, true),
  ('Hemocentro Chacao',                          'hospital',         'Chacao, Caracas, Venezuela',      'Caracas',   'Héctor Velazco',      '4123393880',   true, true),
  ('Centro Técnico Don Bosco',                   'collection_point', 'Caracas, Venezuela',              'Caracas',   'Padre Fredy Niño',    '04126742886',  true, true),
  ('Centro de Acopio Hospital de Clínicas',      'collection_point', 'Caracas, Venezuela',              'Caracas',   'Mariale Tovar',       '04141503286',  true, true),
  ('Centro de Acopio UNIMET',                    'collection_point', 'Caracas, Venezuela',              'Caracas',   null,                   null,           true, true),
  ('Centro de Acopio Catia Calle México',        'collection_point', 'Catia, Caracas, Venezuela',       'Caracas',   null,                   null,           true, true);
