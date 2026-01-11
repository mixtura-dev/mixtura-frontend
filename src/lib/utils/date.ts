// src/lib/utils/date.ts
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export function useDateFormatter() {
  const { t, locale } = useI18n()

  const shortDateTimeFormatter = computed(
    () =>
      new Intl.DateTimeFormat(locale.value, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
  )

  const fullDateTimeFormatter = computed(
    () =>
      new Intl.DateTimeFormat(locale.value, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
  )

  function formatSmartDate(dateString: string | null | undefined): string {
    if (!dateString) return t('dates.unknown', 'Unknown')
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return t('dates.unknown', 'Unknown')
      const now = new Date()
      const diffYears = date.getFullYear() - now.getFullYear()
      if (diffYears > 50) return t('dates.permanent', 'Permanent')
      return shortDateTimeFormatter.value.format(date)
    } catch {
      return t('dates.unknown', 'Unknown')
    }
  }

  function formatFullDate(dateString: string | null | undefined): string {
    if (!dateString) return t('dates.unknown', 'Unknown')
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return t('dates.unknown', 'Unknown')
      return fullDateTimeFormatter.value.format(date)
    } catch {
      return t('dates.unknown', 'Unknown')
    }
  }

  return {
    formatSmartDate,
    formatFullDate,
  }
}
