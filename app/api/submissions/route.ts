import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyInitiative } from '@/lib/gemini/verify'
import type { Resource, Submission, SubmissionInsert, ResourceType } from '@/types/database'

export async function POST(request: Request) {
  const body = await request.json() as {
    type?: ResourceType
    name?: string
    url?: string | null
    instagram?: string | null
    city?: string | null
    country?: string
    description?: string | null
    submitter_email?: string
  }

  const { type, name, url, instagram, city, country, description, submitter_email } = body

  if (!type || !name || !submitter_email) {
    return NextResponse.json(
      { error: 'Faltan campos obligatorios: type, name, submitter_email' },
      { status: 400 }
    )
  }

  if (!url && !instagram) {
    return NextResponse.json(
      { error: 'Se requiere al menos una URL o cuenta de Instagram' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  // Businesses publish directly without verification
  if (type === 'business') {
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .insert({
        name,
        type: 'business',
        url: url ?? null,
        instagram: instagram ?? null,
        city: city ?? null,
        country: country ?? 'ES',
        description_es: description ?? null,
        description_en: null,
        contact: null,
        verified: false,
        active: true,
        earthquake_specific: true,
        is_government: false,
      })
      .select()
      .single()

    if (resourceError) {
      return NextResponse.json({ error: resourceError.message }, { status: 500 })
    }

    return NextResponse.json({ data: resource, published: true }, { status: 201 })
  }

  // All other types go through the submission queue with AI verification
  const submission: SubmissionInsert = {
    type,
    name,
    url: url ?? null,
    instagram: instagram ?? null,
    city: city ?? null,
    country: country ?? 'INT',
    description: description ?? null,
    submitter_email,
    status: 'pending',
    ai_verified: null,
    ai_notes: null,
  }

  const { data: created, error: insertError } = await supabase
    .from('submissions')
    .insert(submission)
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Trigger AI verification asynchronously (non-blocking)
  verifyInitiative({
    name,
    url: url ?? null,
    instagram: instagram ?? null,
    description: description ?? '',
    type,
  })
    .then((result) => {
      void Promise.resolve(
        supabase
          .from('submissions')
          .update({ ai_verified: result.verified, ai_notes: `[${result.confidence}] ${result.notes}` })
          .eq('id', created.id)
      ).catch(() => {})
    })
    .catch(() => {})

  return NextResponse.json({ data: created, published: false }, { status: 201 })
}
