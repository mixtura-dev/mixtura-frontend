<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Invite members</DialogTitle>
        <DialogDescription> Create an invite link for {{ server?.name }} </DialogDescription>
      </DialogHeader>

      <div v-if="isLoadingInvites" class="flex items-center justify-center py-8">
        <Loader2 class="size-6 animate-spin text-muted-foreground" />
      </div>

      <div v-else class="space-y-4">
        <div v-if="invites?.length" class="space-y-2">
          <Label class="text-sm font-medium">Active invites</Label>
          <div class="max-h-48 space-y-2 overflow-y-auto">
            <div
              v-for="invite in invites"
              :key="invite.id"
              class="flex items-center justify-between rounded-md border p-2 pl-4"
            >
              <code class="text-sm select-all">{{ invite.key }}</code>
              <div class="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8"
                  @click="copyInviteLink(invite.key)"
                >
                  <Copy class="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8 text-destructive hover:text-destructive"
                  :disabled="deletingInviteId === invite.id"
                  @click="handleDeleteInvite(invite.id)"
                >
                  <Loader2 v-if="deletingInviteId === invite.id" class="size-4 animate-spin" />
                  <Trash2 v-else class="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label class="text-sm font-medium">Create new invite</Label>
          <div class="flex gap-2">
            <Input
              v-model.number="useLimit"
              type="number"
              min="1"
              placeholder="Max uses (optional)"
              class="flex-1"
            />
            <Button :disabled="isCreating" @click="handleCreateInvite">
              <Loader2 v-if="isCreating" class="mr-2 size-4 animate-spin" />
              <Plus v-else class="mr-2 size-4" />
              Create
            </Button>
          </div>
          <p class="text-xs text-muted-foreground">Leave empty for unlimited uses.</p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="open = false">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Loader2, Plus, Trash2 } from 'lucide-vue-next'

import { getErrorMessage } from '@/composables/useApiError'
import { toast } from 'vue-sonner'
import { useClipboard } from '@vueuse/core'
import type { Server } from '@/types/user'
// Импортируем типы через RequestBody для полной точности
import type { RequestBody } from '@/types/auth'
import {
  useCreateInviteMutation,
  useDeleteInviteMutation,
  useServerInvitesQuery,
} from '@/api/queries/server'

const props = defineProps<{
  server: Server | null
}>()

const open = defineModel<boolean>('open', { required: true })

// У API в requestBody есть только use_limit (судя по ошибке TS)
const useLimit = ref<number | undefined>(undefined)
const deletingInviteId = ref<string | null>(null)

const serverId = computed(() => props.server?.id ?? '')

// Queries
const {
  data: invites,
  isLoading: isLoadingInvites,
  refetch: refetchInvites,
} = useServerInvitesQuery(serverId)

const { mutate: createInvite, isPending: isCreating } = useCreateInviteMutation()
const { mutate: deleteInvite } = useDeleteInviteMutation()

const { copy } = useClipboard()

watch(open, (isOpen) => {
  if (isOpen && props.server) {
    refetchInvites()
  }
})

function handleCreateInvite() {
  if (!props.server) return

  // Формируем payload строго по типу
  const payload: RequestBody<'/api/server/{server_id}/invites', 'post'> = {
    use_limit: useLimit.value ? useLimit.value : null,
    // expires_in здесь нет, так как TS говорит, что его нет в схеме.
    // Если нужно добавить expires_in, нужно обновить types/api.ts (перегенерировать с бэкенда)
  }

  createInvite(
    {
      serverId: props.server.id,
      data: payload,
    },
    {
      onSuccess: (data) => {
        toast.success('Invite created')
        if (data?.key) {
          copyInviteLink(data.key)
        }
        useLimit.value = undefined
      },
      // Используем типизированный helper для ошибок
      onError: (error) => {
        toast.error('Failed to create invite', {
          description: getErrorMessage(error),
        })
      },
    },
  )
}

function handleDeleteInvite(inviteId: string) {
  if (!props.server) return

  deletingInviteId.value = inviteId

  deleteInvite(
    { serverId: props.server.id, inviteId },
    {
      onSuccess: () => {
        toast.success('Invite deleted')
        deletingInviteId.value = null
      },
      onError: (error) => {
        toast.error('Failed to delete invite', {
          description: getErrorMessage(error),
        })
        deletingInviteId.value = null
      },
    },
  )
}

function copyInviteLink(key: string) {
  const link = `${window.location.origin}/invite/${key}`
  copy(link)
  toast.success('Invite link copied')
}
</script>
