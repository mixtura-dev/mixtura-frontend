// composables/useLanguage.ts
import { changeLocale, DEFAULT_LOCALE } from '@/i18n'
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/messages'
import { useStorage } from '@vueuse/core'
import { computed, readonly, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useLanguage = () => {
  const i18n = useI18n()
  const storedLocale = useStorage<SupportedLocale>('user-locale', DEFAULT_LOCALE)
  const isLoading = ref(false)

  const currentLocale = computed<SupportedLocale>({
    get() {
      return (i18n.locale.value as SupportedLocale) || storedLocale.value
    },
    async set(newLocale: SupportedLocale) {
      if (newLocale === currentLocale.value || isLoading.value) return

      isLoading.value = true
      try {
        await changeLocale(newLocale)
        storedLocale.value = newLocale
      } catch (error) {
        console.error('Failed to change locale:', error)
      } finally {
        isLoading.value = false
      }
    },
  })

  return {
    currentLocale,
    supportedLocales: SUPPORTED_LOCALES,
    isLoading: readonly(isLoading),
  }
}
