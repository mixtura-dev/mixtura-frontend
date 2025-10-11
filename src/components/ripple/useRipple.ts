import { ref, onUnmounted } from 'vue'

export interface Wave {
  x: number
  y: number
  date: number
  pointerId: number
}

const RIPPLE_DELAY = 70
const WAVE_LIFETIME = 225

export function useRipple() {
  const clicks = ref<Wave[]>([])
  const timers = new Map<number, ReturnType<typeof setTimeout>>()
  let clearTimer: ReturnType<typeof setTimeout> | null = null

  function clearClicks() {
    if (clearTimer) clearTimeout(clearTimer)
    clearTimer = setTimeout(() => (clicks.value = []), WAVE_LIFETIME)
  }

  function addClick(x: number, y: number, pointerId: number) {
    const now = Date.now()
    clicks.value = [
      ...clicks.value.filter(c => c.date + WAVE_LIFETIME > now),
      { x, y, date: now, pointerId },
    ]
    clearClicks()
    timers.delete(pointerId)
  }

  function onPointerDown(e: PointerEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    timers.set(e.pointerId, setTimeout(() => addClick(x, y, e.pointerId), RIPPLE_DELAY))
  }

  function onPointerCancel(e: PointerEvent) {
    const timer = timers.get(e.pointerId)
    if (timer) clearTimeout(timer)
    timers.delete(e.pointerId)
  }

  onUnmounted(() => {
    timers.forEach(t => clearTimeout(t))
    if (clearTimer) clearTimeout(clearTimer)
  })

  return {
    clicks,
    onPointerDown,
    onPointerCancel,
  }
}
