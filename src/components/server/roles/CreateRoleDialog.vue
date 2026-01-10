<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Create Server Role</DialogTitle>
        <DialogDescription>
          Create a new role with permissions for server administration. The role will be added at
          the bottom of the hierarchy.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label>Role Name</Label>
          <Input v-model="form.name" placeholder="e.g., Moderator, Admin" :maxlength="32" />
        </div>

        <div class="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
          <Info class="inline size-4 mr-1 -mt-0.5" />
          After creating, drag the role in the list to set its position in the hierarchy.
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false"> Cancel </Button>
          <Button type="submit" :disabled="!isValid || isPending">
            <Loader2 v-if="isPending" class="mr-2 size-4 animate-spin" />
            Create Role
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
import { Info, Loader2 } from 'lucide-vue-next'
import { useCreateServerRoleMutation } from '@/api/queries/server'
import type { ServerID } from '@/types/user'

const props = defineProps<{
  serverId: ServerID
}>()

const emit = defineEmits<{
  created: [roleId: string]
}>()

const open = defineModel<boolean>('open', { required: true })

const form = reactive({
  name: '',
})

const { mutate: createServerRole, isPending } = useCreateServerRoleMutation()

const isValid = computed(() => form.name.trim().length > 0)

function handleSubmit() {
  if (!isValid.value) return

  createServerRole(
    {
      serverId: props.serverId,
      data: {
        name: form.name.trim(),
        position: 0,
      },
    },
    {
      onSuccess: (data) => {
        toast.success('Role created')
        emit('created', data.id)
        form.name = ''
        open.value = false
      },
      onError: () => toast.error('Failed to create role'),
    },
  )
}
</script>
