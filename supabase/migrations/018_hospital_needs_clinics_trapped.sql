-- Migration 018: Hospital supply needs + free clinics + trapped buildings
-- Source: Google Sheets (sinmordaza / thefaria / saschafitness)
-- Run AFTER 014, 015, 016, 017 in Supabase SQL Editor

-- Already in DB from 015 (skip to avoid duplicates):
-- Hospital Dr. Domingo Luciani (El Llanito), Hospital Vargas de Caracas,
-- Hospital El Junquito, Hospital Magallanes de Catia

-- ── PART 1: New hospital help requests ───────────────────────────────────────────

insert into public.help_requests (full_name, location, needs, details, status)
values
  (
    'Materno Infantil de El Valle — Centro de Acopio',
    'El Valle, Caracas, Venezuela',
    '{"medicine","food"}',
    'Centro de acopio activo. Urgente: alcohol, gasas, yelcos, jeringas, insumos médicos en general, medicamentos básicos y comida para niños hospitalizados.',
    'active'
  ),
  (
    'Hospital J.M. de los Ríos',
    'Caracas, Venezuela',
    '{"medicine"}',
    'Hospital pediátrico. Necesita: glucómetros, tiras reactivas y teteros para los niños internados.',
    'active'
  ),
  (
    'Hospital Trinidad — Centro de Acopio',
    'Caracas, Venezuela',
    '{"medicine"}',
    'Centro de acopio activo. Necesita: agua potable, productos de higiene e insumos médicos generales.',
    'active'
  ),
  (
    'Casa Bambi',
    'Caracas, Venezuela',
    '{"food","medicine"}',
    'Casa hogar para bebés y niños. Necesita: fórmula y alimentos para bebés, alimentos no perecederos, artículos de higiene personal, pañales, toallas húmedas, cremas antipañalitis y para dermatitis, jabón neutro, champú, cobijas, sábanas y almohadas.',
    'active'
  ),
  (
    'Hospital Francisco Pimentel',
    'Caracas, Venezuela',
    '{"medicine"}',
    'Necesita: insumos para curas, pañales para niños, leche NAN, medicamentos pediátricos, materiales de limpieza y bolsas negras.',
    'active'
  ),
  (
    'Escuela de Medicina UCV — Centro de Acopio',
    'Ciudad Universitaria, Caracas, Venezuela',
    '{"medicine"}',
    'Centro de acopio activo en la UCV. Necesita: acetaminofén pediátrico jarabe, cetirizina, loratadina pediátrica, sueros de hidratación oral, probióticos, solución fisiológica, pañales, toallas húmedas, crema antipañalitis, inhaladores, ibuprofeno y diclofenac pediátrico.',
    'active'
  ),
  (
    'Hospital Universitario de Caracas (UCV)',
    'Ciudad Universitaria, Caracas, Venezuela',
    '{"medicine"}',
    'Recepción en área de Enfermería. Necesita: gasas, guantes, solución 0,9%, Ringer, inyectadoras #5 #10 y #20, compresas y bacitracina.',
    'active'
  ),
  (
    'Hospital Lídice de Catia',
    'Catia, Caracas, Venezuela',
    '{"medicine"}',
    'Alta demanda por quemados. Necesita urgente: guantes, gasas, rollos para quemados, adhesivo, sulfadiazina de plata, bacitracina y cepillos quirúrgicos.',
    'active'
  ),
  (
    'Instituto Anatómico UCV',
    'Ciudad Universitaria, Caracas, Venezuela',
    '{"medicine"}',
    'Necesita: cloruro de sodio inyectable, bacitracina, sulfadiazina de plata, macrogoteros, catéter IV, jeringas #5 #10 y #20, catéter Ecomed, guantes de nitrilo, centros de cama y pañales para adultos.',
    'active'
  ),
  (
    'Hospital Pérez Carreño',
    'Caracas, Venezuela',
    '{"medicine"}',
    'Necesidades críticas: Losartán 50mg, hidroclorotiazida, metformina, amlodipina, ivermectina, ibuprofeno, paracetamol, budesonida en gotas, salbutamol en gotas, antialérgicos, metoclopramida (amp. y tab.), ondansetrón (ampollas), ketoprofeno, ketorolaco, dipirona, gluconato de calcio, bicarbonato, contraste para rayos X. Insumos: solución 0,9%, Ringer lactato, dextrosa 5%, sueros de hidratación oral, guantes, gasas, hipafix rojo, catéter vía central 5cm, inyectadoras #20, yelco #24, suturas seda 2-0 y 3-0, cepillo con clorhexidina, jabón neutro, tubo orotraqueal, bisturís, termómetro de mercurio.',
    'active'
  );

-- ── PART 2: Private clinics offering free primary care ───────────────────────────

insert into public.resources (
  name, type, url, instagram, city, country,
  description_es, verified, active, earthquake_specific, is_government
) values (
  'Clínicas privadas Caracas — Atención primaria gratuita',
  'medical',
  null,
  null,
  'Caracas',
  'VE',
  'Al menos 12 clínicas privadas de Caracas ofrecen atención primaria gratuita a víctimas del terremoto: Clínicas Caracas, Clínica Metropolitana, Clínica Ávila, Centro Médico Docente La Trinidad, Clínica Fénix, Venemergencia, Sanatrix y otras. Acudir a urgencias e indicar que eres afectado del terremoto.',
  true,
  true,
  true,
  false
);

-- ── PART 3: Trapped persons — emergency help requests ────────────────────────────

insert into public.help_requests (full_name, location, needs, details, status)
values
  (
    'Edificio Oasis Beach',
    'La Guaira, Venezuela',
    '{"trapped"}',
    'Sin ayuda oficial. Solo familiares y civiles en el lugar. Solicitan maquinaria pesada y equipos de rescate de forma urgente.',
    'active'
  ),
  (
    'Edificio Miramar',
    'Caraballeda (junto a C.C. Costa del Sol), La Guaira, Venezuela',
    '{"trapped"}',
    'URGENTE: Niños bajo los escombros. Solicitan rescate inmediato y maquinaria pesada.',
    'active'
  ),
  (
    'Edificio Sol y Mar',
    'Playa Grande (Apto. Amarillo), La Guaira, Venezuela',
    '{"trapped"}',
    'Personas atrapadas. Solicitan ayuda inmediata, maquinaria pesada y apoyo de rescate.',
    'active'
  ),
  (
    'Residencias Maribel',
    'Caraballeda, La Guaira, Venezuela',
    '{"trapped"}',
    'Personas atrapadas en los escombros. Solicitan equipos de rescate especializados.',
    'active'
  ),
  (
    'Costamar II',
    'Tanaguarena, La Guaira, Venezuela',
    '{"trapped"}',
    'Personas afectadas. Necesitan apoyo urgente de rescate.',
    'active'
  ),
  (
    'Residencia Belo Horizonte',
    'La Guaira, Venezuela',
    '{"trapped"}',
    'Personas atrapadas. Se requiere apoyo de rescate.',
    'active'
  ),
  (
    'Puerto Coral',
    'La Guaira, Venezuela',
    '{"trapped"}',
    'Personas atrapadas. Solicitan ayuda urgente.',
    'active'
  ),
  (
    'Av. España — Tanaguarena',
    'Tanaguarena, La Guaira, Venezuela',
    '{"trapped"}',
    'Punto de emergencia reportado. Coordenadas GPS: 10.614172, -66.837531. Solicitan rescate.',
    'active'
  );
