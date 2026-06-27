import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de privacidad — Estamos por Venezuela',
  description: 'Información sobre cómo Estamos por Venezuela trata tus datos personales conforme al RGPD y la LOPDGDD.',
}

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
      <h1 className="text-3xl font-black text-slate-900 mb-2">Política de privacidad</h1>
      <p className="text-slate-500 text-sm mb-8">Última actualización: junio 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">1. Responsable del tratamiento</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          <strong>Estamos por Venezuela</strong> es una plataforma ciudadana independiente sin ánimo de lucro
          creada para centralizar la ayuda humanitaria ante el terremoto de Venezuela de 2026.
          Para cualquier consulta sobre privacidad, escríbenos a:{' '}
          <a href="mailto:hello@estamosporvenezuela.com" className="text-red-600 hover:underline">
            hello@estamosporvenezuela.com
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">2. Datos que recogemos</h2>
        <ul className="text-slate-700 text-sm leading-relaxed space-y-2 list-disc pl-5">
          <li>
            <strong>Solicitudes de ayuda:</strong> nombre opcional, descripción de la situación, ubicación,
            tipo de ayuda necesaria. Estos datos se publican de forma visible en la plataforma si así lo autorizas.
          </li>
          <li>
            <strong>Recursos enviados:</strong> nombre de la organización, URL, descripción, tipo de recurso
            y país. Estos datos se publican en el directorio una vez verificados.
          </li>
          <li>
            <strong>Sesión de administración:</strong> correo electrónico y contraseña cifrada, exclusivamente
            para el acceso al panel de administración. No se recogen datos de administradores en el acceso público.
          </li>
          <li>
            <strong>Datos técnicos:</strong> cookies de sesión estrictamente necesarias para el funcionamiento
            de la plataforma (autenticación). No usamos cookies de seguimiento, analítica ni publicidad.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">3. Finalidad y base jurídica</h2>
        <p className="text-slate-700 text-sm leading-relaxed mb-2">
          Tratamos tus datos para:
        </p>
        <ul className="text-slate-700 text-sm leading-relaxed space-y-2 list-disc pl-5">
          <li>Publicar y conectar solicitudes de ayuda con recursos disponibles (interés legítimo, art. 6.1.f RGPD).</li>
          <li>Verificar y publicar recursos de ayuda humanitaria (interés legítimo).</li>
          <li>Gestionar el acceso al panel de administración (ejecución de acuerdo, art. 6.1.b RGPD).</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">4. Destinatarios y transferencias internacionales</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Los datos se almacenan en <strong>Supabase</strong> (infraestructura en la UE) y se sirven a través
          de <strong>Vercel</strong> (infraestructura global con garantías adecuadas según decisiones de
          adecuación de la Comisión Europea y cláusulas contractuales tipo). No vendemos ni cedemos datos a terceros.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">5. Plazo de conservación</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Las solicitudes de ayuda y los recursos del directorio se conservan mientras la plataforma esté
          operativa o hasta que el interesado solicite su eliminación. Las cookies de sesión se eliminan
          al cerrar el navegador o al cerrar sesión.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">6. Tus derechos</h2>
        <p className="text-slate-700 text-sm leading-relaxed mb-2">
          Conforme al RGPD y la LOPDGDD tienes derecho a:
        </p>
        <ul className="text-slate-700 text-sm leading-relaxed space-y-1 list-disc pl-5">
          <li>Acceder a tus datos personales.</li>
          <li>Rectificar datos inexactos.</li>
          <li>Solicitar la supresión de tus datos.</li>
          <li>Oponerte al tratamiento o solicitar su limitación.</li>
          <li>Presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en{' '}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
              www.aepd.es
            </a>
          </li>
        </ul>
        <p className="text-slate-700 text-sm leading-relaxed mt-3">
          Para ejercer tus derechos, escríbenos a{' '}
          <a href="mailto:hello@estamosporvenezuela.com" className="text-red-600 hover:underline">
            hello@estamosporvenezuela.com
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">7. Cookies</h2>
        <p className="text-slate-700 text-sm leading-relaxed">
          Esta plataforma utiliza únicamente cookies técnicas estrictamente necesarias para la autenticación
          del panel de administración. No instalamos cookies de analítica, publicidad ni redes sociales.
          Puedes gestionar tus preferencias en cualquier momento desde el aviso de cookies que aparece
          en tu primera visita.
        </p>
      </section>

      <div className="mt-10 pt-6 border-t border-slate-200">
        <Link href="/" className="text-red-600 text-sm hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
