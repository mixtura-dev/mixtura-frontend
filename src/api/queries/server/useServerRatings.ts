import type { ServerID } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { queryKeys } from './keys'
import {
  listServerRoles,
  createServerRole,
  updateServerRole,
  deleteServerRole,
  updateServerRolePermissions,
} from '@/api/endpoints/server/serverRole'
import {
  listCustoms,
  createCustom,
  updateRatingValue,
} from '@/api/endpoints/server/serverRating'
import type { RequestBody } from '@/types/auth'

// ===== QUERIES =====

export function useServerRolesQuery(serverId: MaybeRefOrGetter<ServerID>) {
  return useQuery({
    queryKey: computed(() => queryKeys.servers.serverRoles(toValue(serverId))),
    queryFn: () => listServerRoles(toValue(serverId)),
    enabled: () => !!toValue(serverId),
  })
}

// ===== MUTATIONS =====

export const useCreateServerRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      data,
    }: {
      serverId: ServerID
      data: RequestBody<'/api/server/{server_id}/role/', 'post'>
    }) => createServerRole(serverId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.serverRoles(serverId) })
    },
  })
}

export const useUpdateServerRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      roleId,
      data,
    }: {
      serverId: ServerID
      roleId: string
      data: RequestBody<'/api/server/{server_id}/role/{role_id}', 'patch'>
    }) => updateServerRole(serverId, roleId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.serverRoles(serverId) })
    },
  })
}

export const useUpdateServerRoleSilentMutation = () => {
  return useMutation({
    mutationFn: ({
      serverId,
      roleId,
      data,
    }: {
      serverId: ServerID
      roleId: string
      data: RequestBody<'/api/server/{server_id}/role/{role_id}', 'patch'>
    }) => updateServerRole(serverId, roleId, data),
  })
}

export const useDeleteServerRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, roleId }: { serverId: ServerID; roleId: string }) =>
      deleteServerRole(serverId, roleId),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.serverRoles(serverId) })
    },
  })
}

export const useUpdateServerRolePermissionsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      roleId,
      data,
    }: {
      serverId: ServerID
      roleId: string
      data: RequestBody<'/api/server/{server_id}/role/{role_id}/permissions', 'put'>
    }) => updateServerRolePermissions(serverId, roleId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.serverRoles(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.members(serverId) })
    },
  })
}

// ===== CUSTOMS (per-member custom ratings) =====

export function useCustomsQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  memberId: MaybeRefOrGetter<string>,
) {
  const sId = computed(() => toValue(serverId))
  const mId = computed(() => toValue(memberId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.customs(sId.value, mId.value)),
    queryFn: () => listCustoms(sId.value, mId.value),
    enabled: computed(() => !!sId.value && !!mId.value),
  })
}

export function useCreateCustomMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      memberId,
    }: {
      serverId: ServerID
      memberId: string
    }) => createCustom(serverId, memberId),
    onSuccess: (_, { serverId, memberId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.servers.customs(serverId, memberId),
      })
    },
  })
}

export function useUpdateCustomRatingMutation() {
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.servers.customs(serverId, memberId),
      })
    },
  })
}
