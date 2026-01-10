<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Create Virtual Member</DialogTitle>
        <DialogDescription>
          Create a placeholder member that can be migrated to a real user later
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label>Nickname</Label>
          <Input v-model="form.nickname" placeholder="Enter nickname" :maxlength="32" />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false"> Cancel </Button>
          <Button type="submit" :disabled="!isValid || isPending">
            <Loader2 v-if="isPending" class="mr-2 size-4 animate-spin" />
            Create
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
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
import { useCreateVirtualMemberMutation } from '@/api/queries/server'

const props = defineProps<{
  serverId: ServerID
}>()

const open = defineModel<boolean>('open', { required: true })

const form = reactive({
  nickname: '',
})

const { mutate: createVirtualMember, isPending } = useCreateVirtualMemberMutation()

const isValid = computed(() => form.nickname.trim().length > 0)

function handleSubmit() {
  if (!isValid.value) return

  createVirtualMember(
    {
      serverId: props.serverId,
      data: { nickname: form.nickname.trim() },
    },
    {
      onSuccess: () => {
        toast.success('Virtual member created')
        open.value = false
        form.nickname = ''
      },
      onError: () => toast.error('Failed to create virtual member'),
    },
  )
}
</script>
