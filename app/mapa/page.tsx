'use client'

import dynamic from 'next/dynamic'
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

// Barcelona collection points from Acción Directa Barcelona
// Coordinates are approximate for OpenStreetMap pins
const COLLECTION_POINTS: MapPoint[] = [
  {
    id: 'cp-1',
    name: 'Academia Odontología',
    lat: 41.4133,
    lng: 2.1752,
    address: 'Carrer Juan Sada 55, Barcelona',
    items: 'Insumos médicos (H₂O₂, alcohol, guantes, gasas, medicamentos)',
    hours: 'Sáb 27 jun · 10:00–13:00',
    whatsappUrl: 'https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
    type: 'collection_point',
  },
  {
    id: 'cp-2',
    name: 'Rest. Tío Papelón',
    lat: 41.3986,
    lng: 2.1747,
    address: 'Carrer Sicilia 247, Barcelona',
    items: 'Insumos médicos',
    hours: 'Sáb 27 jun · 10:00–13:00',
    whatsappUrl: 'https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
    type: 'collection_point',
  },
  {
    id: 'cp-3',
    name: 'Rest. El Tequeñón',
    lat: 41.4374,
    lng: 2.1720,
    address: 'Carrer del Pantà de Tremp 47, Barcelona',
    items: 'Insumos médicos',
    hours: 'Sáb 27 jun · 10:00–13:00',
    whatsappUrl: 'https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
    type: 'collection_point',
  },
  {
    id: 'cp-4',
    name: 'Rest. Rincón de la Abuela',
    lat: 41.3990,
    lng: 2.1960,
    address: 'Carrer Mallorca 470, Barcelona',
    items: 'Insumos médicos',
    hours: 'Sáb 27 jun · 10:00–13:00',
    whatsappUrl: 'https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
    type: 'collection_point',
  },
  {
    id: 'cp-5',
    name: 'Rest. Los Panas',
    lat: 41.3810,
    lng: 2.1520,
    address: 'Carrer Aragó 40, Barcelona',
    items: 'Insumos médicos',
    hours: 'Sáb 27 jun · 10:00–13:00',
    whatsappUrl: 'https://chat.whatsapp.com/HVlcLTdjQMmKCG0zF0Gk1j',
    type: 'collection_point',
  },
  {
    id: 'cp-6',
    name: 'Centro de Acogida — Rubí',
    lat: 41.4942,
    lng: 2.0328,
    address: 'Carrer Magi Ramentol 23, Rubí (Barcelona)',
    items: 'Guantes, gasas, jeringas, solución salina, cobijas, sábanas, ropa. Deadline: lunes 29 jun.',
    hours: 'Consultar disponibilidad',
    type: 'collection_point',
  },
]

const LEGEND = [
  { color: '#dc2626', label: 'Punto de recogida' },
  { color: '#2563eb', label: 'Médico / Sanitario' },
  { color: '#16a34a', label: 'Coordinación voluntarios' },
]

export default function MapaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Mapa de puntos de recogida</h1>
        <p className="text-slate-600">
          Localiza el punto de recogida más cercano para donar materiales y medicamentos.
        </p>
      </div>

      {/* Alert banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
        <span className="text-amber-600 text-lg shrink-0">⚠️</span>
        <div className="text-sm text-amber-800">
          <strong>Prioriza la donación económica.</strong> Llega antes y sin obstáculos logísticos.{' '}
          <Link href="/donaciones" className="underline font-semibold">Ver cómo donar dinero →</Link>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm mb-6" style={{ height: '480px' }}>
        <MapView
          points={COLLECTION_POINTS}
          center={[41.3874, 2.1686]}
          zoom={12}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-8">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-slate-600">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow"
              style={{ background: item.color }}
            />
            {item.label}
          </div>
        ))}
      </div>

      {/* Point list */}
      <h2 className="text-xl font-bold text-slate-900 mb-4">Puntos en detalle</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COLLECTION_POINTS.map((point) => (
          <div key={point.id} className="card">
            <div className="flex items-start gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full mt-1 shrink-0 border border-white shadow"
                style={{ background: '#dc2626' }}
              />
              <h3 className="font-bold text-slate-900 text-sm leading-tight">{point.name}</h3>
            </div>
            <p className="text-xs text-slate-500 mb-1">{point.address}</p>
            {point.hours && (
              <p className="text-xs text-slate-600 mb-1">
                <span className="font-semibold">Horario:</span> {point.hours}
              </p>
            )}
            {point.items && (
              <p className="text-xs text-slate-600 mb-2">
                <span className="font-semibold">Aceptan:</span> {point.items}
              </p>
            )}
            {point.whatsappUrl && (
              <a
                href={point.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg font-medium hover:bg-emerald-200 transition-colors"
              >
                WhatsApp del grupo
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Acción Directa credit */}
      <div className="mt-8 p-4 bg-slate-50 rounded-xl text-sm text-slate-500">
        Puntos de recogida organizados por{' '}
        <a
          href="https://acciondirectabarcelona.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:underline font-medium"
        >
          Acción Directa Barcelona
        </a>
        {' '}· Campaña Medicinas YA · Actualizado 27 jun 2026
      </div>
    </div>
  )
}
