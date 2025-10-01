import type { paths } from './api'

export interface Role {
  id: number
  name: string
}

export type User = paths['/api/auth/user']['get']['responses'][200]['content']['application/json']
