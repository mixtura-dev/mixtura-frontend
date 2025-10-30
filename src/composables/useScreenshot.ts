import { type MaybeRefOrGetter, ref, toValue } from 'vue'

const QUALITY_SCREENSHOT = 0.8

export function useScreenshot(targetRef: MaybeRefOrGetter<HTMLElement | null>) {
  const isLoading = ref(false)

  const makeScreenshot = async () => {
    const target = toValue(targetRef)
    if (!target) return
    isLoading.value = true
    try {
      const { toBlob } = await import('html-to-image')
      const blob = await toBlob(target, { quality: QUALITY_SCREENSHOT })
      if (!blob) {
        console.error('[useScreenshot] Не удалось создать скриншот (blob пустой)')
        return
      }

      const now = new Date()
      const dateStr = now.toLocaleDateString('ru-RU').replace(/\./g, '-')
      const timeStr = now
        .toLocaleTimeString('ru-RU', {
          hour12: false,
          timeStyle: 'short',
        })
        .replace(/:/g, '-')
      const filename = `teams-${dateStr}-(${timeStr}).png`

      const link = document.createElement('a')
      link.download = filename
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (err) {
      console.error('[useScreenshot] Error when taking screenshot', err)
    } finally {
      isLoading.value = false
    }
  }

  return { makeScreenshot, isLoading }
}
