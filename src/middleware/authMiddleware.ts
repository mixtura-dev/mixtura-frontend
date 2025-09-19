import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const authMiddleware = (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  next()
}
