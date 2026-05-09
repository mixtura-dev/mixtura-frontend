import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from './keys'
import { addOrganizer, listOrganizers, removeOrganizer } from '@/api/endpoints/event/eventOrganizer'
import type { RequestBody } from '@/types/auth'
import type { ServerID } from '@/types/user'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

// ===== QUERIES =====

export function useOrganizersQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  eventId: MaybeRefOrGetter<string>,
) {
  const sId = computed(() => toValue(serverId))
  const eId = computed(() => toValue(eventId))

  return useQuery({
    queryKey: computed(() => queryKeys.events.organizers.list(sId.value, eId.value)),
    queryFn: () => listOrganizers(sId.value, eId.value),
    enabled: computed(() => !!sId.value && !!eId.value),
  })
}

// ===== MUTATIONS =====

export function useAddOrganizerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      eventId,
      data,
    }: {
      serverId: ServerID
      eventId: string
      data: RequestBody<'/api/server/{server_id}/events/{event_id}/organizers', 'post'>
    }) => addOrganizer(serverId, eventId, data),
    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.organizers.list(serverId, eventId),
      })
    },
  })
}

export function useRemoveOrganizerMutation() {
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
    }) => removeOrganizer(serverId, eventId, memberId),
    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.organizers.list(serverId, eventId),
      })
    },
  })
}
