<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ t('server.manageRestrictions.title') }}</DialogTitle>
        <DialogDescription> {{ t('server.manageRestrictions.description') }} </DialogDescription>
      </DialogHeader>

      <div class="relative">
        <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          :placeholder="t('server.manageRestrictions.searchPlaceholder')"
          class="pl-9"
        />
      </div>

      <ScrollArea class="h-[400px]">
        <div v-if="isLoading" class="flex justify-center py-8">
          <Loader2 class="size-6 animate-spin text-muted-foreground" />
        </div>

        <div
          v-else-if="filteredMembers.length === 0"
          class="py-8 text-center text-muted-foreground"
        >
          <Users class="mx-auto mb-2 size-8 opacity-50" />
          <p>{{ t('server.manageRestrictions.noMembersFound') }}</p>
          <p v-if="!searchQuery" class="text-sm">
            {{ t('server.manageRestrictions.onlyRealUsersHint') }}
          </p>
        </div>

        <div v-else class="space-y-2">
          <div v-for="member in filteredMembers" :key="member.id" class="rounded-lg border p-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <MemberAvatar :member-id="member.id" :nickname="member.nickname" />
                <div>
                  <div class="flex items-center gap-2">
                    <p class="font-medium">{{ member.nickname }}</p>
                    <Badge v-if="isCurrentMember(member.id)" variant="secondary" class="text-xs">
                      {{ t('server.manageRestrictions.youBadge') }}
                    </Badge>
                  </div>
                  <p class="text-xs text-muted-foreground">
                    {{
                      isCurrentMember(member.id)
                        ? t('server.manageRestrictions.cannotManageOwnRestrictions')
                        : t('server.manageRestrictions.clickToManageRestrictions')
                    }}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                :disabled="isCurrentMember(member.id)"
                @click="selectMember(member)"
              >
                {{ t('server.manageRestrictions.manageButton') }}
              </Button>
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
import { useI18n } from 'vue-i18n' // <-- Импорт useI18n

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Search, Users } from 'lucide-vue-next'
import MemberRestrictionsDialog from './MemberRestrictionsDialog.vue'
import AddRestrictionDialog from './AddRestrictionDialog.vue'
import type { MemberListItem, ServerID } from '@/types/user'
import { useServerMembersQuery } from '@/api/queries/server'
import { useCurrentMemberStore } from '@/stores/currentMember.store'
import MemberAvatar from '../member/MemberAvatar.vue'

const props = defineProps<{
  serverId: ServerID
}>()

const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n() // <-- Получаем функцию перевода

const currentMemberStore = useCurrentMemberStore()

const searchQuery = ref('')
const selectedMember = ref<MemberListItem | null>(null)
const showMemberDialog = ref(false)
const showAddDialog = ref(false)

const { data: members, isLoading } = useServerMembersQuery(computed(() => props.serverId))

const realMembers = computed(() => {
  if (!members.value) return []
  return members.value.filter((m) => m.user_id)
})

const filteredMembers = computed(() => {
  if (!searchQuery.value) return realMembers.value

  const query = searchQuery.value.toLowerCase()
  return realMembers.value.filter((m) => m.nickname.toLowerCase().includes(query))
})

function isCurrentMember(memberId: string): boolean {
  return currentMemberStore.memberId === memberId
}

function selectMember(member: MemberListItem) {
  if (isCurrentMember(member.id)) return

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
