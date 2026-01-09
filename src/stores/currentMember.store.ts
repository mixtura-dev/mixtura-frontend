import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CurrentMemberResponse, ServerID } from '@/types/user'
import { ACTIONS, PERMISSION_CODES, type ActionKey, type PermissionCode } from '@/types/permissions'

export const useCurrentMemberStore = defineStore('currentMember', () => {
  const currentMemberData = ref<CurrentMemberResponse | null>(null)
  const currentServerId = ref<ServerID | null>(null)

  const memberId = computed(() => currentMemberData.value?.member.id ?? null)
  const userId = computed(() => currentMemberData.value?.member.user_id ?? null)

  const permissions = computed<Set<string>>(() => {
    const perms = currentMemberData.value?.permissions ?? []
    return new Set(perms)
  })

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

  function clear() {
    currentMemberData.value = null
    currentServerId.value = null
  }

  return {
    // State
    currentMemberData,
    currentServerId,

    // Getters
    memberId,
    userId,
    permissions,

    // Methods
    hasPermission,
    canPerformAction,
    canActOnMember,
    setCurrentMember,
    clear,
  }
})
