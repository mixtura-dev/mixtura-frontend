import type { ServerID } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRef } from 'vue'
import { queryKeys } from './keys'
import {
  acceptInviteByKey,
  createServerInvite,
  deleteInviteByKey,
  getInviteByKey,
  getServerInvites,
} from '@/api/endpoints/server/serverInvite'
import type { RequestBody } from '@/types/auth'

// ===== QUERIES =====

export const useServerInvitesQuery = (serverId: MaybeRef<ServerID>) => {
  const id = computed(() => toValue(serverId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.invites(id.value)),
    queryFn: () => getServerInvites(id.value),
    enabled: computed(() => !!id.value),
  })
}

export const useInviteByKeyQuery = (key: MaybeRef<string>) => {
  const inviteKey = computed(() => toValue(key))

  return useQuery({
    queryKey: computed(() => queryKeys.invites.byKey(inviteKey.value)),
    queryFn: () => getInviteByKey(inviteKey.value),
    enabled: computed(() => !!inviteKey.value),
    retry: false,
  })
}

// ===== MUTATIONS =====

export const useCreateInviteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      data,
    }: {
      serverId: ServerID
      data: RequestBody<'/api/server/{server_id}/invites', 'post'>
    }) => createServerInvite(serverId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.invites(serverId) })
    },
  })
}

export const useAcceptInviteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      key,
      data,
    }: {
      key: string
      data: RequestBody<'/api/server/invites/{key}', 'post'>
    }) => acceptInviteByKey(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.list() })
    },
  })
}

export const useDeleteInviteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, inviteId }: { serverId: ServerID; inviteId: string }) =>
      deleteInviteByKey(serverId, inviteId),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.invites(serverId) })
    },
  })
}
