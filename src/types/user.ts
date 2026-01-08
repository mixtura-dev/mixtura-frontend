import type { paths } from '@/types/api'

export type ServerDetail =
  paths['/api/server/{server_id}']['get']['responses'][200]['content']['application/json']

export type ServerListItem =
  paths['/api/server/list/user']['get']['responses'][200]['content']['application/json'][number]

export type Server = ServerListItem
export type ServerID = Server['id']

export type Invite =
  paths['/api/server/{server_id}/invites']['get']['responses'][200]['content']['application/json'][number]

export type InviteInfo =
  paths['/api/server/invites/{key}']['get']['responses'][200]['content']['application/json']

export type JoinServerResponse =
  paths['/api/server/invites/{key}']['post']['responses'][200]['content']['application/json']

export type CreateInviteBody =
  paths['/api/server/{server_id}/invites']['post']['requestBody']['content']['application/json']
