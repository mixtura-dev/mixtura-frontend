<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ t('server.createRole.title') }}</DialogTitle>
        <DialogDescription>
          {{ t('server.createRole.description') }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label>{{ t('server.createRole.roleName') }}</Label>
          <Input
            v-model="form.name"
            :placeholder="t('server.createRole.roleNamePlaceholder')"
            :maxlength="32"
          />
        </div>

        <div class="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
          <Info class="inline size-4 mr-1 -mt-0.5" />
          {{ t('server.createRole.positionHint') }}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false">
            {{ t('server.createRole.cancel') }}
          </Button>
          <Button type="submit" :disabled="!isValid || isPending">
            <Loader2 v-if="isPending" class="mr-2 size-4 animate-spin" />
            {{ t('server.createRole.createRoleButton') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

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
        toast.success(t('server.createRole.toast.success'))
        emit('created', data.id)
        form.name = ''
        open.value = false
      },
      onError: () => toast.error(t('server.createRole.toast.error')),
    },
  )
}
</script>
