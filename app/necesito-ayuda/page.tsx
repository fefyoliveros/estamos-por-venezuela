'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/context'
import type { NeedType } from '@/types/database'

const NEEDS: { value: NeedType; labelKey: string; emergency?: boolean }[] = [
  { value: 'food', labelKey: 'help.needs.food' },
  { value: 'medicine', labelKey: 'help.needs.medicine' },
  { value: 'find_person', labelKey: 'help.needs.find_person' },
  { value: 'other', labelKey: 'help.needs.other' },
  { value: 'trapped', labelKey: 'help.needs.trapped', emergency: true },
]

function NecesitoAyudaContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const initialTrapped = searchParams.get('trapped') === 'true'

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [fullName, setFullName] = useState('')
  const [location, setLocation] = useState('')
  const [needs, setNeeds] = useState<NeedType[]>(initialTrapped ? ['trapped'] : [])
  const [details, setDetails] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  function toggleNeed(need: NeedType) {
    setNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName || !location || needs.length === 0) return
    setSubmitting(true)

    const res = await fetch('/api/help-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        location,
        needs,
        details: details || null,
        whatsapp: whatsapp.trim() || null,
      }),
    })

    if (res.ok) setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Emergency alert */}
      <div className="bg-red-600 text-white rounded-2xl p-5 mb-8">
        <h2 className="font-black text-lg mb-1">{t('help.emergency.title')}</h2>
        <p className="text-red-100 text-sm">{t('help.emergency.body')}</p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-black text-slate-900">{t('help.form.title')}</h1>
        <Link href="/peticiones" className="text-sm text-red-600 font-semibold hover:text-red-700 transition-colors">
          Ver peticiones →
        </Link>
      </div>
      <p className="text-slate-600 text-sm mb-6">{t('help.title')}</p>

      {submitted ? (
        <div className="card bg-emerald-50 border-emerald-200 text-center py-10">
          <div className="text-5xl mb-4">✅</div>
          <p className="font-semibold text-emerald-800 mb-2">{t('help.form.success')}</p>
          <p className="text-sm text-emerald-700 mb-6">
            Tu solicitud ya es visible para quienes puedan ayudar.
          </p>
          <Link
            href="/peticiones"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors"
          >
            Ver directorio de peticiones →
          </Link>
        </div>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="label">{t('help.form.name')} *</label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="location" className="label">{t('help.form.location')} *</label>
            <input
              id="location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('help.form.location.placeholder')}
              className="input"
            />
          </div>

          <div>
            <p className="label">{t('help.form.needs')} *</p>
            <div className="flex flex-col gap-2">
              {NEEDS.map((n) => (
                <button
                  key={n.value}
                  type="button"
                  onClick={() => toggleNeed(n.value)}
                  className={`text-left px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-colors ${
                    n.emergency
                      ? needs.includes(n.value)
                        ? 'border-red-600 bg-red-600 text-white text-base py-4'
                        : 'border-red-500 text-red-600 bg-red-50 hover:bg-red-100 text-base py-4'
                      : needs.includes(n.value)
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {n.emergency ? '🆘 ' : ''}{t(n.labelKey as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="details" className="label">{t('help.form.details')}</label>
            <textarea
              id="details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="input resize-none"
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="label">
              WhatsApp (con prefijo de país)
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+58 412 000 0000 o +34 600 000 000"
              className="input"
            />
            <p className="text-xs text-slate-400 mt-1">
              Opcional. Aparecerá en el directorio para que puedan contactarte directamente.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || !fullName || !location || needs.length === 0}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? t('common.loading') : t('help.form.submit')}
          </button>
        </form>
      )}
    </div>
  )
}

export default function NecesitoAyudaPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-10 text-slate-400">Cargando...</div>}>
      <NecesitoAyudaContent />
    </Suspense>
  )
}
