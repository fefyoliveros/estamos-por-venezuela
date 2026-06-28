import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SupplyReportInsert } from '@/types/database'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('supply_reports')
    .select('id, hub_id, report_type, items, description, urgency, updated_by, active, created_at')
    .eq('hub_id', id)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] }, { headers: PUBLIC_CORS_HEADERS })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json() as Partial<SupplyReportInsert>
    const { report_type, items, description, urgency, updated_by } = body

    if (!report_type || !updated_by?.trim()) {
      return NextResponse.json({ error: 'report_type y updated_by son obligatorios.' }, { status: 400 })
    }
    if (report_type !== 'shortage' && report_type !== 'surplus') {
      return NextResponse.json({ error: 'report_type debe ser shortage o surplus.' }, { status: 400 })
    }
    if ((!items || items.length === 0) && !description?.trim()) {
      return NextResponse.json({ error: 'Incluye al menos un ítem o una descripción.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('supply_reports').insert({
      hub_id: id,
      report_type,
      items: items ?? [],
      description: description?.trim() ?? null,
      urgency: urgency ?? 'medium',
      updated_by: updated_by.trim(),
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
