'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import ResourceCard from '@/components/ResourceCard'
import type { Resource, ResourceType } from '@/types/database'

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

export default function DirectorioPage() {
  const { t } = useTranslation()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [country, setCountry] = useState('all')

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
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">{t('directory.title')}</h1>
        <p className="text-slate-600">{t('directory.subtitle')}</p>
      </div>

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
