import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const createServerInvite = (
  serverId: ServerID,
  data: RequestBody<'/api/servers/{server_id}/invites', 'post'>,
): Promise<SuccessResponse<'/api/servers/{server_id}/invites', 'post'>> =>
  baseApi.post(`/api/servers/${serverId}/invites`, data).then((res) => res.data)

export const getServerInvites = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/servers/{server_id}/invites', 'get'>> =>
  baseApi.get(`/api/servers/${serverId}/invites`).then((res) => res.data)

export const getInviteByKey = (
  key: string,
): Promise<SuccessResponse<'/api/servers/invites/{key}', 'get'>> =>
  baseApi.get(`/api/servers/invites/${key}`).then((res) => res.data)

export const acceptInviteByKey = (
  key: string,
  data: RequestBody<'/api/servers/invites/{key}', 'post'>,
): Promise<SuccessResponse<'/api/servers/invites/{key}', 'post'>> =>
  baseApi.post(`/api/servers/invites/${key}`, data).then((res) => res.data)

export const deleteInviteByKey = (
  serverId: ServerID,
  inviteId: string,
): Promise<SuccessResponse<'/api/servers/{server_id}/invites/{invite_id}', 'delete'>> =>
  baseApi.delete(`/api/servers/${serverId}/invites/${inviteId}`).then((res) => res.data)
