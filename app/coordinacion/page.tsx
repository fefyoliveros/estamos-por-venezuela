'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SupplyHub, SupplyReport, UrgencyLevel, HubType, ReportType } from '@/types/database'

// ── Hub vote panel ────────────────────────────────────────────────────────────

function VotePanel({ hubId }: { hubId: string }) {
  const [trust, setTrust]       = useState<number | null>(null)
  const [denounce, setDenounce] = useState<number | null>(null)
  const [denounceOpen, setDenounceOpen] = useState(false)
  const [reason, setReason]     = useState('')
  const [voted, setVoted]       = useState<'trust' | 'denounce' | null>(null)
  const [error, setError]       = useState('')

  useEffect(() => {
    void fetch(`/api/supply-hubs/${hubId}/vote`)
      .then(r => r.json())
      .then((j: { trust?: number; denounce?: number }) => {
        setTrust(j.trust ?? 0)
        setDenounce(j.denounce ?? 0)
      })
  }, [hubId])

  async function vote(type: 'trust' | 'denounce') {
    setError('')
    const res = await fetch(`/api/supply-hubs/${hubId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote_type: type, reason: type === 'denounce' ? reason : undefined }),
    })
    if (!res.ok) {
      const j = await res.json() as { error?: string }
      setError(j.error ?? 'Error')
      return
    }
    if (type === 'trust') { setTrust(t => (t ?? 0) + 1) }
    else { setDenounce(d => (d ?? 0) + 1) }
    setVoted(type)
    setDenounceOpen(false)
    setReason('')
  }

  if (voted) return (
    <p className="text-xs text-slate-400 pt-2 border-t border-slate-100 mt-2">
      {voted === 'trust' ? '✅ Gracias por tu voto de confianza' : '🚩 Denuncia recibida. El equipo la revisará.'}
    </p>
  )

  return (
    <div className="border-t border-slate-100 pt-2 mt-2 space-y-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => void vote('trust')}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-700 transition-colors"
        >
          👍 Confío {trust !== null ? <span className="font-semibold">({trust})</span> : null}
        </button>
        <span className="text-slate-200 text-xs">·</span>
        <button
          onClick={() => setDenounceOpen(v => !v)}
          className="text-xs text-slate-400 hover:text-red-600 transition-colors"
        >
          🚩 Denunciar{denounce ? ` (${denounce})` : ''}
        </button>
      </div>
      {denounceOpen && (
        <div className="space-y-2">
          <input
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Motivo de la denuncia (obligatorio)..."
            className="input text-xs"
          />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => { setDenounceOpen(false); setReason('') }} className="text-xs text-slate-500 hover:text-slate-700">Cancelar</button>
            <button
              onClick={() => reason.trim() && void vote('denounce')}
              disabled={!reason.trim()}
              className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-40"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Hub submit form ───────────────────────────────────────────────────────────

const INIT_HUB_FORM = {
  name: '', hub_type: 'hospital' as HubType, location: '', city: '',
  contact_name: '', contact_whatsapp: '', description: '',
}

function HubSubmitForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [form, setForm]       = useState(INIT_HUB_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.name.trim() || !form.location.trim()) { setError('Nombre y ubicación son obligatorios.'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/supply-hubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const j = await res.json() as { error?: string }
        throw new Error(j.error ?? 'Error')
      }
      setDone(true)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
      <p className="font-bold text-emerald-800 mb-1">¡Centro añadido!</p>
      <p className="text-xs text-emerald-700 mb-3">Aparece en la lista con la etiqueta "Sin verificar". La comunidad podrá votarlo.</p>
      <button onClick={onCancel} className="text-xs text-emerald-600 hover:underline">Cerrar</button>
    </div>
  )

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
      <h3 className="font-black text-slate-900">Añadir nuevo centro</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 block mb-1">Nombre del centro *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input text-sm" required placeholder="Hospital General / Centro de Acopio XYZ" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Tipo *</label>
          <select value={form.hub_type} onChange={e => setForm(f => ({ ...f, hub_type: e.target.value as HubType }))} className="input text-sm">
            <option value="hospital">🏥 Hospital / Clínica</option>
            <option value="collection_point">📦 Centro de Acopio</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Ciudad</label>
          <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input text-sm" placeholder="Caracas" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 block mb-1">Dirección / Ubicación *</label>
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input text-sm" required placeholder="Av. Principal, Urbanización..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Nombre del coordinador</label>
          <input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} className="input text-sm" placeholder="Dra. María García" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">WhatsApp</label>
          <input value={form.contact_whatsapp} onChange={e => setForm(f => ({ ...f, contact_whatsapp: e.target.value }))} className="input text-sm" placeholder="+58 412 000 0000" type="tel" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 block mb-1">Descripción (opcional)</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input text-sm resize-none" rows={2} placeholder="Qué tipo de ayuda ofrecen o necesitan..." />
        </div>
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <p className="text-xs text-slate-400">El centro aparecerá inmediatamente con etiqueta "Sin verificar". La comunidad puede votarlo.</p>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1 text-sm">Cancelar</button>
        <button type="submit" disabled={submitting} className="btn-primary flex-1 text-sm disabled:opacity-40">
          {submitting ? 'Añadiendo...' : 'Añadir centro'}
        </button>
      </div>
    </form>
  )
}

// ── Icons ────────────────────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

// ── Constants ─────────────────────────────────────────────────────────────────

const URGENCY_CONFIG: Record<UrgencyLevel, { label: string; badgeClass: string; dotColor: string }> = {
  critical: { label: 'CRÍTICO',  badgeClass: 'bg-red-100 text-red-800 border border-red-300',      dotColor: 'bg-red-500' },
  high:     { label: 'ALTO',     badgeClass: 'bg-orange-100 text-orange-800 border border-orange-300', dotColor: 'bg-orange-500' },
  medium:   { label: 'MEDIO',    badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300',  dotColor: 'bg-amber-400' },
  low:      { label: 'BAJO',     badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',  dotColor: 'bg-slate-400' },
}

const MEDICAL_SUPPLIES: string[] = [
  'Gasas', 'Guantes de nitrilo', 'Jeringas #5', 'Jeringas #10', 'Jeringas #20',
  'Suero fisiológico 0.9%', 'Ringer Lactato', 'Bacitracina', 'Sulfadiazina de plata',
  'Ibuprofeno', 'Paracetamol', 'Acetaminofén pediátrico', 'Omeprazol',
  'Yelcos #24', 'Catéter IV', 'Alcohol', 'Agua potable', 'Pañales bebé',
  'Pañales adulto', 'Alimentos no perecederos', 'Sueros hidratación oral',
  'Medicamentos para hipertensión', 'Inhaladores', 'Compresas', 'Toallas húmedas',
  'Jabón neutro', 'Leche NAN / fórmula', 'Bolsas negras', 'Materiales de limpieza',
  'Generador eléctrico', 'Combustible',
]

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  return `hace ${Math.floor(hrs / 24)}d`
}

// ── Report form (inline accordion) ────────────────────────────────────────────

const INIT_REPORT = {
  report_type: 'shortage' as ReportType,
  items: [] as string[],
  description: '',
  urgency: 'high' as UrgencyLevel,
  updated_by: '',
}

function ReportForm({ hubId, onSuccess }: { hubId: string; onSuccess: () => void }) {
  const [form, setForm] = useState(INIT_REPORT)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function toggleItem(item: string) {
    setForm(f => ({
      ...f,
      items: f.items.includes(item)
        ? f.items.filter(i => i !== item)
        : [...f.items, item],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.updated_by.trim()) { setError('Indica tu nombre o rol.'); return }
    if (form.items.length === 0 && !form.description.trim()) {
      setError('Selecciona al menos un material o escribe una descripción.'); return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`/api/supply-hubs/${hubId}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_type: form.report_type,
          items: form.items,
          description: form.description.trim() || null,
          urgency: form.urgency,
          updated_by: form.updated_by.trim(),
        }),
      })
      if (!res.ok) {
        const j = await res.json() as { error?: string }
        throw new Error(j.error ?? 'Error al publicar')
      }
      setForm(INIT_REPORT)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="border-t border-slate-100 pt-4 mt-4 space-y-4">
      {/* Type selector */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, report_type: 'shortage' }))}
          className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-colors ${form.report_type === 'shortage' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}
        >
          ⚠️ Necesitan materiales
        </button>
        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, report_type: 'surplus' }))}
          className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-colors ${form.report_type === 'surplus' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}
        >
          ✅ Tienen excedente
        </button>
      </div>

      {/* Quick-pick supplies */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-2">
          {form.report_type === 'shortage' ? '¿Qué necesitan?' : '¿Qué tienen de sobra?'}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {MEDICAL_SUPPLIES.map(item => (
            <button
              key={item}
              type="button"
              onClick={() => toggleItem(item)}
              className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                form.items.includes(item)
                  ? form.report_type === 'shortage'
                    ? 'border-red-400 bg-red-50 text-red-700 font-semibold'
                    : 'border-emerald-400 bg-emerald-50 text-emerald-700 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Descripción adicional (opcional)</label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Ej: Necesitamos urgente gasas para quemados de tercer grado..."
          rows={2}
          className="input text-sm resize-none"
        />
      </div>

      {/* Urgency — only for shortages */}
      {form.report_type === 'shortage' && (
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Nivel de urgencia</label>
          <div className="flex gap-2 flex-wrap">
            {(['critical', 'high', 'medium', 'low'] as UrgencyLevel[]).map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setForm(f => ({ ...f, urgency: lvl }))}
                className={`px-3 py-1 rounded-lg text-xs font-bold border-2 transition-colors ${form.urgency === lvl ? URGENCY_CONFIG[lvl].badgeClass + ' border-current' : 'border-slate-200 text-slate-500'}`}
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${URGENCY_CONFIG[lvl].dotColor}`} />
                {URGENCY_CONFIG[lvl].label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reporter name */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Tu nombre o rol *</label>
        <input
          value={form.updated_by}
          onChange={e => setForm(f => ({ ...f, updated_by: e.target.value }))}
          placeholder="Ej: Coordinadora de enfermería, Voluntario Cruz Roja..."
          className="input text-sm"
        />
      </div>

      {error && <p className="text-red-600 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full text-sm disabled:opacity-40"
      >
        {submitting ? 'Publicando...' : 'Publicar actualización'}
      </button>
    </form>
  )
}

// ── Reports list ──────────────────────────────────────────────────────────────

interface ReportsState {
  data: SupplyReport[]
  loading: boolean
  open: boolean
}

function HubReportsPanel({ hub }: { hub: SupplyHub }) {
  const [shortage, setShortage] = useState<ReportsState>({ data: [], loading: false, open: false })
  const [surplus, setSurplus]   = useState<ReportsState>({ data: [], loading: false, open: false })
  const [formOpen, setFormOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchReports = useCallback(async () => {
    setShortage(s => ({ ...s, loading: true }))
    setSurplus(s => ({ ...s, loading: true }))
    try {
      const res = await fetch(`/api/supply-hubs/${hub.id}/reports`)
      const json = await res.json() as { data?: SupplyReport[] }
      const all = json.data ?? []
      setShortage(s => ({ ...s, data: all.filter(r => r.report_type === 'shortage'), loading: false }))
      setSurplus(s => ({ ...s, data: all.filter(r => r.report_type === 'surplus'), loading: false }))
    } catch {
      setShortage(s => ({ ...s, loading: false }))
      setSurplus(s => ({ ...s, loading: false }))
    }
  }, [hub.id])

  useEffect(() => { void fetchReports() }, [fetchReports, refreshKey])

  const latestShortage = shortage.data[0]
  const latestSurplus  = surplus.data[0]

  return (
    <div className="space-y-3">
      {/* Shortage summary */}
      {latestShortage ? (
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${URGENCY_CONFIG[latestShortage.urgency].badgeClass}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${URGENCY_CONFIG[latestShortage.urgency].dotColor}`} />
              {URGENCY_CONFIG[latestShortage.urgency].label}
            </span>
            <span className="text-xs text-slate-400">NECESITAN · {timeAgo(latestShortage.created_at)}</span>
          </div>
          {latestShortage.items.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {latestShortage.items.map(item => (
                <span key={item} className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">{item}</span>
              ))}
            </div>
          )}
          {latestShortage.description && (
            <p className="text-xs text-slate-600 leading-relaxed">{latestShortage.description}</p>
          )}
          <p className="text-xs text-slate-400 mt-1">Reportado por: {latestShortage.updated_by}</p>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">Sin reporte de necesidades aún. Sé el primero en actualizar.</p>
      )}

      {/* Surplus summary */}
      {latestSurplus && (
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✅ OFRECEN
            </span>
            <span className="text-xs text-slate-400">{timeAgo(latestSurplus.created_at)}</span>
          </div>
          {latestSurplus.items.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {latestSurplus.items.map(item => (
                <span key={item} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">{item}</span>
              ))}
            </div>
          )}
          {latestSurplus.description && (
            <p className="text-xs text-slate-600 leading-relaxed">{latestSurplus.description}</p>
          )}
          <p className="text-xs text-slate-400 mt-1">Reportado por: {latestSurplus.updated_by}</p>
        </div>
      )}

      {/* Update accordion */}
      <div className="border-t border-slate-100 pt-3">
        <button
          onClick={() => setFormOpen(v => !v)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <span>{formOpen ? '▲' : '▼'}</span>
          Actualizar lista de este centro
        </button>
        {formOpen && (
          <ReportForm
            hubId={hub.id}
            onSuccess={() => {
              setFormOpen(false)
              setRefreshKey(k => k + 1)
            }}
          />
        )}
      </div>
    </div>
  )
}

