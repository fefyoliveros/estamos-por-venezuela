-- 008: Fix confirmed URLs, add Cruz Roja Venezuela bank details, add European and US collection points

-- Fix Cruz Roja Española — confirmed URL
update public.resources
set url = 'https://www2.cruzroja.es/-/ayuda-terremoto-venezuela-2026'
where name = 'Cruz Roja Española — Ayuda Terremoto Venezuela';

-- Fix Cáritas Española — confirmed URL
update public.resources
set url = 'https://www.caritas.es/castrense/emergencias/caritas-con-venezuela/'
where name = 'Cáritas Española — Venezuela';

-- Fix UNICEF — Spanish-specific portal
update public.resources
set url = 'https://www.unicef.es/colabora/dona/emergencia-terremoto-en-venezuela?fc=9923'
where name = 'UNICEF — Emergencia Terremoto Venezuela';

-- Fix Save the Children — Spanish portal
update public.resources
set url = 'https://www.savethechildren.es/donacion-ong/terremoto-en-venezuela-2026'
where name = 'Save the Children — Terremoto Venezuela 2026';

-- Update Cruz Roja Venezolana with bank account details from official flyer
update public.resources
set
  url = 'https://crvkycdonantes.netlify.app',
  contact = 'Banesco Bs: 0134-0224-82-2243028658 | Banesco USD: 0134-1736-99-0001006051 | Banesco América: 1500236086 | Zelle: contabilidad@cruzroja.ve | IBAN EUR (ABANCA): ES18208000473693040028376 | Reporta tu donación: crvkycdonantes.netlify.app',
  description_es = 'Cruz Roja Venezolana desplegada en hospitales y rescates. RIF J-00235031-8. Acepta transferencias en bolívares (Banesco), USD (Banesco), Zelle y euros (ABANCA). IFRC lanzó llamamiento de emergencia para 300.000 personas.',
  description_en = 'Venezuelan Red Cross deployed at hospitals and rescue sites. RIF J-00235031-8. Accepts transfers in bolívares (Banesco), USD (Banesco), Zelle and euros (ABANCA). IFRC launched emergency appeal for 300,000 people.'
where name = 'Cruz Roja Venezolana / IFRC';

-- Mark Sambil Madrid as temporarily paused
update public.resources
set
  description_es = '⚠️ TEMPORALMENTE PAUSADO (27 jun): Capacidad de carga colmada. Sambil Madrid, Leganés. Comida no perecedera, medicamentos, higiene, ropa, mantas.',
  description_en = '⚠️ TEMPORARILY PAUSED (27 Jun): Cargo capacity maxed out. Sambil Madrid, Leganés. Non-perishable food, medicine, hygiene, clothing, blankets.'
where name = 'Punto de recogida — Sambil Madrid (Leganés)';

