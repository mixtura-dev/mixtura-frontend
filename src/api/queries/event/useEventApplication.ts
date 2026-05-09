import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from './keys'
import {
  getApplication,
  listApplications,
  reviewApplication,
  submitApplication,
} from '@/api/endpoints/event/eventApplication'
import type { RequestBody } from '@/types/auth'
import type { ServerID } from '@/types/user'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

// ===== QUERIES =====

export function useApplicationsQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  eventId: MaybeRefOrGetter<string>,
) {
  const sId = computed(() => toValue(serverId))
  const eId = computed(() => toValue(eventId))

  return useQuery({
    queryKey: computed(() => queryKeys.events.applications.list(sId.value, eId.value)),
    queryFn: () => listApplications(sId.value, eId.value),
    enabled: computed(() => !!sId.value && !!eId.value),
  })
}

export function useApplicationQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  applicationId: MaybeRefOrGetter<string>,
) {
  const sId = computed(() => toValue(serverId))
  const aId = computed(() => toValue(applicationId))

  return useQuery({
    queryKey: computed(() => queryKeys.events.applications.detail(sId.value, aId.value)),
    queryFn: () => getApplication(sId.value, aId.value),
    enabled: computed(() => !!sId.value && !!aId.value),
  })
}

// ===== MUTATIONS =====

export function useSubmitApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      eventId,
      data,
    }: {
      serverId: ServerID
      eventId: string
      data: RequestBody<'/api/server/{server_id}/events/{event_id}/applications', 'post'>
    }) => submitApplication(serverId, eventId, data),
    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.applications.list(serverId, eventId),
      })
    },
  })
}

export function useReviewApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      applicationId,
      data,
    }: {
      serverId: ServerID
      eventId: string
      applicationId: string
      data: RequestBody<
        '/api/server/{server_id}/events/applications/{application_id}/review',
        'patch'
      >
    }) => reviewApplication(serverId, applicationId, data),
    onSuccess: (_, { serverId, eventId, applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.applications.detail(serverId, applicationId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.applications.list(serverId, eventId),
      })
    },
  })
}
