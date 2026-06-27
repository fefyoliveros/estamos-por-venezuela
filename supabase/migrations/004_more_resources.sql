-- ============================================================
-- Migration 004: Deduplicate + bulk resource additions
-- Run in Supabase SQL Editor → Execute
-- ============================================================

-- 1. Remove duplicate rows (keep earliest inserted per unique name)
DELETE FROM public.resources
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY LOWER(TRIM(name))
      ORDER BY created_at ASC, id ASC
    ) AS rn
    FROM public.resources
  ) ranked
  WHERE rn > 1
);

-- ============================================================
-- 2. Campañas de donación — TIER 1: Internacionales verificadas
-- ============================================================

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'UNICEF Venezuela Earthquake', 'campaign', 'https://www.unicef.org/appeals/venezuela-earthquake', 'INT',
  'Fondo de UNICEF específico para el terremoto de Venezuela 2026. Ayuda a niños en situación de emergencia.',
  'UNICEF fund specific to the 2026 Venezuela earthquake. Helps children in emergency situations.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'UNICEF Venezuela Earthquake');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Cruz Roja Venezuela', 'campaign', 'https://www.cruzrojavenezuela.org', 'VE',
  'Cruz Roja Venezolana — coordinación local de ayuda humanitaria y rescate.',
  'Venezuelan Red Cross — local humanitarian aid and rescue coordination.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Cruz Roja Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Caritas Venezuela', 'campaign', 'https://www.caritasvenezuela.org', 'VE',
  'Caritas Venezuela — distribución de alimentos, medicinas y atención humanitaria.',
  'Caritas Venezuela — food distribution, medicine and humanitarian care.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Caritas Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Save the Children Venezuela', 'campaign', 'https://www.savethechildren.org/us/what-we-do/emergency-response/venezuela-earthquake', 'INT',
  'Save the Children — enfocado en niños afectados por el terremoto de Venezuela.',
  'Save the Children — focused on children affected by the Venezuela earthquake.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Save the Children Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'World Central Kitchen Venezuela', 'campaign', 'https://wck.org/relief/venezuela-earthquake-2026', 'INT',
  'WCK activa en Venezuela — reparto de comidas calientes a afectados. Bizum: 03843',
  'WCK active in Venezuela — hot meal distribution to those affected. Bizum: 03843',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'World Central Kitchen Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, contact, verified, active, earthquake_specific)
SELECT 'Global Giving Venezuela Earthquake', 'campaign', 'https://www.globalgiving.org/fundraisers/venezuela-earthquake/', 'INT',
  'Fondo GlobalGiving para el terremoto de Venezuela — transparente y verificado.',
  'GlobalGiving fund for the Venezuela earthquake — transparent and verified.',
  'globalgiving.org/fundraisers/venezuela-earthquake',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Global Giving Venezuela Earthquake');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Plan International Venezuela Earthquake Appeal', 'campaign', 'https://www.plan-international.org/get-involved/venezuela-earthquake-appeal/', 'INT',
  'Plan International — respuesta al terremoto de Venezuela, enfocado en protección infantil.',
  'Plan International — Venezuela earthquake response, focused on child protection.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Plan International Venezuela Earthquake Appeal');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Direct Relief Venezuela', 'campaign', 'https://www.directrelief.org/emergency/venezuela-earthquake/', 'INT',
  'Direct Relief — suministros médicos de emergencia para Venezuela.',
  'Direct Relief — emergency medical supplies for Venezuela.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Direct Relief Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'International Medical Corps Venezuela', 'campaign', 'https://internationalmedicalcorps.org/emergency-response/venezuela-earthquake/', 'INT',
  'International Medical Corps — atención sanitaria de emergencia en zonas afectadas.',
  'International Medical Corps — emergency healthcare in affected areas.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'International Medical Corps Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Project Hope Venezuela', 'campaign', 'https://www.projecthope.org/crisis/venezuela-earthquake/', 'INT',
  'Project Hope — salud y apoyo médico en Venezuela tras el terremoto.',
  'Project Hope — health and medical support in Venezuela after the earthquake.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Project Hope Venezuela');

-- ============================================================
-- 3. Campañas venezolanas específicas
-- ============================================================

