import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyInitiative } from '@/lib/gemini/verify'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Admin-only endpoint
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { submission_id } = await request.json() as { submission_id: string }

  if (!submission_id) {
    return NextResponse.json({ error: 'submission_id requerido' }, { status: 400 })
  }

  const { data: submission, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', submission_id)
    .single()

  if (error || !submission) {
    return NextResponse.json({ error: 'Submission no encontrada' }, { status: 404 })
  }

  const result = await verifyInitiative({
    name: submission.name,
    url: submission.url,
    instagram: submission.instagram,
    description: submission.description ?? '',
    type: submission.type,
  })

  await supabase
    .from('submissions')
    .update({
      ai_verified: result.verified,
      ai_notes: `[${result.confidence}] ${result.notes}`,
    })
    .eq('id', submission_id)

  return NextResponse.json({ result })
}
