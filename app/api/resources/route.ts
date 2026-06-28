import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const country = searchParams.get('country')
  const search = searchParams.get('q')

  const supabase = await createClient()

  let query = supabase
    .from('resources')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (type && type !== 'all') {
    query = query.eq('type', type)
  }

  if (country && country !== 'all') {
    query = query.eq('country', country)
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description_es.ilike.%${search}%,city.ilike.%${search}%`
    )
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { headers: PUBLIC_CORS_HEADERS })
}
