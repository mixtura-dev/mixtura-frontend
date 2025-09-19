import './index.css'
import { createApp } from 'vue'
import App from './App.vue'
import { useApp } from './composables/useApp'

const app = createApp(App)
useApp(app)
app.mount('#app')
