import router from '@/router'
import type { LoginPayload, RegisterPayload } from '@/types/auth'
import type { WorkspaceCreator } from '@/types/user'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<WorkspaceCreator | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const logout = () => {
    cleanUserData()
    router.push('/sign-in')
  }
  const login = async (loginData: LoginPayload) => {
    throw new Error('Not implemented')
  }
  const signup = (signupData: RegisterPayload) => {
    throw new Error('Not implemented')
  }

  const setUserData = () => {
    throw new Error('Not implemented')
  }

  const cleanUserData = () => {
    user.value = null
  }
  return {
    user,
    isAuthenticated,
    logout,
    setUserData,
    login,
    signup,
  }
})
