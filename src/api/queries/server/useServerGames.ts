import type { ServerID } from '@/types/user'
import { computed, toValue, type MaybeRef } from 'vue'
import { queryKeys } from './keys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  addGameToServer,
  listServerGames,
  removeGameFromServer,
} from '@/api/endpoints/server/serverGame'
import type { RequestBody } from '@/types/auth'

export const useServerGamesQuery = (serverId: MaybeRef<ServerID>) => {
  const id = computed(() => toValue(serverId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.games(id.value)),
    queryFn: () => listServerGames(id.value),
    enabled: computed(() => !!id.value),
  })
}
export const useAddGameToServerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      data,
    }: {
      serverId: ServerID
      data: RequestBody<'/api/servers/{server_id}/games/', 'post'>
    }) => addGameToServer(serverId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.games(serverId) })
    },
  })
}

export const useRemoveGameFromServerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, gameId }: { serverId: ServerID; gameId: string }) =>
      removeGameFromServer(serverId, gameId),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.games(serverId) })
    },
  })
}
