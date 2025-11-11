import type { SupportedLocale } from './messages'

type LocaleMessages = Record<string, unknown>

const localeLoaders = {
  ru: () => import('./locales/ru/index.ts'),
  en: () => import('./locales/en/index.ts'),
}

export const loadLocaleMessages = async (locale: SupportedLocale): Promise<LocaleMessages> => {
  const loader = localeLoaders[locale]
  if (!loader) throw new Error(`Locale ${locale} not supported`)

  const { default: messages } = await loader()
  return messages
}
