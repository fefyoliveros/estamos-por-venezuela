'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SkillOffer, SkillCategory, SkillAvailability, VolunteerInitiative, InitiativeCategory } from '@/types/database'

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

const INITIAL_SKILL_FORM = {
  full_name: '',
  skill_category: 'translator' as SkillCategory,
  skill_description: '',
  availability: 'remote' as SkillAvailability,
  location: '',
  contact_method: 'whatsapp',
  contact_value: '',
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
  })
  const [posting, setPosting]         = useState(false)
  const [postError, setPostError]     = useState('')

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
      const json = await res.json() as { error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Error')
      setPostSuccess(true)
      setShowForm(false)
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
              Tu iniciativa ha sido enviada. La revisaremos y la publicaremos en breve.
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500">Contacto vía {offer.contact_method}:</span>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded select-all">{offer.contact_value}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = 'iniciativas' | 'habilidades'

export default function VoluntariosPage() {
  const [tab, setTab] = useState<Tab>('iniciativas')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Voluntarios</h1>
        <p className="text-slate-500">Conecta con iniciativas activas o publica tu habilidad.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-8 w-fit">
        <button
          onClick={() => setTab('iniciativas')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${tab === 'iniciativas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          📋 Iniciativas activas
        </button>
        <button
          onClick={() => setTab('habilidades')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${tab === 'habilidades' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🙋 Ofrece tu habilidad
        </button>
      </div>

      {tab === 'iniciativas' ? <InitiativesTab /> : <SkillsTab />}
    </div>
  )
}
