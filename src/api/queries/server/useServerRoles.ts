import type { ServerID } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRef } from 'vue'
import { queryKeys } from './keys'
import {
  createRole,
  deleteRole,
  getRoleSet,
  updateRole,
  updateRoleIcon,
  updateRoleSet,
} from '@/api/endpoints/server/serverRole'
import type { RequestBody } from '@/types/auth'

export function useRoleSetQuery(serverId: MaybeRef<ServerID>) {
  const id = computed(() => toValue(serverId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.roleSet(id.value)),
    queryFn: () => getRoleSet(id.value),
    enabled: computed(() => !!id.value),
  })
}

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      roleSetId,
      data,
    }: {
      serverId: ServerID
      roleSetId: string
      data: RequestBody<'/api/servers/{server_id}/role-set/{role_set_id}/roles', 'post'>
    }) => createRole(serverId, roleSetId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.roleSet(serverId) })
    },
  })
}

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      roleSetId,
      roleId,
    }: {
      serverId: ServerID
      roleSetId: string
      roleId: string
    }) => deleteRole(serverId, roleSetId, roleId),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.roleSet(serverId) })
    },
  })
}

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      roleSetId,
      roleId,
      data,
    }: {
      serverId: ServerID
      roleSetId: string
      roleId: string
      data: RequestBody<'/api/servers/{server_id}/role-set/{role_set_id}/roles/{role_id}', 'patch'>
    }) => updateRole(serverId, roleSetId, roleId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.roleSet(serverId) })
    },
  })
}

export const useUpdateRoleIconMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      roleSetId,
      roleId,
      data,
    }: {
      serverId: ServerID
      roleSetId: string
      roleId: string
      data: RequestBody<
        '/api/servers/{server_id}/role-set/{role_set_id}/roles/{role_id}/icon',
        'put'
      >
    }) => updateRoleIcon(serverId, roleSetId, roleId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.roleSet(serverId) })
    },
  })
}

export const useUpdateRoleSetMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      roleSetId,
      data,
    }: {
      serverId: ServerID
      roleSetId: string
      data: RequestBody<'/api/servers/{server_id}/role-set/{role_set_id}', 'patch'>
    }) => updateRoleSet(serverId, roleSetId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.roleSet(serverId) })
    },
  })
}
