import type { paths, components } from '@/types/api'

export type User = paths['/api/auth/user']['get']['responses'][200]['content']['application/json']

// Серверы
export type ServerDetail =
  paths['/api/server/{server_id}']['get']['responses'][200]['content']['application/json']

export type ServerListItem =
  paths['/api/server/list/user']['get']['responses'][200]['content']['application/json'][number]

export type Server = ServerListItem
export type ServerID = Server['id']

// Инвайты
export type Invite =
  paths['/api/server/{server_id}/invites']['get']['responses'][200]['content']['application/json'][number]

export type InviteInfo =
  paths['/api/server/invites/{key}']['get']['responses'][200]['content']['application/json']

export type JoinServerResponse =
  paths['/api/server/invites/{key}']['post']['responses'][200]['content']['application/json']

export type CreateInviteBody =
  paths['/api/server/{server_id}/invites']['post']['requestBody']['content']['application/json']

export type Member =
  paths['/api/server/{server_id}/members/{member_id}']['get']['responses'][200]['content']['application/json']

export type MemberListItem =
  paths['/api/server/{server_id}/members/']['get']['responses'][200]['content']['application/json'][number]
export type CurrentMemberResponse =
  paths['/api/server/{server_id}/members/me']['get']['responses'][200]['content']['application/json']

export type ServerRole = components['schemas']['ServerRoleResponse']
export type Permission = components['schemas']['PermissionResponse']
export type Game = components['schemas']['GameResponse']