INSERT INTO public.resources (name, type, url, country, description_es, description_en, contact, verified, active, earthquake_specific)
SELECT 'Gio Foundation Inc', 'campaign', 'https://www.paypal.com/donate/?hosted_button_id=KCC5G44TF6Q3G', 'INT',
  'Fundación Gio — donación directa por PayPal para ayuda humanitaria Venezuela.',
  'Gio Foundation — direct PayPal donation for Venezuela humanitarian aid.',
  'PayPal: paypal.com/donate/?hosted_button_id=KCC5G44TF6Q3G',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Gio Foundation Inc');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'GoFundMe Venezuela Earthquake Relief', 'campaign', 'https://www.gofundme.com/c/act/venezuela-earthquake-relief', 'INT',
  'Campaña oficial de GoFundMe para el terremoto de Venezuela 2026.',
  'Official GoFundMe campaign for the 2026 Venezuela earthquake.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'GoFundMe Venezuela Earthquake Relief');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Hazlo Hoy — Terremoto Venezuela', 'campaign', 'https://www.terremoto.hazlohoy.org', 'VE',
  'Plataforma venezolana Hazlo Hoy — búsqueda de desaparecidos y donaciones para el terremoto.',
  'Venezuelan platform Hazlo Hoy — missing persons search and earthquake donations.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Hazlo Hoy — Terremoto Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Sun Risas', 'campaign', 'https://fundraise.sunrisas.org/campaing/815513/donate', 'INT',
  'Sun Risas — campaña de recaudación para afectados del terremoto de Venezuela.',
  'Sun Risas — fundraising campaign for Venezuela earthquake victims.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Sun Risas');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'We Love Foundation', 'campaign', NULL, 'INT',
  'We Love Foundation — apoyo humanitario para Venezuela.',
  'We Love Foundation — humanitarian support for Venezuela.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'We Love Foundation');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'The House Project', 'campaign', NULL, 'INT',
  'The House Project — reconstrucción y apoyo a afectados del terremoto.',
  'The House Project — reconstruction and support for earthquake victims.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'The House Project');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Hogar Bambi Venezuela', 'campaign', NULL, 'VE',
  'Hogar Bambi Venezuela — albergue y apoyo a niños y familias desplazadas.',
  'Hogar Bambi Venezuela — shelter and support for displaced children and families.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Hogar Bambi Venezuela');

-- ============================================================
-- 4. Ayuda a niños
-- ============================================================

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'ASONACOP', 'ngo', NULL, 'VE',
  'Asociación venezolana de apoyo a niños y familias afectadas por el terremoto.',
  'Venezuelan association supporting children and families affected by the earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'ASONACOP');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Fundación Red de Casas Don Bosco', 'ngo', NULL, 'VE',
  'Red de casas salesianas de acogida para niños y jóvenes afectados por el terremoto.',
  'Network of Salesian homes for children and youth affected by the earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Fundación Red de Casas Don Bosco');

-- ============================================================
-- 5. Búsqueda de desaparecidos
-- ============================================================

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Desaparecidos Terremoto Venezuela', 'missing_persons', 'https://www.desaparecidosterremotovenezuela.com', 'VE',
  'Plataforma de búsqueda de personas desaparecidas tras el terremoto de Venezuela.',
  'Platform for searching missing persons after the Venezuela earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Desaparecidos Terremoto Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Red Ayuda Venezuela', 'missing_persons', 'https://www.redayudavenezuela.com', 'VE',
  'Red de ayuda con buscador de desaparecidos y coordinación de ayuda humanitaria.',
  'Aid network with missing persons search and humanitarian aid coordination.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Red Ayuda Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Venezuela Reporta', 'missing_persons', 'https://www.venezuelareporta.org', 'VE',
  'Plataforma ciudadana para reportar y buscar personas desaparecidas.',
  'Citizen platform to report and search for missing persons.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Venezuela Reporta');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'SOS Venezuela 2026', 'missing_persons', 'https://www.sosvenezuela2026.com', 'VE',
  'Portal de emergencia con buscador de desaparecidos y recursos de ayuda.',
  'Emergency portal with missing persons search and aid resources.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'SOS Venezuela 2026');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Busca en VZLA', 'missing_persons', 'https://www.buscaenvzla.com', 'VE',
  'Buscador de personas desaparecidas en Venezuela tras el terremoto.',
  'Missing persons search tool in Venezuela after the earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Busca en VZLA');

-- ============================================================
-- 6. Comida / Food
-- ============================================================

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Alimenta La Solidaria', 'ngo', 'https://www.alimentalasolidaria.org', 'VE',
  'ONG venezolana de distribución de alimentos a comunidades vulnerables.',
  'Venezuelan NGO distributing food to vulnerable communities.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Alimenta La Solidaria');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Programa Mundial de Alimentos', 'ngo', 'https://www.wfp.org/countries/venezuela', 'INT',
  'WFP — distribución de alimentos de emergencia en zonas afectadas por el terremoto.',
  'WFP — emergency food distribution in areas affected by the earthquake.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Programa Mundial de Alimentos');

-- ============================================================
-- 7. Salud / Medical
-- ============================================================

INSERT INTO public.resources (name, type, url, city, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Médicos por Venezuela', 'medical', 'https://www.medicosporvenezuela.org', 'Caracas', 'VE',
  'Red de médicos venezolanos coordinando atención sanitaria de emergencia.',
  'Network of Venezuelan doctors coordinating emergency healthcare.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Médicos por Venezuela');

