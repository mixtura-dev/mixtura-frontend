import { updateBodyClass } from '@/helpers/dom/bodyManager'
import { useMediaQuery } from '@vueuse/core'
import { defineStore } from 'pinia'
import { reactive, watchEffect } from 'vue'

type AnimationLevels = 'level-0' | 'level-1' | 'level-2'

interface AppState {
  isDrawerOpen: boolean
  animationLevel: AnimationLevels
}

export const useAppStore = defineStore('app', () => {
  const state = reactive<AppState>({
    isDrawerOpen: false,
    animationLevel: 'level-2',
  })
  const animationClasses: AnimationLevels[] = ['level-0', 'level-1', 'level-2'] as const

  const isLargeScreen = useMediaQuery('(min-width: 768px)')

  const setAnimationLevel = (level: AnimationLevels): void => {
    state.animationLevel = level
    updateBodyClass(animationClasses, level)
  }

  const closeDrawer = () => {
    state.isDrawerOpen = false
  }

  watchEffect(() => {
    if (isLargeScreen.value) {
      state.isDrawerOpen = false
    }
  })

  return {
    closeDrawer,
    setAnimationLevel,
    state,
  }
})
