import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const listPlayers = (
  serverId: ServerID,
  eventId: string,
  params?: { status?: string | null; page?: number; page_size?: number },
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/players', 'get'>> =>
  baseApi
    .get(`/api/server/${serverId}/events/${eventId}/players`, { params })
    .then((res) => res.data)

export const addPlayer = (
  serverId: ServerID,
  eventId: string,
  data: RequestBody<'/api/server/{server_id}/events/{event_id}/players', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/players', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/events/${eventId}/players`, data).then((res) => res.data)

export const updatePlayerStatus = (
  serverId: ServerID,
  eventId: string,
  memberId: string,
  data: RequestBody<'/api/server/{server_id}/events/{event_id}/players/{member_id}/status', 'patch'>,
): Promise<
  SuccessResponse<'/api/server/{server_id}/events/{event_id}/players/{member_id}/status', 'patch'>
> =>
  baseApi
    .patch(`/api/server/${serverId}/events/${eventId}/players/${memberId}/status`, data)
    .then((res) => res.data)

export const removePlayer = (
  serverId: ServerID,
  eventId: string,
  memberId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/players/{member_id}', 'delete'>> =>
  baseApi
    .delete(`/api/server/${serverId}/events/${eventId}/players/${memberId}`)
    .then((res) => res.data)

export const updatePlayerRoles = (
  serverId: ServerID,
  eventId: string,
  memberId: string,
  data: RequestBody<'/api/server/{server_id}/events/{event_id}/players/{member_id}/roles', 'put'>,
): Promise<
  SuccessResponse<'/api/server/{server_id}/events/{event_id}/players/{member_id}/roles', 'put'>
> =>
  baseApi
    .put(`/api/server/${serverId}/events/${eventId}/players/${memberId}/roles`, data)
    .then((res) => res.data)
