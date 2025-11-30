import { useAuthStore } from '@/stores/authStore.store'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
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
      await authStore.fetchUser()
    } catch (error) {
      logger.debug('User fetch failed (likely guest)', error)
    }
  }

  if (
    to.meta.requiresAuth &&
    !authStore.isAuthenticated &&
    !isOAuthCallback &&
    !to.meta.guestOnly
  ) {
    next({ path: '/sign-in', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ path: '/' })
    return
  }

  next()
}
