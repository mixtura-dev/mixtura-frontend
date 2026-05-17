import { baseApi } from '@/api/axios'
import type { SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const listTeams = (
  serverId: ServerID,
  eventId: string,
  params?: { page?: number; page_size?: number },
): Promise<SuccessResponse<'/api/server/{server_id}/events/{event_id}/teams', 'get'>> =>
  baseApi
    .get(`/api/server/${serverId}/events/${eventId}/teams`, { params })
    .then((res) => res.data)
