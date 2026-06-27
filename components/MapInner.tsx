'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

const makeIcon = (color: string) =>
  L.divIcon({
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.45)"></div>`,
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  })

export interface MapPoint {
  id: string
  name: string
  lat: number
  lng: number
  address: string
  items?: string
  hours?: string
  whatsappUrl?: string
  type: 'collection_point' | 'medical' | 'volunteer_coordinator'
}

interface MapInnerProps {
  points: MapPoint[]
  center: [number, number]
  zoom: number
}

const TYPE_COLORS: Record<MapPoint['type'], string> = {
  collection_point: '#dc2626',
  medical: '#2563eb',
  volunteer_coordinator: '#16a34a',
}

export default function MapInner({ points, center, zoom }: MapInnerProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.lat, point.lng]}
          icon={makeIcon(TYPE_COLORS[point.type])}
        >
          <Popup maxWidth={240}>
            <div>
              <p className="font-bold text-sm mb-1">{point.name}</p>
              <p className="text-xs text-gray-500 mb-1">{point.address}</p>
              {point.hours && (
                <p className="text-xs mb-1"><strong>Horario:</strong> {point.hours}</p>
              )}
              {point.items && (
                <p className="text-xs mb-1"><strong>Aceptan:</strong> {point.items}</p>
              )}
              {point.whatsappUrl && (
                <a
                  href={point.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-700 underline"
                >
                  Unirse al grupo WhatsApp
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
