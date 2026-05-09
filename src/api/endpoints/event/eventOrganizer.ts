import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const listOrganizers = (
  serverId: ServerID,
  eventId: string,
  params?: { page?: number; page_size?: number },
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/organizers', 'get'>> =>
  baseApi
    .get(`/api/server/${serverId}/events/${eventId}/organizers`, { params })
    .then((res) => res.data)

export const addOrganizer = (
  serverId: ServerID,
  eventId: string,
  data: RequestBody<'/api/server/{server_id}/events/{event_id}/organizers', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/organizers', 'post'>> =>
  baseApi
    .post(`/api/server/${serverId}/events/${eventId}/organizers`, data)
    .then((res) => res.data)

export const removeOrganizer = (
  serverId: ServerID,
  eventId: string,
  memberId: string,
): Promise<
  SuccessResponse<
    '/api/server/{server_id}/events/{event_id}/organizers/{member_id}',
    'delete'
  >
> =>
  baseApi
    .delete(`/api/server/${serverId}/events/${eventId}/organizers/${memberId}`)
    .then((res) => res.data)
