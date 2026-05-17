import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const createDraft = (
  serverId: ServerID,
  eventId: string,
  data: RequestBody<'/api/server/{server_id}/events/{event_id}/drafts', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/drafts', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/events/${eventId}/drafts`, data).then((res) => res.data)

export const listDrafts = (
  serverId: ServerID,
  eventId: string,
  params?: { page?: number; page_size?: number },
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/drafts', 'get'>> =>
  baseApi
    .get(`/api/server/${serverId}/events/${eventId}/drafts`, { params })
    .then((res) => res.data)

export const getDraft = (
  serverId: ServerID,
  draftId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/events/drafts/{draft_id}', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/events/drafts/${draftId}`).then((res) => res.data)

export const runTeamFormation = (
  serverId: ServerID,
  draftId: string,
  data: RequestBody<'/api/server/{server_id}/events/drafts/{draft_id}/team-formation', 'post'>,
): Promise<
  SuccessResponse<'/api/server/{server_id}/events/drafts/{draft_id}/team-formation', 'post'>
> =>
  baseApi
    .post(`/api/server/${serverId}/events/drafts/${draftId}/team-formation`, data)
    .then((res) => res.data)

export const getTeamFormation = (
  serverId: ServerID,
  draftId: string,
  params?: { page?: number; page_size?: number },
): Promise<
  SuccessResponse<'/api/server/{server_id}/events/drafts/{draft_id}/team-formation', 'get'>
> =>
  baseApi
    .get(`/api/server/${serverId}/events/drafts/${draftId}/team-formation`, { params })
    .then((res) => res.data)

export const chooseTeamFormationVariant = (
  serverId: ServerID,
  draftId: string,
  variantId: string,
): Promise<
  SuccessResponse<
    '/api/server/{server_id}/events/drafts/{draft_id}/team-formation/variants/{variant_id}/choose',
    'post'
  >
> =>
  baseApi
    .post(
      `/api/server/${serverId}/events/drafts/${draftId}/team-formation/variants/${variantId}/choose`,
    )
    .then((res) => res.data)
