import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery, useMutation } from '@tanstack/vue-query'
import {
  authQueryKeys,
  useProvidersQuery,
  useUserQuery,
  useSignInMutation,
  useSignOutMutation,
  useSignUpMutation,
  useVerifySignUpMutation,
  useConfirmSignUpMutation,
  useResetPasswordMutation,
  useVerifyResetPasswordMutation,
  useConfirmResetPasswordMutation,
  useCallbackProvidersMutation,
} from '@/composables/useAuthQuery.ts'
import {
  getProviders,
  signIn,
  signOut,
  signUp,
  verifySignUp,
  confirmSignUp,
  resetPassword,
  verifyResetPassword,
  confirmResetPassword,
  callbackProviders,
} from '@/api/endpoints/auth'
import { getUserInfo } from '@/api/endpoints/user'

vi.mock('@/api/endpoints/auth', () => ({
  getProviders: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  verifySignUp: vi.fn(),
  confirmSignUp: vi.fn(),
  resetPassword: vi.fn(),
  verifyResetPassword: vi.fn(),
  confirmResetPassword: vi.fn(),
  callbackProviders: vi.fn(),
}))

vi.mock('@/api/endpoints/user', () => ({
  getUserInfo: vi.fn(),
}))

const mockQueryClient = {
  invalidateQueries: vi.fn(),
  clear: vi.fn(),
}

vi.mock('@tanstack/vue-query', async () => {
  const actual = await vi.importActual('@tanstack/vue-query')
  return {
    ...actual,
    useQueryClient: () => mockQueryClient,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
  }
})

describe('Auth Composables', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('authQueryKeys', () => {
    it('generates correct user query key', () => {
      expect(authQueryKeys.user()).toEqual(['auth', 'user'])
    })

    it('generates correct providers query key', () => {
      expect(authQueryKeys.providers()).toEqual(['auth', 'providers'])
    })
  })

  describe('useProvidersQuery', () => {
    it('returns query with correct configuration', () => {
      const mockUseQuery = vi.mocked(useQuery)
      useProvidersQuery()

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['auth', 'providers'],
        queryFn: getProviders,
        staleTime: 10 * 60 * 1000,
      })
    })
  })

  describe('useUserQuery', () => {
    it('returns query with correct configuration', () => {
      const mockUseQuery = vi.mocked(useQuery)
      useUserQuery()

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['auth', 'user'],
        queryFn: getUserInfo,
        staleTime: 5 * 60 * 1000,
        retry: false,
      })
    })
  })

  describe('useSignInMutation', () => {
    it('returns mutation with correct configuration', () => {
      const mockUseMutation = vi.mocked(useMutation)
      useSignInMutation()

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: signIn,
        onSuccess: expect.any(Function),
      })

      const onSuccess = mockUseMutation.mock.calls[0][0].onSuccess
      onSuccess()
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['auth', 'user'],
      })
    })
  })

  describe('useSignOutMutation', () => {
    it('returns mutation with correct configuration', () => {
      const mockUseMutation = vi.mocked(useMutation)
      useSignOutMutation()

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: signOut,
        onSuccess: expect.any(Function),
      })

      const onSuccess = mockUseMutation.mock.calls[0][0].onSuccess
      onSuccess()
      expect(mockQueryClient.clear).toHaveBeenCalledWith()
    })
  })

  describe('useSignUpMutation', () => {
    it('returns mutation with correct configuration', () => {
      const mockUseMutation = vi.mocked(useMutation)
      useSignUpMutation()

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: signUp,
      })
    })
  })

  describe('useVerifySignUpMutation', () => {
    it('returns mutation with correct configuration', () => {
      const mockUseMutation = vi.mocked(useMutation)
      useVerifySignUpMutation()

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: verifySignUp,
      })
    })
  })

  describe('useConfirmSignUpMutation', () => {
    it('returns mutation with correct configuration', () => {
      const mockUseMutation = vi.mocked(useMutation)
      useConfirmSignUpMutation()

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: confirmSignUp,
        onSuccess: expect.any(Function),
      })

      const onSuccess = mockUseMutation.mock.calls[0][0].onSuccess
      onSuccess()
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['auth', 'user'],
      })
    })
  })

  describe('useResetPasswordMutation', () => {
    it('returns mutation with correct configuration', () => {
      const mockUseMutation = vi.mocked(useMutation)
      useResetPasswordMutation()

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: resetPassword,
      })
    })
  })

  describe('useVerifyResetPasswordMutation', () => {
    it('returns mutation with correct configuration', () => {
      const mockUseMutation = vi.mocked(useMutation)
      useVerifyResetPasswordMutation()

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: verifyResetPassword,
      })
    })
  })

  describe('useConfirmResetPasswordMutation', () => {
    it('returns mutation with correct configuration', () => {
      const mockUseMutation = vi.mocked(useMutation)
      useConfirmResetPasswordMutation()

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: confirmResetPassword,
        onSuccess: expect.any(Function),
      })

      const onSuccess = mockUseMutation.mock.calls[0][0].onSuccess
      onSuccess()
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['auth', 'user'],
      })
    })
  })

  describe('useCallbackProvidersMutation', () => {
    it('returns mutation with correct configuration', () => {
      const mockUseMutation = vi.mocked(useMutation)
      useCallbackProvidersMutation()

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: callbackProviders,
        onSuccess: expect.any(Function),
      })

      const onSuccess = mockUseMutation.mock.calls[0][0].onSuccess
      onSuccess()
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['auth', 'user'],
      })
    })
  })
})
