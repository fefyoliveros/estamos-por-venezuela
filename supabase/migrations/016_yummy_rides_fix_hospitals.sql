-- 014: Fix Yummi → Yummy Rides + add Hospitales en Venezuela
-- Run in Supabase SQL Editor → Execute

-- ── 1. Fix spelling: Yummi → Yummy ───────────────────────────────────────────
update public.resources
set
  name         = 'Yummy Rides — Donación',
  description_es = replace(description_es, 'Yummi Rides', 'Yummy Rides')
where name = 'Yummi Rides — Donación';

update public.resources
set
  name         = 'Yummy Rides — SOS Voluntarios',
  description_es = replace(description_es, 'Yummi Rides', 'Yummy Rides')
where name = 'Yummi Rides — SOS Voluntarios';

update public.volunteer_initiatives
set
  title            = 'Yummy Rides — Voluntarios presenciales y donación alimentaria',
  coordinator_name = 'Yummy Rides',
  description      = replace(description, 'Yummi Rides', 'Yummy Rides')
where coordinator_name = 'Yummi Rides';

-- ── 2. Hospitales en Venezuela — directorio (desaparecidos / médico) ──────────
insert into public.resources (
  name, type, url, instagram, city, country,
  description_es, verified, active, earthquake_specific, is_government
) values (
  'Hospitales en Venezuela',
  'missing_persons',
  'https://www.hospitalesenvenezuela.com',
  '@gaboangulo.mkt',
  null,
  'VE',
  'Portal para localizar personas ingresadas en hospitales venezolanos tras el terremoto. Busca por nombre en los hospitales de las zonas afectadas. Voluntarios online contribuyen añadiendo listas de pacientes para facilitar la búsqueda de familiares. Coordinado por @gaboangulo.mkt.',
  true,
  true,
  true,
  false
);

-- ── 3. Hospitales en Venezuela — iniciativa de voluntariado online ─────────────
insert into public.volunteer_initiatives (
  title, description, location, coordinator_name, coordinator_contact,
  needed_skills, spots_available, category, is_onsite, active
) values (
  'Hospitales en Venezuela — Registrar listas de pacientes hospitalizados',
  'Voluntarios online ayudan a registrar en el portal hospitalesenvenezuela.com los nombres de personas ingresadas en hospitales de las zonas afectadas del terremoto. Este trabajo permite que las familias puedan localizar a sus seres queridos desaparecidos. No requiere presencia física — se hace desde cualquier lugar con acceso a información hospitalaria.',
  'Online / Venezuela',
  'Gabo Angulo',
  '@gaboangulo.mkt',
  ARRAY['registro de datos', 'coordinación online', 'hospitalario'],
  null,
  'coordination',
  false,
  true
);
