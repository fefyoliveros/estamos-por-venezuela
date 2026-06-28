import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Service role bypasses RLS — admin needs resolved requests too, not just active
  const adminDb = await createAdminClient()
  const { data, error } = await adminDb
    .from('help_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id, action } = await request.json() as { id: string; action?: 'resolve' | 'reactivate' }

  if (!id) {
    return NextResponse.json({ error: 'id es obligatorio' }, { status: 400 })
  }

  const newStatus = action === 'reactivate' ? 'active' : 'resolved'

  const adminDb = await createAdminClient()
  const { error } = await adminDb
    .from('help_requests')
    .update({ status: newStatus })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
