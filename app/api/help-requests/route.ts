import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { HelpRequestInsert } from '@/types/database'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

const SELECT_FIELDS = 'id, full_name, location, needs, details, whatsapp, status, urgency, latitude, longitude, resolved_at, resolution_type, resolution_notes, created_at'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get('status') === 'resolved' ? 'resolved' : 'active'

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('help_requests')
    .select(SELECT_FIELDS)
    .eq('status', statusParam)
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { headers: PUBLIC_CORS_HEADERS })
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<HelpRequestInsert>
  const { full_name, location, needs, details, whatsapp, urgency, latitude, longitude } = body

  if (!full_name || !location || !needs || needs.length === 0) {
    return NextResponse.json(
      { error: 'Se requiere nombre, ubicación y al menos una necesidad' },
      { status: 400 }
    )
  }

  const validUrgencies = ['critical', 'high', 'medium', 'low']
  const resolvedUrgency = urgency && validUrgencies.includes(urgency) ? urgency : 'medium'

  const supabase = await createClient()

  const { error } = await supabase
    .from('help_requests')
    .insert({
      full_name,
      location,
      needs,
      details: details ?? null,
      whatsapp: whatsapp ?? null,
      status: 'active',
      urgency: resolvedUrgency,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
