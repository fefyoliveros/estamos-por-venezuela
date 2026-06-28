import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const onsiteOnly = searchParams.get('onsite') === 'true'

  const supabase = await createClient()
  let query = supabase
    .from('volunteer_initiatives')
    .select('id, title, description, location, coordinator_name, needed_skills, spots_available, category, is_onsite, created_at')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (onsiteOnly) query = query.eq('is_onsite', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] }, { headers: PUBLIC_CORS_HEADERS })
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      title?: string
      description?: string
      location?: string
      coordinator_name?: string
      coordinator_contact?: string
      needed_skills?: string[]
      spots_available?: number | null
      category?: string
    }

    const { title, description, location, coordinator_name, coordinator_contact, category } = body
    if (!title || !description || !location || !coordinator_name || !coordinator_contact || !category) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('volunteer_initiatives')
      .insert({
        title,
        description,
        location,
        coordinator_name,
        coordinator_contact,
        needed_skills: body.needed_skills ?? [],
        spots_available: body.spots_available ?? null,
        category,
        is_onsite: (body as { is_onsite?: boolean }).is_onsite ?? false,
        active: true,
      })
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, id: data.id }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
