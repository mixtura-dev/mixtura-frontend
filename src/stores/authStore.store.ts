import { type User } from '@/types/user'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import router from '@/router'
import { queryClient } from '@/api/queryClient'
import { createLogger } from '@/lib/logger'
import { getUserInfo } from '@/api/endpoints/user/user'
import { authQueryKeys } from '@/api/queries/user/keys'

const logger = createLogger('authStore')

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthLoaded = ref(false)
  const isAuthenticated = computed(() => !!user.value)

  const setUser = (userData: User) => {
    user.value = userData
  }

  const clearUser = () => {
    user.value = null
  }

  const fetchUser = async () => {
    try {
      const fetchedUser = await queryClient.ensureQueryData({
        queryKey: authQueryKeys.user(),
        queryFn: getUserInfo,
      })

      setUser(fetchedUser)
      isAuthLoaded.value = true
    } catch (error: unknown) {
      clearUser()
      isAuthLoaded.value = true
      logger.debug('No authenticated user found during auth check.', error)
    }
  }

  const handleUnauthorized = () => {
    clearUser()
    router.push('/sign-in')
  }

  return {
    user,
    isAuthLoaded,
    isAuthenticated,
    handleUnauthorized,
    setUser,
    fetchUser,
    clearUser,
  }
})
