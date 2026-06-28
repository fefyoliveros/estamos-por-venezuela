import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { HelpRequestInsert } from '@/types/database'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('help_requests')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { headers: PUBLIC_CORS_HEADERS })
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<HelpRequestInsert>
  const { full_name, location, needs, details } = body

  if (!full_name || !location || !needs || needs.length === 0) {
    return NextResponse.json(
      { error: 'Se requiere nombre, ubicación y al menos una necesidad' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('help_requests')
    .insert({
      full_name,
      location,
      needs,
      details: details ?? null,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
