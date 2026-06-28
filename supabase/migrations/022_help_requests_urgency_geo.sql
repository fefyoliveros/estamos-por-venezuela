-- Add urgency, geolocation, and resolution tracking to help_requests

ALTER TABLE public.help_requests
  ADD COLUMN IF NOT EXISTS urgency          TEXT DEFAULT 'medium'
    CHECK (urgency IN ('critical', 'high', 'medium', 'low')),
  ADD COLUMN IF NOT EXISTS latitude         NUMERIC(9,6),
  ADD COLUMN IF NOT EXISTS longitude        NUMERIC(9,6),
  ADD COLUMN IF NOT EXISTS resolved_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS resolution_type  TEXT
    CHECK (resolution_type IN ('found', 'deceased', 'evacuated', 'resolved')),
  ADD COLUMN IF NOT EXISTS resolution_notes TEXT;

-- Seed critical help requests from community TikTok report spreadsheet (La Guaira earthquake 2026-06-26)
-- Approximate coordinates by neighborhood cluster; no individual GPS available.

INSERT INTO public.help_requests
  (full_name, location, needs, details, whatsapp, status, urgency, latitude, longitude)
VALUES
  -- ── Playa Grande / Catia La Mar ───────────────────────────────────────────
  ('Edificio Aquarium',
   'Av. La Atlántida, Catia La Mar 1162, Playa Grande, La Guaira',
   ARRAY['trapped'],
   'Se busca a Pablo Armas y otros residentes. Nadie ha llegado a remover escombros. Se necesita maquinaria y rescatistas urgente.',
   '04147941004', 'active', 'critical', 10.5957, -66.9572),

  ('Edificio Belo Horizonte',
   'Playa Grande, Catia La Mar, La Guaira',
   ARRAY['trapped'],
   'Múltiples personas atrapadas, muchas menciones de familiares dentro. Se necesita maquinaria pesada. No pueden avanzar del 4to piso.',
   NULL, 'active', 'critical', 10.5963, -66.9564),

  ('Edificio Sol Marino Garden II',
   'Playa Grande, Catia La Mar, La Guaira',
   ARRAY['trapped'],
   '7 niños y 7 adultos atrapados. No hay ningún grupo de rescate nacional ni internacional. Urge ayuda.',
   NULL, 'active', 'critical', 10.5961, -66.9561),

  ('Edificio Oasis Beach',
   'Av. 1, Playa Grande, cerca del Hotel Marriott, La Guaira',
   ARRAY['trapped'],
   'Confirmadas señales de vida. Se necesitan rescatistas, perros de búsqueda y gasoil. Eudy Cisneros (CI 16658743) embarazada, Cesar Flores Mota (CI 15573201) entre los atrapados.',
   NULL, 'active', 'critical', 10.5958, -66.9555),

  ('Edificio El Jurel',
   'Playa Grande, Catia La Mar, La Guaira',
   ARRAY['trapped', 'find_person'],
   'Johnny Druid Alcalá (CI 15.375.594, 45 años) y Andy Maldonado atrapados en pisos superiores. Sin ayuda profesional.',
   NULL, 'active', 'high', 10.5965, -66.9570),

  ('Residencias Vallarta',
   'Playa Grande, Catia La Mar, La Guaira',
   ARRAY['trapped'],
   'Niños con vida confirmados. Se necesitan rescatistas con maquinaria. Skarlent Rodríguez (23 años, calle 7). Contacto: 0412-4022739.',
   '04124022739', 'active', 'critical', 10.5960, -66.9575),

  ('Residencias Los Monjes',
   'Calle 3, Catia La Mar 1162, Playa Grande, La Guaira',
   ARRAY['trapped'],
   '5 personas con señales de vida confirmadas. Sin rescatistas profesionales ni maquinaria.',
   NULL, 'active', 'critical', 10.5967, -66.9573),

  ('Edificio Costa Dorada',
   'Calle 9, Playa Grande, La Guaira',
   ARRAY['trapped', 'find_person'],
   'Estybalis Blanco, Antonio Moreno, Ainoha Del Nogal y Aranza Del Nogal atrapados. 4 días sin rescate nacional ni internacional.',
   NULL, 'active', 'high', 10.5962, -66.9568),

  -- ── Las 15 Letras / Macuto ────────────────────────────────────────────────
  ('Residencias Punta Brisas',
   'Sector Las 15 Letras, al lado del Club Canario, Macuto, La Guaira',
   ARRAY['trapped'],
   'Nadie logró salir antes de que cayera el edificio. Todos los residentes atrapados, no ha ido nadie a ayudar. Marian Naranjo y Richard García confirmados dentro. Se necesita maquinaria pesada.',
   NULL, 'active', 'critical', 10.6130, -66.9440),

  ('Edificio Gradisca',
   'Macuto, La Guaira',
   ARRAY['trapped'],
   'Más de 30 desaparecidos. 4 días pidiendo ayuda. Se oyen voces. Hay niños dentro. Sin respuesta de rescatistas.',
   NULL, 'active', 'critical', 10.6133, -66.9437),

  -- ── Los Corales ───────────────────────────────────────────────────────────
  ('Edificio Mar de Leva',
   'Los Corales, Caraballeda, La Guaira',
   ARRAY['trapped'],
   'Aproximadamente 11 desaparecidos. Entre los atrapados: Dunia Medina (mayor, medicación cardíaca), su nieto Abraham (autismo) y Jesús Guedez (recién operado). Se necesita cortadora de acetileno/oxicorte y rescatistas.',
   NULL, 'active', 'critical', 10.6135, -66.8984),

  ('Edificio Costa Brava',
   'Los Corales, Av. La Costanera, La Guaira',
   ARRAY['trapped'],
   'Personas en el ascensor. Múltiples reportes de sobrevivientes. Sin maquinaria. Sin rescatistas profesionales.',
   NULL, 'active', 'critical', 10.6130, -66.8991),

  ('Edificio La Gabarra',
   'Los Corales, La Guaira',
   ARRAY['trapped', 'find_person'],
   'Se busca a Greidy Gil. Múltiples familias reportan personas vivas dentro. Se necesita maquinaria pesada urgente.',
   NULL, 'active', 'critical', 10.6138, -66.8980),

  ('Edificio Coral Mar',
   'Los Corales, La Guaira',
   ARRAY['trapped', 'find_person'],
   'Nayibeth Lima, Diego Núñez y Juan Diego Núñez (8 años) atrapados. Se confirman señales de vida. Necesitan maquinaria para remover escombros. Contacto: Rosa Elena Lima.',
   '+584249500346', 'active', 'critical', 10.6129, -66.8977),

  ('Residencias Bahía Mar',
   'Los Corales, Av. La Costanera, Caraballeda, La Guaira',
   ARRAY['trapped', 'find_person'],
   'Antonio Cabrera (padre), Antonio Cabrera (hijo) y Alonso Cabrera (nieto, 6 años) sepultados. Se necesita maquinaria para remover escombros. Bebé entre los atrapados.',
   NULL, 'active', 'critical', 10.6136, -66.8987),

  ('Residencias Arichuna',
   'Los Corales, La Guaira',
   ARRAY['trapped'],
   'Señales de vida confirmadas. Poca maquinaria, no llegan equipos pesados. Múltiples reportes de sobrevivientes en distintos pisos.',
   NULL, 'active', 'high', 10.6141, -66.8972),

  -- ── Caraballeda / Urbanización Caribe ────────────────────────────────────
  ('Residencias Bellevue',
   'Av. Circunvalación, Caraballeda, La Guaira',
   ARRAY['trapped'],
   'Más de 15 personas atrapadas. Señales de vida confirmadas. Se necesitan maquinarias urgente. Varios reportes coinciden en la urgencia.',
   NULL, 'active', 'critical', 10.6142, -66.8877),

  ('Residencias OPPPE 33',
   'Bulevar Naiguatá, Urbanización Caribe, Caraballeda, La Guaira',
   ARRAY['trapped', 'find_person'],
   'Yhovany Hernández Fernández, Adela Taberneiro García, Ulises Adrián Hernández Taberneiro y Lía Fernanda Hernández Taberneiro (familia) atrapados. Quieren demoler el edificio OPP26 contiguo aunque aún hay personas gritando con vida.',
   NULL, 'active', 'critical', 10.6138, -66.8873),

  ('Edificio Breogán',
   'Av. 16, Caraballeda, La Guaira',
   ARRAY['trapped'],
   'Manuel Rojas, Alejandra Romero y su bebé Assiel Rojas (2 años) atrapados. Se oyen ruidos en el sótano y estacionamiento. Más de 2 días esperando. Sin maquinaria.',
   NULL, 'active', 'critical', 10.6145, -66.8868),

  ('Residencias Celtamar I',
   'Urbanización Palmar Este, Caraballeda, La Guaira',
   ARRAY['trapped', 'find_person'],
   'Evanggelis Ángulo Veltri (25 años, CI 27573169) y Karen Ysbel Mendoza Veltri (17 años, CI 33263653) atrapadas. Sin equipo de rescate en la zona.',
   '04264850532', 'active', 'critical', 10.6150, -66.8861),

  ('Edificio Breña Sol',
   'Urbanización Caribe, detrás del McDonald''s, Caraballeda, La Guaira',
   ARRAY['trapped', 'find_person'],
   '12 personas atrapadas sin ayuda de maquinaria. Carlos Murgas (64 años) entre los atrapados. Llevan varios días sin rescate profesional.',
   NULL, 'active', 'critical', 10.6140, -66.8882)
ON CONFLICT DO NOTHING;
