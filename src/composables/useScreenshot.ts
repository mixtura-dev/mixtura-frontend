import { type Ref, ref } from 'vue'

export function useScreenshot(targetRef: Ref<HTMLElement | null>) {
  const isLoading = ref(false)

  const makeScreenshot = async () => {
    if (!targetRef.value) return
    isLoading.value = true
    try {
      const { toBlob } = await import('html-to-image')
      const blob = await toBlob(targetRef.value, { quality: 0.9 })

      if (!blob) {
        console.error('Не удалось создать скриншот (blob пустой)')
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
      console.error('[useScreenshot]: Error when do screenshot', err)
    } finally {
      isLoading.value = false
    }
  }

  return { makeScreenshot, isLoading }
}
