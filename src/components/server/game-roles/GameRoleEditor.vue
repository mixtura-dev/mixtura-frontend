<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <img
          v-if="role.icon_url"
          :src="role.icon_url"
          class="size-6 rounded-sm"
          alt=""
        />
        <Swords v-else class="size-5 text-muted-foreground" />
        <h3 class="font-semibold text-lg">{{ role.name }}</h3>
      </div>
      <Button
        variant="destructive"
        size="sm"
        :disabled="isDeleting"
        @click="handleDelete"
      >
        <Loader2 v-if="isDeleting" class="mr-1 size-3 animate-spin" />
        {{ t('server.gameRoles.role.deleteButton') }}
      </Button>
    </div>

    <Separator />

    <div class="space-y-2">
      <Label>{{ t('server.gameRoles.role.nameLabel') }}</Label>
      <Input
        v-model="localName"
        :maxlength="32"
        :placeholder="t('server.gameRoles.role.namePlaceholder')"
      />
    </div>

    <div class="space-y-2">
      <Label>{{ t('server.gameRoles.role.teamCount') }}</Label>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <Label class="text-xs text-muted-foreground">{{ t('server.gameRoles.role.minInTeam') }}</Label>
          <Input v-model.number="localMinInTeam" type="number" min="0" />
        </div>
        <div class="space-y-1">
          <Label class="text-xs text-muted-foreground">{{ t('server.gameRoles.role.maxInTeam') }}</Label>
          <Input v-model.number="localMaxInTeam" type="number" min="0" />
        </div>
      </div>
      <p v-if="!isValid" class="text-destructive text-xs">
        {{ t('server.gameRoles.role.maxMinError') }}
      </p>
    </div>

    <div class="flex items-start gap-3 rounded-lg border p-3">
      <Checkbox id="hidden" v-model="localHidden" />
      <div>
        <Label for="hidden" class="font-medium">{{ t('server.gameRoles.role.hidden') }}</Label>
        <p class="text-xs text-muted-foreground">{{ t('server.gameRoles.role.hiddenDescription') }}</p>
      </div>
    </div>

    <div class="pt-2">
      <Button
        :disabled="!hasChanges || isPending || !isValid"
        @click="handleSave"
      >
        <Loader2 v-if="isPending" class="mr-2 size-4 animate-spin" />
        {{ t('server.gameRoles.role.saveChanges') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Loader2, Swords } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import type { components } from '@/types/api'
import type { ServerID } from '@/types/user'
import { useUpdateRoleMutation, useDeleteRoleMutation } from '@/api/queries/server'

type GameRoleItemResponse = components['schemas']['GameRoleItemResponse']

const props = defineProps<{
  role: GameRoleItemResponse
  roleSetId: string
  serverId: ServerID
}>()

const emit = defineEmits<{
  deleted: []
}>()

const { t } = useI18n()

const localName = ref(props.role.name)
const localMinInTeam = ref(props.role.min_in_team)
const localMaxInTeam = ref(props.role.max_in_team)
const localHidden = ref(props.role.hidden)

const hasChanges = computed(
  () =>
    localName.value !== props.role.name ||
    localMinInTeam.value !== props.role.min_in_team ||
    localMaxInTeam.value !== props.role.max_in_team ||
    localHidden.value !== props.role.hidden,
)

const isValid = computed(() => {
  const min = localMinInTeam.value
  const max = localMaxInTeam.value
  return min >= 0 && max >= min
})

const { mutateAsync: updateRole, isPending } = useUpdateRoleMutation()
const { mutateAsync: deleteRole, isPending: isDeleting } = useDeleteRoleMutation()

async function handleSave() {
  try {
    await updateRole({
      serverId: props.serverId,
      roleSetId: props.roleSetId,
      roleId: props.role.id,
      data: {
        name: localName.value,
        min_in_team: localMinInTeam.value,
        max_in_team: localMaxInTeam.value,
        hidden: localHidden.value,
      },
    })
    toast.success(t('server.gameRoles.role.toast.updated'))
  } catch {
    toast.error(t('server.gameRoles.role.toast.updateFailed'))
  }
}

async function handleDelete() {
  try {
    await deleteRole({
      serverId: props.serverId,
      roleSetId: props.roleSetId,
      roleId: props.role.id,
    })
    toast.success(t('server.gameRoles.role.toast.deleted'))
    emit('deleted')
  } catch {
    toast.error(t('server.gameRoles.role.toast.deleteFailed'))
  }
}
</script>
