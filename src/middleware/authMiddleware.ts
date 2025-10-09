import { useAuthStore } from '@/stores/authStore.store'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { getUserInfo } from '@/api/endpoints/user'
import { useQueryClient } from '@tanstack/vue-query'

export const authMiddleware = async (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  const isOAuthCallback = to.path.startsWith('/oauth/callback/')

  if (!isOAuthCallback && authStore.isAuthenticated === false) {
    try {
      const user = await queryClient.fetchQuery({
        queryKey: ['auth', 'user'],
        queryFn: getUserInfo,
        staleTime: 5 * 60 * 1000,
      })
      authStore.setUser(user)
    } catch {
      authStore.clearUser()
    }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ path: '/' })
    return
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      path: '/sign-in',
      query: { redirect: to.fullPath },
    })
    return
  }

  next()
}
