import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { ActionKey } from '@/types/permissions'
import { useCurrentMemberStore } from '@/stores/currentMember.store'

export function useServerPermissions() {
  const store = useCurrentMemberStore()

  const currentMemberId = computed(() => store.memberId)

  function can(action: ActionKey): boolean {
    return store.canPerformAction(action)
  }

  function canActOn(targetMemberId: MaybeRefOrGetter<string>, action: ActionKey): boolean {
    return store.canActOnMember(toValue(targetMemberId), action)
  }

  function isMe(memberId: MaybeRefOrGetter<string>): boolean {
    return toValue(memberId) === currentMemberId.value
  }

  return {
    currentMemberId,
    can,
    canActOn,
    isMe,
  }
}
