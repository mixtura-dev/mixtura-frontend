import type { ServerID } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRef } from 'vue'
import { queryKeys } from './keys'
import {
  createRating,
  deleteCustom,
  getCustom,
  listCustoms,
  updateRatingValue,
} from '@/api/endpoints/server/serverRating'
import type { RequestBody } from '@/types/auth'

export const useMemberCustomsQuery = (serverId: MaybeRef<ServerID>, memberId: MaybeRef<string>) => {
  const sId = computed(() => toValue(serverId))
  const mId = computed(() => toValue(memberId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.customs(sId.value, mId.value)),
    queryFn: () => listCustoms(sId.value, mId.value),
    enabled: computed(() => !!sId.value && !!mId.value),
  })
}

export const useMemberCustomQuery = (
  serverId: MaybeRef<ServerID>,
  memberId: MaybeRef<string>,
  customId: MaybeRef<string>,
) => {
  const sId = computed(() => toValue(serverId))
  const mId = computed(() => toValue(memberId))
  const cId = computed(() => toValue(customId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.custom(sId.value, mId.value, cId.value)),
    queryFn: () => getCustom(sId.value, mId.value, cId.value),
    enabled: computed(() => !!sId.value && !!mId.value && !!cId.value),
  })
}

export const useCreateRatingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      ratingSetId,
      data,
    }: {
      serverId: ServerID
      ratingSetId: string
      data: RequestBody<'/api/servers/{server_id}/rating-set/{rating_set_id}/ratings', 'post'>
    }) => createRating(serverId, ratingSetId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}

export const useDeleteCustomMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      memberId,
      customId,
    }: {
      serverId: ServerID
      memberId: string
      customId: string
    }) => deleteCustom(serverId, memberId, customId),
    onSuccess: (_, { serverId, memberId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.customs(serverId, memberId) })
    },
  })
}

export const useUpdateRatingValueMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      memberId,
      customId,
      gameRoleId,
      data,
    }: {
      serverId: ServerID
      memberId: string
      customId: string
      gameRoleId: string
      data: RequestBody<
        '/api/servers/{server_id}/members/{member_id}/customs/{custom_id}/ratings/{game_role_id}',
        'put'
      >
    }) => updateRatingValue(serverId, memberId, customId, gameRoleId, data),
    onSuccess: (_, { serverId, memberId, customId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.servers.custom(serverId, memberId, customId),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.customs(serverId, memberId) })
    },
  })
}
