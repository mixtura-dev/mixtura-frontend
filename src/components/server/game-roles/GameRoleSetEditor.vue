<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <Layers class="size-5 text-muted-foreground" />
      <h3 class="font-semibold text-lg">{{ roleSet.name }}</h3>
    </div>

    <Separator />

    <div class="space-y-2">
      <Label>{{ t('server.gameRoles.roleSet.nameLabel') }}</Label>
      <Input
        v-model="localName"
        :maxlength="32"
        :placeholder="roleSet.name"
      />
    </div>

    <div class="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
      {{ t('server.gameRoles.roleSet.hint') }}
    </div>

    <p class="text-sm text-muted-foreground">
      {{ t('server.gameRoles.roleSet.rolesCount', { count: roleSet.game_roles.length }) }}
    </p>

    <div class="pt-2">
      <Button
        :disabled="!hasChanges || isPending"
        @click="handleSave"
      >
        <Loader2 v-if="isPending" class="mr-2 size-4 animate-spin" />
        {{ t('server.gameRoles.roleSet.saveName') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Layers, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { components } from '@/types/api'
import type { ServerID } from '@/types/user'
import { useUpdateRoleSetMutation } from '@/api/queries/server'

type GameRoleSetResponse = components['schemas']['GameRoleSetResponse']

const props = defineProps<{
  roleSet: GameRoleSetResponse
  serverId: ServerID
}>()

const { t } = useI18n()

const localName = ref(props.roleSet.name)

watch(
  () => props.roleSet.name,
  (val) => {
    localName.value = val
  },
)

const hasChanges = computed(() => localName.value !== props.roleSet.name)

const { mutateAsync: updateRoleSet, isPending } = useUpdateRoleSetMutation()

async function handleSave() {
  try {
    await updateRoleSet({
      serverId: props.serverId,
      roleSetId: props.roleSet.id,
      data: { name: localName.value },
    })
    toast.success(t('server.gameRoles.roleSet.toast.updated'))
  } catch {
    toast.error(t('server.gameRoles.roleSet.toast.updateFailed'))
  }
}
</script>
