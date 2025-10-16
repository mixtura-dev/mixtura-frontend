import './index.css'
import { createApp } from 'vue'
import App from './App.vue'
import { useApp } from './composables/useApp'
import { useAuthStore } from './stores/authStore.store'
import { QueryClient } from '@tanstack/vue-query'
import { authQueryKeys } from './composables/useAuthQuery'
import { getUserInfo } from './api/endpoints/user'
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})
const app = createApp(App)
useApp(app)
const authStore = useAuthStore()
queryClient
  .fetchQuery({
    queryKey: authQueryKeys.user(),
    queryFn: getUserInfo,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
  .then((user) => {
    authStore.setUser(user)
  })
  .catch(() => {
    authStore.clearUser()
  })
  .finally(() => {
    import('@/router').then(({ default: router }) => {
      app.use(router)
      app.mount('#app')
    })
  })
