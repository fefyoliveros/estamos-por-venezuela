'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-brand-ink text-brand-canvas/70 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-brand-canvas font-serif text-xl mb-3">Estamos por Venezuela</h3>
            <p className="text-sm leading-relaxed">{t('footer.about')}</p>
          </div>

          <div>
            <h4 className="text-brand-canvas font-semibold mb-3">Recursos rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/directorio" className="hover:text-brand-canvas transition-colors">Directorio de recursos</Link></li>
              <li><Link href="/asistente" className="hover:text-brand-canvas transition-colors">Asistente de ayuda</Link></li>
              <li><Link href="/necesito-ayuda" className="hover:text-brand-canvas transition-colors text-brand-ember">Necesito ayuda urgente</Link></li>
              <li><Link href="/agregar" className="hover:text-brand-canvas transition-colors">Agregar un recurso</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-brand-canvas font-semibold mb-3">Información</h4>
            <p className="text-xs leading-relaxed text-brand-canvas/50">{t('footer.disclaimer')}</p>
            <p className="text-xs mt-3 text-brand-canvas/40">
              estamosporvenezuela.com<br />
              Plataforma ciudadana independiente
            </p>
            <div className="mt-3">
              <Link href="/privacidad" className="text-xs text-brand-canvas/40 hover:text-brand-canvas/70 transition-colors">
                Política de privacidad
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-tierra/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-canvas/40">
          <p>Plataforma creada con urgencia ante la crisis humanitaria del terremoto de Venezuela, junio 2026.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-ember shrink-0" />
              Cruz Roja Española: Bizum 33512
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-sol shrink-0" />
              UNICEF · Save the Children: Bizum 13132
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
