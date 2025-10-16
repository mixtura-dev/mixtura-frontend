import {
  callbackProviders,
  confirmResetPassword,
  confirmSignUp,
  getProviders,
  resetPassword,
  signIn,
  signOut,
  signUp,
  verifyResetPassword,
  verifySignUp,
} from '@/api/endpoints/auth'
import { getUserInfo } from '@/api/endpoints/user'
import { useAuthStore } from '@/stores/authStore.store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const USER_STALE_TIME = 5 * 60 * 1000 // 5 min
const PROVIDER_STALE_TIME = 10 * 60 * 1000 // 10 min

export const authQueryKeys = {
  user: () => ['auth', 'user'] as const,
  providers: () => ['auth', 'providers'] as const,
}

export const useProvidersQuery = () => {
  return useQuery({
    queryKey: authQueryKeys.providers(),
    queryFn: getProviders,
    staleTime: PROVIDER_STALE_TIME,
  })
}

export const useUserQuery = () => {
  return useQuery({
    queryKey: authQueryKeys.user(),
    queryFn: getUserInfo,
    staleTime: USER_STALE_TIME,
    retry: false,
  })
}

export const useSignInMutation = () => {
  const authStore = useAuthStore() // ← получаем store

  return useMutation({
    mutationFn: signIn,
    onSuccess: async () => {
      // Получаем данные пользователя напрямую
      const user = await getUserInfo()
      authStore.setUser(user) // ← ЭТО ГЛАВНОЕ — запись в стор
    },
    onError: () => {
      authStore.clearUser()
    },
  })
}

export const useSignOutMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export const useSignUpMutation = () =>
  useMutation({
    mutationFn: signUp,
  })

export const useVerifySignUpMutation = () =>
  useMutation({
    mutationFn: verifySignUp,
  })

export const useConfirmSignUpMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: confirmSignUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.user() })
    },
  })
}
export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: resetPassword,
  })

export const useVerifyResetPasswordMutation = () =>
  useMutation({
    mutationFn: verifyResetPassword,
  })

export const useConfirmResetPasswordMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: confirmResetPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.user() })
    },
  })
}

export const useCallbackProvidersMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: callbackProviders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.user() })
    },
  })
}
