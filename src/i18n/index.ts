import { createI18n } from 'vue-i18n'
import { type SupportedLocale, messages } from './messages'
import { isSupportedLocale, setHtmlLangAttribute } from '@/lib/utils/localeUtils'

type MessageSchema = (typeof messages)['en']

export const DEFAULT_LOCALE: SupportedLocale = 'ru'

export const getSavedLocale = (): SupportedLocale | null => {
  const savedLocale = localStorage.getItem('user-locale')
  return savedLocale && isSupportedLocale(savedLocale) ? (savedLocale as SupportedLocale) : null
}

export const getBrowserLocale = (): SupportedLocale | null => {
  const browserLocale = navigator.language?.split('-')[0]
  console.log('Browser language:', browserLocale)
  return browserLocale && isSupportedLocale(browserLocale)
    ? (browserLocale as SupportedLocale)
    : null
}

const setLocale = (locale: SupportedLocale): SupportedLocale => {
  localStorage.setItem('user-locale', locale)
  setHtmlLangAttribute(locale)
  return locale
}

export const getInitialLocale = (): SupportedLocale => {
  const savedLocale = getSavedLocale()
  if (savedLocale) {
    return setLocale(savedLocale)
  }

  const browserLocale = getBrowserLocale()
  if (browserLocale) {
    return setLocale(browserLocale)
  }
  return setLocale(DEFAULT_LOCALE)
}

export const i18n = createI18n<[MessageSchema], SupportedLocale>({
  legacy: false,
  messages,
  locale: getInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
})
