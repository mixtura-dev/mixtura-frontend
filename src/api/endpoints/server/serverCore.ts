import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const listUserServers = (): Promise<SuccessResponse<'/api/server/list/user', 'get'>> =>
  baseApi.get('/api/server/list/user').then((res) => res.data)

export const listPublicServers = (): Promise<SuccessResponse<'/api/server/list/public', 'get'>> =>
  baseApi.get('/api/server/list/public').then((res) => res.data)

export const createServer = (
  data: RequestBody<'/api/server/', 'post'>,
): Promise<SuccessResponse<'/api/server/', 'post'>> =>
  baseApi.post('/api/server/', data).then((res) => res.data)

export const deleteServer = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/server/{server_id}', 'delete'>> =>
  baseApi.delete(`/api/server/${serverId}`).then((res) => res.data)

export const getServer = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/server/{server_id}', 'get'>> =>
  baseApi.get(`/api/server/${serverId}`).then((res) => res.data)

export const updateServer = (
  serverId: ServerID,
  data: RequestBody<'/api/server/{server_id}', 'patch'>,
): Promise<SuccessResponse<'/api/server/{server_id}', 'patch'>> =>
  baseApi.patch(`/api/server/${serverId}`, data).then((res) => res.data)

export const getGlobalGames = (): Promise<SuccessResponse<'/api/server/global/games', 'get'>> =>
  baseApi.get('/api/server/global/games').then((res) => res.data)

export const getGlobalRatingTemplates = (): Promise<
  SuccessResponse<'/api/server/global/rating-set', 'get'>
> => baseApi.get('/api/server/global/rating-set').then((res) => res.data)

export const getGlobalRestrictions = (): Promise<
  SuccessResponse<'/api/server/global/restrictions', 'get'>
> => baseApi.get('/api/server/global/restrictions').then((res) => res.data)

export const getGlobalRoleTemplates = (): Promise<
  SuccessResponse<'/api/server/global/role-set', 'get'>
> => baseApi.get('/api/server/global/role-set').then((res) => res.data)

export const getGlobalPermissions = (): Promise<
  SuccessResponse<'/api/server/global/permissions', 'get'>
> => baseApi.get('/api/server/global/permissions').then((res) => res.data)

export const updateServerBanner = (
  serverId: ServerID,
  banner: File,
): Promise<SuccessResponse<'/api/server/{server_id}/banner', 'put'>> => {
  const formData = new FormData()
  formData.append('banner', banner)
  return baseApi.put(`/api/server/${serverId}/banner`, formData).then((res) => res.data)
}

export const deleteServerBanner = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/server/{server_id}/banner', 'delete'>> =>
  baseApi.delete(`/api/server/${serverId}/banner`).then((res) => res.data)

export const updateServerIcon = (
  serverId: ServerID,
  icon: File,
): Promise<SuccessResponse<'/api/server/{server_id}/icon', 'put'>> => {
  const formData = new FormData()
  formData.append('icon', icon)
  return baseApi.put(`/api/server/${serverId}/icon`, formData).then((res) => res.data)
}

export const deleteServerIcon = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/server/{server_id}/icon', 'delete'>> =>
  baseApi.delete(`/api/server/${serverId}/icon`).then((res) => res.data)
