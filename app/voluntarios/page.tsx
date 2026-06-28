'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SkillOffer, SkillCategory, SkillAvailability, VolunteerInitiative, InitiativeCategory, OnsiteVolunteer, InitiativeNeed, UrgencyLevel } from '@/types/database'

// ── Shared constants ──────────────────────────────────────────────────────────

const SKILL_CATEGORIES: { value: SkillCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'Todos', emoji: '🌐' },
  { value: 'translator', label: 'Traducción', emoji: '🗣' },
  { value: 'medical', label: 'Médico / Sanitario', emoji: '🏥' },
  { value: 'psychological', label: 'Psicológico', emoji: '🧠' },
  { value: 'legal', label: 'Legal / Abogado', emoji: '⚖️' },
  { value: 'it', label: 'Informática', emoji: '💻' },
  { value: 'design', label: 'Diseño', emoji: '🎨' },
  { value: 'pr', label: 'Comunicación', emoji: '📢' },
  { value: 'logistics', label: 'Logística', emoji: '🚛' },
  { value: 'construction', label: 'Construcción', emoji: '🔨' },
  { value: 'other', label: 'Otro', emoji: '🙌' },
]

const INITIATIVE_CATEGORY_LABELS: Record<InitiativeCategory, { label: string; emoji: string }> = {
  logistics:    { label: 'Logística', emoji: '🚛' },
  medical:      { label: 'Médico', emoji: '🏥' },
  food:         { label: 'Alimentación', emoji: '🍲' },
  rescue:       { label: 'Rescate', emoji: '🔦' },
  psychosocial: { label: 'Apoyo psicosocial', emoji: '🧠' },
  translation:  { label: 'Traducción', emoji: '🗣' },
  collection:   { label: 'Recogida de materiales', emoji: '📦' },
  coordination: { label: 'Coordinación', emoji: '📋' },
  other:        { label: 'Otro', emoji: '🙌' },
}

const AVAILABILITY_LABELS: Record<SkillAvailability, string> = {
  remote: 'Online / Remoto',
  local:  'Presencial',
  both:   'Remoto o presencial',
}

const URGENCY_CONFIG: Record<UrgencyLevel, { label: string; dotColor: string; badgeClass: string; guide: string }> = {
  critical: {
    label:      'Critico',
    dotColor:   'bg-red-500',
    badgeClass: 'bg-red-50 text-red-800 border border-red-200',
    guide:      'Riesgo de vida. Se necesita AHORA mismo, sin excepción.',
  },
  high: {
    label:      'Alto',
    dotColor:   'bg-orange-500',
    badgeClass: 'bg-orange-50 text-orange-800 border border-orange-200',
    guide:      'Necesario en las próximas horas. Impacto directo en la operación.',
  },
  medium: {
    label:      'Medio',
    dotColor:   'bg-amber-400',
    badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200',
    guide:      'Necesario hoy o mañana. Mejora significativamente la capacidad.',
  },
  low: {
    label:      'Bajo',
    dotColor:   'bg-slate-400',
    badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
    guide:      'Util, pero no urgente. Puede esperar.',
  },
}

const INITIAL_SKILL_FORM = {
  full_name: '',
  skill_category: 'translator' as SkillCategory,
  skill_description: '',
  availability: 'remote' as SkillAvailability,
  location: '',
  contact_method: 'whatsapp',
  contact_value: '',
}

// ── Initiative needs panel ────────────────────────────────────────────────────

const URGENCY_LEVELS: UrgencyLevel[] = ['critical', 'high', 'medium', 'low']

const INITIAL_NEED_FORM = {
  updated_by: '', location_context: '', needs_description: '', urgency_level: 'medium' as UrgencyLevel,
}

