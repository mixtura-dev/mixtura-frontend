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
import { queryClient } from '@/api/queryClient'
import { useAuthStore } from '@/stores/authStore.store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const USER_STALE_TIME = 5 * 60 * 1000
const PROVIDER_STALE_TIME = 10 * 60 * 1000

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
  const localQueryClient = useQueryClient()
  const authStore = useAuthStore()
  return useMutation({
    mutationFn: signIn,
    onSuccess: async () => {
      await localQueryClient.invalidateQueries({ queryKey: authQueryKeys.user() })
      const user = await queryClient.fetchQuery({
        queryKey: authQueryKeys.user(),
        queryFn: getUserInfo,
      })
      authStore.setUser(user)
    },
    onError: () => {},
  })
}

export const useSignOutMutation = () => {
  const localQueryClient = useQueryClient()
  const authStore = useAuthStore()
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      localQueryClient.clear()
      authStore.clearUser()
      authStore.isAuthLoaded = true
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
  const localQueryClient = useQueryClient()
  const authStore = useAuthStore()
  return useMutation({
    mutationFn: confirmSignUp,
    onSuccess: async () => {
      await localQueryClient.invalidateQueries({ queryKey: authQueryKeys.user() })
      const user = await queryClient.fetchQuery({
        queryKey: authQueryKeys.user(),
        queryFn: getUserInfo,
      })
      authStore.setUser(user)
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
  const localQueryClient = useQueryClient()
  const authStore = useAuthStore()
  return useMutation({
    mutationFn: confirmResetPassword,
    onSuccess: async () => {
      await localQueryClient.invalidateQueries({ queryKey: authQueryKeys.user() })
      const user = await queryClient.fetchQuery({
        queryKey: authQueryKeys.user(),
        queryFn: getUserInfo,
      })
      authStore.setUser(user)
    },
  })
}

export const useCallbackProvidersMutation = () => {
  const localQueryClient = useQueryClient()
  const authStore = useAuthStore()
  return useMutation({
    mutationFn: callbackProviders,
    onSuccess: async () => {
      await localQueryClient.invalidateQueries({ queryKey: authQueryKeys.user() })
      const user = await queryClient.fetchQuery({
        queryKey: authQueryKeys.user(),
        queryFn: getUserInfo,
      })
      authStore.setUser(user)
    },
  })
}
