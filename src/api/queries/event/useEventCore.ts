import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from './keys'
import {
  activateEvent,
  cancelEvent,
  closeRegistration,
  completeEvent,
  createEvent,
  eventHealth,
  getEvent,
  listPrivateEvents,
  listPublicEvents,
  openRegistration,
  updateEvent,
} from '@/api/endpoints/event/eventCore'
import type { RequestBody } from '@/types/auth'
import type { ServerID } from '@/types/user'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

// ===== QUERIES =====

export function useEventHealthQuery() {
  return useQuery({
    queryKey: queryKeys.events.health(),
    queryFn: eventHealth,
    staleTime: 60 * 1000,
  })
}

export function usePublicEventsQuery(serverId: MaybeRefOrGetter<ServerID>) {
  const id = computed(() => toValue(serverId))

  return useQuery({
    queryKey: computed(() => queryKeys.events.list(id.value)),
    queryFn: () => listPublicEvents(id.value),
    enabled: () => !!toValue(serverId),
  })
}

export function usePrivateEventsQuery(serverId: MaybeRefOrGetter<ServerID>) {
  const id = computed(() => toValue(serverId))

  return useQuery({
    queryKey: computed(() => queryKeys.events.private(id.value)),
    queryFn: () => listPrivateEvents(id.value),
    enabled: () => !!toValue(serverId),
  })
}

export function useEventQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  eventId: MaybeRefOrGetter<string>,
) {
  const sId = computed(() => toValue(serverId))
  const eId = computed(() => toValue(eventId))

  return useQuery({
    queryKey: computed(() => queryKeys.events.detail(sId.value, eId.value)),
    queryFn: () => getEvent(sId.value, eId.value),
    enabled: computed(() => !!sId.value && !!eId.value),
  })
}

// ===== MUTATIONS =====

export function useCreateEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      data,
    }: {
      serverId: ServerID
      data: RequestBody<'/api/server/{server_id}/events/', 'post'>
    }) => createEvent(serverId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.list(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.private(serverId) })
    },
  })
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      eventId,
      data,
    }: {
      serverId: ServerID
      eventId: string
      data: RequestBody<'/api/server/{server_id}/events/{event_id}', 'patch'>
    }) => updateEvent(serverId, eventId, data),
    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(serverId, eventId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.list(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.private(serverId) })
    },
  })
}

export function useActivateEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, eventId }: { serverId: ServerID; eventId: string }) =>
      activateEvent(serverId, eventId),
    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(serverId, eventId) })
    },
  })
}

export function useOpenRegistrationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, eventId }: { serverId: ServerID; eventId: string }) =>
      openRegistration(serverId, eventId),
    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(serverId, eventId) })
    },
  })
}

export function useCloseRegistrationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, eventId }: { serverId: ServerID; eventId: string }) =>
      closeRegistration(serverId, eventId),
    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(serverId, eventId) })
    },
  })
}

export function useCancelEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, eventId }: { serverId: ServerID; eventId: string }) =>
      cancelEvent(serverId, eventId),
    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(serverId, eventId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.list(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.private(serverId) })
    },
  })
}

export function useCompleteEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, eventId }: { serverId: ServerID; eventId: string }) =>
      completeEvent(serverId, eventId),
    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(serverId, eventId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.list(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.private(serverId) })
    },
  })
}
