import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { useServerQuery, useCurrentMemberQuery } from '@/api/queries/server'
import { useServerDialogs } from '@/composables/useServerDialogs'
import { useMemberListToggle } from '@/composables/useMemberListToggle'
import type { ServerID } from '@/types/user'

export function useServerPage() {
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const serverId = computed<ServerID>(() => route.params.serverId as ServerID)

  const { data: server, isError: isServerError } = useServerQuery(serverId)
  const {
    data: currentMember,
    isLoading: isLoadingCurrentMember,
    isError: isMemberError,
  } = useCurrentMemberQuery(serverId)

  const showProfileDialog = ref(false)
  const showMyRestrictionsDialog = ref(false)
  const showLeaveDialog = ref(false)
  const showMigrateDialog = ref(false)
  const selectedMemberId = ref<string | null>(null)
  const migratingMemberId = ref<string | null>(null)

  const { showMemberList } = useMemberListToggle()
  const {
    showInviteDialog,
    showRolesDialog,
    showRestrictionsDialog,
    showCreateVirtualDialog,
  } = useServerDialogs()

  const currentMemberId = computed(() => currentMember.value?.member.id ?? null)

  const shouldRedirectOnError = computed(
    () => !isLoadingCurrentMember.value && (isServerError.value || isMemberError.value),
  )

  watch(shouldRedirectOnError, (redirect) => {
    if (redirect) {
      toast.error(t('server.page.notFoundOrAccessDenied'))
      router.replace('/')
    }
  })

  function openProfile(memberId: string) {
    selectedMemberId.value = memberId
    showProfileDialog.value = true
  }

  function openLeave() {
    showLeaveDialog.value = true
  }

  function openMyRestrictions() {
    showMyRestrictionsDialog.value = true
  }

  function handleSelectMember(memberId: string) {
    openProfile(memberId)
  }

  function handleMigrateMember(memberId: string) {
    migratingMemberId.value = memberId
    showMigrateDialog.value = true
  }

  function handleViewOwnProfile() {
    const id = currentMemberId.value
    if (id) openProfile(id)
  }

  return {
    serverId,
    server,
    currentMember,
    currentMemberId,
    isLoadingCurrentMember,
    showProfileDialog,
    showMyRestrictionsDialog,
    showLeaveDialog,
    showMigrateDialog,
    showInviteDialog,
    showRolesDialog,
    showRestrictionsDialog,
    showCreateVirtualDialog,
    selectedMemberId,
    migratingMemberId,
    showMemberList,
    handleSelectMember,
    handleMigrateMember,
    handleViewOwnProfile,
    openProfile,
    openLeave,
    openMyRestrictions,
  }
}
