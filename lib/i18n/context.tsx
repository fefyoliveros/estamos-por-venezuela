'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { translations, type Locale, type TranslationKey } from './translations'

const COOKIE_NAME = 'locale'
const DEFAULT_LOCALE: Locale = 'es'

interface I18nContextValue {
  locale: Locale
  t: (key: TranslationKey) => string
  toggleLanguage: () => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getInitialLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  const value = match?.[1]
  return value === 'en' || value === 'es' ? value : DEFAULT_LOCALE
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    setLocale(getInitialLocale())
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[locale][key] ?? translations[DEFAULT_LOCALE][key] ?? key
    },
    [locale]
  )

  const toggleLanguage = useCallback(() => {
    setLocale((prev) => {
      const next: Locale = prev === 'es' ? 'en' : 'es'
      document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=31536000; SameSite=Lax`
      return next
    })
  }, [])

  return (
    <I18nContext.Provider value={{ locale, t, toggleLanguage }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be inside TranslationProvider')
  return ctx
}
