import type { paths } from '@/types/api'

export type SuccessResponse<T extends keyof paths, M extends keyof paths[T]> = paths[T][M] extends {
  responses: { 200: { content: { 'application/json': infer Json } } }
}
  ? Json
  : never

export type RequestBody<T extends keyof paths, M extends keyof paths[T]> = paths[T][M] extends {
  requestBody: { content: { 'application/json': infer Json } }
}
  ? Json
  : never

export interface LoginPayload {
  username: string
  password: string
}

export interface SignupPayload {
  username: string
  password: string
  password_again: string
}

export interface ForgotPasswordPayload {
  email: string
}
