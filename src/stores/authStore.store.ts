import router from '@/router'
import type { ForgotPasswordPayload, LoginPayload, RegisterPayload } from '@/types/auth'
import type { WorkspaceCreator } from '@/types/user'
import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const _user = ref<WorkspaceCreator | null>(null)
  const user = readonly(_user)
  const isAuthenticated = computed(() => !!_user.value)

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

  const resetPassword = (forgotPasswordData: ForgotPasswordPayload) => {
    throw new Error('Not implemented')
  }

  const setUserData = (data: WorkspaceCreator) => {
    _user.value = data
  }
  const cleanUserData = () => {
    _user.value = null
  }
  return {
    user,
    isAuthenticated,
    logout,
    setUserData,
    login,
    signup,
    resetPassword,
  }
})
