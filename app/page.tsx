import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getServerLocale } from '@/lib/i18n/server'
import { translations } from '@/lib/i18n/translations'
import InViewMotion from '@/components/InViewMotion'
import Marquee from '@/components/Marquee'

export const revalidate = 60

const marqueeItems = [
  'Caracas', 'Miranda', 'Vargas', 'Mérida', 'Barquisimeto', 'Maracaibo',
  'Medicamentos urgentes', 'Sangre O−', 'Personas desaparecidas',
  'Voluntarios activos', 'Donaciones verificadas', 'Puntos de recogida',
]

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
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/95 via-brand-ink/50 to-brand-ink/15" />

        {/* Venezuelan flag bar */}
        <div className="absolute top-0 left-0 right-0 h-1 flex z-10">
          <div className="flex-1 bg-brand-ember" />
          <div className="flex-1 bg-brand-sol" />
          <div className="flex-1 bg-brand-cielo" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 px-4 sm:px-6 text-center text-white z-10">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-canvas/60 mb-4 font-medium">
            Terremoto de Venezuela — Junio 2026
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-none mb-6 max-w-4xl">
            {t['home.hero.title']}
          </h1>
          <p className="text-base sm:text-lg text-brand-canvas/70 mb-10 max-w-xl leading-relaxed">
            {t['home.hero.subtitle']}
          </p>

          <Link
            href="/necesito-ayuda?trapped=true"
            className="block w-full sm:w-auto sm:inline-block px-8 py-4 bg-brand-ember hover:bg-brand-ember/90 text-white text-lg font-bold uppercase tracking-widest transition-all shadow-2xl shadow-brand-ember/30 animate-pulse mb-5 focus-visible:outline-brand-ember rounded-full"
          >
            {t['home.hero.cta.trapped']}
          </Link>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/voluntarios" className="px-6 py-3 rounded-full bg-white text-brand-ink font-semibold hover:bg-brand-canvas transition-colors text-sm">
              {t['home.hero.cta.help']}
            </Link>
            <Link href="/donaciones" className="px-6 py-3 rounded-full bg-brand-sol text-brand-ink font-semibold hover:bg-brand-sol/90 transition-colors text-sm">
              {t['home.hero.cta.donate']}
            </Link>
            <Link href="/directorio" className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:border-white/60 transition-colors text-sm">
              {t['home.hero.cta.resources']}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats — editorial numbers with serif */}
      <section className="border-b border-brand-tierra/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-3 gap-4 text-center divide-x divide-brand-tierra/15">
          <InViewMotion delay={0}>
            <p className="font-serif text-5xl text-brand-ember leading-none">{resourceCount}+</p>
            <p className="text-xs text-brand-warm-muted mt-2 uppercase tracking-widest">{t['home.stats.resources']}</p>
          </InViewMotion>
          <InViewMotion delay={100}>
            <p className="font-serif text-5xl text-brand-ink leading-none">{helpCount}</p>
            <p className="text-xs text-brand-warm-muted mt-2 uppercase tracking-widest">{t['home.stats.help']}</p>
          </InViewMotion>
          <InViewMotion delay={200}>
            <p className="font-serif text-5xl text-brand-cielo leading-none">3</p>
            <p className="text-xs text-brand-warm-muted mt-2 uppercase tracking-widest">{t['home.stats.countries']}</p>
          </InViewMotion>
        </div>
      </section>

      {/* Marquee ticker */}
      <div className="py-4 border-b border-brand-tierra/10">
        <Marquee items={marqueeItems} />
      </div>

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
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-ink/20 lg:to-brand-ink/40" />
        </div>

        <div className="bg-brand-ink text-brand-canvas px-8 py-12 lg:px-12 lg:py-14">
          <p className="section-label text-brand-canvas/50 mb-3" style={{ ['--tw-before-bg' as string]: 'rgb(207 20 43)' }}>
            <span className="w-2 h-2 rounded-full bg-brand-ember shrink-0 inline-block mr-2" />
            Crítico ahora
          </p>
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
              <li key={item.label} className="flex gap-4 items-start border-b border-brand-tierra/20 pb-4 last:border-0 last:pb-0">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-ember mt-2 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-brand-canvas/50 mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Feature section — editorial with large background text */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Large background display text */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span className="font-serif text-[22vw] lg:text-[18vw] font-black text-brand-ink/[0.03] whitespace-nowrap leading-none">
            Venezuela
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <InViewMotion>
            <p className="section-label">Herramientas</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-brand-ink mb-12">
              Todo en <em>un solo lugar</em>
            </h2>
          </InViewMotion>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* AI Assistant — featured wide card */}
            <InViewMotion delay={50} className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl overflow-hidden border border-brand-tierra/20 hover:shadow-lg transition-shadow">
                <div className="bg-brand-ink px-8 py-10 flex flex-col justify-between min-h-[200px]">
                  <p className="section-label text-brand-canvas/40">
                    <span className="w-2 h-2 rounded-full bg-brand-tierra shrink-0 inline-block mr-2" />
                    IA
                  </p>
                  <div>
                    <h3 className="font-serif text-2xl lg:text-3xl text-brand-canvas mb-2">{t['home.assistant.title']}</h3>
                    <p className="text-brand-canvas/50 text-sm leading-relaxed">{t['home.assistant.subtitle']}</p>
                  </div>
                </div>
                <div className="bg-brand-warm-surface px-8 py-10 flex flex-col justify-between">
                  <p className="text-brand-ink/60 text-sm leading-relaxed">
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
              <div className="card hover:shadow-lg h-full">
                <div className="h-1 -mx-5 -mt-5 mb-6 rounded-t-2xl bg-gradient-to-r from-brand-cielo to-brand-cielo/60" />
                <p className="section-label">Directorio</p>
                <h3 className="font-serif text-2xl text-brand-ink mb-2">{t['home.directory.title']}</h3>
                <p className="text-brand-warm-muted text-sm mb-6 leading-relaxed">{t['home.directory.subtitle']}</p>
                <Link href="/directorio" className="btn-primary text-sm">
                  {t['home.directory.cta']} →
                </Link>
              </div>
            </InViewMotion>

            {/* Help requests */}
            <InViewMotion delay={150}>
              <div className="card hover:shadow-lg h-full">
                <div className="h-1 -mx-5 -mt-5 mb-6 rounded-t-2xl bg-gradient-to-r from-brand-ember to-brand-ember/60" />
                <p className="section-label">Emergencias</p>
                <h3 className="font-serif text-2xl text-brand-ink mb-2">{t['home.help.title']}</h3>
                <p className="text-brand-warm-muted text-sm mb-6 leading-relaxed">{t['home.help.subtitle']}</p>
                <Link href="/necesito-ayuda" className="btn-primary text-sm">
                  {t['home.help.cta']} →
                </Link>
              </div>
            </InViewMotion>

            {/* Donate */}
            <InViewMotion delay={200}>
              <div className="card hover:shadow-lg h-full">
                <div className="h-1 -mx-5 -mt-5 mb-6 rounded-t-2xl bg-gradient-to-r from-brand-sol to-brand-sol/60" />
                <p className="section-label">Donaciones</p>
                <h3 className="font-serif text-2xl text-brand-ink mb-2">{t['home.donate.title']}</h3>
                <p className="text-brand-warm-muted text-sm mb-6 leading-relaxed">{t['home.donate.subtitle']}</p>
                <Link href="/donaciones" className="btn-primary text-sm">
                  {t['home.donate.cta']} →
                </Link>
              </div>
            </InViewMotion>

            {/* Volunteers */}
            <InViewMotion delay={250}>
              <div className="card hover:shadow-lg h-full">
                <div className="h-1 -mx-5 -mt-5 mb-6 rounded-t-2xl bg-gradient-to-r from-teal-600 to-teal-400" />
                <p className="section-label">Voluntariado</p>
                <h3 className="font-serif text-2xl text-brand-ink mb-2">{t['home.volunteer.title']}</h3>
                <p className="text-brand-warm-muted text-sm mb-6 leading-relaxed">{t['home.volunteer.subtitle']}</p>
                <Link href="/voluntarios" className="btn-primary text-sm">
                  {t['home.volunteer.cta']} →
                </Link>
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
        <div className="absolute inset-0 bg-brand-ink/65" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <div>
            <p className="font-serif text-2xl sm:text-3xl text-brand-canvas mb-4">
              Cada acción cuenta. Cada donación <em>llega</em>.
            </p>
            <Link href="/agregar" className="btn-secondary text-sm">
              {t['home.submit.cta']}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick donate strip */}
      <section className="bg-brand-sol">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm font-semibold text-brand-ink text-center">
            <Link href="/donaciones" className="text-base font-bold hover:underline whitespace-nowrap">
              Dona ahora a ONGs verificadas →
            </Link>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="bg-brand-ink/10 rounded-full px-3 py-1">Cruz Roja ES · Bizum 33512</span>
              <span className="bg-brand-ink/10 rounded-full px-3 py-1">UNICEF ES · unicef.es</span>
              <span className="bg-brand-ink/10 rounded-full px-3 py-1">Save the Children · Bizum 13132</span>
              <span className="bg-brand-ink/10 rounded-full px-3 py-1">WCK · Bizum 03843</span>
              <span className="bg-brand-ink/10 rounded-full px-3 py-1">Cáritas · Bizum 00089</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
