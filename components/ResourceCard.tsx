'use client'

import { useTranslation } from '@/lib/i18n/context'
import type { Resource } from '@/types/database'

const TYPE_LABELS: Record<string, string> = {
  ngo: 'ONG',
  campaign: 'Campaña',
  collection_point: 'Punto de recogida',
  psychological: 'Apoyo psicológico',
  medical: 'Médico',
  animal_rescue: 'Rescate animal',
  missing_persons: 'Desaparecidos',
  portal: 'Portal',
  business: 'Empresa',
  volunteer_coordinator: 'Voluntarios',
  other: 'Otro',
}

const TYPE_COLORS: Record<string, string> = {
  ngo: 'bg-blue-50 text-blue-700',
  campaign: 'bg-amber-50 text-amber-700',
  collection_point: 'bg-green-50 text-green-700',
  psychological: 'bg-purple-50 text-purple-700',
  medical: 'bg-red-50 text-red-700',
  animal_rescue: 'bg-orange-50 text-orange-700',
  missing_persons: 'bg-slate-100 text-slate-700',
  portal: 'bg-cyan-50 text-cyan-700',
  business: 'bg-indigo-50 text-indigo-700',
  volunteer_coordinator: 'bg-teal-50 text-teal-700',
  other: 'bg-slate-50 text-slate-600',
}

const COUNTRY_FLAG: Record<string, string> = {
  VE: '🇻🇪',
  ES: '🇪🇸',
  INT: '🌍',
  LATAM: '🌎',
}

interface ResourceCardProps {
  resource: Resource
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const { t, locale } = useTranslation()

  const description = locale === 'es'
    ? resource.description_es
    : (resource.description_en ?? resource.description_es)

  return (
    <article className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge ${TYPE_COLORS[resource.type] ?? 'bg-slate-50 text-slate-600'}`}>
            {TYPE_LABELS[resource.type] ?? resource.type}
          </span>
          {resource.verified && (
            <span className="badge bg-emerald-50 text-emerald-700">
              ✓ {t('directory.verified')}
            </span>
          )}
          <span className="text-sm">{COUNTRY_FLAG[resource.country] ?? '🌐'}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 text-base leading-snug">{resource.name}</h3>
        {resource.city && (
          <p className="text-xs text-slate-500 mt-0.5">{resource.city}</p>
        )}
      </div>

      {description && (
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{description}</p>
      )}

      {resource.contact && (
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">{resource.contact}</p>
      )}

      <div className="flex items-center gap-2 mt-auto pt-1 flex-wrap">
        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-red-600 hover:text-red-700 underline underline-offset-2"
          >
            {t('directory.visit')} →
          </a>
        )}
        {resource.instagram && (
          <a
            href={`https://instagram.com/${resource.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-pink-600 hover:text-pink-700"
          >
            {resource.instagram}
          </a>
        )}
      </div>
    </article>
  )
}
