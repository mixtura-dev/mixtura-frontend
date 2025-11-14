import './index.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { i18n } from './i18n'
import { MotionPlugin } from '@vueuse/motion'
import { queryClient } from './api/queryClient'
import copy from './directives/copy'
const pinia = createPinia()
import './iconify';
const app = createApp(App)
app.use(VueQueryPlugin, { queryClient })
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(MotionPlugin)

app.directive('copy', copy)

app.mount('#app')
