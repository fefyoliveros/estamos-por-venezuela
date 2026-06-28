import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

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
