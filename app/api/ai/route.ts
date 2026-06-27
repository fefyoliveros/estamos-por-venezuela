import { NextResponse } from 'next/server'
import { getRecommendation } from '@/lib/gemini/recommend'
import { createClient } from '@/lib/supabase/server'
import type { UserAnswers } from '@/lib/gemini/recommend'

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<UserAnswers>
    const { location, support_type, availability } = body

    if (!location || !support_type || !availability) {
      return NextResponse.json(
        { error: 'Se requieren: location, support_type, availability' },
        { status: 400 }
      )
    }

    const recommendation = await getRecommendation({ location, support_type, availability })

    const supabase = await createClient()
    const { data: resources } = await supabase
      .from('resources')
      .select('*')
      .eq('active', true)
      .in('type', recommendation.resource_types.length > 0 ? recommendation.resource_types : ['ngo'])
      .limit(6)

    return NextResponse.json({ recommendation, resources: resources ?? [] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[/api/ai]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
