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
  zelle?: string
  badge?: string
  country: string
}

const TIER1: DonationOrg[] = [
  {
    name: 'UNICEF España',
    description: 'Coordinando respuesta para 3,9 millones de niños. $2,5M asignados. 48 toneladas de suministros en camino.',
    url: 'https://www.unicef.es/colabora/dona/emergencia-terremoto-en-venezuela?fc=9923',
    badge: 'Internacional verificada',
    country: '🌐',
  },
  {
    name: 'Cruz Roja Española',
    description: 'Apoya a Cruz Roja Venezolana. 17 toneladas de carga humanitaria desplegadas. Bizum, SMS y web.',
    url: 'https://www2.cruzroja.es/-/ayuda-terremoto-venezuela-2026',
    bizum: '33512',
    badge: 'Verificada',
    country: '🇪🇸',
  },
  {
    name: 'Cáritas España — Venezuela',
    description: 'Movilizó €300.000 para Cáritas Venezuela. Bizum, Santander y CaixaBank disponibles.',
    url: 'https://www.caritas.es/castrense/emergencias/caritas-con-venezuela/',
    bizum: '00089',
    badge: 'Verificada',
    country: '🇪🇸',
  },
  {
    name: 'Save the Children España',
    description: 'Asistiendo a 200.000 personas incluyendo 100.000 niños. Donación directa en español.',
    url: 'https://www.savethechildren.es/donacion-ong/terremoto-en-venezuela-2026',
    bizum: '13132',
    badge: 'Internacional verificada',
    country: '🌐',
  },
  {
    name: 'World Central Kitchen',
    description: 'Equipo desplegado sirviendo comidas calientes. Chef José Andrés comprometió $1 millón.',
    url: 'https://wck.org/donate',
    bizum: '03843',
    badge: 'Activa en Venezuela',
    country: '🌐',
  },
  {
    name: 'MSF / Médicos Sin Fronteras',
    description: 'Equipos evaluando en Caracas. Kits de trauma donados a hospitales de Caracas y La Guaira.',
    url: 'https://www.msf.org',
    badge: 'Médica verificada',
    country: '🌐',
  },
  {
    name: 'Direct Relief',
    description: 'Suministros médicos de emergencia: kits de heridas, material quirúrgico, antibióticos. 100% a Venezuela.',
    url: 'https://www.directrelief.org/donate/',
    badge: 'Médica verificada',
    country: '🌐',
  },
  {
    name: 'CADENA',
    description: 'Organización humanitaria internacional con presencia directa en Venezuela.',
    url: 'https://donate.cadena.ngo/campaign/815508/donate',
    badge: 'Activa en Venezuela',
    country: '🌐',
  },
  {
    name: 'Oxfam América',
    description: 'Apoyando respuesta humanitaria liderada localmente en Venezuela.',
    url: 'https://give.oxfamamerica.org/page/26493/donate/1',
    badge: 'Internacional verificada',
    country: '🌐',
  },
  {
    name: 'GlobalGiving — Venezuela Earthquake Relief Fund',
    description: 'Fondo que canaliza donaciones a organizaciones locales verificadas para atención médica, rescate y agua.',
    url: 'https://www.globalgiving.org/projects/venezuela-earthquake-relief-fund/',
    badge: 'Plataforma transparente',
    country: '🌐',
  },
]

const TIER2: DonationOrg[] = [
  {
    name: 'Yummy Rides — Donación alimentaria',
    description: 'Plataforma de centralización de donaciones de alimentos y coordinación de voluntarios presenciales en Venezuela.',
    url: 'https://dona.yummyrides.com',
    badge: 'Activa en Venezuela',
    country: '🇻🇪',
  },
  {
    name: 'Fundación Hogar Bambi',
    description: 'Fundación venezolana de protección a la infancia. Donación vía Zelle o Instagram.',
    url: 'https://www.instagram.com/hogarbambi',
    zelle: 'admin@bambifoundation.org',
    badge: '@hogarbambi',
    country: '🇻🇪',
  },
  {
    name: 'Gio Foundation Inc',
    description: 'Fundación venezolana-americana. Donación directa por PayPal.',
    paypal: 'https://www.paypal.com/donate/?hosted_button_id=KCC5G44TF6Q3G',
    country: '🌐',
  },
  {
    name: 'GoFundMe — We Love Foundation Venezuela',
    description: '13 años de trayectoria. Más de $1 millón recaudado. 100% para víctimas del terremoto.',
    url: 'https://www.gofundme.com/f/emergency-relief-for-venezuela-earthquake-victims',
    country: '🌐',
  },
  {
    name: 'Sun Risas Foundation',
    description: 'Con sede en Valencia, Estado Carabobo. Recoge palas, linternas, pilas, guantes.',
    url: 'https://fundraise.sunrisas.org/campaign/815513/donate',
    country: '🇻🇪',
  },
  {
    name: 'VACC Foundation',
    description: 'Alimentos, agua, medicamentos y refugios temporales para familias afectadas.',
    url: 'https://vaccfoundation.org/donate-now/',
    country: '🌐',
  },
  {
    name: 'The House Project — Fundación Montaner',
    description: 'Casi 20 años de trayectoria. Ayuda directa a familias y limpieza de escombros.',
    url: 'https://thehouse-project.org',
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
        {org.zelle && (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-lg font-mono font-bold">
            Zelle {org.zelle}
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
            Ir al sitio →
          </a>
        )}
      </div>
    </div>
  )
}

