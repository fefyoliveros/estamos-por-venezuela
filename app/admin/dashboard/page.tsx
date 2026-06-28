'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { useTranslation } from '@/lib/i18n/context'
import type { Submission, HelpRequest, SkillOffer, OnsiteVolunteer, VolunteerInitiative } from '@/types/database'

type Tab = 'submissions' | 'help' | 'volunteers' | 'initiatives'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  return `hace ${Math.floor(hours / 24)}d`
}

// Admin-extended types that include fields excluded from public API
interface AdminOnsiteVolunteer extends OnsiteVolunteer {
  contact?: string
  active?: boolean
}

interface AdminInitiative extends VolunteerInitiative {
  coordinator_contact?: string
  active?: boolean
}

export default function AdminDashboardPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('submissions')

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([])
  const [skillOffers, setSkillOffers] = useState<SkillOffer[]>([])
  const [onsiteVolunteers, setOnsiteVolunteers] = useState<AdminOnsiteVolunteer[]>([])
  const [initiatives, setInitiatives] = useState<AdminInitiative[]>([])

  const [loadingSubmissions, setLoadingSubmissions] = useState(true)
  const [loadingHelp, setLoadingHelp] = useState(true)
  const [loadingVolunteers, setLoadingVolunteers] = useState(true)
  const [loadingInitiatives, setLoadingInitiatives] = useState(true)

  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [verifyLoading, setVerifyLoading] = useState<string | null>(null)

  const loadSubmissions = useCallback(async () => {
    setLoadingSubmissions(true)
    const res = await fetch('/api/admin/submissions')
    if (res.status === 401) { router.push('/admin/login'); return }
    const json = await res.json() as { data: Submission[] }
    setSubmissions(json.data ?? [])
    setLoadingSubmissions(false)
  }, [router])

  const loadHelp = useCallback(async () => {
    setLoadingHelp(true)
    const res = await fetch('/api/admin/help-requests')
    if (res.status === 401) { router.push('/admin/login'); return }
    const json = await res.json() as { data: HelpRequest[] }
    setHelpRequests(json.data ?? [])
    setLoadingHelp(false)
  }, [router])

  const loadVolunteers = useCallback(async () => {
    setLoadingVolunteers(true)
    const res = await fetch('/api/admin/volunteers')
    if (res.status === 401) { router.push('/admin/login'); return }
    const json = await res.json() as { skill_offers: SkillOffer[]; onsite_volunteers: AdminOnsiteVolunteer[] }
    setSkillOffers(json.skill_offers ?? [])
    setOnsiteVolunteers(json.onsite_volunteers ?? [])
    setLoadingVolunteers(false)
  }, [router])

  const loadInitiatives = useCallback(async () => {
    setLoadingInitiatives(true)
    const res = await fetch('/api/admin/initiatives')
    if (res.status === 401) { router.push('/admin/login'); return }
    const json = await res.json() as { data: AdminInitiative[] }
    setInitiatives(json.data ?? [])
    setLoadingInitiatives(false)
  }, [router])

  useEffect(() => { loadSubmissions() }, [loadSubmissions])
  useEffect(() => { loadHelp() }, [loadHelp])
  useEffect(() => { loadVolunteers() }, [loadVolunteers])
  useEffect(() => { loadInitiatives() }, [loadInitiatives])

  // ── Submissions ───────────────────────────────────────────────────────────
  async function handleSubmissionAction(id: string, action: 'approve' | 'reject') {
    setActionLoading(id)
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    setSubmissions((prev) => prev.filter((s) => s.id !== id))
    setActionLoading(null)
  }

  async function handleVerify(id: string) {
    setVerifyLoading(id)
    const res = await fetch('/api/ai/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission_id: id }),
    })
    const json = await res.json() as { ai_verified: boolean; ai_notes: string }
    setSubmissions((prev) =>
      prev.map((s) => s.id === id ? { ...s, ai_verified: json.ai_verified, ai_notes: json.ai_notes } : s)
    )
    setVerifyLoading(null)
  }

  // ── Help requests ─────────────────────────────────────────────────────────
  async function handleHelpAction(id: string, action: 'resolve' | 'reactivate') {
    setActionLoading(id)
    await fetch('/api/admin/help-requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    const newStatus = action === 'reactivate' ? 'active' : 'resolved'
    setHelpRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: newStatus } : r)
    )
    setActionLoading(null)
  }

  // ── Volunteers ────────────────────────────────────────────────────────────
  async function handleVolunteerAction(id: string, table: 'skill_offers' | 'onsite_volunteers', action: 'deactivate' | 'reactivate') {
    setActionLoading(id)
    await fetch('/api/admin/volunteers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, table, action }),
    })
    if (table === 'skill_offers') {
      setSkillOffers((prev) => prev.map((s) => s.id === id ? { ...s, active: action === 'reactivate' } : s))
    } else {
      setOnsiteVolunteers((prev) => prev.map((v) => v.id === id ? { ...v, active: action === 'reactivate' } : v))
    }
    setActionLoading(null)
  }

  // ── Initiatives ───────────────────────────────────────────────────────────
  async function handleInitiativeAction(id: string, action: 'delete' | 'deactivate' | 'reactivate') {
    setActionLoading(id)
    await fetch('/api/admin/initiatives', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    if (action === 'delete') {
      setInitiatives((prev) => prev.filter((i) => i.id !== id))
    } else {
      setInitiatives((prev) =>
        prev.map((i) => i.id === id ? { ...i, active: action === 'reactivate' } : i)
      )
    }
    setActionLoading(null)
  }

  async function handleLogout() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // ── Counts for badges ─────────────────────────────────────────────────────
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending').length
  const activeHelpCount = helpRequests.filter((r) => r.status === 'active').length
  const totalVolunteers = skillOffers.length + onsiteVolunteers.length

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: 'submissions', label: t('admin.tabs.submissions'), badge: pendingSubmissions },
    { key: 'help', label: t('admin.tabs.help'), badge: activeHelpCount },
    { key: 'volunteers', label: 'Voluntarios', badge: totalVolunteers > 0 ? totalVolunteers : undefined },
    { key: 'initiatives', label: 'Iniciativas', badge: initiatives.length > 0 ? initiatives.length : undefined },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-slate-900">{t('admin.dashboard.title')}</h1>
        <button onClick={handleLogout} className="btn-secondary text-sm">
          {t('admin.logout')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-slate-200">
        {tabs.map(({ key, label, badge }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              tab === key
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
            {badge !== undefined && badge > 0 && (
              <span className="ml-2 bg-red-100 text-red-700 text-xs rounded-full px-2 py-0.5">{badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── SUBMISSIONS ──────────────────────────────────────────────────────── */}
      {tab === 'submissions' && (
        <div>
          {loadingSubmissions ? (
            <p className="text-slate-400">{t('common.loading')}</p>
          ) : submissions.length === 0 ? (
            <div className="card text-center py-12 text-slate-400">
              <p>{t('admin.submissions.empty')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <article key={sub.id} className="card border border-slate-200">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge">{sub.type}</span>
                        {sub.ai_verified === true && (
                          <span className="badge bg-emerald-100 text-emerald-700">✓ AI verificado</span>
                        )}
                        {sub.ai_verified === false && (
                          <span className="badge bg-red-100 text-red-700">✗ No verificado</span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900">{sub.name}</h3>
                      <p className="text-sm text-slate-500">{sub.submitter_email} · {timeAgo(sub.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-3">
                    {sub.url && (
                      <a href={sub.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        🌐 {sub.url}
                      </a>
                    )}
                    {sub.instagram && (
                      <a href={`https://instagram.com/${sub.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
                        📸 {sub.instagram}
                      </a>
                    )}
                    {sub.city && <span>📍 {sub.city}{sub.country ? `, ${sub.country}` : ''}</span>}
                  </div>

                  {sub.description && (
                    <p className="text-sm text-slate-600 mb-3 bg-slate-50 rounded-lg p-3">{sub.description}</p>
                  )}

                  {sub.ai_notes && (
                    <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3 mb-3">🤖 {sub.ai_notes}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSubmissionAction(sub.id, 'approve')}
                      disabled={actionLoading === sub.id}
                      className="btn-primary text-sm py-2 px-4 disabled:opacity-40"
                    >
                      {t('admin.submissions.approve')}
                    </button>
                    <button
                      onClick={() => handleSubmissionAction(sub.id, 'reject')}
                      disabled={actionLoading === sub.id}
                      className="btn-secondary text-sm py-2 px-4 disabled:opacity-40"
                    >
                      {t('admin.submissions.reject')}
                    </button>
                    {sub.ai_verified === null && (
                      <button
                        onClick={() => handleVerify(sub.id)}
                        disabled={verifyLoading === sub.id}
                        className="text-sm px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-40"
                      >
                        {verifyLoading === sub.id ? '...' : '🤖 Verificar con AI'}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── HELP REQUESTS ────────────────────────────────────────────────────── */}
      {tab === 'help' && (
        <div>
          {loadingHelp ? (
            <p className="text-slate-400">{t('common.loading')}</p>
          ) : helpRequests.length === 0 ? (
            <div className="card text-center py-12 text-slate-400">
              <p>{t('admin.help.empty')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {helpRequests.map((req) => (
                <article
                  key={req.id}
                  className={`card border ${req.needs.includes('trapped') ? 'border-red-300 bg-red-50' : 'border-slate-200'} ${req.status === 'resolved' ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {req.needs.includes('trapped') && (
                          <span className="badge bg-red-600 text-white">🆘 ATRAPADO</span>
                        )}
                        <span className={`badge ${req.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900">{req.full_name}</p>
                      <p className="text-sm text-slate-500">📍 {req.location} · {timeAgo(req.created_at)}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {req.needs.filter((n) => n !== 'trapped').map((n) => (
                          <span key={n} className="badge">{n}</span>
                        ))}
                      </div>
                      {req.details && (
                        <p className="text-sm text-slate-600 mt-2">{req.details}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {req.status === 'active' && (
                        <button
                          onClick={() => handleHelpAction(req.id, 'resolve')}
                          disabled={actionLoading === req.id}
                          className="btn-secondary text-sm py-2 px-3 whitespace-nowrap disabled:opacity-40"
                        >
                          {t('admin.help.resolve')}
                        </button>
                      )}
                      {req.status === 'resolved' && (
                        <button
                          onClick={() => handleHelpAction(req.id, 'reactivate')}
                          disabled={actionLoading === req.id}
                          className="text-sm px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-40 whitespace-nowrap"
                        >
                          ↩ Reactivar
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── VOLUNTEERS ───────────────────────────────────────────────────────── */}
      {tab === 'volunteers' && (
        <div className="space-y-8">
          {loadingVolunteers ? (
            <p className="text-slate-400">{t('common.loading')}</p>
          ) : (
            <>
              {/* Skill offers */}
              <section>
                <h2 className="font-bold text-slate-700 text-sm uppercase tracking-widest mb-3">
                  Ofertas de habilidades ({skillOffers.length})
                </h2>
                {skillOffers.length === 0 ? (
                  <p className="text-slate-400 text-sm">Sin ofertas todavía.</p>
                ) : (
                  <div className="space-y-3">
                    {skillOffers.map((offer) => (
                      <article key={offer.id} className={`card border border-slate-200 ${!offer.active ? 'opacity-50' : ''}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="badge bg-teal-100 text-teal-700">{offer.skill_category}</span>
                              <span className="badge bg-slate-100 text-slate-600">{offer.availability}</span>
                              {!offer.active && <span className="badge bg-slate-200 text-slate-500">inactivo</span>}
                            </div>
                            <p className="font-semibold text-slate-900">{offer.full_name}</p>
                            {offer.location && <p className="text-xs text-slate-500">📍 {offer.location}</p>}
                            <p className="text-sm text-slate-600 mt-1">{offer.skill_description}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {offer.contact_method}: <span className="font-medium text-slate-600">{offer.contact_value}</span>
                              {' · '}{timeAgo(offer.created_at)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleVolunteerAction(offer.id, 'skill_offers', offer.active ? 'deactivate' : 'reactivate')}
                            disabled={actionLoading === offer.id}
                            className={`text-sm px-3 py-2 rounded-lg border transition-colors disabled:opacity-40 whitespace-nowrap ${
                              offer.active
                                ? 'border-slate-300 text-slate-600 hover:bg-slate-50'
                                : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {offer.active ? 'Desactivar' : '↩ Activar'}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {/* Onsite volunteers */}
              <section>
                <h2 className="font-bold text-slate-700 text-sm uppercase tracking-widest mb-3">
                  Voluntarios presenciales ({onsiteVolunteers.length})
                </h2>
                {onsiteVolunteers.length === 0 ? (
                  <p className="text-slate-400 text-sm">Sin registros todavía.</p>
                ) : (
                  <div className="space-y-3">
                    {onsiteVolunteers.map((v) => (
                      <article key={v.id} className={`card border border-slate-200 ${!v.active ? 'opacity-50' : ''}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {v.has_vehicle && <span className="badge bg-blue-100 text-blue-700">🚗 Con vehículo</span>}
                              {!v.active && <span className="badge bg-slate-200 text-slate-500">inactivo</span>}
                            </div>
                            <p className="font-semibold text-slate-900">{v.full_name}</p>
                            <p className="text-xs text-slate-500">
                              📍 {v.origin_location} · Disponible desde: {v.available_from}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">{v.skills}</p>
                            {v.group_affiliation && (
                              <p className="text-xs text-slate-500 mt-1">Grupo: {v.group_affiliation}</p>
                            )}
                            {v.contact && (
                              <p className="text-xs text-emerald-700 font-medium mt-1">📞 {v.contact}</p>
                            )}
                            <p className="text-xs text-slate-400 mt-1">{timeAgo(v.created_at)}</p>
                          </div>
                          <button
                            onClick={() => handleVolunteerAction(v.id, 'onsite_volunteers', v.active ? 'deactivate' : 'reactivate')}
                            disabled={actionLoading === v.id}
                            className={`text-sm px-3 py-2 rounded-lg border transition-colors disabled:opacity-40 whitespace-nowrap ${
                              v.active
                                ? 'border-slate-300 text-slate-600 hover:bg-slate-50'
                                : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {v.active ? 'Desactivar' : '↩ Activar'}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      )}

      {/* ── INITIATIVES ──────────────────────────────────────────────────────── */}
      {tab === 'initiatives' && (
        <div>
          {loadingInitiatives ? (
            <p className="text-slate-400">{t('common.loading')}</p>
          ) : initiatives.length === 0 ? (
            <div className="card text-center py-12 text-slate-400">
              <p>Sin iniciativas todavía.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {initiatives.map((ini) => (
                <article
                  key={ini.id}
                  className={`card border ${!ini.active ? 'border-amber-200 bg-amber-50/40' : 'border-slate-200'}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge bg-purple-100 text-purple-700">{ini.category}</span>
                        {ini.active
                          ? <span className="badge bg-emerald-100 text-emerald-700">✓ Visible</span>
                          : <span className="badge bg-slate-200 text-slate-500">Oculta</span>
                        }
                      </div>
                      <h3 className="font-bold text-slate-900">{ini.title}</h3>
                      <p className="text-sm text-slate-500">
                        👤 {ini.coordinator_name}
                        {ini.coordinator_contact && (
                          <> · <span className="text-emerald-700 font-medium">{ini.coordinator_contact}</span></>
                        )}
                        {' · '}📍 {ini.location} · {timeAgo(ini.created_at)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 mb-3">{ini.description}</p>

                  {ini.needed_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {ini.needed_skills.map((s) => (
                        <span key={s} className="badge bg-slate-100 text-slate-600">{s}</span>
                      ))}
                    </div>
                  )}

                  {ini.spots_available !== null && (
                    <p className="text-xs text-slate-500 mb-3">Plazas disponibles: {ini.spots_available}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {ini.active ? (
                      <button
                        onClick={() => handleInitiativeAction(ini.id, 'deactivate')}
                        disabled={actionLoading === ini.id}
                        className="text-sm px-4 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-40"
                      >
                        Ocultar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleInitiativeAction(ini.id, 'reactivate')}
                        disabled={actionLoading === ini.id}
                        className="text-sm px-4 py-2 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-40"
                      >
                        ↩ Mostrar
                      </button>
                    )}
                    <button
                      onClick={() => handleInitiativeAction(ini.id, 'delete')}
                      disabled={actionLoading === ini.id}
                      className="btn-secondary text-sm py-2 px-4 disabled:opacity-40"
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
