import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const createServerInvite = (
  serverId: ServerID,
  data: RequestBody<'/api/server/{server_id}/invites', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/invites', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/invites`, data).then((res) => res.data)

export const getServerInvites = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/server/{server_id}/invites', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/invites`).then((res) => res.data)

export const getInviteByKey = (
  key: string,
): Promise<SuccessResponse<'/api/server/invites/{key}', 'get'>> =>
  baseApi.get(`/api/server/invites/${key}`).then((res) => res.data)

export const acceptInviteByKey = (
  key: string,
  data: RequestBody<'/api/server/invites/{key}', 'post'>,
): Promise<SuccessResponse<'/api/server/invites/{key}', 'post'>> =>
  baseApi.post(`/api/server/invites/${key}`, data).then((res) => res.data)

export const deleteInviteByKey = (
  serverId: ServerID,
  inviteId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/invites/{invite_id}', 'delete'>> =>
  baseApi.delete(`/api/server/${serverId}/invites/${inviteId}`).then((res) => res.data)
