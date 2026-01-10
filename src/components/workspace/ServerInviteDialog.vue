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
          <ScrollArea class="max-h-48">
            <div class="space-y-2 pr-4">
              <div
                v-for="invite in invites"
                :key="invite.id"
                class="flex items-center justify-between rounded-md border p-2 pl-4"
              >
                <div class="flex-1 min-w-0">
                  <code class="text-sm select-all truncate block">{{ invite.key }}</code>
                </div>
                <div class="flex gap-1 shrink-0">
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
          </ScrollArea>
        </div>

        <div v-else class="py-4 text-center text-muted-foreground">
          <LinkIcon class="mx-auto mb-2 size-8 opacity-50" />
          <p class="text-sm">No active invites</p>
        </div>

        <Separator />

        <!-- Create new invite -->
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
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Copy, Link as LinkIcon, Loader2, Plus, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useClipboard } from '@vueuse/core'

import type { Server } from '@/types/user'
import type { RequestBody } from '@/types/auth'
import {
  useCreateInviteMutation,
  useDeleteInviteMutation,
  useServerInvitesQuery,
} from '@/api/queries/server'

const props = defineProps<{
  server: Server | null | undefined
}>()

const open = defineModel<boolean>('open', { required: true })

const useLimit = ref<number | undefined>(undefined)
const deletingInviteId = ref<string | null>(null)

const serverId = computed(() => props.server?.id ?? '')

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

  const payload: RequestBody<'/api/server/{server_id}/invites', 'post'> = {
    use_limit: useLimit.value ? useLimit.value : null,
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
      onError: () => {
        toast.error('Failed to create invite')
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
      },
      onError: () => {
        toast.error('Failed to delete invite')
      },
      onSettled: () => {
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
