import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cómo donar — Estamos por Venezuela',
  description: 'La guía más completa para donar al terremoto de Venezuela 2026. Organizaciones verificadas, Bizum, PayPal y puntos de recogida.',
}

interface DonationOrg {
  name: string
  description: string
  url?: string
  bizum?: string
  paypal?: string
  badge?: string
  country: string
}

const TIER1: DonationOrg[] = [
  {
    name: 'UNICEF',
    description: 'Protección de niños y familias afectadas. Presencia directa en Venezuela.',
    url: 'https://www.unicef.org/appeals/venezuela-earthquake',
    badge: 'Internacional verificada',
    country: '🌐',
  },
  {
    name: 'Cruz Roja Venezuela',
    description: 'Coordinación local de rescate, primeros auxilios y distribución de ayuda.',
    url: 'https://www.cruzrojavenezuela.org',
    badge: 'Presencia local',
    country: '🇻🇪',
  },
  {
    name: 'Caritas Venezuela',
    description: 'Distribución de alimentos, medicinas y atención psicosocial en zonas afectadas.',
    url: 'https://www.caritasvenezuela.org',
    badge: 'Presencia local',
    country: '🇻🇪',
  },
  {
    name: 'Save the Children',
    description: 'Protección de menores y apoyo educativo en zonas de emergencia.',
    url: 'https://www.savethechildren.org/us/what-we-do/emergency-response/venezuela-earthquake',
    bizum: '13132',
    badge: 'Internacional verificada',
    country: '🌐',
  },
  {
    name: 'World Central Kitchen',
    description: 'Reparto de comidas calientes. Ya activos en zonas afectadas.',
    url: 'https://wck.org/relief/venezuela-earthquake-2026',
    bizum: '03843',
    badge: 'Activa en Venezuela',
    country: '🌐',
  },
  {
    name: 'Plan International',
    description: 'Respuesta centrada en niñas y mujeres en situación de vulnerabilidad.',
    url: 'https://www.plan-international.org/get-involved/venezuela-earthquake-appeal/',
    badge: 'Internacional verificada',
    country: '🌐',
  },
  {
    name: 'Direct Relief',
    description: 'Suministros médicos de emergencia directos a hospitales en Venezuela.',
    url: 'https://www.directrelief.org/emergency/venezuela-earthquake/',
    badge: 'Médica verificada',
    country: '🌐',
  },
  {
    name: 'International Medical Corps',
    description: 'Atención sanitaria de emergencia en zonas sin acceso a hospitales.',
    url: 'https://internationalmedicalcorps.org/emergency-response/venezuela-earthquake/',
    badge: 'Médica verificada',
    country: '🌐',
  },
  {
    name: 'Cruz Roja Española',
    description: 'Recauda fondos para la respuesta internacional al terremoto de Venezuela.',
    url: 'https://www.cruzroja.es',
    bizum: '33512',
    badge: 'Verificada',
    country: '🇪🇸',
  },
  {
    name: 'Cáritas España',
    description: 'Canaliza donaciones a Cáritas Venezuela a través de la red española.',
    url: 'https://www.caritas.es',
    bizum: '00089',
    badge: 'Verificada',
    country: '🇪🇸',
  },
]

const TIER2: DonationOrg[] = [
  {
    name: 'Gio Foundation Inc',
    description: 'Fundación venezolana-americana. Donación directa por PayPal.',
    paypal: 'https://www.paypal.com/donate/?hosted_button_id=KCC5G44TF6Q3G',
    country: '🌐',
  },
  {
    name: 'GoFundMe Venezuela Earthquake Relief',
    description: 'Campaña oficial de GoFundMe para el terremoto de Venezuela 2026.',
    url: 'https://www.gofundme.com/c/act/venezuela-earthquake-relief',
    country: '🌐',
  },
  {
    name: 'Hazlo Hoy — Terremoto Venezuela',
    description: 'Plataforma venezolana con donaciones, búsqueda de desaparecidos y registro de necesidades.',
    url: 'https://www.terremoto.hazlohoy.org',
    country: '🇻🇪',
  },
  {
    name: 'Sun Risas',
    description: 'Campaña de recaudación específica para afectados del terremoto.',
    url: 'https://fundraise.sunrisas.org/campaing/815513/donate',
    country: '🌐',
  },
  {
    name: 'Global Giving Venezuela',
    description: 'Plataforma transparente con fondo acumulado para el terremoto.',
    url: 'https://www.globalgiving.org/fundraisers/venezuela-earthquake/',
    country: '🌐',
  },
]

