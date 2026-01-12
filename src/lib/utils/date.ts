import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export function useDateFormatter() {
  const { t, locale } = useI18n()

  const shortDateFormatter = computed(
    () =>
      new Intl.DateTimeFormat(locale.value, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
  )

  const shortDateTimeFormatter = computed(
    () =>
      new Intl.DateTimeFormat(locale.value, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
  )

  const fullDateFormatter = computed(
    () =>
      new Intl.DateTimeFormat(locale.value, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
  )

  const fullDateTimeFormatter = computed(
    () =>
      new Intl.DateTimeFormat(locale.value, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
  )

  function isPermanent(date: Date): boolean {
    const now = new Date()
    const diffYears = date.getFullYear() - now.getFullYear()
    return diffYears > 50
  }

  function formatSmartDate(dateString: string | null | undefined): string {
    if (!dateString) return t('dates.unknown', 'Unknown')
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return t('dates.unknown', 'Unknown')
      if (isPermanent(date)) return t('dates.permanent', 'Permanent')
      return shortDateFormatter.value.format(date)
    } catch {
      return t('dates.unknown', 'Unknown')
    }
  }

  function formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) return t('dates.unknown', 'Unknown')
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return t('dates.unknown', 'Unknown')
      if (isPermanent(date)) return t('dates.permanent', 'Permanent')
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
      if (isPermanent(date)) return t('dates.permanent', 'Permanent')
      return fullDateFormatter.value.format(date)
    } catch {
      return t('dates.unknown', 'Unknown')
    }
  }

  function formatFullDateTime(dateString: string | null | undefined): string {
    if (!dateString) return t('dates.unknown', 'Unknown')
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return t('dates.unknown', 'Unknown')
      if (isPermanent(date)) return t('dates.permanent', 'Permanent')
      return fullDateTimeFormatter.value.format(date)
    } catch {
      return t('dates.unknown', 'Unknown')
    }
  }

  return {
    formatSmartDate,
    formatDateTime,
    formatFullDate,
    formatFullDateTime,
  }
}
