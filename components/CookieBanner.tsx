'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent')
      if (!consent) setVisible(true)
    } catch {
      // localStorage not available (SSR or private browsing)
    }
  }, [])

  function accept() {
    try { localStorage.setItem('cookie-consent', 'accepted') } catch { /* noop */ }
    setVisible(false)
  }

  function reject() {
    try { localStorage.setItem('cookie-consent', 'rejected') } catch { /* noop */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 p-4 sm:p-5"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-slate-300 flex-1">
          Usamos cookies técnicas necesarias para el funcionamiento de la plataforma.
          No usamos cookies de seguimiento ni publicidad.{' '}
          <Link href="/privacidad" className="underline text-white hover:text-slate-200">
            Política de privacidad
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-sm rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
