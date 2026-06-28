import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') === 'surplus' ? 'surplus' : 'shortage'

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('supply_reports')
    .select(`
      id, hub_id, items, description, urgency, updated_by, created_at,
      supply_hubs ( name, hub_type, city, contact_whatsapp )
    `)
    .eq('report_type', type)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] }, { headers: PUBLIC_CORS_HEADERS })
}
