import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from './keys'
import {
  chooseTeamFormationVariant,
  createDraft,
  getDraft,
  getTeamFormation,
  listDrafts,
  runTeamFormation,
} from '@/api/endpoints/event/eventDraft'
import type { RequestBody } from '@/types/auth'
import type { ServerID } from '@/types/user'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export function useDraftsQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  eventId: MaybeRefOrGetter<string>,
  params?: MaybeRefOrGetter<{ page?: number; page_size?: number }>,
) {
  const sId = computed(() => toValue(serverId))
  const eId = computed(() => toValue(eventId))
  const p = computed(() => toValue(params))

  return useQuery({
    queryKey: computed(() => [...queryKeys.events.drafts.list(sId.value, eId.value), p.value]),
    queryFn: () => listDrafts(sId.value, eId.value, p.value),
    enabled: computed(() => !!sId.value && !!eId.value),
  })
}

export function useDraftQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  draftId: MaybeRefOrGetter<string>,
) {
  const sId = computed(() => toValue(serverId))
  const dId = computed(() => toValue(draftId))

  return useQuery({
    queryKey: computed(() => queryKeys.events.drafts.detail(sId.value, dId.value)),
    queryFn: () => getDraft(sId.value, dId.value),
    enabled: computed(() => !!sId.value && !!dId.value),
  })
}

export function useTeamFormationQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  draftId: MaybeRefOrGetter<string>,
  params?: MaybeRefOrGetter<{ page?: number; page_size?: number }>,
) {
  const sId = computed(() => toValue(serverId))
  const dId = computed(() => toValue(draftId))
  const p = computed(() => toValue(params))

  return useQuery({
    queryKey: computed(() => [...queryKeys.events.drafts.formation(sId.value, dId.value), p.value]),
    queryFn: () => getTeamFormation(sId.value, dId.value, p.value),
    enabled: computed(() => !!sId.value && !!dId.value),
  })
}

export function useCreateDraftMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      eventId,
      data,
    }: {
      serverId: ServerID
      eventId: string
      data: RequestBody<'/api/server/{server_id}/events/{event_id}/drafts', 'post'>
    }) => createDraft(serverId, eventId, data),

    onSuccess: (_, { serverId, eventId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.drafts.list(serverId, eventId),
      })
    },
  })
}

export function useRunTeamFormationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      draftId,
      data,
    }: {
      serverId: ServerID
      draftId: string
      data: RequestBody<'/api/server/{server_id}/events/drafts/{draft_id}/team-formation', 'post'>
    }) => runTeamFormation(serverId, draftId, data),
    onSuccess: (_, { serverId, draftId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.drafts.formation(serverId, draftId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.drafts.detail(serverId, draftId),
      })
    },
  })
}

export function useChooseTeamFormationVariantMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      draftId,
      variantId,
    }: {
      serverId: ServerID
      draftId: string
      variantId: string
    }) => chooseTeamFormationVariant(serverId, draftId, variantId),
    onSuccess: (_, { serverId, draftId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.drafts.formation(serverId, draftId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.drafts.detail(serverId, draftId),
      })
    },
  })
}