-- ============================================================
-- 8. Portales de ayuda / Registro
-- ============================================================

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'VeneConnect', 'portal', 'https://www.veneconnect.com', 'VE',
  'Portal de registro y conexión de ayuda para el terremoto de Venezuela.',
  'Registration and aid connection portal for the Venezuela earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'VeneConnect');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Donar Seguro', 'portal', 'https://www.donarseguro.com', 'VE',
  'Plataforma de donaciones verificadas para el terremoto de Venezuela.',
  'Verified donation platform for the Venezuela earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Donar Seguro');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Sismo Ayuda Venezuela', 'portal', 'https://www.sismoayudave.com', 'VE',
  'Portal de coordinación de ayuda y voluntariado para el terremoto.',
  'Aid coordination and volunteering portal for the earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Sismo Ayuda Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Terremoto Venezuela', 'portal', 'https://www.terremotovenezuela.com', 'VE',
  'Portal central de información y ayuda sobre el terremoto de Venezuela.',
  'Central information and aid portal about the Venezuela earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Terremoto Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Ayuda en Camino', 'portal', 'https://www.ayudaencamino.com', 'VE',
  'Portal de coordinación de insumos y ayuda en tránsito hacia Venezuela.',
  'Portal coordinating supplies and aid in transit to Venezuela.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Ayuda en Camino');

-- ============================================================
-- 9. Rescate animal
-- ============================================================

INSERT INTO public.resources (name, type, url, instagram, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'La Manada de Beethoven', 'animal_rescue', NULL, '@lamanadadebethoven', 'VE',
  'Rescate y cuidado de animales afectados por el terremoto de Venezuela.',
  'Rescue and care of animals affected by the Venezuela earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'La Manada de Beethoven');

INSERT INTO public.resources (name, type, url, instagram, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Misión Nevado Oficial', 'animal_rescue', NULL, '@misionnevadooficial', 'VE',
  'Organización de rescate animal ante el terremoto de Venezuela.',
  'Animal rescue organization for the Venezuela earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Misión Nevado Oficial');

INSERT INTO public.resources (name, type, url, instagram, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Peluditos VE', 'animal_rescue', NULL, '@peluditosve_', 'VE',
  'Rescate y adopción de animales afectados por el terremoto.',
  'Rescue and adoption of animals affected by the earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Peluditos VE');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Laika Venezuela', 'animal_rescue', NULL, 'VE',
  'Organización de rescate y cuidado animal en zonas afectadas por el terremoto.',
  'Animal rescue and care organization in earthquake-affected areas.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Laika Venezuela');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Fundación Ruta Animal', 'animal_rescue', NULL, 'VE',
  'Fundación venezolana de rescate y protección animal tras el terremoto.',
  'Venezuelan animal rescue and protection foundation after the earthquake.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Fundación Ruta Animal');

-- ============================================================
-- 10. Voluntariado
-- ============================================================

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Interp-Aid — Traductores voluntarios', 'volunteer_coordinator', 'https://www.interp-aid.lovable.app', 'INT',
  'Plataforma de traductores online voluntarios inglés-español para coordinar ayuda internacional.',
  'Platform of online volunteer translators English-Spanish to coordinate international aid.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Interp-Aid — Traductores voluntarios');

INSERT INTO public.resources (name, type, url, city, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'UCV — Centro de Coordinación de Voluntarios', 'volunteer_coordinator', NULL, 'Caracas', 'VE',
  'Plaza de Rectorado UCV — centralización de voluntarios y materiales en Caracas.',
  'UCV Rector Plaza — centralization of volunteers and materials in Caracas.',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'UCV — Centro de Coordinación de Voluntarios');

INSERT INTO public.resources (name, type, url, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Hospitales Venezuela', 'volunteer_coordinator', 'https://www.hospitalesvenezuela.com', 'VE',
  'Red de hospitales y voluntarios médicos coordinando respuesta al terremoto.',
  'Network of hospitals and medical volunteers coordinating earthquake response.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Hospitales Venezuela');

INSERT INTO public.resources (name, type, url, instagram, city, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Figurolab — Impresión 3D de Férulas', 'volunteer_coordinator', NULL, '@Figurolab', 'Barcelona', 'ES',
  '@Figurolab imprime férulas 3D para afectados. Si tienes impresora 3D contáctales.',
  '@Figurolab prints 3D splints for those affected. If you have a 3D printer, contact them.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Figurolab — Impresión 3D de Férulas');

INSERT INTO public.resources (name, type, url, instagram, city, country, description_es, description_en, verified, active, earthquake_specific)
SELECT 'Lorena Báez — Voluntarios Los Teques', 'volunteer_coordinator', NULL, '@soylorenabaez', 'Los Teques', 'VE',
  'Voluntarios en Los Teques para preparar y llevar comida al Hospital Victorino Santaella.',
  'Volunteers in Los Teques preparing and bringing food to Hospital Victorino Santaella.',
  false, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Lorena Báez — Voluntarios Los Teques');

