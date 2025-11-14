import { useAuthStore } from '@/stores/authStore.store'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { authQueryKeys } from '@/composables/useAuthQuery'
import { queryClient } from '@/api/queryClient'
import { createLogger } from '@/lib/logger'

const logger = createLogger('authMiddleware')

export const authMiddleware = async (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()
  const isOAuthCallback = to.path.startsWith('/oauth/callback')

  logger.debug('Auth middleware triggered', {
    to: to.fullPath,
    isOAuthCallback,
    isAuthLoaded: authStore.isAuthLoaded,
    isAuthenticated: authStore.isAuthenticated,
  })

  if (!authStore.isAuthLoaded) {
    try {
      const { getUserInfo } = await import('@/api/endpoints/user')

      const user = await queryClient.ensureQueryData({
        queryKey: authQueryKeys.user(),
        queryFn: getUserInfo,
      })
      authStore.setUser(user)
    } catch (error: unknown) {
      authStore.clearUser()
      logger.debug('No authenticated user found during auth check.', error)
    }
    authStore.isAuthLoaded = true
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated && !isOAuthCallback) {
    next({ path: '/sign-in', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ path: '/' })
    return
  }

  next()
}
