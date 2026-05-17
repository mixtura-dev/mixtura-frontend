import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from './keys'
import {
  getMatch,
  listMatches,
  recordMatchResult,
  setupMatch,
} from '@/api/endpoints/event/eventMatch'
import type { RequestBody } from '@/types/auth'
import type { ServerID } from '@/types/user'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export function useMatchesQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  eventId: MaybeRefOrGetter<string>,
  params?: MaybeRefOrGetter<{ active?: boolean | null; page?: number; page_size?: number }>,
) {
  const sId = computed(() => toValue(serverId))
  const eId = computed(() => toValue(eventId))
  const p = computed(() => toValue(params))

  return useQuery({
    queryKey: computed(() => [...queryKeys.events.matches.list(sId.value, eId.value), p.value]),
    queryFn: () => listMatches(sId.value, eId.value, p.value),
    enabled: computed(() => !!sId.value && !!eId.value),
  })
}

export function useMatchQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  matchId: MaybeRefOrGetter<string>,
) {
  const sId = computed(() => toValue(serverId))
  const mId = computed(() => toValue(matchId))

  return useQuery({
    queryKey: computed(() => queryKeys.events.matches.detail(sId.value, mId.value)),
    queryFn: () => getMatch(sId.value, mId.value),
    enabled: computed(() => !!sId.value && !!mId.value),
  })
}

export function useSetupMatchMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      eventId,
      data,
    }: {
      serverId: ServerID
      eventId: string
      data: RequestBody<'/api/server/{server_id}/events/{event_id}/matches', 'post'>
    }) => setupMatch(serverId, eventId, data),
    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.matches.list(serverId, eventId),
      })
    },
  })
}

export function useRecordMatchResultMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      matchId,
      data,
    }: {
      serverId: ServerID
      matchId: string
      data: RequestBody<'/api/server/{server_id}/events/matches/{match_id}/result', 'post'>
    }) => recordMatchResult(serverId, matchId, data),
    onSuccess: (_, { serverId, matchId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.matches.detail(serverId, matchId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.matches.list(serverId, matchId),
      })
    },
  })
}
