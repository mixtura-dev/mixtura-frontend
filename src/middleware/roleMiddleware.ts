import { useAuthStore } from '@/stores/authStore.store'
import type { Role } from '@/types/user'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const roleMiddleware = (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const { user } = useAuthStore()
  const roles = to.meta.roles as Role[]

  if (!roles) {
    return next()
  }

  if (!user || !roles.includes(user.role)) {
    return next('/403')
  }

  next()
}
