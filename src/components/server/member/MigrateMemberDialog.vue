<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Migrate Virtual Member</DialogTitle>
        <DialogDescription> Transfer this virtual member to a real user account </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label>User ID</Label>
          <Input v-model="form.userId" placeholder="Enter user ID to migrate to" />
          <p class="text-xs text-muted-foreground">
            The user must have an account but not be a member of this server
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false"> Cancel </Button>
          <Button type="submit" :disabled="!isValid || isPending">
            <Loader2 v-if="isPending" class="mr-2 size-4 animate-spin" />
            Migrate
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { toast } from 'vue-sonner'
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
import { Loader2 } from 'lucide-vue-next'
import type { ServerID } from '@/types/user'
import { useMigrateMemberMutation } from '@/api/queries/server'

const props = defineProps<{
  serverId: ServerID
  memberId: string | null
}>()

const open = defineModel<boolean>('open', { required: true })

const form = reactive({
  userId: '',
})

const { mutate: migrateMember, isPending } = useMigrateMemberMutation()

const isValid = computed(() => form.userId.trim().length > 0 && !!props.memberId)

// Reset form when dialog opens
watch(open, (isOpen) => {
  if (isOpen) {
    form.userId = ''
  }
})

function handleSubmit() {
  if (!isValid.value || !props.memberId) return

  migrateMember(
    {
      serverId: props.serverId,
      memberId: props.memberId,
      data: { target_member_id: form.userId.trim() },
    },
    {
      onSuccess: () => {
        toast.success('Member migrated successfully')
        open.value = false
      },
      onError: () => toast.error('Failed to migrate member'),
    },
  )
}
</script>
