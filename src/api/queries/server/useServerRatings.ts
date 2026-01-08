import type { ServerID } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRef } from 'vue'
import { queryKeys } from './keys'
import {
  createRating,
  deleteRating,
  updateRating,
  updateRatingIcon,
  updateRatingSet,
  deleteCustom,
  listCustoms,
  updateRatingValue,
} from '@/api/endpoints/server/serverRating'
import { getRatingSet } from '@/api/endpoints/server/serverRating'
import type { RequestBody } from '@/types/auth'

// ===== QUERIES =====

export const useRatingSetQuery = (serverId: MaybeRef<ServerID>) => {
  const id = computed(() => toValue(serverId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.ratingSet(id.value)),
    queryFn: () => getRatingSet(id.value),
    enabled: computed(() => !!id.value),
  })
}

export const useMemberCustomsQuery = (serverId: MaybeRef<ServerID>, memberId: MaybeRef<string>) => {
  const sId = computed(() => toValue(serverId))
  const mId = computed(() => toValue(memberId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.customs(sId.value, mId.value)),
    queryFn: () => listCustoms(sId.value, mId.value),
    enabled: computed(() => !!sId.value && !!mId.value),
  })
}

// ===== MUTATIONS =====

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
      data: RequestBody<'/api/server/{server_id}/rating-set/{rating_set_id}/ratings', 'post'>
    }) => createRating(serverId, ratingSetId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.ratingSet(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}

export const useDeleteRatingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      ratingSetId,
      ratingId,
    }: {
      serverId: ServerID
      ratingSetId: string
      ratingId: string
    }) => deleteRating(serverId, ratingSetId, ratingId),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.ratingSet(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}

export const useUpdateRatingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      ratingSetId,
      ratingId,
      data,
    }: {
      serverId: ServerID
      ratingSetId: string
      ratingId: string
      data: RequestBody<
        '/api/server/{server_id}/rating-set/{rating_set_id}/ratings/{rating_id}',
        'patch'
      >
    }) => updateRating(serverId, ratingSetId, ratingId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.ratingSet(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}

export const useUpdateRatingIconMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      ratingSetId,
      ratingId,
      icon,
    }: {
      serverId: ServerID
      ratingSetId: string
      ratingId: string
      icon: File
    }) => updateRatingIcon(serverId, ratingSetId, ratingId, icon),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.ratingSet(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}

export const useUpdateRatingSetMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      ratingSetId,
      data,
    }: {
      serverId: ServerID
      ratingSetId: string
      data: RequestBody<'/api/server/{server_id}/rating-set/{rating_set_id}', 'patch'>
    }) => updateRatingSet(serverId, ratingSetId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.ratingSet(serverId) })
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
        '/api/server/{server_id}/members/{member_id}/customs/{custom_id}/ratings/{game_role_id}',
        'put'
      >
    }) => updateRatingValue(serverId, memberId, customId, gameRoleId, data),
    onSuccess: (_, { serverId, memberId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.customs(serverId, memberId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.member(serverId, memberId) })
    },
  })
}
