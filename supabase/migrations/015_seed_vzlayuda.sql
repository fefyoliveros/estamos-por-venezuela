-- Seed data classified from vzlayuda.com (public humanitarian platform)
-- /necesito listings → skill offers (people offering help)
-- /ayudar listings → volunteer initiatives + institutional help requests

-- contact_method and contact_value are both NOT NULL
-- using vzlayuda.com URL so coordinators can find them via the source platform
insert into public.skill_offers (full_name, skill_category, skill_description, availability, location, contact_method, contact_value, active)
values
  (
    'Rafael Orta',
    'other',
    'Orientación en búsqueda y rescate — experiencia como bombero. Apoyo a equipos de rescate en zonas de derrumbe y estructuras colapsadas.',
    'local',
    'Venezuela',
    'whatsapp',
    'https://vzlayuda.com/necesito',
    true
  ),
  (
    'Marifer De Gouveia',
    'translator',
    'Intérprete inglés / italiano disponible 24/7 para apoyo en comunicaciones humanitarias y coordinación con organizaciones internacionales.',
    'both',
    'Internacional',
    'whatsapp',
    'https://vzlayuda.com/necesito',
    true
  ),
  (
    'Jeisby Jimenez — Kromosoma Digital',
    'design',
    'Diseño gráfico urgente: flyers para personas desaparecidas, material de difusión y comunicación visual para iniciativas de ayuda humanitaria.',
    'remote',
    'Venezuela',
    'whatsapp',
    'https://vzlayuda.com/necesito',
    true
  ),
  (
    'Yohiris Ramírez — PsicoYohi',
    'psychological',
    'Primeros auxilios psicológicos y acompañamiento emocional a víctimas, supervivientes y familias afectadas por el desastre.',
    'both',
    'Venezuela',
    'whatsapp',
    'https://vzlayuda.com/necesito',
    true
  ),
  (
    'Julián Mujica',
    'logistics',
    'Donación de alimentos no perecederos y botiquines de primeros auxilios para zonas afectadas. Disponible para coordinar entregas.',
    'local',
    'Venezuela',
    'whatsapp',
    'https://vzlayuda.com/necesito',
    true
  );

-- Volunteer initiatives classified from vzlayuda.com/ayudar
insert into public.volunteer_initiatives
  (title, description, location, coordinator_name, coordinator_contact, needed_skills, category, is_onsite, active)
values
  (
    'Preparación de alimentos para niños y adultos mayores',
    'Preparación y distribución de comida para niños y adultos mayores en parques de Caracas y Caraballeda. Se necesitan voluntarios para cocinar, distribuir y apoyar la logística.',
    'Caracas / Caraballeda',
    'Mariela',
    'https://vzlayuda.com/ayudar',
    '{"cocina","logística","distribución"}',
    'food',
    true,
    true
  ),
  (
    'Entrega de medicamentos y juguetes a niños huérfanos en albergues',
    'Recolección y entrega de medicamentos, juguetes y pan a niños huérfanos alojados en albergues. Se necesitan voluntarios para acompañar las entregas y brindar apoyo emocional.',
    'Venezuela',
    'Mariangel Rodríguez',
    'https://vzlayuda.com/ayudar',
    '{"transporte","apoyo emocional","logística"}',
    'food',
    true,
    true
  ),
  (
    'Centro de Acopio Cáritas Venezuela — San Juan de los Morros',
    'Centro de recogida de insumos humanitarios gestionado por Cáritas Venezuela Fundación. Se reciben y distribuyen alimentos, medicamentos, ropa y materiales de primera necesidad.',
    'San Juan de los Morros, Guárico',
    'Cáritas Venezuela Fundación',
    'https://vzlayuda.com/ayudar',
    '{"logística","clasificación de insumos","distribución"}',
    'collection',
    true,
    true
  ),
  (
    'Tu Plato — Distribución de alimentos Maracay / Tucacas',
    'Restaurante Tu Plato habilitado como punto de distribución de alimentos en Maracay y Tucacas. Se necesitan voluntarios para clasificar, empaquetar y repartir comida.',
    'Maracay / Tucacas',
    'Tu Plato Restaurant',
    'https://vzlayuda.com/ayudar',
    '{"cocina","distribución","logística"}',
    'food',
    true,
    true
  );

-- Institutional help requests from vzlayuda.com/ayudar (hospitals with critical supply needs)
insert into public.help_requests (full_name, location, needs, details, status)
values
  (
    'Hospital Vargas de Caracas',
    'Caracas, Venezuela',
    '{"medicine"}',
    'Necesidad urgente de insumos médicos: materiales de curación, medicamentos básicos, suero IV y equipos quirúrgicos. Contactar al hospital para coordinar entregas.',
    'active'
  ),
  (
    'Hospital Dr. Domingo Luciani',
    'Caracas, Venezuela',
    '{"medicine"}',
    'Se requieren suministros de trauma y emergencia: vendajes, antisépticos, material de sutura, medicamentos para dolor y sedación. Capacidad bajo máxima presión.',
    'active'
  ),
  (
    'Hospital El Junquito',
    'El Junquito, Caracas, Venezuela',
    '{"medicine"}',
    'Escasez crítica de insumos básicos: medicamentos, material de curación, oxígeno y alimentación para pacientes internados sin familiares en la zona.',
    'active'
  ),
  (
    'Hospital Magallanes de Catia',
    'Catia, Caracas, Venezuela',
    '{"medicine"}',
    'Urgente: suero intravenoso, jeringas, catéteres y material estéril. El hospital atiende casos de trauma por derrumbes sin insumos suficientes.',
    'active'
  );
