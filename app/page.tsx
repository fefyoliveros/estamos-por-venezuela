import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getServerLocale } from '@/lib/i18n/server'
import { translations } from '@/lib/i18n/translations'

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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white">
        {/* Venezuelan flag stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-blue-800" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="text-5xl mb-4">🇻🇪</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight">
            {t['home.hero.title']}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            {t['home.hero.subtitle']}
          </p>

          {/* Emergency button — most prominent */}
          <Link
            href="/necesito-ayuda?trapped=true"
            className="block w-full sm:w-auto sm:inline-block px-8 py-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xl font-black uppercase tracking-wide transition-all shadow-xl shadow-red-900/50 animate-pulse mb-6 focus-visible:outline-red-400"
          >
            {t['home.hero.cta.trapped']}
          </Link>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            <Link
              href="/asistente"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors"
            >
              {t['home.hero.cta.help']}
            </Link>
            <Link
              href="/directorio?type=campaign"
              className="px-6 py-3 rounded-xl bg-yellow-400 text-slate-900 font-bold hover:bg-yellow-300 transition-colors"
            >
              {t['home.hero.cta.donate']}
            </Link>
            <Link
              href="/directorio"
              className="px-6 py-3 rounded-xl border-2 border-white/30 text-white font-bold hover:border-white/60 transition-colors"
            >
              {t['home.hero.cta.resources']}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-4xl font-black text-red-600">{resourceCount}+</p>
            <p className="text-sm text-slate-500 mt-1">{t['home.stats.resources']}</p>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-900">{helpCount}</p>
            <p className="text-sm text-slate-500 mt-1">{t['home.stats.help']}</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-4xl font-black text-blue-700">3</p>
            <p className="text-sm text-slate-500 mt-1">{t['home.stats.countries']}</p>
          </div>
        </div>
      </section>

      {/* Main sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* AI Assistant */}
          <div className="card bg-gradient-to-br from-slate-900 to-slate-800 text-white col-span-1 md:col-span-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="text-5xl">🤖</div>
              <div className="flex-1">
                <h2 className="text-2xl font-black mb-2">{t['home.assistant.title']}</h2>
                <p className="text-slate-300 mb-4">{t['home.assistant.subtitle']}</p>
                <Link
                  href="/asistente"
                  className="btn-primary"
                >
                  {t['home.assistant.cta']} →
                </Link>
              </div>
            </div>
          </div>

          {/* Directory */}
          <div className="card border-slate-200">
            <div className="text-3xl mb-3">📋</div>
            <h2 className="text-xl font-black text-slate-900 mb-2">{t['home.directory.title']}</h2>
            <p className="text-slate-600 text-sm mb-4">{t['home.directory.subtitle']}</p>
            <Link href="/directorio" className="btn-primary text-sm">
              {t['home.directory.cta']} →
            </Link>
          </div>

          {/* Help requests */}
          <div className="card border-red-100 bg-red-50">
            <div className="text-3xl mb-3">🆘</div>
            <h2 className="text-xl font-black text-slate-900 mb-2">{t['home.help.title']}</h2>
            <p className="text-slate-600 text-sm mb-4">{t['home.help.subtitle']}</p>
            <Link href="/necesito-ayuda" className="btn-primary text-sm">
              {t['home.help.cta']} →
            </Link>
          </div>

          {/* Submit resource */}
          <div className="card border-slate-200 md:col-span-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-3xl">➕</div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-slate-900 mb-1">{t['home.submit.title']}</h2>
                <p className="text-slate-600 text-sm">{t['home.submit.subtitle']}</p>
              </div>
              <Link href="/agregar" className="btn-secondary whitespace-nowrap text-sm">
                {t['home.submit.cta']}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick donate strip */}
      <section className="bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-semibold text-slate-900 text-center">
            <span className="text-base">Dona ahora a ONGs verificadas:</span>
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <span className="bg-white/60 rounded-lg px-3 py-1.5">Cruz Roja ES · Bizum 33512</span>
              <span className="bg-white/60 rounded-lg px-3 py-1.5">UNICEF · unicef.org</span>
              <span className="bg-white/60 rounded-lg px-3 py-1.5">Save the Children · Bizum 13132</span>
              <span className="bg-white/60 rounded-lg px-3 py-1.5">WCK · Bizum 03843</span>
              <span className="bg-white/60 rounded-lg px-3 py-1.5">Cáritas · Bizum 00089</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
