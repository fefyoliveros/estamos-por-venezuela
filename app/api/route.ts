import { NextResponse } from 'next/server'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

export function GET() {
  return NextResponse.json(
    {
      name: 'Estamos por Venezuela — API pública',
      version: '1.0',
      description: 'Datos humanitarios abiertos — terremoto Venezuela 2026. Todos los endpoints son de solo lectura y no requieren autenticación.',
      base_url: 'https://estamosporvenezuela.com/api',
      endpoints: [
        {
          path: '/api/resources',
          method: 'GET',
          description: 'ONGs, puntos de recogida, campañas y organizaciones de ayuda humanitaria.',
          params: [
            { name: 'type', type: 'string', description: 'ngo | collection_point | campaign | business | volunteer_coordinator | other' },
            { name: 'country', type: 'string', description: 'ES | VE | INT' },
            { name: 'q', type: 'string', description: 'Búsqueda libre (nombre, descripción, ciudad)' },
          ],
          returns: 'id, name, type, url, instagram, city, country, description_es, description_en, contact, verified, earthquake_specific',
        },
        {
          path: '/api/help-requests',
          method: 'GET',
          description: 'Solicitudes de ayuda activas: personas atrapadas, necesidades médicas, rescates.',
          params: [],
          returns: 'id, full_name, location, needs, details, whatsapp, status, created_at',
          note: 'whatsapp puede ser null. Cuando está presente, el solicitante consintió publicarlo para ser contactado directamente.',
        },
        {
          path: '/api/initiatives',
          method: 'GET',
          description: 'Iniciativas de voluntariado coordinadas por organizaciones.',
          params: [
            { name: 'onsite', type: 'boolean', description: 'true → solo iniciativas que requieren presencia física' },
          ],
          returns: 'id, title, description, location, coordinator_name, needed_skills, spots_available, category, is_onsite, created_at',
          note: 'El contacto del coordinador no se expone aquí. Se revela al hacer clic en Participar desde la web.',
        },
        {
          path: '/api/onsite-volunteers',
          method: 'GET',
          description: 'Voluntarios registrados para desplazarse en persona a la zona afectada.',
          params: [],
          returns: 'id, full_name, origin_location, available_from, skills, has_vehicle, group_affiliation, created_at',
          note: 'Datos de contacto excluidos. Solo disponibles para coordinadores autorizados.',
        },
        {
          path: '/api/initiatives/:id/needs',
          method: 'GET',
          description: 'Reportes de necesidades en tiempo real para una iniciativa (campo). Incluye urgencia y contexto de ubicación.',
          params: [
            { name: ':id', type: 'uuid', description: 'ID de la iniciativa (de /api/initiatives)' },
          ],
          returns: 'id, updated_by, location_context, needs_description, urgency_level, created_at',
        },
        {
          path: '/api/skill-offers',
          method: 'GET',
          description: 'Voluntarios que ofrecen habilidades específicas: traducción, medicina, logística, etc.',
          params: [
            { name: 'category', type: 'string', description: 'translator | medical | psychological | legal | it | design | pr | logistics | construction | other' },
          ],
          returns: 'id, full_name, skill_category, skill_description, availability, location, created_at',
          note: 'Datos de contacto excluidos. El contacto se gestiona a través de la plataforma.',
        },
      ],
      license: 'Datos de uso libre para fines humanitarios.',
    },
    { headers: PUBLIC_CORS_HEADERS }
  )
}
