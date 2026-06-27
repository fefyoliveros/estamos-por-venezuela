import type { Metadata } from 'next'
import './globals.css'
import { TranslationProvider } from '@/lib/i18n/context'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'

export const metadata: Metadata = {
  title: 'Estamos por Venezuela — Ayuda humanitaria terremoto 2026',
  description: 'Toda la ayuda en un solo lugar. Encuentra ONGs, puntos de recogida, campañas verificadas y cómo ayudar al terremoto de Venezuela 2026.',
  openGraph: {
    title: 'Estamos por Venezuela',
    description: 'Directorio centralizado de ayuda humanitaria para el terremoto de Venezuela 2026.',
    locale: 'es_ES',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <TranslationProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 btn-primary"
          >
            Ir al contenido principal
          </a>
          <NavBar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </TranslationProvider>
      </body>
    </html>
  )
}
