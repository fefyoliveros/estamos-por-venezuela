import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hub_votes')
    .select('vote_type')
    .eq('hub_id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const all = data ?? []
  return NextResponse.json(
    { trust: all.filter(v => v.vote_type === 'trust').length, denounce: all.filter(v => v.vote_type === 'denounce').length },
    { headers: PUBLIC_CORS_HEADERS }
  )
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json() as { vote_type?: string; reason?: string }
    const { vote_type, reason } = body
    if (!vote_type || (vote_type !== 'trust' && vote_type !== 'denounce')) {
      return NextResponse.json({ error: 'vote_type debe ser trust o denounce.' }, { status: 400 })
    }
    if (vote_type === 'denounce' && !reason?.trim()) {
      return NextResponse.json({ error: 'Debes indicar el motivo de la denuncia.' }, { status: 400 })
    }
    const supabase = await createClient()
    const { error } = await supabase.from('hub_votes').insert({
      hub_id: id,
      vote_type,
      reason: reason?.trim() ?? null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error desconocido' }, { status: 500 })
  }
}
