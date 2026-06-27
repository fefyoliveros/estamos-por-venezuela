'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SkillOffer, SkillCategory, SkillAvailability } from '@/types/database'

const CATEGORIES: { value: SkillCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'Todos', emoji: '🌐' },
  { value: 'translator', label: 'Traducción', emoji: '🗣' },
  { value: 'medical', label: 'Médico / Sanitario', emoji: '🏥' },
  { value: 'psychological', label: 'Psicológico', emoji: '🧠' },
  { value: 'legal', label: 'Legal / Abogado', emoji: '⚖️' },
  { value: 'it', label: 'Informática / Tecnología', emoji: '💻' },
  { value: 'design', label: 'Diseño / Comunicación', emoji: '🎨' },
  { value: 'pr', label: 'Relaciones Públicas', emoji: '📢' },
  { value: 'logistics', label: 'Logística / Transporte', emoji: '🚛' },
  { value: 'construction', label: 'Construcción / Obras', emoji: '🔨' },
  { value: 'other', label: 'Otro', emoji: '🙌' },
]

const AVAILABILITY_LABELS: Record<SkillAvailability, string> = {
  remote: 'Online / Remoto',
  local: 'Presencial',
  both: 'Remoto o presencial',
}

const CONTACT_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  phone: 'Teléfono',
}

const INITIAL_FORM = {
  full_name: '',
  skill_category: 'translator' as SkillCategory,
  skill_description: '',
  availability: 'remote' as SkillAvailability,
  location: '',
  contact_method: 'whatsapp',
  contact_value: '',
}

export default function VoluntariosPage() {
  const [offers, setOffers] = useState<SkillOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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
      setForm(INITIAL_FORM)
      setShowForm(false)
      void fetchOffers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Ofrece tu habilidad</h1>
        <p className="text-slate-600 text-lg">
          Traductores inglés-español, médicos online, psicólogos, diseñadores, programadores, cerrajeros,
          carpinteros — todos sois necesarios. Publica tu habilidad y conecta con quien te necesita.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { step: '1', icon: '📋', text: 'Publica tu habilidad y cómo contactarte' },
          { step: '2', icon: '🤝', text: 'Las organizaciones te contactan directamente' },
          { step: '3', icon: '🌍', text: 'Ayudas desde donde estás — online o presencial' },
        ].map((s) => (
          <div key={s.step} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
            <div className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{s.step}</div>
            <p className="text-sm text-slate-700">{s.text}</p>
          </div>
        ))}
      </div>

      {/* Online translator highlight */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-8 flex items-start gap-3">
        <span className="text-2xl shrink-0">🗣</span>
        <div>
          <p className="font-bold text-blue-900 text-sm mb-1">¿Hablas inglés y español?</p>
          <p className="text-sm text-blue-800 mb-2">
            Hay voluntarios extranjeros que necesitan traducción en tiempo real.
            Plataforma específica para traductores:
          </p>
          <a
            href="https://www.interp-aid.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-700 underline font-semibold"
          >
            interp-aid.lovable.app →
          </a>
        </div>
      </div>

      {/* Offer CTA */}
      {!showForm && (
        <div className="mb-8">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4 text-sm text-emerald-800 font-medium">
              Tu oferta ha sido publicada correctamente. ¡Gracias!
            </div>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            + Publicar mi habilidad
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={(e) => void handleSubmit(e)} className="card mb-8">
          <h2 className="text-lg font-black text-slate-900 mb-4">Tu oferta de voluntariado</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label" htmlFor="full_name">Nombre completo</label>
              <input
                id="full_name"
                type="text"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="input"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="label" htmlFor="skill_category">Categoría</label>
              <select
                id="skill_category"
                required
                value={form.skill_category}
                onChange={(e) => setForm({ ...form, skill_category: e.target.value as SkillCategory })}
                className="input"
              >
                {CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="label" htmlFor="skill_description">¿Cómo puedes ayudar? (descripción)</label>
            <textarea
              id="skill_description"
              required
              value={form.skill_description}
              onChange={(e) => setForm({ ...form, skill_description: e.target.value })}
              className="input h-24 resize-none"
              placeholder="Describe tu habilidad y cómo puedes contribuir..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label" htmlFor="availability">Disponibilidad</label>
              <select
                id="availability"
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value as SkillAvailability })}
                className="input"
              >
                <option value="remote">Online / Remoto</option>
                <option value="local">Presencial</option>
                <option value="both">Remoto o presencial</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="location">Ubicación (opcional)</label>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input"
                placeholder="Ciudad, país"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label" htmlFor="contact_method">Forma de contacto</label>
              <select
                id="contact_method"
                value={form.contact_method}
                onChange={(e) => setForm({ ...form, contact_method: e.target.value })}
                className="input"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="phone">Teléfono</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="contact_value">
                {form.contact_method === 'email' ? 'Email' : form.contact_method === 'whatsapp' ? 'Número WhatsApp' : 'Teléfono'}
              </label>
              <input
                id="contact_value"
                type={form.contact_method === 'email' ? 'email' : 'tel'}
                required
                value={form.contact_value}
                onChange={(e) => setForm({ ...form, contact_value: e.target.value })}
                className="input"
                placeholder={form.contact_method === 'email' ? 'tu@email.com' : '+34 600 000 000'}
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary flex-1 text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 text-sm disabled:opacity-40"
            >
              {submitting ? 'Publicando...' : 'Publicar mi habilidad'}
            </button>
          </div>
        </form>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filtrar por categoría">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setActiveCategory(c.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeCategory === c.value
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Offers list */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Cargando voluntarios...</div>
      ) : offers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">No hay voluntarios publicados en esta categoría aún.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
            Sé el primero en publicar tu habilidad
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">{offers.length} voluntario{offers.length !== 1 ? 's' : ''} disponible{offers.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offers.map((offer) => {
              const cat = CATEGORIES.find((c) => c.value === offer.skill_category)
              return (
                <div key={offer.id} className="card">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{offer.full_name}</p>
                      <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full mt-1">
                        {cat?.emoji} {cat?.label ?? offer.skill_category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 mt-0.5">
                      {AVAILABILITY_LABELS[offer.availability]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{offer.skill_description}</p>
                  {offer.location && (
                    <p className="text-xs text-slate-400 mb-2">📍 {offer.location}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      Contacto vía {CONTACT_LABELS[offer.contact_method] ?? offer.contact_method}:
                    </span>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded select-all">
                      {offer.contact_value}
                    </span>
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
