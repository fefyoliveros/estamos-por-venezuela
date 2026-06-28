-- 010: Add Yummi Rides, Liberty Express, Mandalo Ya + update Fundación Bambi
-- Run in Supabase SQL Editor → Execute

-- ── 1. Yummi Rides ────────────────────────────────────────────────────────────
-- Platform centralising food donation and coordinating on-site volunteers
insert into public.resources (
  name, type, url, instagram, city, country,
  description_es, verified, active, earthquake_specific, is_government
) values (
  'Yummi Rides — Donación',
  'collection_point',
  'https://dona.yummyrides.com',
  null,
  'Caracas',
  'VE',
  'Plataforma de centralización de donaciones de alimentos y coordinación de voluntarios presenciales en Venezuela. Dos portales: dona.yummyrides.com para donaciones y sos.yummyrides.com para coordinación de voluntarios en zona.',
  true,
  true,
  true,
  false
),
(
  'Yummi Rides — SOS Voluntarios',
  'volunteer_coordinator',
  'https://sos.yummyrides.com',
  null,
  'Caracas',
  'VE',
  'Portal de coordinación de voluntarios presenciales de Yummi Rides. Organiza brigadas de ayuda alimentaria y logística en zona de emergencia.',
  true,
  true,
  true,
  false
);

-- ── 2. Yummi Rides como iniciativa de voluntariado ────────────────────────────
insert into public.volunteer_initiatives (
  title, description, location, coordinator_name, coordinator_contact,
  needed_skills, spots_available, category, is_onsite, active
) values (
  'Yummi Rides — Voluntarios presenciales y donación alimentaria',
  'Plataforma que centraliza la donación de alimentos y organiza voluntarios presenciales en Venezuela. Si estás en zona, coordina a través de sos.yummyrides.com. Si quieres donar, entra en dona.yummyrides.com.',
  'Caracas, Venezuela',
  'Yummi Rides',
  'https://sos.yummyrides.com',
  ARRAY['logística', 'reparto de alimentos', 'coordinación'],
  null,
  'food',
  true,
  true
);

-- ── 3. Liberty Express — Campaña solidaria de envíos ─────────────────────────
insert into public.resources (
  name, type, url, instagram, city, country,
  description_es, verified, active, earthquake_specific, is_government
) values (
  'Liberty Express — Envío solidario',
  'collection_point',
  null,
  null,
  null,
  'ES',
  'Campaña solidaria: un envío gratuito por cliente de artículos esenciales (hasta 4 kg) desde cualquier sucursal Liberty Express en Europa. Destinos: Gran Caracas y La Guaira (estados declarados en emergencia). Se acepta: alimentos no perecederos, medicamentos, suministros médicos autorizados, ropa en buen estado. NO se acepta: electrónica, inflamables, alcohol, artículos prohibidos en transporte aéreo. Entrega en tiendas Liberty Express en los estados indicados.',
  true,
  true,
  true,
  false
);

-- ── 4. Mandalo Ya — Campaña solidaria de envíos ──────────────────────────────
insert into public.resources (
  name, type, url, instagram, city, country,
  description_es, verified, active, earthquake_specific, is_government
) values (
  'Mandalo Ya — Envío solidario',
  'collection_point',
  null,
  null,
  'Madrid',
  'ES',
  'Campaña solidaria: un envío gratuito por cliente de artículos esenciales (hasta 4 kg) desde dos puntos en Madrid: Mercado Las Maravillas y Montera. Destinos: Gran Caracas y La Guaira (estados declarados en emergencia). Se acepta: alimentos no perecederos, medicamentos, suministros médicos autorizados, ropa limpia en buen estado. NO se acepta: electrónica, inflamables, alcohol, artículos prohibidos en transporte aéreo.',
  true,
  true,
  true,
  false
);

-- ── 5. Actualizar Fundación Bambi con Instagram y Zelle ───────────────────────
update public.resources
set
  instagram = '@hogarbambi',
  contact   = 'Zelle: admin@bambifoundation.org · Instagram: @hogarbambi',
  url       = coalesce(url, 'https://www.instagram.com/hogarbambi')
where lower(name) like '%bambi%'
  and country in ('VE', 'INT', '🌐');
