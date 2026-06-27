import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  // Contact is intentionally excluded — admin only
  const { data, error } = await supabase
    .from('onsite_volunteers')
    .select('id, full_name, origin_location, available_from, skills, has_vehicle, group_affiliation, created_at')
    .eq('active', true)
    .order('available_from', { ascending: true })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [], count: data?.length ?? 0 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      full_name?: string
      origin_location?: string
      available_from?: string
      skills?: string
      has_vehicle?: boolean
      contact?: string
      group_affiliation?: string
      acknowledged_safety?: boolean
    }

    const { full_name, origin_location, available_from, skills, contact, acknowledged_safety } = body

    if (!full_name || !origin_location || !available_from || !skills || !contact) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 })
    }

    if (!acknowledged_safety) {
      return NextResponse.json(
        { error: 'Debes confirmar que leerás las instrucciones de seguridad antes de registrarte.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('onsite_volunteers')
      .insert({
        full_name,
        origin_location,
        available_from,
        skills,
        has_vehicle: body.has_vehicle ?? false,
        contact,
        group_affiliation: body.group_affiliation ?? null,
        acknowledged_safety: true,
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
