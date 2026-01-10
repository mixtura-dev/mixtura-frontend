<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>Manage Restrictions</DialogTitle>
        <DialogDescription> View and manage member restrictions </DialogDescription>
      </DialogHeader>

      <!-- Search member -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="searchQuery" placeholder="Search members..." class="pl-9" />
      </div>

      <!-- Members list -->
      <ScrollArea class="h-[400px]">
        <div v-if="isLoading" class="flex justify-center py-8">
          <Loader2 class="size-6 animate-spin text-muted-foreground" />
        </div>

        <div
          v-else-if="filteredMembers.length === 0"
          class="py-8 text-center text-muted-foreground"
        >
          No members found
        </div>

        <div v-else class="space-y-2">
          <div v-for="member in filteredMembers" :key="member.id" class="rounded-lg border p-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Avatar class="size-10">
                  <AvatarFallback
                    :style="{ backgroundColor: `hsl(${hashToHue(member.id)}, 50%, 45%)` }"
                  >
                    {{ getInitials(member.nickname) }}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p class="font-medium">{{ member.nickname }}</p>
                  <p class="text-xs text-muted-foreground">Click to manage restrictions</p>
                </div>
              </div>
              <Button variant="outline" size="sm" @click="selectMember(member)"> Manage </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>

  <MemberRestrictionsDialog
    v-model:open="showMemberDialog"
    :server-id="serverId"
    :member="selectedMember"
    @add-restriction="handleAddRestriction"
  />

  <AddRestrictionDialog
    v-model:open="showAddDialog"
    :server-id="serverId"
    :member-id="selectedMember?.id ?? null"
    @added="handleRestrictionAdded"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Search } from 'lucide-vue-next'
import MemberRestrictionsDialog from './MemberRestrictionsDialog.vue'
import AddRestrictionDialog from './AddRestrictionDialog.vue'
import { getInitials } from '@/lib/utils/user'
import { hashToHue } from '@/lib/utils/colors'
import type { ServerID } from '@/types/user'
import { useServerMembersQuery } from '@/api/queries/server'

interface MemberItem {
  id: string
  nickname: string
}

const props = defineProps<{
  serverId: ServerID
}>()

const open = defineModel<boolean>('open', { required: true })

const searchQuery = ref('')
const selectedMember = ref<MemberItem | null>(null)
const showMemberDialog = ref(false)
const showAddDialog = ref(false)

const { data: members, isLoading } = useServerMembersQuery(computed(() => props.serverId))

const filteredMembers = computed(() => {
  if (!members.value) return []
  if (!searchQuery.value) return members.value

  const query = searchQuery.value.toLowerCase()
  return members.value.filter((m) => m.nickname.toLowerCase().includes(query))
})

function selectMember(member: MemberItem) {
  selectedMember.value = member
  showMemberDialog.value = true
}

function handleAddRestriction() {
  showMemberDialog.value = false
  showAddDialog.value = true
}

function handleRestrictionAdded() {
  showAddDialog.value = false
  showMemberDialog.value = true
}
</script>
