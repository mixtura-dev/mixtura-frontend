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

  if (!to.meta.guestOnly && !authStore.isAuthenticated) {
    try {
      const user = await queryClient.fetchQuery({
        queryKey: ['auth', 'user'],
        queryFn: getUserInfo,
      })
      authStore.setUser(user)
    } catch {
      authStore.clearUser()
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      path: '/sign-in',
      query: { redirect: to.fullPath },
    })
    return
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ path: '/' })
    return
  }

  next()
}
