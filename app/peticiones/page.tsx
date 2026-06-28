'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { HelpRequest, NeedType } from '@/types/database'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  return `hace ${Math.floor(hours / 24)}d`
}

const NEED_LABELS: Record<NeedType, string> = {
  food: 'Alimentos',
  medicine: 'Medicamentos',
  find_person: 'Buscar persona',
  trapped: 'ATRAPADO',
  other: 'Otro',
}

const NEED_FILTERS: { value: NeedType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'trapped', label: '🆘 Atrapados' },
  { value: 'medicine', label: '💊 Medicamentos' },
  { value: 'food', label: '🥫 Alimentos' },
  { value: 'find_person', label: '🔍 Buscar persona' },
  { value: 'other', label: 'Otros' },
]

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export default function PeticionesPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<NeedType | 'all'>('all')

  const fetchRequests = useCallback(async () => {
    const res = await fetch('/api/help-requests')
    const json = await res.json() as { data: HelpRequest[] }
    setRequests(json.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchRequests()
    const timer = setInterval(() => void fetchRequests(), 60000)
    return () => clearInterval(timer)
  }, [fetchRequests])

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.needs.includes(filter))
  const trapped = requests.filter((r) => r.needs.includes('trapped'))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Directorio de peticiones de ayuda</h1>
          <p className="text-slate-500 text-sm">
            {loading
              ? 'Cargando...'
              : `${requests.length} solicitud${requests.length !== 1 ? 'es' : ''} activa${requests.length !== 1 ? 's' : ''} · se actualiza cada 60 s`}
          </p>
        </div>
        <Link
          href="/necesito-ayuda"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors whitespace-nowrap shrink-0"
        >
          + Publicar una solicitud
        </Link>
      </div>

      {/* Emergency callout */}
      {trapped.length > 0 && (
        <div className="bg-red-600 text-white rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
          <span className="text-2xl shrink-0">🆘</span>
          <div>
            <p className="font-black text-base mb-0.5">
              {trapped.length} persona{trapped.length !== 1 ? 's' : ''} atrapada{trapped.length !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-red-100">Necesitan rescate inmediato. Si puedes ayudar, actúa ahora.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {NEED_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              filter === f.value
                ? f.value === 'trapped'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {f.label}
          </button>
        ))}
        {filter !== 'all' && (
          <button
            onClick={() => setFilter('all')}
            className="text-xs text-slate-400 hover:text-slate-700 underline px-1"
          >
            Limpiar
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Cargando solicitudes...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 mb-4">No hay solicitudes en esta categoría.</p>
          <Link href="/necesito-ayuda" className="btn-primary text-sm">
            Publicar una solicitud
          </Link>
        </div>
      ) : (
        <>
          {filter !== 'all' && (
            <p className="text-xs text-slate-400 mb-4">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((req) => (
              <article
                key={req.id}
                className={`card border ${req.needs.includes('trapped') ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-semibold text-sm text-slate-900">{req.full_name}</p>
                  <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">{timeAgo(req.created_at)}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">📍 {req.location}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {req.needs.map((n) => (
                    <span
                      key={n}
                      className={`badge text-xs ${n === 'trapped' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      {NEED_LABELS[n]}
                    </span>
                  ))}
                </div>
                {req.details && (
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{req.details}</p>
                )}
                {req.whatsapp && (
                  <a
                    href={`https://wa.me/${req.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <WhatsAppIcon />
                    {req.whatsapp}
                  </a>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
