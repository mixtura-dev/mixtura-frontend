import { createI18n } from 'vue-i18n'
import { type SupportedLocale } from './messages'
import { isSupportedLocale, setHtmlLangAttribute } from '@/lib/utils/localeUtils'
import { loadLocaleMessages } from './loaders'

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

const customRule = (choice: number, choicesLength: number): number => {
  if (choice === 0) {
    return 0 // zero
  }
  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1 // one
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2 // few
  }
  return choicesLength < 4 ? 2 : 3 // many
}

export const i18n = createI18n({
  legacy: false,
  messages: {},
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  missingWarn: false,
  fallbackWarn: false,
  pluralRules: { ru: customRule },
})

export const changeLocale = async (locale: SupportedLocale): Promise<void> => {
  console.log(`Requested to change locale to: ${locale}`)
  console.log(`Changing locale to: ${locale}`)
  if (!i18n.global.availableLocales.includes(locale)) {
    console.log(`Loading locale messages for: ${locale}`)
    try {
      const messages = await loadLocaleMessages(locale)
      console.log(`Loaded messages for locale ${locale}:`, messages)
      i18n.global.setLocaleMessage(locale, messages)
    } catch (error) {
      console.error(`Failed to load locale ${locale}:`, error)
      return
    }
  }

  i18n.global.locale.value = locale
  setLocale(locale)
}
