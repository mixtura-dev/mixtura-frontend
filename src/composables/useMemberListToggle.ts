import { ref } from 'vue'

const showMemberList = ref(true)

export function useMemberListToggle() {
  function toggle() {
    showMemberList.value = !showMemberList.value
  }

  return { showMemberList, toggle }
}
