'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/context'
import ResourceCard from '@/components/ResourceCard'
import type { Resource, ResourceType } from '@/types/database'

const RESOURCE_TYPE_LABELS: { value: ResourceType; label: string }[] = [
  { value: 'ngo',                   label: 'ONG / Fundación' },
  { value: 'campaign',              label: 'Campaña de recogida' },
  { value: 'collection_point',      label: 'Punto de acopio' },
  { value: 'volunteer_coordinator', label: 'Coordinador de voluntarios' },
  { value: 'medical',               label: 'Centro médico' },
  { value: 'psychological',         label: 'Apoyo psicológico' },
  { value: 'business',              label: 'Empresa solidaria' },
  { value: 'other',                 label: 'Otro' },
]

function AddResourceForm({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<ResourceType | ''>('')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [instagram, setInstagram] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('VE')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!type || !name.trim() || !email.trim() || (!url.trim() && !instagram.trim())) {
      setError('Nombre, tipo, email y web o Instagram son obligatorios.')
      return
    }
    setSubmitting(true)
    setError('')
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, name: name.trim(), url: url.trim() || null, instagram: instagram.trim() || null, city: city.trim() || null, country, description: description.trim() || null, submitter_email: email.trim() }),
    })
    if (res.ok) {
      setSubmitted(true)
    } else {
      const json = await res.json() as { error?: string }
      setError(json.error ?? 'Error al enviar')
    }
    setSubmitting(false)
  }

  if (submitted) return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
      <p className="text-2xl mb-2">✅</p>
      <p className="font-bold text-emerald-800 mb-1">¡Propuesta enviada!</p>
      <p className="text-xs text-emerald-700 mb-4">El equipo la revisará y la añadirá al directorio.</p>
      <button onClick={onClose} className="text-xs text-emerald-600 underline hover:text-emerald-800">Cerrar</button>
    </div>
  )

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-slate-900">Proponer un recurso</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">×</button>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Tipo de recurso *</label>
        <select value={type} onChange={e => setType(e.target.value as ResourceType)} className="input text-sm" required>
          <option value="">Selecciona un tipo...</option>
          {RESOURCE_TYPE_LABELS.map(rt => (
            <option key={rt.value} value={rt.value}>{rt.label}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 block mb-1">Nombre *</label>
          <input value={name} onChange={e => setName(e.target.value)} className="input text-sm" required placeholder="Nombre de la organización o campaña" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Sitio web</label>
          <input value={url} onChange={e => setUrl(e.target.value)} className="input text-sm" placeholder="https://" type="url" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Instagram</label>
          <input value={instagram} onChange={e => setInstagram(e.target.value)} className="input text-sm" placeholder="@cuenta" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Ciudad</label>
          <input value={city} onChange={e => setCity(e.target.value)} className="input text-sm" placeholder="Caracas / Barcelona..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">País</label>
          <select value={country} onChange={e => setCountry(e.target.value)} className="input text-sm">
            <option value="VE">🇻🇪 Venezuela</option>
            <option value="ES">🇪🇸 España</option>
            <option value="INT">🌐 Internacional</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 block mb-1">Tu email *</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="input text-sm" type="email" required placeholder="tu@email.com" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 block mb-1">Descripción (opcional)</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="input text-sm resize-none" rows={2} placeholder="¿Qué hace este recurso? ¿Cómo ayuda?" />
        </div>
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <p className="text-xs text-slate-400">La propuesta será revisada antes de publicarse. El email no se muestra en el directorio.</p>
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 text-sm">Cancelar</button>
        <button type="submit" disabled={submitting} className="btn-primary flex-1 text-sm disabled:opacity-40">
          {submitting ? 'Enviando...' : 'Proponer recurso'}
        </button>
      </div>
    </form>
  )
}

const FILTERS: { value: string; key: string }[] = [
  { value: 'all', key: 'directory.filter.all' },
  { value: 'ngo', key: 'directory.filter.ngo' },
  { value: 'campaign', key: 'directory.filter.campaign' },
  { value: 'collection_point', key: 'directory.filter.collection_point' },
  { value: 'volunteer_coordinator', key: 'directory.filter.volunteer_coordinator' },
  { value: 'medical', key: 'directory.filter.medical' },
  { value: 'psychological', key: 'directory.filter.psychological' },
  { value: 'missing_persons', key: 'directory.filter.missing_persons' },
  { value: 'business', key: 'directory.filter.business' },
  { value: 'animal_rescue', key: 'directory.filter.animal_rescue' },
]

function DirectorioContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState(searchParams.get('type') ?? 'all')
  const [country, setCountry] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)

  const fetchResources = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeFilter !== 'all') params.set('type', activeFilter)
    if (country !== 'all') params.set('country', country)
    if (search.trim()) params.set('q', search.trim())

    const res = await fetch(`/api/resources?${params.toString()}`)
    const json = await res.json() as { data: Resource[] }
    setResources(json.data ?? [])
    setLoading(false)
  }, [activeFilter, country, search])

  useEffect(() => {
    const timer = setTimeout(fetchResources, search ? 400 : 0)
    return () => clearTimeout(timer)
  }, [fetchResources, search])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">{t('directory.title')}</h1>
          <p className="text-slate-600">{t('directory.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowAddForm(v => !v)}
          className="shrink-0 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-slate-50 transition-colors"
        >
          + Proponer recurso
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <AddResourceForm onClose={() => setShowAddForm(false)} />
        </div>
      )}

      {/* Search + country filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('directory.search')}
          className="input flex-1"
          aria-label={t('directory.search')}
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="input sm:w-40"
          aria-label="Filtrar por país"
        >
          <option value="all">🌍 Todos</option>
          <option value="VE">🇻🇪 Venezuela</option>
          <option value="ES">🇪🇸 España</option>
          <option value="INT">🌐 Internacional</option>
        </select>
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filtrar por tipo">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeFilter === f.value
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {t(f.key as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">{t('common.loading')}</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12 text-slate-400">{t('directory.empty')}</div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">{resources.length} recursos encontrados</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function DirectorioPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-400">
        Cargando directorio...
      </div>
    }>
      <DirectorioContent />
    </Suspense>
  )
}
