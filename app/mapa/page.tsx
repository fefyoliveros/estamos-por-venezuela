'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { MapPoint } from '@/components/MapInner'
import Link from 'next/link'

const MapView = dynamic(() => import('@/components/MapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-100 rounded-xl">
      <p className="text-slate-400 text-sm">Cargando mapa...</p>
    </div>
  ),
})

type Region = 'barcelona' | 'madrid' | 'sevilla' | 'miami'

const REGION_CONFIG: Record<Region, { center: [number, number]; zoom: number; label: string }> = {
  barcelona: { center: [41.3874, 2.1686], zoom: 12, label: 'Barcelona' },
  madrid:    { center: [40.42, -3.82],    zoom: 11, label: 'Madrid' },
  sevilla:   { center: [37.393, -5.982],  zoom: 14, label: 'Sevilla' },
  miami:     { center: [25.796, -80.31],  zoom: 12, label: 'Miami (EEUU)' },
}

const ALL_POINTS: MapPoint[] = [
  // ── BARCELONA ──────────────────────────────────────────────
  {
    id: 'bcn-1',
    name: 'Academia Odontología',
    lat: 41.4133, lng: 2.1752,
    address: 'Carrer Juan Sada 55, Barcelona',
    items: 'H₂O₂, alcohol, guantes, gasas, medicamentos',
    hours: 'Sáb 27 jun · 10:00–13:00',
    whatsappUrl: 'https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
    googleMapsUrl: 'https://maps.google.com/?q=41.4133,2.1752',
    region: 'barcelona',
    type: 'collection_point',
  },
  {
    id: 'bcn-2',
    name: 'Rest. Tío Papelón',
    lat: 41.3986, lng: 2.1747,
    address: 'Carrer Sicilia 247, Barcelona',
    items: 'Insumos médicos',
    hours: 'Sáb 27 jun · 10:00–13:00',
    whatsappUrl: 'https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
    googleMapsUrl: 'https://maps.google.com/?q=Carrer+Sicilia+247+Barcelona',
    region: 'barcelona',
    type: 'collection_point',
  },
  {
    id: 'bcn-3',
    name: 'Rest. El Tequeñón',
    lat: 41.4374, lng: 2.1720,
    address: 'Carrer del Pantà de Tremp 47, Barcelona',
    items: 'Insumos médicos',
    hours: 'Sáb 27 jun · 10:00–13:00',
    whatsappUrl: 'https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
    googleMapsUrl: 'https://maps.google.com/?q=Carrer+del+Pant%C3%A0+de+Tremp+47+Barcelona',
    region: 'barcelona',
    type: 'collection_point',
  },
  {
    id: 'bcn-4',
    name: 'Rest. Rincón de la Abuela',
    lat: 41.3990, lng: 2.1960,
    address: 'Carrer Mallorca 470, Barcelona',
    items: 'Insumos médicos',
    hours: 'Sáb 27 jun · 10:00–13:00',
    whatsappUrl: 'https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
    googleMapsUrl: 'https://maps.google.com/?q=Carrer+Mallorca+470+Barcelona',
    region: 'barcelona',
    type: 'collection_point',
  },
  {
    id: 'bcn-5',
    name: 'Rest. Los Panas',
    lat: 41.3810, lng: 2.1520,
    address: 'Carrer Aragó 40, Barcelona',
    items: 'Insumos médicos',
    hours: 'Sáb 27 jun · 10:00–13:00',
    whatsappUrl: 'https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
    googleMapsUrl: 'https://maps.google.com/?q=Carrer+Arag%C3%B3+40+Barcelona',
    region: 'barcelona',
    type: 'collection_point',
  },
  {
    id: 'bcn-6',
    name: 'Centro de Acogida — Rubí',
    lat: 41.4942, lng: 2.0328,
    address: 'Carrer Magi Ramentol 23, Rubí (Barcelona)',
    items: 'Guantes, gasas, jeringas, solución salina, cobijas, sábanas, ropa',
    hours: 'Deadline: lunes 29 jun · Consultar disponibilidad',
    googleMapsUrl: 'https://maps.google.com/?q=Carrer+Magi+Ramentol+23+Rub%C3%AD',
    region: 'barcelona',
    type: 'collection_point',
  },

  // ── MADRID ──────────────────────────────────────────────────
  {
    id: 'mad-1',
    name: 'Sambil Madrid — Leganés',
    lat: 40.3244, lng: -3.7662,
    address: 'Calle Mondragón s/n, 28917 Leganés, Madrid',
    items: 'Comida no perecedera, medicamentos, higiene, ropa, mantas',
    hours: 'Sáb-Dom 10:00-18:30',
    googleMapsUrl: 'https://maps.google.com/?q=40.3244,-3.7662',
    status: 'paused',
    region: 'madrid',
    type: 'collection_point',
  },
  {
    id: 'mad-2',
    name: 'VENESP — Parroquia Santa María',
    lat: 40.5426, lng: -3.6480,
    address: 'Parroquia Santa María de la Esperanza, Alcobendas',
    items: 'Ropa, mantas, productos de higiene, linternas',
    hours: 'Verificar con VENESP',
    googleMapsUrl: 'https://maps.google.com/?q=40.5426,-3.6480',
    region: 'madrid',
    type: 'collection_point',
  },
  {
    id: 'mad-3',
    name: 'VENESP — Pardillo Center',
    lat: 40.4491, lng: -3.9985,
    address: 'Av. de Madrid 4, local 1, Villanueva de la Cañada',
    items: 'Comida no perecedera, higiene, mantas',
    hours: 'Verificar con VENESP',
    googleMapsUrl: 'https://maps.google.com/?q=40.4491,-3.9985',
    region: 'madrid',
    type: 'collection_point',
  },
  {
    id: 'mad-4',
    name: 'Calle Matilde Landa 26',
    lat: 40.4601, lng: -3.6957,
    address: 'Calle Matilde Landa 26, Madrid (Metro Ventilla)',
    items: 'Refugiados Sin Fronteras y Diáspora en Movimiento',
    hours: 'Sáb-Dom 11:00-18:00 (27-28 jun 2026)',
    googleMapsUrl: 'https://maps.google.com/?q=Calle+Matilde+Landa+26+Madrid',
    region: 'madrid',
    type: 'collection_point',
  },

  // ── SEVILLA ──────────────────────────────────────────────────
  {
    id: 'sev-1',
    name: 'Capilla Divina Pastora de Santa Marina',
    lat: 37.3972, lng: -5.9823,
    address: 'Calle Amparo 13, Sevilla',
    items: 'Comida, kits médicos, primeros auxilios, comida para animales',
    hours: 'Lun-Sáb 19:00-21:00',
    googleMapsUrl: 'https://maps.google.com/?q=Calle+Amparo+13+Sevilla',
    region: 'sevilla',
    type: 'collection_point',
  },

  // ── MIAMI ───────────────────────────────────────────────────
  {
    id: 'mia-1',
    name: 'GEM / Neighbors 4 Neighbors — Hope 4 Venezuela',
    lat: 25.8028, lng: -80.3385,
    address: '1850 NW 84th Ave, Suite 100, Doral FL 33166',
    items: 'Comida no perecedera, higiene, artículos para bebés, mantas, ropa',
    googleMapsUrl: 'https://maps.google.com/?q=1850+NW+84th+Ave+Doral+FL+33166',
    region: 'miami',
    type: 'collection_point',
  },
  {
    id: 'mia-2',
    name: 'Inter Miami CF & City of Doral',
    lat: 25.7982, lng: -80.2296,
    address: 'Nu Stadium (south side), 1900 NW 37th Ave, Miami FL',
    items: 'Suministros esenciales en bins especiales',
    hours: 'Hasta 3 jul 2026',
    googleMapsUrl: 'https://maps.google.com/?q=1900+NW+37th+Ave+Miami+FL',
    region: 'miami',
    type: 'collection_point',
  },
  {
    id: 'mia-3',
    name: 'Doral Legacy Park Community Center',
    lat: 25.8033, lng: -80.3380,
    address: '11400 NW 82nd St, Doral FL 33178',
    items: 'Suministros varios',
    hours: 'Lun-Vie 17:00-21:00 · Sáb-Dom 8:00-17:00',
    googleMapsUrl: 'https://maps.google.com/?q=11400+NW+82nd+St+Doral+FL+33178',
    region: 'miami',
    type: 'collection_point',
  },
  {
    id: 'mia-4',
    name: 'El Arepazo Restaurant (24/7)',
    lat: 25.7818, lng: -80.3325,
    address: '10191 NW 58th St, Doral FL 33178',
    items: 'Agua, ropa, comida en lata, artículos médicos',
    hours: 'Abierto 24/7',
    googleMapsUrl: 'https://maps.google.com/?q=10191+NW+58th+St+Doral+FL+33178',
    region: 'miami',
    type: 'collection_point',
  },
  {
    id: 'mia-5',
    name: 'AFE Organisation',
    lat: 25.7815, lng: -80.3383,
    address: '6090 NW 84th Ave, Miami FL 33166',
    items: 'Suministros médicos y ayuda humanitaria',
    hours: 'Lun-Vie 9:30-15:00',
    googleMapsUrl: 'https://maps.google.com/?q=6090+NW+84th+Ave+Miami+FL+33166',
    region: 'miami',
    type: 'collection_point',
  },
]

