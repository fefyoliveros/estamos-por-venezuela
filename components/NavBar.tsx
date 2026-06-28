'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'

export default function NavBar() {
  const { t, toggleLanguage } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-brand-canvas border-b border-brand-tierra/15 shadow-sm shadow-brand-tierra/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-brand-ink">
          <span className="text-base">🇻🇪</span>
          <span className="hidden sm:inline font-serif text-lg tracking-tight">Estamos por Venezuela</span>
          <span className="sm:hidden font-serif text-base tracking-tight">EPV</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/directorio" className="text-brand-ink/60 hover:text-brand-ink transition-colors">
            {t('nav.directorio')}
          </Link>
          <Link href="/donaciones" className="text-brand-ink/60 hover:text-brand-ink transition-colors">
            {t('nav.donaciones')}
          </Link>
          <Link href="/mapa" className="text-brand-ink/60 hover:text-brand-ink transition-colors">
            {t('nav.mapa')}
          </Link>
          <Link href="/voluntarios" className="text-brand-ink/60 hover:text-brand-ink transition-colors">
            {t('nav.voluntarios')}
          </Link>
          <Link href="/coordinacion" className="text-brand-ink/60 hover:text-brand-ink transition-colors">
            Coordinación
          </Link>
          <Link href="/asistente" className="text-brand-ink/60 hover:text-brand-ink transition-colors">
            {t('nav.asistente')}
          </Link>
          <Link href="/peticiones" className="text-brand-ink/60 hover:text-brand-ink transition-colors">
            {t('nav.peticiones')}
          </Link>
          <Link
            href="/necesito-ayuda"
            className="px-4 py-1.5 rounded-full bg-brand-ember text-white text-sm font-semibold hover:bg-brand-ember/90 transition-colors"
          >
            {t('nav.necesito-ayuda')}
          </Link>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-full border border-brand-tierra/30 text-xs font-semibold text-brand-ink/70 hover:border-brand-tierra transition-colors"
            aria-label="Toggle language"
          >
            {t('nav.lang')}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-full border border-brand-tierra/30 text-xs font-semibold text-brand-ink/70"
          >
            {t('nav.lang')}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className="p-2 rounded-lg hover:bg-brand-warm-surface transition-colors"
          >
            <svg className="w-5 h-5 text-brand-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden border-t border-brand-tierra/15 bg-brand-canvas px-4 py-3 flex flex-col gap-1 text-sm font-medium">
          <Link href="/directorio" className="py-2.5 text-brand-ink/70 hover:text-brand-ink border-b border-brand-tierra/10 transition-colors" onClick={() => setMenuOpen(false)}>
            {t('nav.directorio')}
          </Link>
          <Link href="/donaciones" className="py-2.5 text-brand-ink/70 hover:text-brand-ink border-b border-brand-tierra/10 transition-colors" onClick={() => setMenuOpen(false)}>
            {t('nav.donaciones')}
          </Link>
          <Link href="/mapa" className="py-2.5 text-brand-ink/70 hover:text-brand-ink border-b border-brand-tierra/10 transition-colors" onClick={() => setMenuOpen(false)}>
            {t('nav.mapa')}
          </Link>
          <Link href="/voluntarios" className="py-2.5 text-brand-ink/70 hover:text-brand-ink border-b border-brand-tierra/10 transition-colors" onClick={() => setMenuOpen(false)}>
            {t('nav.voluntarios')}
          </Link>
          <Link href="/coordinacion" className="py-2.5 text-brand-ink/70 hover:text-brand-ink border-b border-brand-tierra/10 transition-colors" onClick={() => setMenuOpen(false)}>
            Coordinación
          </Link>
          <Link href="/asistente" className="py-2.5 text-brand-ink/70 hover:text-brand-ink border-b border-brand-tierra/10 transition-colors" onClick={() => setMenuOpen(false)}>
            {t('nav.asistente')}
          </Link>
          <Link href="/peticiones" className="py-2.5 text-brand-ink/70 hover:text-brand-ink border-b border-brand-tierra/10 transition-colors" onClick={() => setMenuOpen(false)}>
            {t('nav.peticiones')}
          </Link>
          <Link
            href="/necesito-ayuda"
            className="mt-2 py-2.5 px-4 rounded-full bg-brand-ember text-white text-center font-semibold transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.necesito-ayuda')}
          </Link>
        </div>
      )}
    </header>
  )
}
