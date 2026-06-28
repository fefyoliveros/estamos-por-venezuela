import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Use service role to bypass RLS — admin needs to see active=false rows too
  const adminDb = await createAdminClient()
  const { data, error } = await adminDb
    .from('volunteer_initiatives')
    .select('*') // includes coordinator_contact — admin only
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id, action } = await request.json() as {
    id: string
    action: 'delete' | 'deactivate' | 'reactivate'
  }

  if (!id || !action) {
    return NextResponse.json({ error: 'id y action son obligatorios' }, { status: 400 })
  }

  const adminDb = await createAdminClient()

  if (action === 'delete') {
    const { error } = await adminDb.from('volunteer_initiatives').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  const { error } = await adminDb
    .from('volunteer_initiatives')
    .update({ active: action === 'reactivate' })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
