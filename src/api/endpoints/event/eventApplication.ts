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
> =>
  baseApi
    .get(`/api/server/${serverId}/events/applications/${applicationId}`)
    .then((res) => res.data)

export const reviewApplication = (
  serverId: ServerID,
  applicationId: string,
  data: RequestBody<'/api/server/{server_id}/events/applications/{application_id}/review', 'patch'>,
): Promise<
  SuccessResponse<'/api/server/{server_id}/events/applications/{application_id}/review', 'patch'>
> =>
  baseApi
    .patch(`/api/server/${serverId}/events/applications/${applicationId}/review`, data)
    .then((res) => res.data)

export const getApplicationForm = (
  serverId: ServerID,
  eventId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/applications/form', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/events/${eventId}/applications/form`).then((res) => res.data)

export const updateTimeSettings = (
  serverId: ServerID,
  eventId: string,
  data: RequestBody<
    '/api/server/{server_id}/events/{event_id}/applications/time_settings',
    'patch'
  >,
): Promise<
  SuccessResponse<'/api/server/{server_id}/events/{event_id}/applications/time_settings', 'patch'>
> =>
  baseApi
    .patch(`/api/server/${serverId}/events/${eventId}/applications/time_settings`, data)
    .then((res) => res.data)

export const addCustomField = (
  serverId: ServerID,
  eventId: string,
  data: RequestBody<'/api/server/{server_id}/events/{event_id}/applications/fields', 'post'>,
): Promise<
  SuccessResponse<'/api/server/{server_id}/events/{event_id}/applications/fields', 'post'>
> =>
  baseApi
    .post(`/api/server/${serverId}/events/${eventId}/applications/fields`, data)
    .then((res) => res.data)

export const updateCustomField = (
  serverId: ServerID,
  eventId: string,
  fieldId: string,
  data: RequestBody<
    '/api/server/{server_id}/events/{event_id}/applications/fields/{field_id}',
    'patch'
  >,
): Promise<
  SuccessResponse<
    '/api/server/{server_id}/events/{event_id}/applications/fields/{field_id}',
    'patch'
  >
> =>
  baseApi
    .patch(`/api/server/${serverId}/events/${eventId}/applications/fields/${fieldId}`, data)
    .then((res) => res.data)

export const deleteCustomField = (
  serverId: ServerID,
  eventId: string,
  fieldId: string,
): Promise<
  SuccessResponse<
    '/api/server/{server_id}/events/{event_id}/applications/fields/{field_id}',
    'delete'
  >
> =>
  baseApi
    .delete(`/api/server/${serverId}/events/${eventId}/applications/fields/${fieldId}`)
    .then((res) => res.data)
