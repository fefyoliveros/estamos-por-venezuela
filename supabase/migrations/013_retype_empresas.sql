-- 013: Reclassify Yummi Rides, Liberty Express, Mandalo Ya as type 'business'
-- Run in Supabase SQL Editor → Execute

update public.resources
set type = 'business'
where name in (
  'Yummi Rides — Donación',
  'Yummi Rides — SOS Voluntarios',
  'Yummy SOS',
  'Liberty Express — Envío solidario',
  'Mandalo Ya — Envío solidario'
);
