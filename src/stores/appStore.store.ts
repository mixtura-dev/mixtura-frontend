import { useMediaQuery } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useAppStore = defineStore('app', () => {
  const state = ref({
    isDrawerOpen: false,
    disabledAnimations: false,
  })

  const isLargeScreen = useMediaQuery('(min-width: 768px)')

  const closeDrawer = () => {
    state.value.isDrawerOpen = false
  }

  watchEffect(() => {
    if (isLargeScreen.value) {
      state.value.isDrawerOpen = false
    }
  })

  return {
    closeDrawer,
    state,
  }
})
