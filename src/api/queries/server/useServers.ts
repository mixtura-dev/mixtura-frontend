import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from './keys'
import {
  createServer,
  deleteServer,
  deleteServerBanner,
  deleteServerIcon,
  getGlobalGames,
  getGlobalPermissions,
  getGlobalRatingTemplates,
  getGlobalRestrictions,
  getGlobalRoleTemplates,
  getServer,
  listUserServers,
  listPublicServers,
  updateServer,
  updateServerBanner,
  updateServerIcon,
} from '@/api/endpoints/server/serverCore'
import type { RequestBody } from '@/types/auth'
import type { ServerID } from '@/types/user'
import { computed, toValue, type MaybeRef } from 'vue'

// ===== QUERIES =====

export const useServersQuery = () => {
  return useQuery({
    queryKey: queryKeys.servers.list(),
    queryFn: listUserServers,
    staleTime: 5 * 60 * 1000, // 5 min
  })
}

export const usePublicServersQuery = () => {
  return useQuery({
    queryKey: [...queryKeys.servers.all, 'public'] as const,
    queryFn: listPublicServers,
    staleTime: 5 * 60 * 1000,
  })
}

export const useServerQuery = (serverId: MaybeRef<ServerID>) => {
  const id = computed(() => toValue(serverId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.detail(id.value)),
    queryFn: () => getServer(id.value),
    enabled: computed(() => !!id.value),
  })
}

export const useGlobalGamesQuery = () => {
  return useQuery({
    queryKey: queryKeys.global.games,
    queryFn: getGlobalGames,
    staleTime: 30 * 60 * 1000,
  })
}

export const useGlobalRatingTemplatesQuery = () => {
  return useQuery({
    queryKey: queryKeys.global.ratingTemplates,
    queryFn: getGlobalRatingTemplates,
    staleTime: 30 * 60 * 1000,
  })
}

export const useGlobalRestrictionsQuery = () => {
  return useQuery({
    queryKey: queryKeys.global.restrictions,
    queryFn: getGlobalRestrictions,
    staleTime: 30 * 60 * 1000,
  })
}

export const useGlobalRoleTemplatesQuery = () => {
  return useQuery({
    queryKey: queryKeys.global.roleTemplates,
    queryFn: getGlobalRoleTemplates,
    staleTime: 30 * 60 * 1000,
  })
}

export const useGlobalPermissionsQuery = () => {
  return useQuery({
    queryKey: queryKeys.global.permissions,
    queryFn: getGlobalPermissions,
    staleTime: 30 * 60 * 1000,
  })
}

// ===== MUTATIONS =====

export const useCreateServerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestBody<'/api/server/', 'post'>) => createServer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.list() })
    },
  })
}

export const useDeleteServerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (serverId: ServerID) => deleteServer(serverId),
    onSuccess: (_, serverId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.list() })
      queryClient.removeQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}

export const useUpdateServerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      data,
    }: {
      serverId: ServerID
      data: RequestBody<'/api/server/{server_id}', 'patch'>
    }) => updateServer(serverId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.list() })
    },
  })
}

export const useUpdateServerBannerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, banner }: { serverId: ServerID; banner: File }) =>
      updateServerBanner(serverId, banner),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.list() })
    },
  })
}

export const useDeleteServerBannerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (serverId: ServerID) => deleteServerBanner(serverId),
    onSuccess: (_, serverId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}

export const useUpdateServerIconMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, icon }: { serverId: ServerID; icon: File }) =>
      updateServerIcon(serverId, icon),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.list() })
    },
  })
}

export const useDeleteServerIconMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (serverId: ServerID) => deleteServerIcon(serverId),
    onSuccess: (_, serverId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.list() })
    },
  })
}
