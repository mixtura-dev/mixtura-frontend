import type { ServerID } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { queryKeys } from './keys'
import {
  listServerRoles,
  createServerRole,
  updateServerRole,
  deleteServerRole,
  updateServerRolePermissions,
} from '@/api/endpoints/server/serverRole'
import type { RequestBody } from '@/types/auth'

// ===== QUERIES =====

export function useServerRolesQuery(serverId: MaybeRefOrGetter<ServerID>) {
  return useQuery({
    queryKey: queryKeys.servers.serverRoles(toValue(serverId)),
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
