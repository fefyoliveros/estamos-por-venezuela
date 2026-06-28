'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { HelpRequest, HelpRequestUrgency, HelpRequestResolutionType, NeedType } from '@/types/database'
import type { HelpRequestPin } from '@/components/HelpRequestMapInner'

const HelpRequestMap = dynamic(() => import('@/components/HelpRequestMapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-100 rounded-xl">
      <p className="text-slate-400 text-sm">Cargando mapa...</p>
    </div>
  ),
})

const PAGE_SIZE = 6

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  return `hace ${Math.floor(hours / 24)}d`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
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

const URGENCY_LABELS: Record<HelpRequestUrgency, string> = {
  critical: 'Crítico',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
}

const URGENCY_BADGE: Record<HelpRequestUrgency, string> = {
  critical: 'bg-red-700 text-white',
  high:     'bg-red-500 text-white',
  medium:   'bg-orange-500 text-white',
  low:      'bg-yellow-500 text-white',
}

const RESOLUTION_LABELS: Record<HelpRequestResolutionType, string> = {
  found:     '✓ Encontrada con vida',
  deceased:  '✝ Fallecida',
  evacuated: '🚁 Evacuada',
  resolved:  '✓ Resuelta',
}

const RESOLUTION_COLORS: Record<HelpRequestResolutionType, string> = {
  found:     'text-emerald-700',
  deceased:  'text-slate-500',
  evacuated: 'text-blue-700',
  resolved:  'text-emerald-700',
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

type ResolutionDraft = {
  type: HelpRequestResolutionType
  notes: string
}

export default function PeticionesPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([])
  const [resolved, setResolved] = useState<HelpRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<NeedType | 'all'>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [updating, setUpdating] = useState<Record<string, boolean>>({})
  const [resolutionOpen, setResolutionOpen] = useState<string | null>(null)
  const [resolutionDraft, setResolutionDraft] = useState<ResolutionDraft>({ type: 'found', notes: '' })

  const fetchAll = useCallback(async () => {
    const [activeRes, resolvedRes] = await Promise.all([
      fetch('/api/help-requests'),
      fetch('/api/help-requests?status=resolved'),
    ])
    const activeJson = await activeRes.json() as { data: HelpRequest[] }
    const resolvedJson = await resolvedRes.json() as { data: HelpRequest[] }
    setRequests(activeJson.data ?? [])
    setResolved(resolvedJson.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchAll()
    const timer = setInterval(() => void fetchAll(), 60000)
    return () => clearInterval(timer)
  }, [fetchAll])

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.needs.includes(filter))
  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount
  const trapped = requests.filter((r) => r.needs.includes('trapped'))

  const mappable: HelpRequestPin[] = requests
    .filter((r) => r.latitude != null && r.longitude != null)
    .map((r) => ({
      id: r.id,
      name: r.full_name,
      lat: r.latitude!,
      lng: r.longitude!,
      location: r.location,
      needs: r.needs,
      details: r.details,
      whatsapp: r.whatsapp,
      urgency: r.urgency,
    }))

  async function patchRequest(id: string, payload: Record<string, string | null>) {
    setUpdating((u) => ({ ...u, [id]: true }))
    await fetch(`/api/help-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    await fetchAll()
    setUpdating((u) => ({ ...u, [id]: false }))
  }

  async function resolveSimple(id: string) {
    await patchRequest(id, { status: 'resolved', resolution_type: 'resolved' })
  }

  async function resolveTrapped(id: string) {
    await patchRequest(id, {
      status: 'resolved',
      resolution_type: resolutionDraft.type,
      resolution_notes: resolutionDraft.notes || null,
    })
    setResolutionOpen(null)
    setResolutionDraft({ type: 'found', notes: '' })
  }

  async function changeUrgency(id: string, urgency: HelpRequestUrgency) {
    await patchRequest(id, { urgency })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Peticiones de ayuda</h1>
          <p className="text-slate-500 text-sm">
            {loading
              ? 'Cargando...'
              : `${requests.length} activa${requests.length !== 1 ? 's' : ''} · ${resolved.length} resuelta${resolved.length !== 1 ? 's' : ''} · se actualiza cada 60 s`}
          </p>
        </div>
        <Link
          href="/necesito-ayuda"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors whitespace-nowrap shrink-0"
        >
          + Publicar una solicitud
        </Link>
      </div>

      {/* Red Ayuda Venezuela highlight */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 text-white rounded-2xl px-5 py-4 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-black text-sm mb-1">🔍 ¿Buscas a alguien desaparecido?</p>
            <p className="text-xs text-red-100 leading-relaxed">
              <strong>Red Ayuda Venezuela</strong> centraliza reportes de desaparecidos, coordina rescatistas y mantiene un registro de edificios afectados en La Guaira.
            </p>
          </div>
          <a
            href="https://www.redayudavenezuela.com"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-3 py-2 bg-white text-red-700 font-bold text-xs rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            Ir al sitio →
          </a>
        </div>
      </div>

      {/* Starlink urgent call */}
      <div className="bg-slate-900 text-white rounded-2xl px-5 py-4 mb-4 flex items-start gap-3">
        <span className="text-2xl shrink-0">📡</span>
        <div>
          <p className="font-black text-base mb-1">Se necesitan antenas Starlink con urgencia</p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Si tienes una antena Starlink, puedes salvar vidas. Las personas atrapadas pueden conectarse desde un TikTok Live, indicar que están vivas y compartir su ubicación exacta.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <a
              href="https://instagram.com/ccnlasmercedes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 font-bold text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              📸 @ccnlasmercedes
            </a>
            <span className="inline-flex items-center text-sm text-slate-300">o lleva tu antena a los sitios de rescate más cercanos</span>
          </div>
        </div>
      </div>

      {/* Emergency callout */}
      {trapped.length > 0 && (
        <div className="bg-red-600 text-white rounded-2xl px-5 py-4 mb-4 flex items-start gap-3">
          <span className="text-2xl shrink-0">🆘</span>
          <div>
            <p className="font-black text-base mb-0.5">
              {trapped.length} persona{trapped.length !== 1 ? 's' : ''} atrapada{trapped.length !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-red-100">Necesitan rescate. Si puedes ayudar, actúa ahora.</p>
          </div>
        </div>
      )}

      {/* Coordinacion cross-promo */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-slate-900 text-sm">¿Quieres llevar insumos a un hospital o centro de acopio?</p>
          <p className="text-xs text-slate-600 mt-0.5">Esta sección es para solicitudes de personas individuales. Para ver qué materiales necesita cada centro, ve a Coordinación.</p>
        </div>
        <Link
          href="/coordinacion"
          className="shrink-0 text-xs font-bold text-blue-700 bg-white border border-blue-300 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          Ver necesidades →
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {NEED_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setVisibleCount(PAGE_SIZE) }}
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

          {/* Request cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {visible.map((req) => {
              const isTrapped = req.needs.includes('trapped')
              const isUpdating = updating[req.id]
              const showResolution = resolutionOpen === req.id

              return (
                <article
                  key={req.id}
                  className={`card border flex flex-col ${isTrapped ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-semibold text-sm text-slate-900 leading-snug">{req.full_name}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${URGENCY_BADGE[req.urgency]}`}>
                        {URGENCY_LABELS[req.urgency]}
                      </span>
                      <span className="text-xs text-slate-400">{timeAgo(req.created_at)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-2">📍 {req.location}</p>

                  {/* Need badges */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {req.needs.map((n) => (
                      <span
                        key={n}
                        className={`badge text-xs ${n === 'trapped' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                      >
                        {NEED_LABELS[n as NeedType]}
                      </span>
                    ))}
                  </div>

                  {req.details && (
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{req.details}</p>
                  )}

                  {req.whatsapp && (
                    <a
                      href={`https://wa.me/${req.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors mb-2 self-start"
                    >
                      <WhatsAppIcon />
                      {req.whatsapp}
                    </a>
                  )}

                  {/* Urgency change */}
                  <div className="flex items-center gap-1 flex-wrap mt-auto pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 mr-0.5">Urgencia:</span>
                    {(['critical', 'high', 'medium', 'low'] as HelpRequestUrgency[]).map((u) => (
                      <button
                        key={u}
                        disabled={isUpdating || req.urgency === u}
                        onClick={() => changeUrgency(req.id, u)}
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-colors ${
                          req.urgency === u
                            ? URGENCY_BADGE[u] + ' border-transparent'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {URGENCY_LABELS[u]}
                      </button>
                    ))}
                  </div>

                  {/* Resolution actions */}
                  {isTrapped && !showResolution && (
                    <button
                      disabled={isUpdating}
                      onClick={() => setResolutionOpen(req.id)}
                      className="mt-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors self-start"
                    >
                      {isUpdating ? 'Actualizando...' : '📋 Actualizar estado'}
                    </button>
                  )}

                  {!isTrapped && (
                    <button
                      disabled={isUpdating}
                      onClick={() => resolveSimple(req.id)}
                      className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors self-start"
                    >
                      {isUpdating ? 'Guardando...' : '✓ Marcar resuelta'}
                    </button>
                  )}

                  {/* Resolution form for trapped */}
                  {showResolution && (
                    <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl">
                      <p className="text-xs font-bold text-slate-700 mb-2">¿Qué pasó?</p>
                      <div className="flex flex-col gap-1.5 mb-2">
                        {(['found', 'evacuated', 'deceased'] as HelpRequestResolutionType[]).map((t) => (
                          <label key={t} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`res-${req.id}`}
                              checked={resolutionDraft.type === t}
                              onChange={() => setResolutionDraft((d) => ({ ...d, type: t }))}
                              className="accent-red-600"
                            />
                            <span className={`text-xs font-semibold ${RESOLUTION_COLORS[t]}`}>
                              {RESOLUTION_LABELS[t]}
                            </span>
                          </label>
                        ))}
                      </div>
                      <textarea
                        placeholder="Notas adicionales (hospital, fecha, etc.)"
                        value={resolutionDraft.notes}
                        onChange={(e) => setResolutionDraft((d) => ({ ...d, notes: e.target.value }))}
                        className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 mb-2 resize-none h-14 focus:outline-none focus:ring-1 focus:ring-slate-300"
                      />
                      <div className="flex gap-2">
                        <button
                          disabled={isUpdating}
                          onClick={() => resolveTrapped(req.id)}
                          className="text-xs font-bold text-white bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          {isUpdating ? 'Guardando...' : 'Confirmar'}
                        </button>
                        <button
                          onClick={() => setResolutionOpen(null)}
                          className="text-xs text-slate-400 hover:text-slate-700"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center mb-8">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:border-slate-400 transition-colors"
              >
                Ver más ({filtered.length - visibleCount} restantes)
              </button>
            </div>
          )}
        </>
      )}

      {/* Map of geolocated requests */}
      {mappable.length > 0 && (
        <div className="mt-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">Mapa de solicitudes</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {mappable.length} ubicaciones geolocalizadas · toca un pin para ver detalles
              </p>
            </div>
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3">
              {(['critical', 'high', 'medium'] as HelpRequestUrgency[]).map((u) => (
                <div key={u} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full border-2 border-white shadow ${
                    u === 'critical' ? 'bg-red-900' : u === 'high' ? 'bg-red-500' : 'bg-orange-500'
                  }`} />
                  <span className="text-[10px] text-slate-500">{URGENCY_LABELS[u]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: 420 }}>
            <HelpRequestMap pins={mappable} />
          </div>
        </div>
      )}

      {/* Outcomes log */}
      {resolved.length > 0 && (
        <section className="mt-2">
          <div className="border-t border-slate-100 pt-8">
            <h2 className="text-lg font-black text-slate-900 mb-1">Registro de actualizaciones</h2>
            <p className="text-xs text-slate-500 mb-5">
              {resolved.length} solicitude{resolved.length !== 1 ? 's' : ''} con estado actualizado.
              Ayuda a mantener este registro preciso.
            </p>
            <div className="space-y-3">
              {resolved.map((req) => {
                const rt = req.resolution_type
                return (
                  <div
                    key={req.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      rt === 'deceased'
                        ? 'bg-slate-50 border-slate-200'
                        : rt === 'found' || rt === 'evacuated'
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-lg shrink-0 mt-0.5">
                      {rt === 'found' ? '✓' : rt === 'deceased' ? '✝' : rt === 'evacuated' ? '🚁' : '✓'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <p className="font-bold text-sm text-slate-900">{req.full_name}</p>
                        {rt && (
                          <span className={`text-xs font-semibold ${RESOLUTION_COLORS[rt]}`}>
                            {RESOLUTION_LABELS[rt]}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">📍 {req.location}</p>
                      {req.resolution_notes && (
                        <p className="text-xs text-slate-600 mt-1">{req.resolution_notes}</p>
                      )}
                      {req.resolved_at && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          Actualizado: {formatDate(req.resolved_at)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
