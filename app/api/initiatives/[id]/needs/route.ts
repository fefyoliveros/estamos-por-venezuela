import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('initiative_needs')
    .select('id, updated_by, location_context, needs_description, urgency_level, created_at')
    .eq('initiative_id', params.id)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] }, { headers: PUBLIC_CORS_HEADERS })
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as {
      updated_by?: string
      location_context?: string
      needs_description?: string
      urgency_level?: string
    }

    const { updated_by, needs_description, urgency_level } = body
    if (!updated_by?.trim() || !needs_description?.trim() || !urgency_level) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 })
    }

    const valid = ['critical', 'high', 'medium', 'low']
    if (!valid.includes(urgency_level)) {
      return NextResponse.json({ error: 'Nivel de urgencia no válido.' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify the initiative exists and is active
    const { data: init, error: initErr } = await supabase
      .from('volunteer_initiatives')
      .select('id')
      .eq('id', params.id)
      .eq('active', true)
      .single()

    if (initErr || !init) {
      return NextResponse.json({ error: 'Iniciativa no encontrada.' }, { status: 404 })
    }

    const { error } = await supabase
      .from('initiative_needs')
      .insert({
        initiative_id:     params.id,
        updated_by:        updated_by.trim(),
        location_context:  body.location_context?.trim() ?? null,
        needs_description: needs_description.trim(),
        urgency_level,
        active: true,
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
