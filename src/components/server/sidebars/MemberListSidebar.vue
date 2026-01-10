<template>
  <aside class="flex w-60 flex-shrink-0 flex-col border-l bg-background">
    <header class="flex shrink-0 items-center gap-2 border-b p-2">
      <div class="relative flex-1">
        <Search class="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="searchQuery" class="h-8 pl-8" placeholder="Search members..." />
      </div>
    </header>

    <div v-if="isLoading" class="flex flex-1 items-center justify-center">
      <Loader2 class="size-6 animate-spin text-muted-foreground" />
    </div>

    <div
      v-else-if="filteredMembers.length > 0"
      class="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-2"
    >
      <MemberListItem
        v-for="member in filteredMembers"
        :key="member.id"
        :member="member"
        :server-id="serverId"
        @view-profile="handleViewProfile"
        @edit="handleEdit"
        @add-restriction="handleAddRestriction"
        @kick="handleKick"
      />
    </div>

    <div v-else class="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <Users class="mb-2 size-8 text-muted-foreground/50" />
      <p class="text-sm text-muted-foreground">
        {{ searchQuery ? 'No members found' : 'No members yet' }}
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Loader2, Search, Users } from 'lucide-vue-next'
import { useServerMembersQuery, useKickMemberMutation } from '@/api/queries/server'
import { getErrorMessage } from '@/composables/useApiError'
import type { ServerID } from '@/types/user'
import MemberListItem from '../member/MemberListItem.vue'

const props = defineProps<{
  serverId: ServerID
}>()

const emit = defineEmits<{
  selectMember: [memberId: string]
}>()

const searchQuery = ref('')
const serverId = computed(() => props.serverId)

const { data: members, isLoading } = useServerMembersQuery(serverId)
const { mutate: kickMember } = useKickMemberMutation()

const filteredMembers = computed(() => {
  const list = members.value ?? []
  if (!searchQuery.value.trim()) return list

  const query = searchQuery.value.toLowerCase()
  return list.filter((member) => member.nickname.toLowerCase().includes(query))
})

function handleViewProfile(memberId: string) {
  emit('selectMember', memberId)
}

function handleEdit(memberId: string) {
  console.log('Edit member:', memberId)
}

function handleAddRestriction(memberId: string) {
  console.log('Add restriction:', memberId)
}

function handleKick(memberId: string) {
  const member = members.value?.find((m) => m.id === memberId)
  if (!member) return

  kickMember(
    { serverId: props.serverId, memberId },
    {
      onSuccess: () => {
        toast.success(`${member.nickname} has been kicked`)
      },
      onError: (error) => {
        const err = error instanceof Error ? error : new Error('Unknown error')
        toast.error('Failed to kick member', {
          description: getErrorMessage(err),
        })
      },
    },
  )
}
</script>
