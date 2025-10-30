import { createPinia } from 'pinia'
import type { App } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { MotionPlugin } from '@vueuse/motion'

import { i18n } from '@/i18n'
import router from '@/router'

export const useApp = (app: App) => {
  app.use(VueQueryPlugin)
  const pinia = createPinia()
  app.use(pinia)
  app.use(MotionPlugin)
  app.use(i18n)
  app.use(router)
}
