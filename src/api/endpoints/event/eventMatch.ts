import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const setupMatch = (
  serverId: ServerID,
  eventId: string,
  data: RequestBody<'/api/server/{server_id}/events/{event_id}/matches', 'post'>,
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/matches', 'post'>> =>
  baseApi.post(`/api/server/${serverId}/events/${eventId}/matches`, data).then((res) => res.data)

export const listMatches = (
  serverId: ServerID,
  eventId: string,
  params?: { active?: boolean | null; page?: number; page_size?: number },
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/matches', 'get'>> =>
  baseApi
    .get(`/api/server/${serverId}/events/${eventId}/matches`, { params })
    .then((res) => res.data)

export const getMatch = (
  serverId: ServerID,
  matchId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/events/matches/{match_id}', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/events/matches/${matchId}`).then((res) => res.data)

export const recordMatchResult = (
  serverId: ServerID,
  matchId: string,
  data: RequestBody<'/api/server/{server_id}/events/matches/{match_id}/result', 'post'>,
): Promise<
  SuccessResponse<'/api/server/{server_id}/events/matches/{match_id}/result', 'post'>
> =>
  baseApi
    .post(`/api/server/${serverId}/events/matches/${matchId}/result`, data)
    .then((res) => res.data)
