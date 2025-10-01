import type { RequestBody, SuccessResponse } from '@/types/auth'
import { baseApi } from '../axios'

export const signIn = (
  data: RequestBody<'/api/auth/signin', 'post'>,
): Promise<SuccessResponse<'/api/auth/signin', 'post'>> =>
  baseApi.post('/api/auth/signin', data).then((res) => res.data)

export const signUp = (
  data: RequestBody<'/api/auth/signup', 'post'>,
): Promise<SuccessResponse<'/api/auth/signup', 'post'>> =>
  baseApi.post('/api/auth/signup', data).then((res) => res.data)

export const verifySignUp = (
  data: RequestBody<'/api/auth/signup/verify', 'post'>,
): Promise<SuccessResponse<'/api/auth/signup/verify', 'post'>> =>
  baseApi.post('/api/auth/signup/verify', data).then((res) => res.data)

export const confirmSignUp = (
  data: RequestBody<'/api/auth/signup/confirm', 'post'>,
): Promise<SuccessResponse<'/api/auth/signup/confirm', 'post'>> =>
  baseApi.post('/api/auth/signup/confirm', data).then((res) => res.data)

export const signOut = (): Promise<SuccessResponse<'/api/auth/signout', 'post'>> =>
  baseApi.post('/api/auth/signout').then((res) => res.data)

export const getProviders = (): Promise<SuccessResponse<'/api/auth/providers', 'get'>> =>
  baseApi.get('/api/auth/providers').then((res) => res.data)

export const resetPassword = (
  data: RequestBody<'/api/auth/reset', 'post'>,
): Promise<SuccessResponse<'/api/auth/reset', 'post'>> =>
  baseApi.post('/api/auth/reset', data).then((res) => res.data)

export const verifyResetPassword = (
  data: RequestBody<'/api/auth/reset/verify', 'post'>,
): Promise<SuccessResponse<'/api/auth/reset/verify', 'post'>> =>
  baseApi.post('/api/auth/reset/verify', data).then((res) => res.data)

export const confirmResetPassword = (
  data: RequestBody<'/api/auth/reset/confirm', 'post'>,
): Promise<SuccessResponse<'/api/auth/reset/confirm', 'post'>> =>
  baseApi.post('/api/auth/reset/confirm', data).then((res) => res.data)
