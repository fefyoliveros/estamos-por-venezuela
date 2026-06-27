'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import ResourceCard from '@/components/ResourceCard'
import type { Resource } from '@/types/database'

type Step = 'q1' | 'q2' | 'q3' | 'loading' | 'result'

interface Recommendation {
  summary: string
  priority: 'high' | 'medium' | 'low'
  suggested_actions: string[]
  resource_types: string[]
  reasoning: string
}

const SUPPORT_OPTIONS = [
  { value: 'volunteer', labelKey: 'assistant.q2.volunteer' as const },
  { value: 'donate_resources', labelKey: 'assistant.q2.donate_resources' as const },
  { value: 'donate_money', labelKey: 'assistant.q2.donate_money' as const },
  { value: 'skills', labelKey: 'assistant.q2.skills' as const },
  { value: 'other', labelKey: 'assistant.q2.other' as const },
]

const AVAILABILITY_OPTIONS = [
  { value: 'now', labelKey: 'assistant.q3.now' as const },
  { value: 'weekend', labelKey: 'assistant.q3.weekend' as const },
  { value: 'flexible', labelKey: 'assistant.q3.flexible' as const },
  { value: 'one_time', labelKey: 'assistant.q3.one_time' as const },
]

export default function AsistentePage() {
  const { t } = useTranslation()
  const [step, setStep] = useState<Step>('q1')
  const [location, setLocation] = useState('')
  const [supportType, setSupportType] = useState('')
  const [availability, setAvailability] = useState('')
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [error, setError] = useState('')

  async function handleSubmit() {
    setStep('loading')
    setError('')

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          support_type: supportType,
          availability,
        }),
      })

      const json = await res.json() as { recommendation?: Recommendation; resources?: Resource[]; error?: string }

      if (!res.ok) {
        throw new Error(json.error ?? 'Error al procesar la solicitud')
      }

      setRecommendation(json.recommendation!)
      setResources(json.resources ?? [])
      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
      setStep('q3')
    }
  }

  function reset() {
    setStep('q1')
    setLocation('')
    setSupportType('')
    setAvailability('')
    setRecommendation(null)
    setResources([])
    setError('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">{t('assistant.title')}</h1>
        <p className="text-slate-600">{t('assistant.subtitle')}</p>
      </div>

      {/* Step indicator */}
      {step !== 'loading' && step !== 'result' && (
        <div className="flex items-center gap-2 mb-8">
          {(['q1', 'q2', 'q3'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? 'bg-red-600 text-white' :
                ['q1', 'q2', 'q3'].indexOf(step) > i ? 'bg-emerald-500 text-white' :
                'bg-slate-200 text-slate-500'
              }`}>
                {['q1', 'q2', 'q3'].indexOf(step) > i ? '✓' : i + 1}
              </div>
              {i < 2 && <div className="flex-1 h-0.5 w-8 bg-slate-200" />}
            </div>
          ))}
        </div>
      )}

      {/* Q1: Location */}
      {step === 'q1' && (
        <div className="card">
          <label htmlFor="location" className="label text-base">{t('assistant.q1.label')}</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t('assistant.q1.placeholder')}
            className="input mb-4"
          />
          <button
            onClick={() => location.trim() && setStep('q2')}
            disabled={!location.trim()}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Q2: Support type */}
      {step === 'q2' && (
        <div className="card">
          <p className="label text-base mb-3">{t('assistant.q2.label')}</p>
          <div className="flex flex-col gap-2 mb-4">
            {SUPPORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setSupportType(opt.value); setStep('q3') }}
                className={`text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-colors ${
                  supportType === opt.value
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
          <button onClick={() => setStep('q1')} className="text-sm text-slate-500 hover:text-slate-700">
            ← {t('common.back')}
          </button>
        </div>
      )}

      {/* Q3: Availability */}
      {step === 'q3' && (
        <div className="card">
          <p className="label text-base mb-3">{t('assistant.q3.label')}</p>
          <div className="flex flex-col gap-2 mb-4">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAvailability(opt.value)}
                className={`text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-colors ${
                  availability === opt.value
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep('q2')} className="btn-secondary flex-1 text-sm">
              ← {t('common.back')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!availability}
              className="btn-primary flex-1 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('assistant.submit')}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {step === 'loading' && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4 animate-bounce">🔍</div>
          <p className="text-slate-600">{t('assistant.loading')}</p>
        </div>
      )}

      {/* Result */}
      {step === 'result' && recommendation && (
        <div className="space-y-6">
          <div className="card bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <h2 className="text-xl font-black mb-3">{t('assistant.result.title')}</h2>
            <p className="text-slate-200 mb-4 leading-relaxed">{recommendation.summary}</p>
            <ul className="space-y-2">
              {recommendation.suggested_actions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          {resources.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-900 mb-3">{t('assistant.result.resources')}</h3>
              <div className="grid grid-cols-1 gap-4">
                {resources.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
            </div>
          )}

          <button onClick={reset} className="btn-secondary w-full">
            {t('assistant.restart')}
          </button>
        </div>
      )}
    </div>
  )
}
