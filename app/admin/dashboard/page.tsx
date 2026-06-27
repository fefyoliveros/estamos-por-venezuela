'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { useTranslation } from '@/lib/i18n/context'
import type { Submission, HelpRequest } from '@/types/database'

type Tab = 'submissions' | 'help'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  return `hace ${Math.floor(hours / 24)}d`
}

export default function AdminDashboardPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('submissions')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)
  const [loadingHelp, setLoadingHelp] = useState(true)
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

  useEffect(() => { loadSubmissions() }, [loadSubmissions])
  useEffect(() => { loadHelp() }, [loadHelp])

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
      body: JSON.stringify({ submission_id: id }), // API reads submission_id
    })
    const json = await res.json() as { ai_verified: boolean; ai_notes: string }
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, ai_verified: json.ai_verified, ai_notes: json.ai_notes } : s
      )
    )
    setVerifyLoading(null)
  }

  async function handleResolve(id: string) {
    setActionLoading(id)
    await fetch('/api/admin/help-requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'resolve' }),
    })
    setHelpRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    )
    setActionLoading(null)
  }

  async function handleLogout() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const pendingCount = submissions.filter((s) => s.status === 'pending').length
  const activeHelpCount = helpRequests.filter((r) => r.status === 'active').length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-slate-900">{t('admin.dashboard.title')}</h1>
        <button onClick={handleLogout} className="btn-secondary text-sm">
          {t('admin.logout')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setTab('submissions')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'submissions'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {t('admin.tabs.submissions')}
          {pendingCount > 0 && (
            <span className="ml-2 bg-red-100 text-red-700 text-xs rounded-full px-2 py-0.5">{pendingCount}</span>
          )}
        </button>
        <button
          onClick={() => setTab('help')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'help'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {t('admin.tabs.help')}
          {activeHelpCount > 0 && (
            <span className="ml-2 bg-red-100 text-red-700 text-xs rounded-full px-2 py-0.5">{activeHelpCount}</span>
          )}
        </button>
      </div>

      {/* Submissions tab */}
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

      {/* Help requests tab */}
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
                  className={`card border ${req.needs.includes('trapped') ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
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

                    {req.status === 'active' && (
                      <button
                        onClick={() => handleResolve(req.id)}
                        disabled={actionLoading === req.id}
                        className="btn-secondary text-sm py-2 px-3 whitespace-nowrap disabled:opacity-40"
                      >
                        {t('admin.help.resolve')}
                      </button>
                    )}
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
