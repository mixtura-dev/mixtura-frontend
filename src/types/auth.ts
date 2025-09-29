export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  username: string
  password: string
  password_again: string
}

export interface ForgotPasswordPayload {
  email: string
}