function NeedsPanel({ initiativeId }: { initiativeId: string }) {
  const [open, setOpen]               = useState(false)
  const [needs, setNeeds]             = useState<InitiativeNeed[]>([])
  const [loading, setLoading]         = useState(false)
  const [showForm, setShowForm]       = useState(false)
  const [showGuide, setShowGuide]     = useState(false)
  const [form, setForm]               = useState(INITIAL_NEED_FORM)
  const [submitting, setSubmitting]   = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState(false)

  async function fetchNeeds() {
    setLoading(true)
    const res = await fetch(`/api/initiatives/${initiativeId}/needs`)
    const json = await res.json() as { data: InitiativeNeed[] }
    setNeeds(json.data ?? [])
    setLoading(false)
  }

  function handleToggle() {
    if (!open) { setOpen(true); void fetchNeeds() }
    else setOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`/api/initiatives/${initiativeId}/needs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Error')
      setSuccess(true)
      setShowForm(false)
      setForm(INITIAL_NEED_FORM)
      void fetchNeeds()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors text-xs font-semibold text-slate-600"
      >
        <span className="flex items-center gap-1.5">
          <span>📋</span>
          <span>
            {!open && needs.length > 0
              ? `Ver ${needs.length} necesidad${needs.length !== 1 ? 'es' : ''} activa${needs.length !== 1 ? 's' : ''}`
              : 'Necesidades y recursos'}
          </span>
        </span>
        <span className="text-slate-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {loading ? (
            <p className="text-xs text-slate-400">Cargando...</p>
          ) : needs.length === 0 && !showForm ? (
            <p className="text-xs text-slate-400 italic">Sin reportes de campo aún.</p>
          ) : (
            needs.map((n) => {
              const u = URGENCY_CONFIG[n.urgency_level]
              return (
                <div key={n.id} className={`rounded-lg px-3 py-2 text-xs ${u.badgeClass}`}>
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${u.dotColor}`} />
                      {u.label}
                    </span>
                    <span className="text-slate-400 text-xs shrink-0">
                      {new Date(n.created_at).toLocaleDateString('es', { day: 'numeric', month: 'short' })} · {n.updated_by}
                    </span>
                  </div>
                  {n.location_context && (
                    <p className="text-xs opacity-70 mb-0.5">📍 {n.location_context}</p>
                  )}
                  <p className="leading-relaxed">{n.needs_description}</p>
                </div>
              )
            })
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-800">
              Actualización enviada. Gracias por reportar desde el campo.
            </div>
          )}

          {!showForm ? (
            <button
              onClick={() => { setShowForm(true); setSuccess(false) }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold"
            >
              + Añadir necesidad actual
            </button>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="bg-slate-50 rounded-xl p-3 space-y-2.5 mt-2 border border-slate-200">
              <p className="text-xs font-bold text-slate-700">Reportar desde el campo</p>

              <div>
                <label className="label text-xs">Tu nombre o rol</label>
                <input
                  required
                  className="input text-xs"
                  placeholder="Voluntario / Coordinador en zona"
                  value={form.updated_by}
                  onChange={(e) => setForm({ ...form, updated_by: e.target.value })}
                />
              </div>

              <div>
                <label className="label text-xs">Ubicacion (opcional)</label>
                <input
                  className="input text-xs"
                  placeholder="Ej. Punto de acopio Los Palos Grandes"
                  value={form.location_context}
                  onChange={(e) => setForm({ ...form, location_context: e.target.value })}
                />
              </div>

              <div>
                <label className="label text-xs">Que se necesita</label>
                <textarea
                  required
                  rows={2}
                  className="input text-xs resize-none"
                  placeholder="Ej: Voluntarios nocturnos y 50 colchonetas urgente."
                  value={form.needs_description}
                  onChange={(e) => setForm({ ...form, needs_description: e.target.value })}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="label text-xs mb-0">Nivel de urgencia</label>
                  <button
                    type="button"
                    onClick={() => setShowGuide(!showGuide)}
                    className="text-xs text-slate-400 hover:text-slate-600 underline"
                  >
                    Como determinarlo
                  </button>
                </div>
                {showGuide && (
                  <div className="mb-2 space-y-1">
                    {URGENCY_LEVELS.map((lvl) => {
                      const u = URGENCY_CONFIG[lvl]
                      return (
                        <div key={lvl} className={`rounded px-2 py-1.5 text-xs flex items-start gap-1.5 ${u.badgeClass}`}>
                          <span className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${u.dotColor}`} />
                          <span><strong>{u.label}</strong> — {u.guide}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
                <select
                  className="input text-xs"
                  value={form.urgency_level}
                  onChange={(e) => setForm({ ...form, urgency_level: e.target.value as UrgencyLevel })}
                >
                  {URGENCY_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{URGENCY_CONFIG[lvl].label} — {URGENCY_CONFIG[lvl].guide}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-red-600 text-xs">{error}</p>}

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-xs">
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 text-xs disabled:opacity-40">
                  {submitting ? 'Enviando...' : 'Publicar'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

// ── Participar modal ──────────────────────────────────────────────────────────

function ParticiparButton({ initiative }: { initiative: VolunteerInitiative }) {
  const [open, setOpen]         = useState(false)
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [contact, setContact]   = useState<string | null>(null)
  const [error, setError]       = useState('')

  async function handleParticipate() {
    if (name.trim().length < 2) { setError('Escribe tu nombre completo.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/initiatives/${initiative.id}/participate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteer_name: name.trim() }),
      })
      const json = await res.json() as { contact?: string; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Error')
      setContact(json.contact ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar')
    } finally {
      setLoading(false)
    }
  }

  function isUrl(s: string) {
    try { new URL(s); return true } catch { return false }
  }
  function isEmail(s: string) { return s.includes('@') }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors"
      >
        Participar →
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setContact(null); setName('') } }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-black text-slate-900 mb-1">{initiative.title}</h3>
            <p className="text-sm text-slate-500 mb-5">Coordinado por {initiative.coordinator_name}</p>

            {contact ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-xs text-emerald-700 font-semibold mb-2 uppercase tracking-wide">Contacto de la iniciativa</p>
                  {isUrl(contact) ? (
                    <a
                      href={contact}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-800 font-bold underline break-all"
                    >
                      {contact}
                    </a>
                  ) : isEmail(contact) ? (
                    <a href={`mailto:${contact}`} className="text-emerald-800 font-bold underline">
                      {contact}
                    </a>
                  ) : contact.startsWith('+') || /^\d/.test(contact) ? (
                    <a href={`https://wa.me/${contact.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-800 font-bold underline">
                      {contact} (WhatsApp)
                    </a>
                  ) : (
                    <p className="text-emerald-800 font-bold break-all">{contact}</p>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Hola {name.split(' ')[0]}, contacta directamente al coordinador indicando tu nombre y cómo quieres ayudar.
                </p>
                <button
                  onClick={() => { setOpen(false); setContact(null); setName('') }}
                  className="w-full btn-secondary text-sm"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Para ver los datos de contacto del coordinador, escribe tu nombre completo.
                  El equipo podrá reconocerte cuando les contactes.
                </p>
                <div>
                  <label className="label" htmlFor="participate-name">Tu nombre completo</label>
                  <input
                    id="participate-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') void handleParticipate() }}
                    className="input"
                    placeholder="Ana García López"
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-600 text-xs">{error}</p>}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setOpen(false); setName('') }}
                    className="btn-secondary flex-1 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleParticipate()}
                    disabled={loading || name.trim().length < 2}
                    className="btn-primary flex-1 text-sm disabled:opacity-40"
                  >
                    {loading ? 'Un momento...' : 'Ver contacto'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// ── Initiatives tab ───────────────────────────────────────────────────────────

function InitiativesTab() {
  const [initiatives, setInitiatives] = useState<VolunteerInitiative[]>([])
  const [loading, setLoading]         = useState(true)
  const [activeCategory, setActive]   = useState<InitiativeCategory | 'all'>('all')
  const [showPostForm, setShowForm]   = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)
  const [postForm, setPostForm]       = useState({
    title: '', description: '', location: '', coordinator_name: '',
    coordinator_contact: '', category: 'coordination' as InitiativeCategory,
    is_onsite: false,
  })
  const [posting, setPosting]         = useState(false)
  const [postError, setPostError]     = useState('')
  const [initialNeeds, setInitialNeeds] = useState<Array<{ needs_description: string; urgency_level: UrgencyLevel }>>([])

  const fetchInitiatives = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/initiatives')
    const json = await res.json() as { data: VolunteerInitiative[] }
    const all = json.data ?? []
    setInitiatives(activeCategory === 'all' ? all : all.filter((i) => i.category === activeCategory))
    setLoading(false)
  }, [activeCategory])

  useEffect(() => { void fetchInitiatives() }, [fetchInitiatives])

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    setPosting(true)
    setPostError('')
    try {
      const res = await fetch('/api/initiatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm),
      })
      const json = await res.json() as { ok?: boolean; id?: string; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Error')

      // Post any initial needs the coordinator added
      if (json.id) {
        const validNeeds = initialNeeds.filter((n) => n.needs_description.trim())
        await Promise.all(
          validNeeds.map((need) =>
            fetch(`/api/initiatives/${json.id}/needs`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                needs_description: need.needs_description.trim(),
                urgency_level: need.urgency_level,
                updated_by: postForm.coordinator_name,
              }),
            })
          )
        )
      }

      setInitialNeeds([])
      setPostSuccess(true)
      setShowForm(false)
      void fetchInitiatives()
    } catch (err) {
      setPostError(err instanceof Error ? err.message : 'Error')
    } finally {
      setPosting(false)
    }
  }

  const categories = Object.entries(INITIATIVE_CATEGORY_LABELS) as [InitiativeCategory, { label: string; emoji: string }][]

  return (
    <div>
      <p className="text-slate-600 mb-5">
        Organizaciones y grupos coordinados que necesitan voluntarios. Haz clic en <strong>Participar</strong> para ver el contacto del coordinador y llegar de forma directa.
      </p>

      {/* Post initiative CTA */}
      {!showPostForm && (
        <div className="mb-6">
          {postSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-3 text-sm text-emerald-800">
              ¡Tu iniciativa está publicada! Ya aparece en la lista.
            </div>
          )}
          <button onClick={() => setShowForm(true)} className="btn-secondary text-sm">
            + Publicar una iniciativa
          </button>
        </div>
      )}

      {/* Post form */}
      {showPostForm && (
        <form onSubmit={(e) => void handlePost(e)} className="card mb-6">
          <h3 className="text-base font-black text-slate-900 mb-4">Publicar iniciativa</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="label">Nombre de la iniciativa</label>
              <input required className="input" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} placeholder="p.ej. Recogida de medicamentos en Sabadell" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Descripción — qué necesitáis y cómo puede ayudar un voluntario</label>
              <textarea required rows={3} className="input resize-none" value={postForm.description} onChange={(e) => setPostForm({ ...postForm, description: e.target.value })} />
            </div>
            <div>
              <label className="label">Ubicación</label>
              <input required className="input" value={postForm.location} onChange={(e) => setPostForm({ ...postForm, location: e.target.value })} placeholder="Barcelona / Online / Venezuela" />
            </div>
            <div>
              <label className="label">Categoría</label>
              <select required className="input" value={postForm.category} onChange={(e) => setPostForm({ ...postForm, category: e.target.value as InitiativeCategory })}>
                {categories.map(([val, meta]) => (
                  <option key={val} value={val}>{meta.emoji} {meta.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Tu nombre / nombre de la organización</label>
              <input required className="input" value={postForm.coordinator_name} onChange={(e) => setPostForm({ ...postForm, coordinator_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Contacto (WhatsApp, email, web)</label>
              <input required className="input" value={postForm.coordinator_contact} onChange={(e) => setPostForm({ ...postForm, coordinator_contact: e.target.value })} placeholder="+34 600... / tu@email.com" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3 pt-1">
              <input
                id="init_onsite"
                type="checkbox"
                checked={postForm.is_onsite}
                onChange={(e) => setPostForm({ ...postForm, is_onsite: e.target.checked })}
                className="w-4 h-4 accent-red-600"
              />
              <label htmlFor="init_onsite" className="text-sm text-slate-700">
                🚶 Esta iniciativa requiere presencia física (ir en persona)
              </label>
            </div>

            {/* Initial needs / resources */}
            <div className="sm:col-span-2">
              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm font-bold text-slate-900 mb-0.5">Recursos y materiales necesarios</p>
                <p className="text-xs text-slate-400 mb-3">Opcional. Aparecerán resaltados en la tarjeta para que los voluntarios sepan qué traer o qué se necesita.</p>
                <div className="space-y-2 mb-3">
                  {initialNeeds.map((need, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <input
                        className="input text-xs flex-1"
                        placeholder="Ej: 50 mantas, voluntarios nocturnos, medicamentos..."
                        value={need.needs_description}
                        onChange={(e) => {
                          const updated = [...initialNeeds]
                          updated[i] = { ...updated[i], needs_description: e.target.value }
                          setInitialNeeds(updated)
                        }}
                      />
                      <select
                        className="input text-xs w-28 shrink-0"
                        value={need.urgency_level}
                        onChange={(e) => {
                          const updated = [...initialNeeds]
                          updated[i] = { ...updated[i], urgency_level: e.target.value as UrgencyLevel }
                          setInitialNeeds(updated)
                        }}
                      >
                        {URGENCY_LEVELS.map((lvl) => (
                          <option key={lvl} value={lvl}>{URGENCY_CONFIG[lvl].label}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setInitialNeeds(initialNeeds.filter((_, j) => j !== i))}
                        className="text-slate-300 hover:text-red-500 text-xl leading-none px-1 shrink-0"
                        aria-label="Eliminar"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setInitialNeeds([...initialNeeds, { needs_description: '', urgency_level: 'medium' }])}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold"
                >
                  + Añadir recurso o necesidad
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-4">El contacto solo se muestra a quien haga clic en Participar e introduzca su nombre.</p>
          {postError && <p className="text-red-600 text-xs mb-3">{postError}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancelar</button>
            <button type="submit" disabled={posting} className="btn-primary flex-1 text-sm disabled:opacity-40">
              {posting ? 'Enviando...' : 'Enviar iniciativa'}
            </button>
          </div>
        </form>
      )}

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setActive('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCategory === 'all' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
        >
          🌐 Todas
        </button>
        {categories.map(([val, meta]) => (
          <button
            key={val}
            onClick={() => setActive(val)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCategory === val ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
          >
            {meta.emoji} {meta.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm py-8 text-center">Cargando iniciativas...</p>
      ) : initiatives.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-400 mb-3">No hay iniciativas en esta categoría.</p>
          <button onClick={() => setShowForm(true)} className="btn-secondary text-sm">Sé el primero en publicar</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {initiatives.map((initiative) => {
            const catMeta = INITIATIVE_CATEGORY_LABELS[initiative.category]
            return (
              <div key={initiative.id} className="card flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                    {catMeta.emoji} {catMeta.label}
                  </span>
                  {initiative.spots_available != null && (
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      {initiative.spots_available} plazas
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">{initiative.title}</h3>
                <p className="text-xs text-slate-500 mb-2">
                  📍 {initiative.location} · {initiative.coordinator_name}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-3 flex-1">{initiative.description}</p>
                {initiative.needed_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {initiative.needed_skills.map((s) => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                )}
                <ParticiparButton initiative={initiative} />
                <NeedsPanel initiativeId={initiative.id} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Skills tab ────────────────────────────────────────────────────────────────

function SkillsTab() {
  const [offers, setOffers]         = useState<SkillOffer[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeCategory, setActive] = useState<SkillCategory | 'all'>('all')
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(INITIAL_SKILL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState('')

  const fetchOffers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeCategory !== 'all') params.set('category', activeCategory)
    const res = await fetch(`/api/skill-offers?${params.toString()}`)
    const json = await res.json() as { data: SkillOffer[] }
    setOffers(json.data ?? [])
    setLoading(false)
  }, [activeCategory])

  useEffect(() => { void fetchOffers() }, [fetchOffers])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/skill-offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json() as { error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Error al enviar')
      setSuccess(true)
      setForm(INITIAL_SKILL_FORM)
      setShowForm(false)
      void fetchOffers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <p className="text-slate-600 mb-5">
        Publica tu habilidad y las organizaciones te contactarán directamente.
        Traductores, médicos, psicólogos, informáticos, conductores — todos sois necesarios.
      </p>

      {/* Translator highlight */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
        <span className="text-xl shrink-0">🗣</span>
        <div>
          <p className="font-bold text-blue-900 text-sm mb-0.5">¿Hablas inglés y español?</p>
          <p className="text-xs text-blue-800 mb-1">Voluntarios extranjeros necesitan traducción en tiempo real.</p>
          <a href="https://www.interp-aid.lovable.app" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 font-semibold underline">
            interp-aid.lovable.app →
          </a>
        </div>
      </div>

      {/* CTA */}
      {!showForm && (
        <div className="mb-6">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-3 text-sm text-emerald-800">
              ¡Oferta publicada! Gracias por ofrecerte.
            </div>
          )}
          <button onClick={() => setShowForm(true)} className="btn-primary">+ Publicar mi habilidad</button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={(e) => void handleSubmit(e)} className="card mb-6">
          <h3 className="text-base font-black text-slate-900 mb-4">Tu oferta de voluntariado</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label" htmlFor="sk_name">Nombre completo</label>
              <input id="sk_name" required className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="sk_cat">Categoría</label>
              <select id="sk_cat" className="input" value={form.skill_category} onChange={(e) => setForm({ ...form, skill_category: e.target.value as SkillCategory })}>
                {SKILL_CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="sk_desc">¿Cómo puedes ayudar?</label>
              <textarea id="sk_desc" required rows={3} className="input resize-none" value={form.skill_description} onChange={(e) => setForm({ ...form, skill_description: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="sk_avail">Disponibilidad</label>
              <select id="sk_avail" className="input" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value as SkillAvailability })}>
                <option value="remote">Online / Remoto</option>
                <option value="local">Presencial</option>
                <option value="both">Ambos</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="sk_loc">Ubicación (opcional)</label>
              <input id="sk_loc" className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ciudad, país" />
            </div>
            <div>
              <label className="label" htmlFor="sk_cmethod">Forma de contacto</label>
              <select id="sk_cmethod" className="input" value={form.contact_method} onChange={(e) => setForm({ ...form, contact_method: e.target.value })}>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="phone">Teléfono</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="sk_cval">
                {form.contact_method === 'email' ? 'Email' : form.contact_method === 'whatsapp' ? 'Número WhatsApp' : 'Teléfono'}
              </label>
              <input id="sk_cval" required type={form.contact_method === 'email' ? 'email' : 'tel'} className="input" value={form.contact_value} onChange={(e) => setForm({ ...form, contact_value: e.target.value })} placeholder={form.contact_method === 'email' ? 'tu@email.com' : '+34 600 000 000'} />
            </div>
          </div>
          {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancelar</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 text-sm disabled:opacity-40">
              {submitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {SKILL_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setActive(c.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCategory === c.value ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm py-8 text-center">Cargando...</p>
      ) : offers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-400 mb-3">Nadie ha publicado su habilidad en esta categoría aún.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm">Sé el primero</button>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-4">{offers.length} voluntario{offers.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offers.map((offer) => {
              const cat = SKILL_CATEGORIES.find((c) => c.value === offer.skill_category)
              return (
                <div key={offer.id} className="card">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{offer.full_name}</p>
                      <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full mt-1">
                        {cat?.emoji} {cat?.label ?? offer.skill_category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{AVAILABILITY_LABELS[offer.availability]}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{offer.skill_description}</p>
                  {offer.location && <p className="text-xs text-slate-400 mb-2">📍 {offer.location}</p>}
                  <p className="text-xs text-slate-400 italic">Contacto disponible para coordinadores registrados</p>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ── Onsite volunteers tab ─────────────────────────────────────────────────────

const INITIAL_ONSITE = {
  full_name: '', origin_location: '', available_from: '', skills: '',
  has_vehicle: false, contact: '', group_affiliation: '', acknowledged_safety: false,
}

function OnsiteTab() {
  const [volunteers, setVolunteers]         = useState<OnsiteVolunteer[]>([])
  const [onsiteInitiatives, setOnsiteInit]  = useState<VolunteerInitiative[]>([])
  const [loading, setLoading]               = useState(true)
  const [showForm, setShowForm]             = useState(false)
  const [form, setForm]                     = useState(INITIAL_ONSITE)
  const [submitting, setSubmitting]         = useState(false)
  const [success, setSuccess]               = useState(false)
  const [error, setError]                   = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/onsite-volunteers').then((r) => r.json() as Promise<{ data: OnsiteVolunteer[] }>),
      fetch('/api/initiatives?onsite=true').then((r) => r.json() as Promise<{ data: VolunteerInitiative[] }>),
    ])
      .then(([ovJson, initJson]) => {
        setVolunteers(ovJson.data ?? [])
        setOnsiteInit(initJson.data ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.acknowledged_safety) { setError('Debes confirmar que leerás las instrucciones de seguridad.'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/onsite-volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Error')
      setSuccess(true)
      setShowForm(false)
      void fetch('/api/onsite-volunteers')
        .then((r) => r.json())
        .then((j: { data: OnsiteVolunteer[] }) => setVolunteers(j.data ?? []))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarte')
    } finally {
      setSubmitting(false)
    }
  }

  const withVehicle = volunteers.filter((v) => v.has_vehicle).length

  return (
    <div>
      {/* Safety warning — prominent, non-skippable visually */}
      <div className="bg-red-900 text-white rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl shrink-0">⚠️</span>
          <div>
            <p className="font-black text-lg mb-1">NO vayas solo ni sin coordinación previa</p>
            <p className="text-red-200 text-sm leading-relaxed">
              Acudir de forma individual e improvisada puede colapsar las rutas de acceso a los
              equipos de rescate y ponerte en peligro a ti mismo. Lee estas instrucciones antes de registrarte:
            </p>
          </div>
        </div>
        <ul className="text-sm text-red-100 space-y-1.5 mb-4 ml-9 list-disc">
          <li>Únete a un grupo organizado — UCV, Cruz Roja, Acción Directa o una agrupación de activistas con experiencia.</li>
          <li>Coordina con los grupos antes de desplazarte. Pregunta qué necesitan exactamente y cuándo.</li>
          <li>No dupliques esfuerzos: llama primero para saber si ya tienen suficientes voluntarios.</li>
          <li>Lleva agua, comida, linterna y cargador portátil. No cuentes con encontrar nada allí.</li>
          <li>Informa siempre a alguien de confianza dónde vas y cuándo volverás.</li>
        </ul>
        <div className="flex flex-wrap gap-2 ml-9">
          <a href="https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-semibold transition-colors">
            WhatsApp Acción Directa →
          </a>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-red-600">{volunteers.length}</p>
            <p className="text-xs text-slate-500 mt-1">Voluntarios registrados</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-slate-900">{withVehicle}</p>
            <p className="text-xs text-slate-500 mt-1">Con vehículo propio</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-3xl font-black text-blue-700">
              {volunteers.filter((v) => v.group_affiliation).length}
            </p>
            <p className="text-xs text-slate-500 mt-1">Con grupo coordinado</p>
          </div>
        </div>
      )}

      {/* Register CTA */}
      {!showForm && (
        <div className="mb-6">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-3 text-sm text-emerald-800">
              ¡Registrado! El equipo coordinador puede contactarte si se necesita alguien con tu perfil.
            </div>
          )}
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Registrarme como voluntario presencial
          </button>
        </div>
      )}

      {/* Registration form */}
      {showForm && (
        <form onSubmit={(e) => void handleSubmit(e)} className="card mb-6">
          <h3 className="text-base font-black text-slate-900 mb-4">Tu registro</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label" htmlFor="ov_name">Nombre completo</label>
              <input id="ov_name" required className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="ov_origin">¿Desde dónde te desplazas?</label>
              <input id="ov_origin" required className="input" value={form.origin_location} onChange={(e) => setForm({ ...form, origin_location: e.target.value })} placeholder="Caracas / Barcelona / Madrid..." />
            </div>
            <div>
              <label className="label" htmlFor="ov_date">Disponible a partir de</label>
              <input id="ov_date" type="date" required className="input" value={form.available_from} onChange={(e) => setForm({ ...form, available_from: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="ov_contact">WhatsApp o email</label>
              <input id="ov_contact" required className="input" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="+34 600..." />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="ov_skills">¿Qué puedes hacer? Habilidades / experiencia</label>
              <textarea id="ov_skills" required rows={2} className="input resize-none" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Médico, conductor 4x4, albañil, psicólogo, cocinero..." />
            </div>
            <div>
              <label className="label" htmlFor="ov_group">Grupo / organización (si tienes)</label>
              <input id="ov_group" className="input" value={form.group_affiliation} onChange={(e) => setForm({ ...form, group_affiliation: e.target.value })} placeholder="UCV, Cruz Roja, ninguno..." />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input
                id="ov_vehicle"
                type="checkbox"
                checked={form.has_vehicle}
                onChange={(e) => setForm({ ...form, has_vehicle: e.target.checked })}
                className="w-4 h-4 accent-red-600"
              />
              <label htmlFor="ov_vehicle" className="text-sm text-slate-700">Tengo vehículo propio</label>
            </div>
          </div>

          {/* Safety acknowledgement — required */}
          <div className={`rounded-xl border-2 p-4 mb-4 transition-colors ${form.acknowledged_safety ? 'border-emerald-400 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.acknowledged_safety}
                onChange={(e) => setForm({ ...form, acknowledged_safety: e.target.checked })}
                className="w-4 h-4 accent-red-600 mt-0.5 shrink-0"
              />
              <span className="text-sm text-slate-800 leading-relaxed">
                <strong>He leído las instrucciones de seguridad.</strong> Entiendo que NO debo desplazarme solo ni sin coordinar previamente con un grupo organizado. Me comprometo a coordinar con otros voluntarios antes de acudir a la zona afectada.
              </span>
            </label>
          </div>

          {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancelar</button>
            <button type="submit" disabled={submitting || !form.acknowledged_safety} className="btn-primary flex-1 text-sm disabled:opacity-40">
              {submitting ? 'Registrando...' : 'Confirmar registro'}
            </button>
          </div>
        </form>
      )}

      {/* In-person initiatives needing volunteers */}
      {!loading && onsiteInitiatives.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-700 mb-3">Iniciativas que buscan voluntarios presenciales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {onsiteInitiatives.map((initiative) => {
              const catMeta = INITIATIVE_CATEGORY_LABELS[initiative.category]
              return (
                <div key={initiative.id} className="card flex flex-col">
                  <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full mb-2 w-fit">
                    {catMeta.emoji} {catMeta.label}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{initiative.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">📍 {initiative.location} · {initiative.coordinator_name}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3 flex-1">{initiative.description}</p>
                  <ParticiparButton initiative={initiative} />
                  <NeedsPanel initiativeId={initiative.id} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Volunteer list */}
      {loading ? (
        <p className="text-slate-400 text-sm py-6 text-center">Cargando...</p>
      ) : volunteers.length === 0 ? (
        <p className="text-slate-400 text-sm py-6 text-center">Sé el primero en registrarte.</p>
      ) : (
        <>
          <h3 className="text-sm font-bold text-slate-700 mb-3">Voluntarios registrados</h3>
          <div className="space-y-2">
            {volunteers.map((v) => (
              <div key={v.id} className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-700 shrink-0">
                  {v.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{v.full_name}</p>
                  <p className="text-xs text-slate-500">
                    📍 {v.origin_location}
                    {v.has_vehicle ? ' · 🚗 Con vehículo' : ''}
                    {v.group_affiliation ? ` · ${v.group_affiliation}` : ''}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">{v.skills}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                  Desde {new Date(v.available_from).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = 'iniciativas' | 'habilidades' | 'presencial'

export default function VoluntariosPage() {
  const [tab, setTab] = useState<Tab>('iniciativas')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Voluntarios</h1>
        <p className="text-slate-500">Conecta con iniciativas activas, publica tu habilidad, o regístrate para ir en persona.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-100 rounded-xl p-1 mb-8 w-fit">
        <button
          onClick={() => setTab('iniciativas')}
          className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${tab === 'iniciativas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          📋 Iniciativas activas
        </button>
        <button
          onClick={() => setTab('presencial')}
          className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${tab === 'presencial' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🚶 Ir en persona
        </button>
        <button
          onClick={() => setTab('habilidades')}
          className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${tab === 'habilidades' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🙋 Ofrece tu habilidad
        </button>
      </div>

      {tab === 'iniciativas' && <InitiativesTab />}
      {tab === 'presencial' && <OnsiteTab />}
      {tab === 'habilidades' && <SkillsTab />}
    </div>
  )
}
