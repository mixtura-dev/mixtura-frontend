import type { RequestBody, SuccessResponse } from '@/types/auth'
import { baseApi } from '../axios'

export const getUserInfo = (): Promise<SuccessResponse<'/api/auth/user', 'get'>> =>
  baseApi.get('/api/auth/user').then((res) => res.data)

export const updateUsername = (
  data: RequestBody<'/api/auth/user', 'put'>,
): Promise<SuccessResponse<'/api/auth/user', 'put'>> =>
  baseApi.put('/api/auth/user', data).then((res) => res.data)

export const checkUsernameTaken = (username: string) => {}
