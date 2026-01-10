import type { ServerID } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { queryKeys } from './keys'
import {
  createRole,
  deleteRole,
  deleteRoleIcon,
  getRoleSet,
  updateRole,
  updateRoleIcon,
  updateRoleSet,
} from '@/api/endpoints/server/serverRole'
import type { RequestBody } from '@/types/auth'

// ===== QUERIES =====

export function useRoleSetQuery(serverId: MaybeRefOrGetter<ServerID>) {
  return useQuery({
    queryKey: computed(() => queryKeys.servers.roleSet(toValue(serverId))),
    queryFn: () => getRoleSet(toValue(serverId)),
    enabled: () => !!toValue(serverId),
  })
}

// ===== MUTATIONS =====

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
      data: RequestBody<'/api/server/{server_id}/role-set/{role_set_id}/role', 'post'>
    }) => createRole(serverId, roleSetId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.roleSet(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
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
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
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
      data: RequestBody<'/api/server/{server_id}/role-set/{role_set_id}/role/{role_id}', 'patch'>
    }) => updateRole(serverId, roleSetId, roleId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.roleSet(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
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
      icon,
    }: {
      serverId: ServerID
      roleSetId: string
      roleId: string
      icon: File
    }) => updateRoleIcon(serverId, roleSetId, roleId, icon),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.roleSet(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}

export const useDeleteRoleIconMutation = () => {
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
    }) => deleteRoleIcon(serverId, roleSetId, roleId),
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
      data: RequestBody<'/api/server/{server_id}/role-set/{role_set_id}', 'patch'>
    }) => updateRoleSet(serverId, roleSetId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.roleSet(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}
