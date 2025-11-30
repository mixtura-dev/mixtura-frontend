import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const addGameToServer = (
  serverId: ServerID,
  data: RequestBody<'/api/servers/{server_id}/games/', 'post'>,
): Promise<SuccessResponse<'/api/servers/{server_id}/games/', 'post'>> =>
  baseApi.post(`/api/servers/${serverId}/games/`, data).then((res) => res.data)

export const listServerGames = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/servers/{server_id}/games/', 'get'>> =>
  baseApi.get(`/api/servers/${serverId}/games/`).then((res) => res.data)

export const removeGameFromServer = (
  serverId: ServerID,
  gameId: string,
): Promise<SuccessResponse<'/api/servers/{server_id}/games/{game_id}', 'delete'>> =>
  baseApi.delete(`/api/servers/${serverId}/games/${gameId}`).then((res) => res.data)