-- ============================================================
-- 11. Puntos de recogida — Barcelona (Acción Directa, sáb 27 jun 10:00-13:00)
-- ============================================================

INSERT INTO public.resources (name, type, url, city, country, description_es, description_en, contact, verified, active, earthquake_specific)
SELECT 'Acción Directa Barcelona — Punto de Recogida', 'collection_point',
  'https://acciondirectabarcelona.org', 'Barcelona', 'ES',
  'Coordinadora de puntos de recogida de insumos médicos en Barcelona. WhatsApp: https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
  'Coordinator of medical supply collection points in Barcelona.',
  'WhatsApp: https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Acción Directa Barcelona — Punto de Recogida');

INSERT INTO public.resources (name, type, city, country, description_es, description_en, contact, verified, active, earthquake_specific)
SELECT 'Academia Odontología — Punto de Recogida', 'collection_point', 'Barcelona', 'ES',
  'Punto de recogida médica. Sáb 27 jun 10:00-13:00. Dirección: Carrer Juan Sada 55, Barcelona.',
  'Medical collection point. Sat 27 Jun 10:00-13:00. Address: Carrer Juan Sada 55, Barcelona.',
  'Carrer Juan Sada 55, Barcelona',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Academia Odontología — Punto de Recogida');

INSERT INTO public.resources (name, type, city, country, description_es, description_en, contact, verified, active, earthquake_specific)
SELECT 'Restaurante Tío Papelón — Punto de Recogida', 'collection_point', 'Barcelona', 'ES',
  'Punto de recogida de insumos médicos. Sáb 27 jun 10:00-13:00. Dirección: Carrer Sicilia 247, Barcelona.',
  'Medical supply collection point. Sat 27 Jun 10:00-13:00. Address: Carrer Sicilia 247, Barcelona.',
  'Carrer Sicilia 247, Barcelona',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Restaurante Tío Papelón — Punto de Recogida');

INSERT INTO public.resources (name, type, city, country, description_es, description_en, contact, verified, active, earthquake_specific)
SELECT 'Restaurante El Tequeñón — Punto de Recogida', 'collection_point', 'Barcelona', 'ES',
  'Punto de recogida de insumos médicos. Sáb 27 jun 10:00-13:00. Dirección: Carrer del Pantà de Tremp 47, Barcelona.',
  'Medical collection point. Sat 27 Jun 10:00-13:00. Address: Carrer del Pantà de Tremp 47, Barcelona.',
  'Carrer del Pantà de Tremp 47, Barcelona',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Restaurante El Tequeñón — Punto de Recogida');

INSERT INTO public.resources (name, type, city, country, description_es, description_en, contact, verified, active, earthquake_specific)
SELECT 'Restaurante Rincón de la Abuela — Punto de Recogida', 'collection_point', 'Barcelona', 'ES',
  'Punto de recogida de insumos médicos. Sáb 27 jun 10:00-13:00. Dirección: Carrer Mallorca 470, Barcelona.',
  'Medical collection point. Sat 27 Jun 10:00-13:00. Address: Carrer Mallorca 470, Barcelona.',
  'Carrer Mallorca 470, Barcelona',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Restaurante Rincón de la Abuela — Punto de Recogida');

INSERT INTO public.resources (name, type, city, country, description_es, description_en, contact, verified, active, earthquake_specific)
SELECT 'Restaurante Los Panas — Punto de Recogida', 'collection_point', 'Barcelona', 'ES',
  'Punto de recogida de insumos médicos. Sáb 27 jun 10:00-13:00. Dirección: Carrer Aragó 40, Barcelona.',
  'Medical collection point. Sat 27 Jun 10:00-13:00. Address: Carrer Aragó 40, Barcelona.',
  'Carrer Aragó 40, Barcelona',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Restaurante Los Panas — Punto de Recogida');

INSERT INTO public.resources (name, type, city, country, description_es, description_en, contact, verified, active, earthquake_specific)
SELECT 'Centro de Acogida Rubí — Insumos Médicos', 'collection_point', 'Rubí', 'ES',
  'Centro de acogida en Rubí. Buscan: guantes, gasas, jeringas, solución salina, cobijas, sábanas, ropa. Deadline lunes 29 jun. Se necesitan furgonetas voluntarias.',
  'Reception centre in Rubí. Need: gloves, gauze, syringes, saline solution, blankets, sheets, clothing. Deadline Monday 29 Jun.',
  'Carrer Magi Ramentol 23, Rubí, Barcelona',
  true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.resources WHERE name = 'Centro de Acogida Rubí — Insumos Médicos');
