import type { Role } from '@/types/user'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const roleMiddleware = (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const roles = to.meta.roles as Role[]

  if (!roles) {
    return next()
  }

  next()
}