function OrgCard({ org, tier }: { org: DonationOrg; tier: 1 | 2 }) {
  return (
    <div className={`card flex flex-col gap-3 ${tier === 1 ? 'border-emerald-100 bg-emerald-50/50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{org.country}</span>
            <h3 className="font-bold text-slate-900 text-sm">{org.name}</h3>
          </div>
          {org.badge && (
            <span className="inline-block text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
              {org.badge}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">{org.description}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {org.bizum && (
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-mono font-bold">
            Bizum {org.bizum}
          </span>
        )}
        {org.paypal && (
          <a
            href={org.paypal}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Donar por PayPal →
          </a>
        )}
        {org.url && (
          <a
            href={org.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Donar ahora →
          </a>
        )}
      </div>
    </div>
  )
}

export default function DonacionesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Cómo donar</h1>
        <p className="text-slate-600 text-lg">
          La donación económica es la forma más eficiente de ayudar: llega antes, sin problemas logísticos
          y permite comprar exactamente lo que se necesita en Venezuela.
        </p>
      </div>

      {/* Priority alert */}
      <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl px-5 py-4 mb-10">
        <p className="text-sm font-semibold text-amber-900 mb-1">Por qué priorizar la donación económica</p>
        <p className="text-sm text-amber-800">
          Las donaciones físicas (ropa, alimentos, medicamentos) generan cuellos de botella en las carreteras,
          costes de transporte altos y problemas aduaneros. Las organizaciones verificadas saben exactamente
          qué se necesita y cómo conseguirlo localmente. <strong>Dona dinero si puedes.</strong>
        </p>
      </div>

      {/* Tier 1 */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold shrink-0">1</span>
          <div>
            <h2 className="text-xl font-black text-slate-900">Organizaciones internacionales verificadas</h2>
            <p className="text-sm text-slate-500">Presencia directa en Venezuela. La opción más segura y eficiente.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIER1.map((org) => (
            <OrgCard key={org.name} org={org} tier={1} />
          ))}
        </div>
      </section>

      {/* Tier 2 */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shrink-0">2</span>
          <div>
            <h2 className="text-xl font-black text-slate-900">Campañas venezolanas específicas</h2>
            <p className="text-sm text-slate-500">Fondos directos para el terremoto. Verifica la organización antes de donar.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIER2.map((org) => (
            <OrgCard key={org.name} org={org} tier={2} />
          ))}
        </div>
      </section>

      {/* Tier 3 */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-500 text-white text-sm font-bold shrink-0">3</span>
          <div>
            <h2 className="text-xl font-black text-slate-900">Donación física — puntos de recogida</h2>
            <p className="text-sm text-slate-500">
              Si no puedes donar dinero, dona materiales en los puntos de recogida verificados cerca de ti.
            </p>
          </div>
        </div>
        <div className="card bg-slate-50">
          <p className="text-sm text-slate-700 mb-3">
            Medicamentos, insumos médicos, ropa y comida no perecedera se recogen en puntos verificados
            en Barcelona y otras ciudades.
          </p>
          <p className="text-xs text-slate-500 mb-4">
            <strong>Importante:</strong> No envíes artículos sin coordinar previamente. Contacta al punto
            de recogida más cercano para saber qué necesitan exactamente.
          </p>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 btn-primary text-sm"
          >
            Ver puntos de recogida en el mapa →
          </Link>
        </div>
      </section>

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
        <p className="text-sm font-bold text-red-900 mb-1">Alerta de fraude</p>
        <p className="text-sm text-red-800">
          Desconfía de cuentas personales sin organización registrada detrás. Verifica siempre que la ONG
          esté registrada legalmente antes de transferir dinero. Si tienes dudas sobre una campaña,
          escríbenos a{' '}
          <a href="mailto:hello@estamosporvenezuela.com" className="underline">
            hello@estamosporvenezuela.com
          </a>
        </p>
      </div>
    </div>
  )
}
