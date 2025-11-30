import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from './keys'
import {
  createServer,
  deleteServer,
  getGlobalGames,
  getGlobalRatingTemplates,
  getGlobalRestrictions,
  getGlobalRoleTemplates,
  listUserServers,
  updateServer,
  updateServerBanner,
  updateServerIcon,
} from '@/api/endpoints/server/serverCore'
import type { RequestBody } from '@/types/auth'
import type { ServerID } from '@/types/user'

export const useServersQuery = () => {
  return useQuery({
    queryKey: queryKeys.servers.list(),
    queryFn: listUserServers,
    staleTime: 5 * 60 * 1000, // 5 min
  })
}

export const useGlobalGamesQuery = () => {
  return useQuery({
    queryKey: queryKeys.global.games,
    queryFn: getGlobalGames,
    staleTime: 30 * 60 * 1000, // 30 min
  })
}

export const useGlobalRatingTemplatesQuery = () => {
  return useQuery({
    queryKey: queryKeys.global.ratingTemplates,
    queryFn: getGlobalRatingTemplates,
    staleTime: 30 * 60 * 1000, // 30 min
  })
}

export const useGlobalRestrictionsQuery = () => {
  return useQuery({
    queryKey: queryKeys.global.restrictions,
    queryFn: getGlobalRestrictions,
    staleTime: 30 * 60 * 1000, // 30 min
  })
}

export const useGlobalRoleTemplatesQuery = () => {
  return useQuery({
    queryKey: queryKeys.global.roleTemplates,
    queryFn: getGlobalRoleTemplates,
    staleTime: 30 * 60 * 1000, // 30 min
  })
}

export const useCreateServerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RequestBody<'/api/servers/', 'post'>) => createServer(data),
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
      data: RequestBody<'/api/servers/{server_id}', 'patch'>
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
    mutationFn: ({ serverId, banner }: { serverId: string; banner: File }) =>
      updateServerBanner(serverId, banner),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
    },
  })
}

export const useUpdateServerIconMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, icon }: { serverId: string; icon: File }) =>
      updateServerIcon(serverId, icon),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.detail(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.list() })
    },
  })
}
