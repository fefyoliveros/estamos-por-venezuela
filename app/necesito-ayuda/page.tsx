'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/context'
import type { HelpRequest, NeedType } from '@/types/database'

const NEEDS: { value: NeedType; labelKey: string; emergency?: boolean }[] = [
  { value: 'food', labelKey: 'help.needs.food' },
  { value: 'medicine', labelKey: 'help.needs.medicine' },
  { value: 'find_person', labelKey: 'help.needs.find_person' },
  { value: 'other', labelKey: 'help.needs.other' },
  { value: 'trapped', labelKey: 'help.needs.trapped', emergency: true },
]

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  return `hace ${Math.floor(hours / 24)}d`
}

function NecesitoAyudaContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const initialTrapped = searchParams.get('trapped') === 'true'

  const [requests, setRequests] = useState<HelpRequest[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [fullName, setFullName] = useState('')
  const [location, setLocation] = useState('')
  const [needs, setNeeds] = useState<NeedType[]>(initialTrapped ? ['trapped'] : [])
  const [details, setDetails] = useState('')

  useEffect(() => {
    fetch('/api/help-requests')
      .then((r) => r.json())
      .then((json: { data: HelpRequest[] }) => {
        setRequests(json.data ?? [])
        setLoadingList(false)
      })
      .catch(() => setLoadingList(false))
  }, [])

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
      body: JSON.stringify({ full_name: fullName, location, needs, details }),
    })

    if (res.ok) {
      setSubmitted(true)
      const json = await res.json() as { data: HelpRequest }
      if (json.data) setRequests((prev) => [json.data, ...prev])
    }
    setSubmitting(false)
  }

  const needLabel = (n: NeedType): string => {
    const map: Record<NeedType, string> = {
      food: 'Alimentos',
      medicine: 'Medicamentos',
      find_person: 'Buscar persona',
      trapped: 'ATRAPADO',
      other: 'Otro',
    }
    return map[n]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Emergency alert */}
      <div className="bg-red-600 text-white rounded-2xl p-5 mb-8">
        <h2 className="font-black text-lg mb-1">{t('help.emergency.title')}</h2>
        <p className="text-red-100 text-sm">{t('help.emergency.body')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">{t('help.form.title')}</h1>
          <p className="text-slate-600 text-sm mb-6">{t('help.title')}</p>

          {submitted ? (
            <div className="card bg-emerald-50 border-emerald-200">
              <div className="text-3xl mb-2">✅</div>
              <p className="font-semibold text-emerald-800">{t('help.form.success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Active requests list */}
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-4">{t('help.list.title')}</h2>

          {loadingList ? (
            <p className="text-slate-400 text-sm">{t('common.loading')}</p>
          ) : requests.length === 0 ? (
            <p className="text-slate-400 text-sm">{t('help.list.empty')}</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {requests.map((req) => (
                <article key={req.id} className={`card border ${req.needs.includes('trapped') ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-sm text-slate-900">{req.full_name}</p>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(req.created_at)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">📍 {req.location}</p>
                  <div className="flex flex-wrap gap-1">
                    {req.needs.map((n) => (
                      <span
                        key={n}
                        className={`badge text-xs ${n === 'trapped' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                      >
                        {needLabel(n)}
                      </span>
                    ))}
                  </div>
                  {req.details && (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{req.details}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NecesitoAyudaPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-10 text-slate-400">Cargando...</div>}>
      <NecesitoAyudaContent />
    </Suspense>
  )
}
