import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('volunteer_initiatives')
    .select('id, title, description, location, coordinator_name, needed_skills, spots_available, category, created_at')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
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
    const { error } = await supabase
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
        active: false, // pending admin approval — not readable until activated
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
