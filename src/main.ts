import './index.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { i18n } from './i18n'
import { MotionPlugin } from '@vueuse/motion'
import { queryClient } from './api/queryClient'
import Vue3Lottie from 'vue3-lottie'
const pinia = createPinia()

const app = createApp(App)
app.use(VueQueryPlugin, { queryClient })
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Vue3Lottie)
app.use(MotionPlugin)

app.mount('#app')
