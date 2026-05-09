import { ref } from 'vue'

const showInviteDialog = ref(false)
const showRolesDialog = ref(false)
const showRestrictionsDialog = ref(false)
const showCreateVirtualDialog = ref(false)

export function useServerDialogs() {
  return {
    showInviteDialog,
    showRolesDialog,
    showRestrictionsDialog,
    showCreateVirtualDialog,
  }
}
