import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from './keys'
import {
  addPlayer,
  listPlayers,
  removePlayer,
  updatePlayerRoles,
  updatePlayerStatus,
} from '@/api/endpoints/event/eventPlayer'
import type { RequestBody } from '@/types/auth'
import type { ServerID } from '@/types/user'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export function usePlayersQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  eventId: MaybeRefOrGetter<string>,
  params?: MaybeRefOrGetter<{ status?: string | null; page?: number; page_size?: number }>,
) {
  const sId = computed(() => toValue(serverId))
  const eId = computed(() => toValue(eventId))
  const p = computed(() => toValue(params))

  return useQuery({
    queryKey: computed(() => [...queryKeys.events.players.list(sId.value, eId.value), p.value]),
    queryFn: () => listPlayers(sId.value, eId.value, p.value),
    enabled: computed(() => !!sId.value && !!eId.value),
  })
}

export function useAddPlayerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      eventId,
      data,
    }: {
      serverId: ServerID
      eventId: string
      data: RequestBody<'/api/server/{server_id}/events/{event_id}/players', 'post'>
    }) => addPlayer(serverId, eventId, data),
    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.players.list(serverId, eventId),
      })
    },
  })
}

export function useUpdatePlayerStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      eventId,
      memberId,
      data,
    }: {
      serverId: ServerID
      eventId: string
      memberId: string
      data: RequestBody<'/api/server/{server_id}/events/{event_id}/players/{member_id}/status', 'patch'>
    }) => updatePlayerStatus(serverId, eventId, memberId, data),
    onSuccess: (_, { serverId, eventId, memberId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.players.detail(serverId, eventId, memberId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.players.list(serverId, eventId),
      })
    },
  })
}

export function useRemovePlayerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      eventId,
      memberId,
    }: {
      serverId: ServerID
      eventId: string
      memberId: string
    }) => removePlayer(serverId, eventId, memberId),
    onSuccess: (_, { serverId, eventId, memberId }) => {
      queryClient.removeQueries({
        queryKey: queryKeys.events.players.detail(serverId, eventId, memberId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.players.list(serverId, eventId),
      })
    },
  })
}

export function useUpdatePlayerRolesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      eventId,
      memberId,
      data,
    }: {
      serverId: ServerID
      eventId: string
      memberId: string
      data: RequestBody<'/api/server/{server_id}/events/{event_id}/players/{member_id}/roles', 'put'>
    }) => updatePlayerRoles(serverId, eventId, memberId, data),
    onSuccess: (_, { serverId, eventId, memberId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.players.detail(serverId, eventId, memberId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.players.list(serverId, eventId),
      })
    },
  })
}
