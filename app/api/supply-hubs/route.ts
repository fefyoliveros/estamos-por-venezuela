import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { HubType } from '@/types/database'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      name?: string; hub_type?: string; location?: string; city?: string
      contact_name?: string; contact_whatsapp?: string; contact_instagram?: string; description?: string
    }
    const { name, hub_type, location, city, contact_name, contact_whatsapp, contact_instagram, description } = body
    if (!name?.trim() || !hub_type || !location?.trim()) {
      return NextResponse.json({ error: 'Nombre, tipo y ubicación son obligatorios.' }, { status: 400 })
    }
    if (hub_type !== 'hospital' && hub_type !== 'collection_point') {
      return NextResponse.json({ error: 'Tipo inválido.' }, { status: 400 })
    }
    const supabase = await createClient()
    const { error } = await supabase.from('supply_hubs').insert({
      name: name.trim(),
      hub_type: hub_type as HubType,
      location: location.trim(),
      city: city?.trim() ?? null,
      contact_name: contact_name?.trim() ?? null,
      contact_whatsapp: contact_whatsapp?.trim() ?? null,
      contact_instagram: contact_instagram?.trim() ?? null,
      description: description?.trim() ?? null,
      verified: false,
      active: true,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error desconocido' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  const supabase = await createClient()
  let query = supabase
    .from('supply_hubs')
    .select('id, name, hub_type, location, city, contact_name, contact_whatsapp, contact_instagram, description, verified, active, created_at')
    .eq('active', true)
    .order('hub_type', { ascending: true })
    .order('name', { ascending: true })

  if (type && (type === 'hospital' || type === 'collection_point')) {
    query = query.eq('hub_type', type)
  }

  const { data, error } = await query.limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data: data ?? [] }, { headers: PUBLIC_CORS_HEADERS })
}