export default function MapaPage() {
  const [activeRegion, setActiveRegion] = useState<Region>('barcelona')

  const { center, zoom } = REGION_CONFIG[activeRegion]
  const visiblePoints = ALL_POINTS.filter((p) => p.region === activeRegion)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Puntos de recogida</p>
        <h1 className="font-serif text-3xl text-[#0a0a0a] mb-2">Mapa de ayuda humanitaria</h1>
        <p className="text-slate-600">
          Localiza el punto de recogida más cercano. Coordenadas verificadas.
        </p>
      </div>

      {/* Airport alert */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
        <span className="text-amber-600 text-lg shrink-0">⚠️</span>
        <div className="text-sm text-amber-800">
          <strong>Prioriza la donación económica.</strong> El aeropuerto de Maiquetía está cerrado por daños estructurales. La donación en dinero llega antes.{' '}
          <Link href="/donaciones" className="underline font-semibold">Ver cómo donar →</Link>
        </div>
      </div>

      {/* Region tabs */}
      <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Región">
        {(Object.entries(REGION_CONFIG) as [Region, typeof REGION_CONFIG[Region]][]).map(([key, cfg]) => {
          const count = ALL_POINTS.filter((p) => p.region === key).length
          return (
            <button
              key={key}
              role="tab"
              aria-selected={activeRegion === key}
              onClick={() => setActiveRegion(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                activeRegion === key
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {cfg.label}
              <span className={`ml-1.5 text-xs ${activeRegion === key ? 'text-red-200' : 'text-slate-400'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm mb-6" style={{ height: '460px' }}>
        <MapView points={visiblePoints} center={center} zoom={zoom} />
      </div>

      {/* Point list */}
      <h2 className="font-serif text-xl text-[#0a0a0a] mb-4">
        {REGION_CONFIG[activeRegion].label} — {visiblePoints.length} puntos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {visiblePoints.map((point) => (
          <div key={point.id} className={`card ${point.status === 'paused' ? 'opacity-60 border-amber-200 bg-amber-50/40' : ''}`}>
            <div className="flex items-start gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full mt-1 shrink-0 border border-white shadow"
                style={{ background: point.status === 'paused' ? '#94a3b8' : '#dc2626' }}
              />
              <div>
                {point.status === 'paused' && (
                  <span className="text-xs font-bold text-amber-700 block mb-0.5">⚠️ Temporalmente pausado</span>
                )}
                <h3 className="font-bold text-slate-900 text-sm leading-tight">{point.name}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-1">{point.address}</p>
            {point.hours && (
              <p className="text-xs text-slate-600 mb-1">
                <span className="font-semibold">Horario:</span> {point.hours}
              </p>
            )}
            {point.items && (
              <p className="text-xs text-slate-600 mb-3">
                <span className="font-semibold">Aceptan:</span> {point.items}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-auto">
              {point.googleMapsUrl && (
                <a
                  href={point.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                  Google Maps →
                </a>
              )}
              {point.whatsappUrl && (
                <a
                  href={point.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-500">
        Puntos de recogida verificados por fuentes locales · Última actualización: 28 jun 2026 ·{' '}
        <a
          href="https://acciondirectabarcelona.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:underline font-medium"
        >
          Acción Directa Barcelona
        </a>
        {' '}(Barcelona) ·{' '}
        <a
          href="https://madridsecreto.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:underline font-medium"
        >
          Madrid Secreto
        </a>
        {' '}(Madrid) ·{' '}
        <a
          href="https://www.univision.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:underline font-medium"
        >
          Univision 23
        </a>
        {' '}(Miami)
      </div>
    </div>
  )
}
