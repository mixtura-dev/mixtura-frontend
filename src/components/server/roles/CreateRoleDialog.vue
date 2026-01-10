<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Create Role</DialogTitle>
        <DialogDescription> Create a new role for this server </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label>Role Name</Label>
          <Input v-model="form.name" placeholder="Enter role name" :maxlength="32" />
        </div>

        <div class="space-y-2">
          <Label>Min in Team</Label>
          <Input v-model.number="form.min_in_team" type="number" :min="0" />
        </div>

        <div class="space-y-2">
          <Label>Max in Team</Label>
          <Input v-model.number="form.max_in_team" type="number" :min="0" />
        </div>

        <div class="flex items-center justify-between">
          <Label>Hidden</Label>
          <Switch v-model:checked="form.hidden" />
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
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-vue-next'
import type { ServerID } from '@/types/user'
import { useCreateRoleMutation } from '@/api/queries/server'

const props = defineProps<{
  serverId: ServerID
  roleSetId: string
}>()

const emit = defineEmits<{
  created: [roleId: string]
}>()

const open = defineModel<boolean>('open', { required: true })

const form = reactive({
  name: '',
  min_in_team: 0,
  max_in_team: 1,
  hidden: false,
})

const { mutate: createRole, isPending } = useCreateRoleMutation()

const isValid = computed(() => form.name.trim().length > 0)

function handleSubmit() {
  if (!isValid.value) return

  createRole(
    {
      serverId: props.serverId,
      roleSetId: props.roleSetId,
      data: {
        name: form.name.trim(),
        min_in_team: form.min_in_team,
        max_in_team: form.max_in_team,
        hidden: form.hidden,
      },
    },
    {
      onSuccess: (data) => {
        toast.success('Role created')
        emit('created', data.id)
        resetForm()
        open.value = false
      },
      onError: () => toast.error('Failed to create role'),
    },
  )
}

function resetForm() {
  form.name = ''
  form.min_in_team = 0
  form.max_in_team = 1
  form.hidden = false
}
</script>
