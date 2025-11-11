export const SUPPORTED_LOCALES = ['ru', 'en'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
