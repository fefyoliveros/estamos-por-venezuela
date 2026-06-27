'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import type { ResourceType } from '@/types/database'

const RESOURCE_TYPES: { value: ResourceType; labelKey: string }[] = [
  { value: 'ngo', labelKey: 'submit.type.ngo' },
  { value: 'collection_point', labelKey: 'submit.type.collection_point' },
  { value: 'business', labelKey: 'submit.type.business' },
  { value: 'campaign', labelKey: 'submit.type.campaign' },
  { value: 'volunteer_coordinator', labelKey: 'submit.type.volunteer_coordinator' },
  { value: 'other', labelKey: 'submit.type.other' },
]

export default function AgregarPage() {
  const { t } = useTranslation()
  const [type, setType] = useState<ResourceType | ''>('')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [instagram, setInstagram] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('ES')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const isBusiness = type === 'business'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!type || !name || !email || (!url && !instagram)) {
      setError('Completa todos los campos obligatorios')
      return
    }
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, name, url: url || null, instagram: instagram || null, city, country, description, submitter_email: email }),
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      const json = await res.json() as { error: string }
      setError(json.error ?? t('common.error'))
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-black mb-2">{t('submit.success')}</h1>
        <p className="text-slate-600">
          {isBusiness ? 'Tu empresa ha sido publicada directamente.' : t('submit.pending')}
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-secondary mt-6">
          Agregar otro
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black text-slate-900 mb-2">{t('submit.title')}</h1>
      <p className="text-slate-600 mb-8">{t('submit.subtitle')}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type */}
        <div>
          <p className="label">{t('submit.type.label')} *</p>
          <div className="flex flex-col gap-2">
            {RESOURCE_TYPES.map((rt) => (
              <button
                key={rt.value}
                type="button"
                onClick={() => setType(rt.value)}
                className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                  type === rt.value
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                {t(rt.labelKey as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </div>

        {type && (
          <>
            {/* Business note */}
            {isBusiness && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                ℹ️ {t('submit.business.note')}
              </div>
            )}

            {/* AI note for others */}
            {!isBusiness && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                🤖 {t('submit.ai.note')}
              </div>
            )}

            <div>
              <label htmlFor="name" className="label">{t('submit.name.label')} *</label>
              <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </div>

            <div>
              <label htmlFor="url" className="label">{t('submit.url.label')}</label>
              <input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" className="input" />
            </div>

            <div>
              <label htmlFor="instagram" className="label">{t('submit.instagram.label')}</label>
              <input id="instagram" type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@cuenta" className="input" />
              <p className="text-xs text-slate-400 mt-1">Si no tienes web, incluye al menos Instagram</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="city" className="label">{t('submit.city.label')}</label>
                <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className="input" />
              </div>
              <div>
                <label htmlFor="country" className="label">{t('submit.country.label')}</label>
                <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="input">
                  <option value="ES">{t('submit.country.ES')}</option>
                  <option value="VE">{t('submit.country.VE')}</option>
                  <option value="INT">{t('submit.country.INT')}</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="label">{t('submit.description.label')}</label>
              <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="input resize-none" />
            </div>

            <div>
              <label htmlFor="email" className="label">{t('submit.email.label')} *</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-40"
            >
              {submitting ? t('common.loading') : (isBusiness ? t('submit.submit.business') : t('submit.submit'))}
            </button>
          </>
        )}
      </form>
    </div>
  )
}
