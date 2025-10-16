import { useAuthStore } from '@/stores/authStore.store'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const authMiddleware = async (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()
  // const isOAuthCallback = to.path.startsWith('/oauth/callback')
  console.log('Middleware:', to.path, 'isAuthenticated:', authStore.isAuthenticated)

  if (to.meta.requiresAuth && !authStore.isAuthenticated /*&& !isOAuthCallback*/) {
    next({ path: '/sign-in', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ path: '/' })
    return
  }

  next()
}