// ── Hub card ──────────────────────────────────────────────────────────────────

function HubCard({ hub }: { hub: SupplyHub }) {
  const isHospital = hub.hub_type === 'hospital'
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-black text-slate-900 text-base leading-tight">
            {isHospital ? '🏥' : '📦'} {hub.name}
          </h3>
          {hub.verified
            ? <span className="shrink-0 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">✓ Verificado</span>
            : <span className="shrink-0 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">⚠️ Sin verificar</span>
          }
        </div>
        <p className="text-xs text-slate-500">📍 {hub.location}</p>
        {hub.description && (
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{hub.description}</p>
        )}
      </div>

      {/* Contact */}
      {(hub.contact_name || hub.contact_whatsapp || hub.contact_instagram) && (
        <div className="flex flex-wrap gap-2 items-center">
          {hub.contact_name && (
            <span className="text-xs text-slate-600 font-medium">👤 {hub.contact_name}</span>
          )}
          {hub.contact_whatsapp && (
            <a
              href={`https://wa.me/${hub.contact_whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <WhatsAppIcon />
              {hub.contact_whatsapp}
            </a>
          )}
          {hub.contact_instagram && (
            <a
              href={`https://instagram.com/${hub.contact_instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-pink-600 hover:underline"
            >
              @{hub.contact_instagram.replace('@', '')}
            </a>
          )}
        </div>
      )}

      {/* Reports */}
      <HubReportsPanel hub={hub} />

      {/* Community trust / denounce */}
      <VotePanel hubId={hub.id} />
    </div>
  )
}

