import ru from '@/i18n/locales/ru/index'
import en from '@/i18n/locales/en/index'

export const messages = {
  en,
  ru,
} as const
export type SupportedLocale = keyof typeof messages

export const SUPPORTED_LOCALES = Object.keys(messages) as SupportedLocale[]