export default function DonacionesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Guía de donaciones</p>
        <h1 className="font-serif text-4xl text-slate-900 mb-3">Cómo donar</h1>
        <p className="text-slate-600 text-lg">
          El aeropuerto de Maiquetía está cerrado por daños estructurales. La donación económica llega antes, evita el cuello de botella logístico y permite comprar en Venezuela lo que más se necesita.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl px-5 py-4 mb-10">
        <p className="text-sm font-semibold text-amber-900 mb-1">Por qué priorizar la donación económica</p>
        <p className="text-sm text-amber-800">
          Con el aeropuerto de Maiquetía cerrado y carreteras cortadas, los envíos físicos no llegan. Las ONG verificadas tienen acceso directo y saben exactamente qué comprar. <strong>Dona dinero si puedes.</strong>
        </p>
      </div>

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

      {/* Cruz Roja Venezuela — bank transfers */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white text-sm font-bold shrink-0">
            🇻🇪
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-900">Cruz Roja Venezolana — Transferencia directa</h2>
            <p className="text-sm text-slate-500">RIF J-00235031-8. Cuentas oficiales verificadas (junio 2026).</p>
          </div>
        </div>
        <div className="card border-red-100 bg-red-50/50">
          <p className="text-xs text-slate-500 mb-4">
            Si deseas apoyar su respuesta humanitaria, puedes realizar tu donación a través de las siguientes cuentas oficiales.
          </p>
          <div className="space-y-3">
            {[
              { label: 'Banesco (Bolívares VES)', value: '0134-0224-82-2243028658' },
              { label: 'Banesco (USD)', value: '0134-1736-99-0001006051' },
              { label: 'Banesco América', value: 'Cuenta N° 1500236086' },
              { label: 'Zelle', value: 'contabilidad@cruzroja.ve' },
              { label: 'ABANCA — IBAN EUR', value: 'ES18208000473693040028376', sub: 'BIC: CAGLESMMXXX' },
            ].map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-red-100 pb-2 last:border-0 last:pb-0">
                <span className="text-xs font-semibold text-slate-600 sm:w-48 shrink-0">{row.label}</span>
                <span className="font-mono text-sm text-slate-900 font-bold">{row.value}</span>
                {row.sub && <span className="text-xs text-slate-500">{row.sub}</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-red-100">
            <p className="text-xs text-slate-500 mb-2">Reporta tu donación:</p>
            <a
              href="https://crvkycdonantes.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-900 underline underline-offset-2"
            >
              crvkycdonantes.netlify.app →
            </a>
          </div>
        </div>
      </section>

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

      {/* European collection points */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-500 text-white text-sm font-bold shrink-0">3</span>
          <div>
            <h2 className="text-xl font-black text-slate-900">Puntos de recogida — Europa</h2>
            <p className="text-sm text-slate-500">Donación física. Verifica el horario antes de ir.</p>
          </div>
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl px-4 py-3 mb-4 text-xs text-amber-800">
          Con el aeropuerto de Maiquetía cerrado, muchas asociaciones priorizan donación económica. Los puntos activos envían vía logística alternativa.
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 text-xs text-blue-800">
          <p className="font-bold mb-1">Liberty Express y Mandalo Ya — qué puedes enviar</p>
          <p className="mb-1">Hasta 4 kg por cliente. 1 envío gratuito. Destinos: Gran Caracas y La Guaira.</p>
          <p className="text-green-800"><strong>Aceptan:</strong> Alimentos no perecederos, medicamentos, suministros médicos autorizados, ropa limpia en buen estado.</p>
          <p className="text-red-800 mt-0.5"><strong>No aceptan:</strong> Electrónicos, inflamables, alcohol, artículos prohibidos en transporte aéreo.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase tracking-wide">
                <th className="text-left px-3 py-2 font-semibold">Ciudad</th>
                <th className="text-left px-3 py-2 font-semibold">Organización</th>
                <th className="text-left px-3 py-2 font-semibold">Dirección</th>
                <th className="text-left px-3 py-2 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { city: 'Madrid — Leganés', org: 'Sambil Madrid (Virgilio Vivas)', address: 'C/ Mondragón s/n, 28917 Leganés', status: '⚠️ PAUSADO temporalmente — capacidad colmada', paused: true },
                { city: 'Madrid — Alcobendas', org: 'VENESP · Parroquia Santa María', address: 'Parroquia Santa María de la Esperanza', status: '✅ Activo', paused: false },
                { city: 'Madrid — Villanueva', org: 'Pardillo Center · VENESP', address: 'Av. de Madrid 4, local 1', status: '✅ Activo', paused: false },
                { city: 'Madrid (2 puntos)', org: 'Mandalo Ya — Envío solidario gratuito', address: 'Mercado Las Maravillas · Montera — hasta 4 kg por cliente', status: '✅ Activo · Gran Caracas y La Guaira', paused: false },
                { city: 'Europa (todas sucursales)', org: 'Liberty Express — Envío solidario gratuito', address: 'Cualquier sucursal Liberty Express en Europa — hasta 4 kg por cliente', status: '✅ Activo · Gran Caracas y La Guaira', paused: false },
                { city: 'Barcelona', org: 'SOS Venezuela · Meals4Hope', address: 'Solo donación monetaria', status: '✅ Activo · sosterremoto.meals4hope.org', paused: false },
                { city: 'Sevilla', org: 'Capilla Divina Pastora', address: 'C/ Amparo 13, Sevilla · lun-sáb 19-21h', status: '✅ Activo', paused: false },
                { city: 'París', org: 'Secours Populaire Français', address: 'don.secourspopulaire.fr/urgence', status: '✅ Activo · Solo financiero', paused: false },
                { city: 'Roma', org: 'AMU / Focolares', address: 'amu-it.eu/campagne/emergenza...', status: '✅ Activo · Solo financiero', paused: false },
                { city: 'Londres', org: 'UNICEF UK', address: 'unicef.org.uk · Tel: 0300 330 5699', status: '✅ Activo · Solo financiero', paused: false },
              ].map((row) => (
                <tr key={row.org} className={row.paused ? 'bg-amber-50' : 'bg-white hover:bg-slate-50'}>
                  <td className="px-3 py-2 font-medium text-slate-900">{row.city}</td>
                  <td className="px-3 py-2 text-slate-700">{row.org}</td>
                  <td className="px-3 py-2 text-slate-500">{row.address}</td>
                  <td className="px-3 py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* US collection points */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-500 text-white text-sm font-bold shrink-0">4</span>
          <div>
            <h2 className="text-xl font-black text-slate-900">Puntos de recogida — Miami (EEUU)</h2>
            <p className="text-sm text-slate-500">Verificados por CBS Miami y Univision 23.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase tracking-wide">
                <th className="text-left px-3 py-2 font-semibold">Organización</th>
                <th className="text-left px-3 py-2 font-semibold">Dirección</th>
                <th className="text-left px-3 py-2 font-semibold">Horario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {[
                { org: 'GEM / Neighbors 4 Neighbors — Hope 4 Venezuela', address: '1850 NW 84th Ave, Suite 100, Doral FL 33166', hours: 'Confirmar' },
                { org: 'Inter Miami CF & City of Doral', address: 'Nu Stadium (south), 1900 NW 37th Ave', hours: 'Hasta 3 jul 2026' },
                { org: 'Doral Legacy Park Community Center', address: '11400 NW 82nd St, Doral FL 33178', hours: 'L-V 17-21h · S-D 8-17h' },
                { org: 'El Arepazo Restaurant', address: '10191 NW 58th St, Doral FL 33178', hours: '24/7' },
                { org: 'AFE Organisation', address: '6090 NW 84th Ave, Miami FL 33166', hours: 'L-V 9:30-15h' },
              ].map((row) => (
                <tr key={row.org} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-slate-900">{row.org}</td>
                  <td className="px-3 py-2 text-slate-500">{row.address}</td>
                  <td className="px-3 py-2 text-slate-700 font-medium whitespace-nowrap">{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
        <p className="text-sm font-bold text-red-900 mb-1">Alerta de fraude</p>
        <p className="text-sm text-red-800">
          Desconfía de cuentas personales sin organización registrada detrás. Verifica siempre que la ONG
          esté registrada legalmente antes de transferir dinero. Si tienes dudas,{' '}
          <a href="mailto:hello@estamosporvenezuela.com" className="underline">
            escríbenos
          </a>.
        </p>
      </div>
    </div>
  )
}
