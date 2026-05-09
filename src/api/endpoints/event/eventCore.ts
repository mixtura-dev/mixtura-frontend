import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const eventHealth = (): Promise<
  SuccessResponse<'/api/server/events/health', 'get'>
> => baseApi.get('/api/server/events/health').then((res) => res.data)

export const listPublicEvents = (
  serverId: ServerID,
  params?: { page?: number; page_size?: number },
): Promise<SuccessResponse<'/api/server/{server_id}/events/', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/events/`, { params }).then((res) => res.data)

export const listPrivateEvents = (
  serverId: ServerID,
  params?: { page?: number; page_size?: number },
): Promise<SuccessResponse<'/api/server/{server_id}/events/private', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/events/private`, { params }).then((res) => res.data)

export const createEvent = (
  serverId: ServerID,
  data: RequestBody<'/api/server/{server_id}/events/', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/events/', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/events/`, data).then((res) => res.data)

export const getEvent = (
  serverId: ServerID,
  eventId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/events/${eventId}`).then((res) => res.data)

export const updateEvent = (
  serverId: ServerID,
  eventId: string,
  data: RequestBody<'/api/server/{server_id}/events/{event_id}', 'patch'>,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}', 'patch'>> =>
  baseApi.patch(`/api/server/${serverId}/events/${eventId}`, data).then((res) => res.data)

export const activateEvent = (
  serverId: ServerID,
  eventId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/activate', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/events/${eventId}/activate`).then((res) => res.data)

export const openRegistration = (
  serverId: ServerID,
  eventId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/registration/open', 'post'>> =>
  baseApi
    .post(`/api/server/${serverId}/events/${eventId}/registration/open`)
    .then((res) => res.data)

export const closeRegistration = (
  serverId: ServerID,
  eventId: string,
): Promise<
  SuccessResponse<'/api/server/{server_id}/events/{event_id}/registration/close', 'post'>
> => baseApi.post(`/api/server/${serverId}/events/${eventId}/registration/close`).then((res) => res.data)

export const cancelEvent = (
  serverId: ServerID,
  eventId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/cancel', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/events/${eventId}/cancel`).then((res) => res.data)

export const completeEvent = (
  serverId: ServerID,
  eventId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/complete', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/events/${eventId}/complete`).then((res) => res.data)
