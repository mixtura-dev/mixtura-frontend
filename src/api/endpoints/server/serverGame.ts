import { baseApi } from '@/api/axios'
import type { RequestBody, SuccessResponse } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const addGameToServer = async (
  serverId: ServerID,
  gameId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/games/', 'put'>> => {
  const currentGames = await listServerGames(serverId)
  const gameIds = [...(currentGames.map((g: { id: string }) => g.id) || []), gameId]
  return setServerGames(serverId, { ids: gameIds })
}

export const setServerGames = (
  serverId: ServerID,
  data: RequestBody<'/api/server/{server_id}/games/', 'put'>,
): Promise<SuccessResponse<'/api/server/{server_id}/games/', 'put'>> =>
  baseApi.put(`/api/server/${serverId}/games/`, data).then((res) => res.data)
export const listServerGames = (
  serverId: ServerID,
): Promise<SuccessResponse<'/api/server/{server_id}/games/', 'get'>> =>
  baseApi.get(`/api/server/${serverId}/games/`).then((res) => res.data)

export const removeGameFromServer = async (
  serverId: ServerID,
  gameId: string,
): Promise<SuccessResponse<'/api/server/{server_id}/games/', 'put'>> => {
  const currentGames = await listServerGames(serverId)
  const gameIds = (currentGames || [])
    .filter((g: { id: string }) => g.id !== gameId)
    .map((g: { id: string }) => g.id)
  return setServerGames(serverId, { ids: gameIds })
}
