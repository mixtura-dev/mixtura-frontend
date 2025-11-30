import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const listUserServers = (): Promise<SuccessResponse<'/api/servers/', 'get'>> =>
  baseApi.get('/api/servers/').then((res) => res.data)

export const createServer = (
  data: RequestBody<'/api/servers/', 'post'>,
): Promise<SuccessResponse<'/api/servers/', 'post'>> =>
  baseApi.post('/api/servers/', data).then((res) => res.data)

export const deleteServer = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/servers/{server_id}', 'delete'>> =>
  baseApi.delete(`/api/servers/${serverId}`).then((res) => res.data)

export const getServer = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/servers/{server_id}', 'get'>> =>
  baseApi.get(`/api/servers/${serverId}`).then((res) => res.data)

export const updateServer = (
  serverId: ServerID,
  data: RequestBody<'/api/servers/{server_id}', 'patch'>,
): Promise<SuccessResponse<'/api/servers/{server_id}', 'patch'>> =>
  baseApi.patch(`/api/servers/${serverId}`, data).then((res) => res.data)

export const getGlobalGames = (): Promise<SuccessResponse<'/api/servers/games', 'get'>> =>
  baseApi.get('/api/servers/games').then((res) => res.data)

export const getGlobalRatingTemplates = (): Promise<
  SuccessResponse<'/api/servers/rating-set', 'get'>
> => baseApi.get('/api/servers/rating-set').then((res) => res.data)

export const getGlobalRestrictions = (): Promise<
  SuccessResponse<'/api/servers/restrictions', 'get'>
> => baseApi.get('/api/servers/restrictions').then((res) => res.data)

export const getGlobalRoleTemplates = (): Promise<
  SuccessResponse<'/api/servers/role-set', 'get'>
> => baseApi.get('/api/servers/role-set').then((res) => res.data)

export const updateServerBanner = (
  serverId: string,
  banner: File,
): Promise<SuccessResponse<'/api/servers/{server_id}/banner', 'put'>> => {
  const formData = new FormData()
  formData.append('banner', banner)
  return baseApi.put(`/api/servers/${serverId}/banner`, formData).then((res) => res.data)
}

export const updateServerIcon = (
  serverId: string,
  icon: File,
): Promise<SuccessResponse<'/api/servers/{server_id}/icon', 'put'>> => {
  const formData = new FormData()
  formData.append('icon', icon)
  return baseApi.put(`/api/servers/${serverId}/icon`, formData).then((res) => res.data)
}
