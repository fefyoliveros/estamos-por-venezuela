import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { PUBLIC_CORS_HEADERS, corsPreFlight } from '@/lib/cors'

export function OPTIONS() { return corsPreFlight() }

const VALID_URGENCIES = ['critical', 'high', 'medium', 'low']
const VALID_STATUSES = ['active', 'resolved']
const VALID_RESOLUTION_TYPES = ['found', 'deceased', 'evacuated', 'resolved']

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const body = await request.json() as Record<string, string | null>
  const { urgency, status, resolution_type, resolution_notes } = body

  const update: Record<string, string | null> = {}

  if (urgency !== undefined) {
    if (!VALID_URGENCIES.includes(urgency as string)) {
      return NextResponse.json({ error: 'Invalid urgency' }, { status: 400 })
    }
    update.urgency = urgency
  }

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status as string)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    update.status = status
    if (status === 'resolved') {
      update.resolved_at = new Date().toISOString()
    }
  }

  if (resolution_type !== undefined) {
    if (resolution_type !== null && !VALID_RESOLUTION_TYPES.includes(resolution_type)) {
      return NextResponse.json({ error: 'Invalid resolution_type' }, { status: 400 })
    }
    update.resolution_type = resolution_type
  }

  if (resolution_notes !== undefined) {
    update.resolution_notes = resolution_notes
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('help_requests')
    .update(update)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { headers: PUBLIC_CORS_HEADERS })
}
