import type { ServerID } from '@/types/user'
import { computed, toValue, type MaybeRef } from 'vue'
import { queryKeys } from './keys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  listServerGames,
  setServerGames,
  addGameToServer,
  removeGameFromServer,
} from '@/api/endpoints/server/serverGame'
import type { RequestBody } from '@/types/auth'

// ===== QUERIES =====

export const useServerGamesQuery = (serverId: MaybeRef<ServerID>) => {
  const id = computed(() => toValue(serverId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.games(id.value)),
    queryFn: () => listServerGames(id.value),
    enabled: computed(() => !!id.value),
  })
}

// ===== MUTATIONS =====

export const useSetServerGamesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      data,
    }: {
      serverId: ServerID
      data: RequestBody<'/api/server/{server_id}/games/', 'put'>
    }) => setServerGames(serverId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.games(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}

export const useAddGameToServerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, gameId }: { serverId: ServerID; gameId: string }) =>
      addGameToServer(serverId, gameId),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.games(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
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
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}
