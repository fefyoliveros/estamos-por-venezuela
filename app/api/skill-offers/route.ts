import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SkillOfferInsert } from '@/types/database'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const supabase = await createClient()
  let query = supabase
    .from('skill_offers')
    .select('id, full_name, skill_category, skill_description, availability, location, contact_method, contact_value, active, created_at')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('skill_category', category)
  }

  const { data, error } = await query.limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] }, { headers: PUBLIC_CORS_HEADERS })
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<SkillOfferInsert>
    const { full_name, skill_category, skill_description, availability, location, contact_method, contact_value } = body

    if (!full_name || !skill_category || !skill_description || !availability || !contact_method || !contact_value) {
      return NextResponse.json({ error: 'Todos los campos obligatorios deben completarse.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('skill_offers')
      .insert({
        full_name,
        skill_category,
        skill_description,
        availability,
        location: location ?? null,
        contact_method,
        contact_value,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
