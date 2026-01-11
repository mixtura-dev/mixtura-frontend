import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CurrentMemberResponse, ServerID } from '@/types/user' // Убедитесь, что ServerID импортирован
import { ACTIONS, PERMISSION_CODES, type ActionKey, type PermissionCode } from '@/types/permissions'

export const useCurrentMemberStore = defineStore('currentMember', () => {
  const currentMemberData = ref<CurrentMemberResponse | null>(null)
  const currentServerId = ref<ServerID | null>(null)
  const userServerIds = ref<Set<ServerID>>(new Set())

  const memberId = computed(() => currentMemberData.value?.member.id ?? null)
  const userId = computed(() => currentMemberData.value?.member.user_id ?? null)

  const permissions = computed<Set<string>>(() => {
    const perms = currentMemberData.value?.permissions ?? []
    return new Set(perms.map((p) => p.code))
  })

  const isMemberOf = computed(() => (serverId: ServerID) => userServerIds.value.has(serverId))

  const hasPermission = (code: PermissionCode): boolean => {
    return permissions.value.has(code)
  }

  const canPerformAction = (action: ActionKey): boolean => {
    const requiredPerms = ACTIONS[action]
    return (
      hasPermission(PERMISSION_CODES.ADMINISTRATOR) ||
      requiredPerms.some((perm) => hasPermission(perm as PermissionCode))
    )
  }

  const canActOnMember = (targetMemberId: string, action: ActionKey): boolean => {
    if (targetMemberId === memberId.value) {
      switch (action) {
        case 'KICK_MEMBER':
        case 'MANAGE_RESTRICTIONS':
          return false
        case 'EDIT_NICKNAME':
        case 'VIEW_RESTRICTIONS':
        case 'MIGRATE_VIRTUAL':
          return canPerformAction(action)
        default:
          return false
      }
    }

    return canPerformAction(action)
  }

  function setCurrentMember(memberData: CurrentMemberResponse | null, serverId: ServerID | null) {
    currentMemberData.value = memberData
    currentServerId.value = serverId
  }

  function setUserServers(serverIDs: ServerID[]) {
    userServerIds.value = new Set(serverIDs)
  }

  function addServer(serverId: ServerID) {
    userServerIds.value.add(serverId)
  }

  function clear() {
    currentMemberData.value = null
    currentServerId.value = null
    userServerIds.value = new Set()
  }

  return {
    currentMemberData,
    currentServerId,
    memberId,
    userId,
    permissions,
    isMemberOf,
    hasPermission,
    canPerformAction,
    canActOnMember,
    setCurrentMember,
    setUserServers,
    addServer,
    clear,
  }
})
