import { useAuthStore } from '@/stores/authStore.store'
import type { Role } from '@/types/user'

export const usePremission = () => {
  const { user } = useAuthStore()
  const hasRole = (role: Role): boolean => {
    return user?.role === role
  }

  const hasAnyRole = (role: Role[]) => {
    if (!user) {
      return false
    }
    return role.includes(user.role)
  }

  return {
    hasRole,
    hasAnyRole,
  }
}
