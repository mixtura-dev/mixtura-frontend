<template>
  <AlertDialog v-model:open="open">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete server?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete
          <span class="font-semibold text-foreground">{{ server?.name }}</span>
          and all its data. This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isPending">Cancel</AlertDialogCancel>
        <Button variant="destructive" :disabled="isPending" @click="handleDelete">
          <Loader2 v-if="isPending" class="mr-2 size-4 animate-spin" />
          <Trash2 v-else class="mr-2 size-4" />
          Delete server
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-vue-next'
import { getErrorMessage } from '@/composables/useApiError'
import { toast } from 'vue-sonner'
import type { Server } from '@/types/user'
import { useDeleteServerMutation } from '@/api/queries/server'

const props = defineProps<{
  server: Server | null
}>()

const emit = defineEmits<{
  deleted: []
}>()

const open = defineModel<boolean>('open', { required: true })

const { mutate, isPending } = useDeleteServerMutation()

function handleDelete() {
  if (!props.server) return

  const serverName = props.server.name

  mutate(props.server.id, {
    onSuccess: () => {
      toast.success('Server deleted', {
        description: `${serverName} has been permanently deleted.`,
      })
      emit('deleted')
    },
    onError: (error) => {
      toast.error('Failed to delete server', {
        description: getErrorMessage(error),
      })
    },
  })
}
</script>
