import type { ServerID } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRef } from 'vue'
import { queryKeys } from './keys'
import {
  addRestriction,
  createVirtualMember,
  getMember,
  getRestrictions,
  joinServer,
  kickMember,
  listMembers,
  migrateMember,
  removeRestriction,
  updateMember,
} from '@/api/endpoints/server/serverMembers'
import type { RequestBody } from '@/types/auth'

// ===== QUERIES =====

export const useServerMembersQuery = (serverId: MaybeRef<ServerID>) => {
  const id = computed(() => toValue(serverId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.members(id.value)),
    queryFn: () => listMembers(id.value),
    enabled: computed(() => !!id.value),
  })
}

export const useServerMemberQuery = (serverId: MaybeRef<ServerID>, memberId: MaybeRef<string>) => {
  const sId = computed(() => toValue(serverId))
  const mId = computed(() => toValue(memberId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.member(sId.value, mId.value)),
    queryFn: () => getMember(sId.value, mId.value),
    enabled: computed(() => !!sId.value && !!mId.value),
  })
}

export const useMemberRestrictionsQuery = (
  serverId: MaybeRef<ServerID>,
  memberId: MaybeRef<string>,
) => {
  const sId = computed(() => toValue(serverId))
  const mId = computed(() => toValue(memberId))

  return useQuery({
    queryKey: computed(() => queryKeys.servers.restrictions(sId.value, mId.value)),
    queryFn: () => getRestrictions(sId.value, mId.value),
    enabled: computed(() => !!sId.value && !!mId.value),
  })
}

// ===== MUTATIONS =====

export const useJoinServerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      data,
    }: {
      serverId: ServerID
      data: RequestBody<'/api/server/{server_id}/members/', 'post'>
    }) => joinServer(serverId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.members(serverId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.list() })
    },
  })
}

export const useKickMemberMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serverId, memberId }: { serverId: ServerID; memberId: string }) =>
      kickMember(serverId, memberId),
    onSuccess: (_, { serverId, memberId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.members(serverId) })
      queryClient.removeQueries({ queryKey: queryKeys.servers.member(serverId, memberId) })
    },
  })
}

export const useUpdateMemberMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      memberId,
      data,
    }: {
      serverId: ServerID
      memberId: string
      data: RequestBody<'/api/server/{server_id}/members/{member_id}', 'patch'>
    }) => updateMember(serverId, memberId, data),
    onSuccess: (_, { serverId, memberId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.member(serverId, memberId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.members(serverId) })
    },
  })
}

export const useCreateVirtualMemberMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      data,
    }: {
      serverId: ServerID
      data: RequestBody<'/api/server/{server_id}/members/virtual', 'post'>
    }) => createVirtualMember(serverId, data),
    onSuccess: (_, { serverId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.members(serverId) })
    },
  })
}

export const useMigrateMemberMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      memberId,
      data,
    }: {
      serverId: ServerID
      memberId: string
      data: RequestBody<'/api/server/{server_id}/members/{member_id}/migrate', 'post'>
    }) => migrateMember(serverId, memberId, data),
    onSuccess: (_, { serverId, memberId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.member(serverId, memberId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.servers.members(serverId) })
    },
  })
}

export const useAddRestrictionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      memberId,
      data,
    }: {
      serverId: ServerID
      memberId: string
      data: RequestBody<'/api/server/{server_id}/members/{member_id}/restrictions', 'post'>
    }) => addRestriction(serverId, memberId, data),
    onSuccess: (_, { serverId, memberId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.servers.restrictions(serverId, memberId),
      })
    },
  })
}

export const useRemoveRestrictionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      serverId,
      memberId,
      restrictionId,
    }: {
      serverId: ServerID
      memberId: string
      restrictionId: string
    }) => removeRestriction(serverId, memberId, restrictionId),
    onSuccess: (_, { serverId, memberId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.servers.restrictions(serverId, memberId),
      })
    },
  })
}
