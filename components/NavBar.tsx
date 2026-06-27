'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'

export default function NavBar() {
  const { t, toggleLanguage } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <span className="text-red-600">🇻🇪</span>
          <span className="hidden sm:inline">Estamos por Venezuela</span>
          <span className="sm:hidden">EPV</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/directorio" className="text-slate-600 hover:text-slate-900 transition-colors">
            {t('nav.directorio')}
          </Link>
          <Link href="/donaciones" className="text-slate-600 hover:text-slate-900 transition-colors">
            {t('nav.donaciones')}
          </Link>
          <Link href="/mapa" className="text-slate-600 hover:text-slate-900 transition-colors">
            {t('nav.mapa')}
          </Link>
          <Link href="/voluntarios" className="text-slate-600 hover:text-slate-900 transition-colors">
            {t('nav.voluntarios')}
          </Link>
          <Link href="/asistente" className="text-slate-600 hover:text-slate-900 transition-colors">
            {t('nav.asistente')}
          </Link>
          <Link href="/necesito-ayuda" className="text-red-600 font-semibold hover:text-red-700 transition-colors">
            {t('nav.necesito-ayuda')}
          </Link>
          <Link href="/agregar" className="text-slate-600 hover:text-slate-900 transition-colors">
            {t('nav.agregar')}
          </Link>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:border-slate-400 transition-colors"
            aria-label="Toggle language"
          >
            {t('nav.lang')}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold"
          >
            {t('nav.lang')}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <Link href="/directorio" className="py-2 text-slate-700" onClick={() => setMenuOpen(false)}>
            {t('nav.directorio')}
          </Link>
          <Link href="/donaciones" className="py-2 text-slate-700" onClick={() => setMenuOpen(false)}>
            {t('nav.donaciones')}
          </Link>
          <Link href="/mapa" className="py-2 text-slate-700" onClick={() => setMenuOpen(false)}>
            {t('nav.mapa')}
          </Link>
          <Link href="/voluntarios" className="py-2 text-slate-700" onClick={() => setMenuOpen(false)}>
            {t('nav.voluntarios')}
          </Link>
          <Link href="/asistente" className="py-2 text-slate-700" onClick={() => setMenuOpen(false)}>
            {t('nav.asistente')}
          </Link>
          <Link href="/necesito-ayuda" className="py-2 text-red-600 font-semibold" onClick={() => setMenuOpen(false)}>
            {t('nav.necesito-ayuda')}
          </Link>
          <Link href="/agregar" className="py-2 text-slate-700" onClick={() => setMenuOpen(false)}>
            {t('nav.agregar')}
          </Link>
        </div>
      )}
    </header>
  )
}