// ── Surplus exchange view ─────────────────────────────────────────────────────

interface SurplusEntry {
  hub: SupplyHub
  report: SupplyReport
}

function SurplusBoard({ hubs }: { hubs: SupplyHub[] }) {
  const [entries, setEntries] = useState<SurplusEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const results: SurplusEntry[] = []
      await Promise.all(
        hubs.map(async hub => {
          try {
            const res = await fetch(`/api/supply-hubs/${hub.id}/reports`)
            const json = await res.json() as { data?: SupplyReport[] }
            const surplus = (json.data ?? []).filter(r => r.report_type === 'surplus')
            surplus.forEach(report => results.push({ hub, report }))
          } catch { /* skip */ }
        })
      )
      results.sort((a, b) => new Date(b.report.created_at).getTime() - new Date(a.report.created_at).getTime())
      setEntries(results)
      setLoading(false)
    }
    if (hubs.length > 0) void load()
  }, [hubs])

  if (loading) return <p className="text-slate-400 text-sm py-10 text-center">Cargando excedentes...</p>
  if (entries.length === 0) return (
    <div className="text-center py-12">
      <p className="text-slate-400 text-sm mb-2">No hay excedentes registrados aún.</p>
      <p className="text-slate-400 text-xs">Los coordinadores pueden publicar materiales disponibles desde la tarjeta de su centro.</p>
    </div>
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Materiales disponibles que otros centros pueden solicitar. Contacta directamente al coordinador para coordinar la transferencia.
      </p>
      {entries.map(({ hub, report }) => (
        <div key={report.id} className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="font-bold text-slate-900 text-sm">{hub.hub_type === 'hospital' ? '🏥' : '📦'} {hub.name}</p>
              <p className="text-xs text-slate-500">📍 {hub.location} · {timeAgo(report.created_at)}</p>
            </div>
            {hub.contact_whatsapp && (
              <a
                href={`https://wa.me/${hub.contact_whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-white border border-emerald-300 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors shrink-0"
              >
                <WhatsAppIcon />
                Coordinar
              </a>
            )}
          </div>
          {report.items.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {report.items.map(item => (
                <span key={item} className="text-xs bg-white text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full font-medium">{item}</span>
              ))}
            </div>
          )}
          {report.description && <p className="text-xs text-slate-600 mt-1">{report.description}</p>}
          <p className="text-xs text-slate-400 mt-2">Reportado por: {report.updated_by}</p>
        </div>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = 'hospital' | 'collection_point' | 'surplus'
type CityFilter = 'all' | string

export default function CoordinacionPage() {
  const [hubs, setHubs]           = useState<SupplyHub[]>([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState<Tab>('hospital')
  const [city, setCity]           = useState<CityFilter>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey]   = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch('/api/supply-hubs')
        const json = await res.json() as { data?: SupplyHub[] }
        setHubs(json.data ?? [])
      } catch { /* ignore */ }
      setLoading(false)
    }
    void load()
  }, [refreshKey])

  const cities = ['all', ...Array.from(new Set(hubs.map(h => h.city).filter(Boolean) as string[])).sort()]

  const visibleHubs = hubs.filter(h => {
    if (tab === 'surplus') return true
    if (h.hub_type !== (tab as HubType)) return false
    if (city !== 'all' && h.city !== city) return false
    return true
  })

  const hospitalCount       = hubs.filter(h => h.hub_type === 'hospital').length
  const collectionCount     = hubs.filter(h => h.hub_type === 'collection_point').length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Coordinación de Insumos</h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed">
          Qué necesita cada hospital y centro de acopio, y qué tienen de sobra.
          Actualiza la lista de tu centro para que los voluntarios sepan exactamente qué llevar.
        </p>
      </div>

      {/* Add hub form */}
      {showAddForm ? (
        <div className="mb-8">
          <HubSubmitForm
            onSuccess={() => { setShowAddForm(false); setRefreshKey(k => k + 1) }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      ) : (
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="text-sm font-semibold border border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-slate-50 transition-colors px-4 py-2 rounded-xl"
          >
            + Añadir hospital o centro de acopio
          </button>
        </div>
      )}

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 flex gap-3">
        <span className="text-2xl shrink-0">ℹ️</span>
        <div className="text-sm text-blue-900 space-y-1">
          <p><strong>Coordinadores:</strong> Abre la tarjeta de tu centro y publica lo que necesitan o lo que tienen de sobra.</p>
          <p><strong>Voluntarios:</strong> Revisa qué necesita cada lugar antes de salir. Contacta al coordinador para confirmar antes de llevar materiales.</p>
          <p><strong>Intercambio:</strong> La pestaña "Excedentes" muestra materiales disponibles para transferir entre centros.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setTab('hospital')}
          className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${tab === 'hospital' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🏥 Hospitales ({hospitalCount})
        </button>
        <button
          onClick={() => setTab('collection_point')}
          className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${tab === 'collection_point' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          📦 Centros de Acopio ({collectionCount})
        </button>
        <button
          onClick={() => setTab('surplus')}
          className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${tab === 'surplus' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          ♻️ Excedentes
        </button>
      </div>

      {/* City filter — only for hub tabs */}
      {tab !== 'surplus' && cities.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {cities.map(c => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${city === c ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 text-slate-600 hover:border-slate-500'}`}
            >
              {c === 'all' ? 'Todas las ciudades' : c}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <p className="text-slate-400 text-sm py-12 text-center">Cargando centros...</p>
      ) : tab === 'surplus' ? (
        <SurplusBoard hubs={hubs} />
      ) : visibleHubs.length === 0 ? (
        <p className="text-slate-400 text-sm py-12 text-center">No hay centros registrados en esta categoría aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleHubs.map(hub => (
            <HubCard key={hub.id} hub={hub} />
          ))}
        </div>
      )}

    </div>
  )
}
