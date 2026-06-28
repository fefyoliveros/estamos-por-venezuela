-- ============================================================
-- Migration 010: Buildings with live signals / trapped people
-- Source: Web search across CNN, Al Jazeera, Efecto Cocuyo,
--         Wikipedia, RTVC, El Español. June 24-28 2026
-- Prioritises buildings NOT yet fully searched or awaiting rescue
-- Run in Supabase SQL Editor → Execute
-- ============================================================

insert into public.help_requests (full_name, location, needs, details, status)
values

(
  'Residencias Petunia I - búsqueda activa',
  'Primera transversal (1ra Avenida), Los Palos Grandes, Caracas (frente a Altamira Suites)',
  ARRAY['trapped']::text[],
  'Edificio de 14-22 pisos parcialmente colapsado. Equipos abrieron brecha en los escombros la noche del 27 jun. Búsqueda ACTIVA en curso. Se han confirmado señales de vida. Al menos 17 residentes rescatados hasta ahora. Quedan personas sin localizar. No acudir sin coordinación previa con Protección Civil.',
  'active'
),

(
  'Residencias Obelisco - búsqueda activa',
  'Avenida Luis Roche, Altamira, Municipio Chacao, Caracas',
  ARRAY['trapped']::text[],
  'Edificio de 5 pisos. Al menos 5 personas rescatadas con vida al 25 jun. Búsqueda ACTIVA, se estima que aún hay personas bajo los escombros. Perros de búsqueda de Ángeles de la Autopista y Protección Civil realizaron marcajes positivos. Rescate en curso.',
  'active'
),

(
  'Edificio Marama - colapso total sin búsqueda confirmada',
  'San Bernardino, Municipio Libertador, Caracas',
  ARRAY['trapped']::text[],
  'Estructura de 5 pisos COMPLETAMENTE COLAPSADA. Estado de búsqueda no confirmado públicamente. Familiares piden que equipos lleguen. Zona de San Bernardino con múltiples derrumbes simultáneos. Se necesita maquinaria pesada.',
  'active'
),

(
  'Edificio Moisés - colapso parcial sin búsqueda confirmada',
  'San Bernardino, Municipio Libertador, Caracas',
  ARRAY['trapped']::text[],
  'Colapso parcial. Estado de búsqueda no confirmado. Zona con varios edificios derrumbados y equipos de rescate dispersos. Familiares reportan falta de recursos en el sector.',
  'active'
),

(
  'Edificio Costanar II - Tanaguarena',
  'Tanaguarena, estado La Guaira',
  ARRAY['trapped']::text[],
  'Edificio colapsado en Tanaguarena. Se confirmaron víctimas mortales. Búsqueda de personas adicionales posiblemente atrapadas no confirmada como completa. La Guaira es la zona más afectada, con más de 1.400 edificios destruidos y muchos sin verificar según autoridades.',
  'active'
),

(
  'Edificio sin identificar, baby shower, Caracas oeste',
  'Caracas oeste (dirección exacta no publicada, reportado por familias)',
  ARRAY['trapped']::text[],
  'Aproximadamente 15 personas atrapadas en 3er piso, incluyendo una mujer embarazada que asistía a un baby shower. Reportado en tiempo real por familiares. Estado de rescate desconocido, sin confirmación de llegada de equipos.',
  'active'
),

(
  'Múltiples edificios, La Guaira sin verificar',
  'Estado La Guaira (Macuto, Caraballeada, Catia La Mar)',
  ARRAY['trapped']::text[],
  'Autoridades venezolanas confirmaron el 27 jun que "todavía falta llegar a muchos edificios" para verificar señales de vida. Más de 1.400 edificios destruidos. Comunicaciones cortadas dificultan coordinar rescates. Familiares buscan a más de 50.000 desaparecidos. Zona de mayor concentración de víctimas.',
  'active'
),

(
  'Edificio Rita - San Bernardino',
  'San Bernardino, Municipio Libertador, Caracas',
  ARRAY['trapped']::text[],
  'Edificio destruido o gravemente dañado en el sector San Bernardino. Estado de búsqueda y rescate no confirmado públicamente. Zona con múltiples colapsos simultáneos. Familiares piden llegada de equipos.',
  'active'
);
