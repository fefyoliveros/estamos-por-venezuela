'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { HelpRequestUrgency } from '@/types/database'

export interface HelpRequestPin {
  id: string
  name: string
  lat: number
  lng: number
  location: string
  needs: string[]
  details: string | null
  whatsapp: string | null
  urgency: HelpRequestUrgency
}

const URGENCY_COLORS: Record<HelpRequestUrgency, string> = {
  critical: '#7f1d1d',
  high:     '#dc2626',
  medium:   '#ea580c',
  low:      '#ca8a04',
}

const URGENCY_LABELS: Record<HelpRequestUrgency, string> = {
  critical: 'CRÍTICO',
  high:     'ALTA',
  medium:   'MEDIA',
  low:      'BAJA',
}

const NEED_LABELS: Record<string, string> = {
  food:        'Alimentos',
  medicine:    'Medicamentos',
  find_person: 'Buscar persona',
  trapped:     'ATRAPADO',
  other:       'Otro',
}

const makeIcon = (color: string) =>
  L.divIcon({
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.5)"></div>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  })

interface Props {
  pins: HelpRequestPin[]
}

export default function HelpRequestMapInner({ pins }: Props) {
  const center: [number, number] = pins.length > 0
    ? [pins.reduce((s, p) => s + p.lat, 0) / pins.length,
       pins.reduce((s, p) => s + p.lng, 0) / pins.length]
    : [10.603, -66.933]

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={makeIcon(URGENCY_COLORS[pin.urgency])}
        >
          <Popup maxWidth={240}>
            <div style={{ fontFamily: 'sans-serif' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{
                  background: URGENCY_COLORS[pin.urgency],
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 4,
                }}>
                  {URGENCY_LABELS[pin.urgency]}
                </span>
              </div>
              <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 2px 0' }}>{pin.name}</p>
              <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 4px 0' }}>📍 {pin.location}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 4 }}>
                {pin.needs.map((n) => (
                  <span key={n} style={{
                    fontSize: 10,
                    padding: '1px 5px',
                    borderRadius: 3,
                    fontWeight: 600,
                    background: n === 'trapped' ? '#dc2626' : '#f1f5f9',
                    color: n === 'trapped' ? 'white' : '#475569',
                  }}>
                    {NEED_LABELS[n] ?? n}
                  </span>
                ))}
              </div>
              {pin.details && (
                <p style={{ fontSize: 11, color: '#475569', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                  {pin.details.length > 130 ? pin.details.slice(0, 130) + '...' : pin.details}
                </p>
              )}
              {pin.whatsapp && (
                <a
                  href={`https://wa.me/${pin.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: '#15803d', display: 'block' }}
                >
                  WhatsApp: {pin.whatsapp}
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
