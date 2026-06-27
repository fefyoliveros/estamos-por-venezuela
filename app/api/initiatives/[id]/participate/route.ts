import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as { volunteer_name?: string }
    if (!body.volunteer_name || body.volunteer_name.trim().length < 2) {
      return NextResponse.json({ error: 'Debes introducir tu nombre completo.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('volunteer_initiatives')
      .select('coordinator_contact, coordinator_name, title')
      .eq('id', params.id)
      .eq('active', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Iniciativa no encontrada.' }, { status: 404 })
    }

    return NextResponse.json({
      contact: data.coordinator_contact,
      coordinator_name: data.coordinator_name,
      title: data.title,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
