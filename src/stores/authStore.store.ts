import router from '@/router'
import { type User } from '@/types/user'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const setUser = (userData: User) => {
    user.value = userData
  }
  const clearUser = () => {
    user.value = null
  }
  const handleUnauthorized = () => {
    clearUser()
    router.push({ name: 'SignIn' })
  }
  return {
    user,
    isAuthenticated,
    handleUnauthorized,
    setUser,
    clearUser,
  }
})
