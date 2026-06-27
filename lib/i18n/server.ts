import { cookies } from 'next/headers'
import type { Locale } from './translations'

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get('locale')?.value
  return value === 'en' || value === 'es' ? value : 'es'
}
