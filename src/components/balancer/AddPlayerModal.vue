<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Search, Plus, Loader2, UserPlus } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useServerMembersInfiniteQuery, useCreateVirtualMemberMutation } from '@/api/queries/server/useServerMembers'
import { useAddPlayerMutation } from '@/api/queries/event'
import type { ServerID } from '@/types/user'

interface Props {
  open: boolean
  serverId: ServerID
  eventId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  added: []
}>()

const { t } = useI18n()

const open = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val),
})

const searchQuery = ref('')
const debouncedQuery = ref('')

const updateDebounced = useDebounceFn(() => {
  debouncedQuery.value = searchQuery.value.trim()
}, 300)

watch(searchQuery, () => updateDebounced())

const {
  data: membersData,
  isLoading: isLoadingMembers,
} = useServerMembersInfiniteQuery(
  computed(() => props.serverId),
  debouncedQuery,
)

const flatMembers = computed(() => {
  if (!membersData.value?.pages) return []
  return membersData.value.pages.flatMap((p) => p.items)
})

const { mutate: createVirtual, isPending: isCreating } = useCreateVirtualMemberMutation()
const { mutate: addPlayer, isPending: isAdding } = useAddPlayerMutation()
const isPending = computed(() => isCreating.value || isAdding.value)

function handleAddMember(memberId: string) {
  addPlayer(
    {
      serverId: props.serverId,
      eventId: props.eventId,
      data: { member_id: memberId, is_draft_pinned: false },
    },
    {
      onSuccess: () => {
        toast.success(t('server.events.balancer.playerAdded'))
        emit('added')
        open.value = false
      },
      onError: () => {
        toast.error(t('server.events.balancer.addPlayerError'))
      },
    },
  )
}

function handleCreateVirtual() {
  const nickname = searchQuery.value.trim()
  if (!nickname) return

  createVirtual(
    { serverId: props.serverId, data: { nickname } },
    {
      onSuccess: (data) => {
        const member = data as unknown as { id: string }
        handleAddMember(member.id)
      },
      onError: () => {
        toast.error(t('server.events.balancer.addPlayerError'))
      },
    },
  )
}

function handleClose() {
  open.value = false
  searchQuery.value = ''
  debouncedQuery.value = ''
}
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>{{ t('server.events.balancer.addPlayerTitle') }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-3">
        <div class="relative">
          <Search class="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            class="pl-8"
            :placeholder="t('server.events.balancer.searchOrCreate')"
            autofocus
          />
        </div>

        <!-- Results -->
        <div class="max-h-60 overflow-y-auto space-y-1">
          <div v-if="isLoadingMembers" class="flex justify-center py-4">
            <Loader2 class="size-5 animate-spin text-muted-foreground" />
          </div>

          <template v-else>
            <button
              v-for="member in flatMembers"
              :key="member.id"
              class="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
              :disabled="isPending"
              @click="handleAddMember(member.id)"
            >
              <UserPlus class="size-4 text-muted-foreground shrink-0" />
              <span class="text-sm truncate">{{ member.nickname }}</span>
            </button>

            <!-- Create virtual -->
            <button
              v-if="searchQuery.trim() && !flatMembers.some(m => m.nickname.toLowerCase() === searchQuery.trim().toLowerCase())"
              class="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
              :disabled="isPending"
              @click="handleCreateVirtual"
            >
              <Loader2 v-if="isCreating" class="size-4 animate-spin shrink-0" />
              <Plus v-else class="size-4 text-primary shrink-0" />
              <span class="text-sm">
                {{ t('server.events.balancer.createVirtual') }} «{{ searchQuery.trim() }}»
              </span>
            </button>
          </template>

          <p
            v-if="!isLoadingMembers && searchQuery.trim() && flatMembers.length === 0"
            class="text-center text-sm text-muted-foreground py-4"
          >
            {{ t('server.events.balancer.noMembersFound') }}
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