-- Add European and US collection points
insert into public.resources (name, type, url, instagram, city, country, description_es, description_en, contact, verified, earthquake_specific) values
(
  'VENESP — Parroquia Santa María de la Esperanza',
  'collection_point',
  null,
  null,
  'Alcobendas, Madrid',
  'ES',
  'Asociación Civil de Venezolanos en España. Ropa, mantas, productos de higiene, linternas.',
  'Venezuelan Civil Association in Spain. Clothes, blankets, hygiene products, flashlights.',
  'Parroquia Santa María de la Esperanza, Alcobendas, Madrid',
  true,
  true
),
(
  'VENESP — Pardillo Center, Villanueva de la Cañada',
  'collection_point',
  null,
  null,
  'Villanueva de la Cañada, Madrid',
  'ES',
  'Pardillo Center y VENESP. Comida no perecedera, productos de higiene, mantas.',
  'Pardillo Center and VENESP. Non-perishable food, hygiene products, blankets.',
  'Av. de Madrid, 4, local 1, Villanueva de la Cañada',
  true,
  true
),
(
  'Capilla Divina Pastora — Sevilla',
  'collection_point',
  null,
  null,
  'Sevilla',
  'ES',
  'Hub activo de recogida de suministros. Comida, kits médicos, primeros auxilios, comida para animales.',
  'Active supply collection hub. Food, medical kits, first aid, pet food.',
  'Calle Amparo, 13, Sevilla (lun-sáb 19:00-21:00)',
  true,
  true
),
(
  'Secours Populaire — Fonds Urgence Venezuela',
  'ngo',
  'https://don.secourspopulaire.fr/urgence',
  null,
  'Paris',
  'INT',
  'Fondo de emergencia activo. Donación financiera para asistencia humanitaria directa en Venezuela.',
  'Active emergency fund. Financial donations for direct humanitarian assistance in Venezuela.',
  '9/11 rue Froissart, 75123 Paris | don.secourspopulaire.fr/urgence',
  true,
  true
),
(
  'AMU / Focolares — Emergencia Venezuela',
  'ngo',
  'https://www.amu-it.eu/campagne/emergenza-terremoto-in-venezuela/',
  null,
  'Roma',
  'INT',
  'Campaña activa del Movimiento de los Focolares. Reconstrucción de viviendas y asistencia alimentaria vía Banca Etica.',
  'Active campaign by the Focolare Movement. Housing reconstruction and food assistance via Banca Etica.',
  'amu-it.eu/campagne/emergenza-terremoto-in-venezuela/',
  true,
  true
),
(
  'UNICEF UK — Venezuela Earthquake Appeal',
  'ngo',
  'https://www.unicef.org.uk/donate/donate-to-our-venezuela-earthquake-appeal/',
  null,
  'London',
  'INT',
  'Fondo de emergencia oficial UK. Purificación de agua y kits médicos para afectados.',
  'UK official emergency fund. Water purification tablets and medical kits for affected people.',
  'unicef.org.uk | Tel: 0300 330 5699',
  true,
  true
),
(
  'Global Empowerment Mission (GEM) — Hope 4 Venezuela',
  'collection_point',
  null,
  null,
  'Doral, Miami (FL)',
  'INT',
  'GEM y Neighbors 4 Neighbors. Comida no perecedera, higiene, artículos para bebés, mantas, ropa. Campaña "Hope 4 Venezuela".',
  'GEM and Neighbors 4 Neighbors. Non-perishable food, hygiene, baby items, blankets, clothing. "Hope 4 Venezuela" campaign.',
  '1850 NW 84th Ave., Suite 100, Doral, FL 33166',
  true,
  true
),
(
  'Inter Miami CF & City of Doral — Drive Venezuela',
  'collection_point',
  null,
  null,
  'Miami (FL)',
  'INT',
  'City of Doral e Inter Miami CF. Bins especiales junto a la tienda del equipo. Activo hasta el 3 de julio 2026.',
  'City of Doral and Inter Miami CF. Specially marked bins outside team store. Running until July 3, 2026.',
  'Nu Stadium (south side), 1900 NW 37th Ave, Miami, FL | Hasta 3 jul 2026',
  true,
  true
),
(
  'Doral Legacy Park Community Center',
  'collection_point',
  null,
  null,
  'Doral, Miami (FL)',
  'INT',
  'Centro comunitario oficial de Doral. Entrega entre semana 17:00-21:00, fines de semana 8:00-17:00.',
  'Official City of Doral community centre. Weekdays 5–9PM, weekends 8AM–5PM.',
  '11400 NW 82nd St, Doral, FL 33178',
  true,
  true
),
(
  'El Arepazo — Punto de Recogida 24/7',
  'collection_point',
  null,
  null,
  'Doral, Miami (FL)',
  'INT',
  'Hub venezolano abierto 24/7. Agua, ropa, comida en lata, artículos médicos y de primeros auxilios.',
  'Venezuelan hub open 24/7. Water, clothing, canned goods, medical and first-aid items.',
  '10191 NW 58th St, Doral, FL 33178 (abierto 24/7)',
  true,
  true
),
(
  'AFE Organisation — Miami',
  'collection_point',
  null,
  null,
  'Miami (FL)',
  'INT',
  'Suministros médicos y artículos de ayuda humanitaria para Venezuela. Lun-vie 9:30-15:00.',
  'Medical supplies and disaster relief items for Venezuela. Mon-Fri 9:30AM–3PM.',
  '6090 NW 84th Ave, Miami, FL 33166 (lun-vie 9:30-15:00)',
  true,
  true
);
