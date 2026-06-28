import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Use service role to bypass RLS — admin needs all rows regardless of active status
  const adminDb = await createAdminClient()
  const [skillRes, onsiteRes] = await Promise.all([
    adminDb
      .from('skill_offers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(300),
    adminDb
      .from('onsite_volunteers')
      .select('*') // includes contact — admin only
      .order('created_at', { ascending: false })
      .limit(300),
  ])

  return NextResponse.json({
    skill_offers: skillRes.data ?? [],
    onsite_volunteers: onsiteRes.data ?? [],
  })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id, table, action } = await request.json() as {
    id: string
    table: 'skill_offers' | 'onsite_volunteers'
    action: 'deactivate' | 'reactivate'
  }

  if (!id || !table || !action) {
    return NextResponse.json({ error: 'id, table y action son obligatorios' }, { status: 400 })
  }

  const adminDb = await createAdminClient()
  const { error } = await adminDb
    .from(table)
    .update({ active: action === 'reactivate' })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
