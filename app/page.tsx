import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getServerLocale } from '@/lib/i18n/server'
import { translations } from '@/lib/i18n/translations'
import InViewMotion from '@/components/InViewMotion'

export const revalidate = 60

export default async function HomePage() {
  const locale = await getServerLocale()
  const t = translations[locale]

  const supabase = await createClient()

  const [resourcesResult, helpResult] = await Promise.all([
    supabase.from('resources').select('id', { count: 'exact', head: true }).eq('active', true),
    supabase.from('help_requests').select('id', { count: 'exact', head: true }).eq('status', 'active'),
  ])

  const resourceCount = resourcesResult.count ?? 0
  const helpCount = helpResult.count ?? 0

  return (
    <>
      {/* Hero — full-bleed editorial */}
      <section className="relative h-[92vh] min-h-[580px] max-h-[960px] overflow-hidden">
        <Image
          src="/images/hero-caracas.jpg"
          alt="Caracas y El Ávila"
          fill
          className="object-cover animate-ken-burns"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-slate-900/15" />

        <div className="absolute top-0 left-0 right-0 h-1 flex z-10">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-blue-800" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 px-4 sm:px-6 text-center text-white z-10">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-300 mb-4 font-medium">
            Terremoto de Venezuela — Junio 2026
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-none mb-6 max-w-4xl">
            {t['home.hero.title']}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
            {t['home.hero.subtitle']}
          </p>

          <Link
            href="/necesito-ayuda?trapped=true"
            className="block w-full sm:w-auto sm:inline-block px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-lg font-bold uppercase tracking-widest transition-all shadow-2xl shadow-red-950/60 animate-pulse mb-5 focus-visible:outline-red-400 rounded-lg"
          >
            {t['home.hero.cta.trapped']}
          </Link>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/voluntarios" className="px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors text-sm">
              {t['home.hero.cta.help']}
            </Link>
            <Link href="/donaciones" className="px-6 py-3 rounded-lg bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-300 transition-colors text-sm">
              {t['home.hero.cta.donate']}
            </Link>
            <Link href="/directorio" className="px-6 py-3 rounded-lg border border-white/30 text-white font-semibold hover:border-white/60 transition-colors text-sm">
              {t['home.hero.cta.resources']}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats — editorial numbers with serif */}
      <section className="border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-3 gap-4 text-center divide-x divide-slate-200/60">
          <InViewMotion delay={0}>
            <p className="font-serif text-5xl text-red-600 leading-none">{resourceCount}+</p>
            <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest">{t['home.stats.resources']}</p>
          </InViewMotion>
          <InViewMotion delay={100}>
            <p className="font-serif text-5xl text-[#0a0a0a] leading-none">{helpCount}</p>
            <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest">{t['home.stats.help']}</p>
          </InViewMotion>
          <InViewMotion delay={200}>
            <p className="font-serif text-5xl text-blue-700 leading-none">3</p>
            <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest">{t['home.stats.countries']}</p>
          </InViewMotion>
        </div>
      </section>

      {/* Urgent needs — editorial split */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-72 lg:h-auto min-h-[340px] overflow-hidden">
          <Image
            src="/images/rescue.jpg"
            alt="Rescatistas trabajando en zona afectada"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/20 lg:to-slate-950/40" />
        </div>

        <div className="bg-slate-950 text-white px-8 py-12 lg:px-12 lg:py-14">
          <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-3">Crítico ahora</p>
          <h2 className="font-serif text-3xl lg:text-4xl mb-8 leading-snug">{t['home.urgent.title']}</h2>
          <ul className="space-y-5">
            {[
              { label: 'Hospitales sin suministros', detail: 'Medicamentos, jeringas y material quirúrgico agotados.' },
              { label: 'Niños y familias separadas', detail: 'venezolanos-en-el-exterior.com · buscatuvzla.com' },
              { label: 'Sangre O−, A+, AB−', detail: 'Bancos de sangre críticos. Contacta Cruz Roja Venezuela.' },
              { label: 'Alimentos — zonas aisladas', detail: 'Carreteras cortadas. Dona directamente a WCK o Cáritas.' },
              { label: 'Personas desaparecidas', detail: 'missingpersons.ngo · desaparecidosterremotovenezuela.com' },
              { label: 'Animales atrapados', detail: '@rescatevzla @animalrescueve @patitas_vzla en Instagram' },
            ].map((item) => (
              <li key={item.label} className="flex gap-4 items-start border-b border-white/10 pb-4 last:border-0 last:pb-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Feature section — hejl-style with large background text */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Large background display text */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span className="font-serif text-[22vw] lg:text-[18vw] font-black text-slate-900/[0.03] whitespace-nowrap leading-none">
            Venezuela
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <InViewMotion>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Herramientas</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-[#0a0a0a] mb-12">Todo en un lugar</h2>
          </InViewMotion>

          {/* News-style card grid inspired by hejl */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* AI Assistant — featured wide card */}
            <InViewMotion delay={50} className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="bg-slate-950 px-8 py-10 flex flex-col justify-between min-h-[200px]">
                  <span className="text-xs uppercase tracking-widest text-slate-400">IA</span>
                  <div>
                    <h3 className="font-serif text-2xl lg:text-3xl text-white mb-2">{t['home.assistant.title']}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{t['home.assistant.subtitle']}</p>
                  </div>
                </div>
                <div className="bg-[#fef3e8] px-8 py-10 flex flex-col justify-between">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Responde preguntas sobre organizaciones, puntos de recogida, cómo donar y qué se necesita más.
                  </p>
                  <Link href="/asistente" className="btn-primary self-start mt-6 text-sm">
                    {t['home.assistant.cta']} →
                  </Link>
                </div>
              </div>
            </InViewMotion>

            {/* Directory */}
            <InViewMotion delay={100}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow h-full">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400" />
                <div className="px-8 py-8">
                  <span className="text-xs uppercase tracking-widest text-blue-500 mb-3 block">Directorio</span>
                  <h3 className="font-serif text-2xl text-[#0a0a0a] mb-2">{t['home.directory.title']}</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">{t['home.directory.subtitle']}</p>
                  <Link href="/directorio" className="btn-primary text-sm">
                    {t['home.directory.cta']} →
                  </Link>
                </div>
              </div>
            </InViewMotion>

            {/* Help requests */}
            <InViewMotion delay={150}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow h-full">
                <div className="h-2 bg-gradient-to-r from-red-600 to-red-400" />
                <div className="px-8 py-8">
                  <span className="text-xs uppercase tracking-widest text-red-500 mb-3 block">Emergencias</span>
                  <h3 className="font-serif text-2xl text-[#0a0a0a] mb-2">{t['home.help.title']}</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">{t['home.help.subtitle']}</p>
                  <Link href="/necesito-ayuda" className="btn-primary text-sm">
                    {t['home.help.cta']} →
                  </Link>
                </div>
              </div>
            </InViewMotion>

            {/* Donate */}
            <InViewMotion delay={200}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow h-full">
                <div className="h-2 bg-gradient-to-r from-yellow-500 to-yellow-300" />
                <div className="px-8 py-8">
                  <span className="text-xs uppercase tracking-widest text-yellow-600 mb-3 block">Donaciones</span>
                  <h3 className="font-serif text-2xl text-[#0a0a0a] mb-2">{t['home.donate.title']}</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">{t['home.donate.subtitle']}</p>
                  <Link href="/donaciones" className="btn-primary text-sm">
                    {t['home.donate.cta']} →
                  </Link>
                </div>
              </div>
            </InViewMotion>

            {/* Volunteers */}
            <InViewMotion delay={250}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow h-full">
                <div className="h-2 bg-gradient-to-r from-teal-600 to-teal-400" />
                <div className="px-8 py-8">
                  <span className="text-xs uppercase tracking-widest text-teal-600 mb-3 block">Voluntariado</span>
                  <h3 className="font-serif text-2xl text-[#0a0a0a] mb-2">{t['home.volunteer.title']}</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">{t['home.volunteer.subtitle']}</p>
                  <Link href="/voluntarios" className="btn-primary text-sm">
                    {t['home.volunteer.cta']} →
                  </Link>
                </div>
              </div>
            </InViewMotion>

          </div>
        </div>
      </section>

      {/* Volunteers photo break */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src="/images/volunteers.webp"
          alt="Voluntarios empacando cajas de ayuda humanitaria"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-900/65" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <div>
            <p className="font-serif text-2xl sm:text-3xl text-white mb-4">
              Cada acción cuenta. Cada donación llega.
            </p>
            <Link href="/agregar" className="btn-secondary text-sm">
              {t['home.submit.cta']}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick donate strip */}
      <section className="bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm font-semibold text-slate-900 text-center">
            <Link href="/donaciones" className="text-base font-bold hover:underline whitespace-nowrap">
              Dona ahora a ONGs verificadas →
            </Link>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="bg-white/60 rounded-md px-3 py-1">Cruz Roja ES · Bizum 33512</span>
              <span className="bg-white/60 rounded-md px-3 py-1">UNICEF ES · unicef.es</span>
              <span className="bg-white/60 rounded-md px-3 py-1">Save the Children · Bizum 13132</span>
              <span className="bg-white/60 rounded-md px-3 py-1">WCK · Bizum 03843</span>
              <span className="bg-white/60 rounded-md px-3 py-1">Cáritas · Bizum 00089</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
