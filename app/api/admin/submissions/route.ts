import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const adminDb = await createAdminClient()
  const { data, error } = await adminDb
    .from('submissions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

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

  const { id, action } = await request.json() as { id: string; action: 'approve' | 'reject' }

  if (!id || !action) {
    return NextResponse.json({ error: 'id y action son obligatorios' }, { status: 400 })
  }

  const adminDb = await createAdminClient()

  const { data: submission, error: fetchError } = await adminDb
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !submission) {
    return NextResponse.json({ error: 'Submission no encontrada' }, { status: 404 })
  }

  if (action === 'approve') {
    // Move to resources table
    await adminDb.from('resources').insert({
      name: submission.name,
      type: submission.type,
      url: submission.url,
      instagram: submission.instagram,
      city: submission.city,
      country: submission.country,
      description_es: submission.description,
      description_en: null,
      contact: null,
      verified: submission.ai_verified === true,
      active: true,
      earthquake_specific: true,
      is_government: false,
    })
  }

  const { error: updateError } = await adminDb
    .from('submissions')
    .update({ status: action === 'approve' ? 'approved' : 'rejected' })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
