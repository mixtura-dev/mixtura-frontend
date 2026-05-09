import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const listApplications = (
  serverId: ServerID,
  eventId: string,
  params?: {
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLIST' | null
    page?: number
    page_size?: number
  },
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/applications', 'get'>> =>
  baseApi
    .get(`/api/server/${serverId}/events/${eventId}/applications`, { params })
    .then((res) => res.data)

export const submitApplication = (
  serverId: ServerID,
  eventId: string,
  data: RequestBody<'/api/server/{server_id}/events/{event_id}/applications', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/applications', 'post'>> =>
  baseApi
    .post(`/api/server/${serverId}/events/${eventId}/applications`, data)
    .then((res) => res.data)

export const getApplication = (
  serverId: ServerID,
  applicationId: string,
): Promise<
  SuccessResponse<'/api/server/{server_id}/events/applications/{application_id}', 'get'>
> => baseApi.get(`/api/server/${serverId}/events/applications/${applicationId}`).then((res) => res.data)

export const reviewApplication = (
  serverId: ServerID,
  applicationId: string,
  data: RequestBody<
    '/api/server/{server_id}/events/applications/{application_id}/review',
    'patch'
  >,
): Promise<
  SuccessResponse<
    '/api/server/{server_id}/events/applications/{application_id}/review',
    'patch'
  >
> =>
  baseApi
    .patch(`/api/server/${serverId}/events/applications/${applicationId}/review`, data)
    .then((res) => res.data)
