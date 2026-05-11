<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { AlertCircle, ChevronDown, ChevronUp, GripVertical, Loader2 } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useApplicationFormQuery, useSubmitApplicationMutation } from '@/api/queries/event'
import { useRoleSetQuery } from '@/api/queries/server/useServerRoles'
import type { ServerID } from '@/types/user'
import type { components } from '@/types/api'

type ApplicationFormRoleResponse = components['schemas']['ApplicationFormRoleResponse']

const props = defineProps<{ serverId: ServerID; eventId: string }>()
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()

const { data: form, isLoading } = useApplicationFormQuery(props.serverId, props.eventId)
const { data: roleSets } = useRoleSetQuery(props.serverId)
const { mutate: submit, isPending: isSubmitting } = useSubmitApplicationMutation()

const filledFields = ref<Record<string, string>>({})
const orderedRoles = ref<ApplicationFormRoleResponse[]>([])

watch(
  () => form.value?.available_roles,
  (roles) => {
    if (roles) orderedRoles.value = [...roles]
  },
  { immediate: true },
)

const rolePriorities = computed(() =>
  Object.fromEntries(orderedRoles.value.map((r, i) => [r.id, i + 1])),
)

const gameRoleNameMap = computed(() => {
  const map = new Map<string, string>()
  roleSets.value?.game_roles.forEach((r) => map.set(r.id, r.name))
  return map
})

function getRoleName(gameRoleId: string): string {
  return gameRoleNameMap.value.get(gameRoleId) ?? t('server.events.application.unknownRole')
}

function moveRole(index: number, direction: -1 | 1) {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= orderedRoles.value.length) return
  const arr = [...orderedRoles.value]
  ;[arr[index], arr[newIndex]] = [arr[newIndex], arr[index]]
  orderedRoles.value = arr
}

const canSubmit = computed(() => {
  if (!form.value) return false
  return form.value.custom_fields
    ?.filter((f) => f.is_required)
    .every((f) => filledFields.value[f.id]?.trim()) ?? true
})

const hasFormContent = computed(() => {
  if (!form.value) return false
  return (
    (form.value.required_integrations?.length ?? 0) > 0
    || (form.value.available_roles?.length ?? 0) > 0
    || (form.value.custom_fields?.length ?? 0) > 0
  )
})

function handleSubmit() {
  submit(
    {
      serverId: props.serverId,
      eventId: props.eventId,
      data: {
        integration_ids: [],
        filled_fields: { ...filledFields.value },
        role_priorities: rolePriorities.value,
      },
    },
    {
      onSuccess: (result) => {
        if (result.auto_approved) {
          toast.success(t('server.events.application.toast.autoApproved'))
        } else {
          toast.success(t('server.events.application.toast.submitted'))
        }
        open.value = false
      },
      onError: () => toast.error(t('server.events.application.toast.error')),
    },
  )
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-lg max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {{ t('server.events.application.dialogTitle') }}
          <span v-if="form?.event_name" class="font-normal text-muted-foreground">
            · {{ form.event_name }}
          </span>
        </DialogTitle>
      </DialogHeader>

      <div v-if="isLoading" class="space-y-3 py-2">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-16 w-full" />
      </div>

      <div v-else-if="!form" class="py-4 text-center text-sm text-muted-foreground">
        {{ t('server.events.settings.applicationTab.loadError') }}
      </div>

      <template v-else>
        <div v-if="!hasFormContent" class="py-4 text-center text-sm text-muted-foreground">
          {{ t('server.events.application.noRequirements') }}
        </div>

        <div v-else class="space-y-6">
          <Alert v-if="(form.required_integrations?.length ?? 0) > 0">
            <AlertCircle class="size-4" />
            <AlertTitle>{{ t('server.events.application.integrationsRequired') }}</AlertTitle>
            <AlertDescription>
              <ul class="mt-1 space-y-1">
                <li
                  v-for="integration in form.required_integrations ?? []"
                  :key="integration.id"
                  class="flex items-center gap-2 text-sm"
                >
                  <span class="size-1.5 rounded-full bg-foreground inline-block shrink-0" />
                  {{ integration.name }}
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          <div v-if="(form.available_roles?.length ?? 0) > 0" class="space-y-3">
            <h4 class="text-sm font-medium">{{ t('server.events.application.rolePriorities') }}</h4>
            <p class="text-xs text-muted-foreground">{{ t('server.events.application.rolePrioritiesHint') }}</p>
            <div class="space-y-2">
              <div
                v-for="(role, index) in orderedRoles"
                :key="role.id"
                class="flex items-center gap-2 rounded-md border px-3 py-2"
              >
                <GripVertical class="size-4 text-muted-foreground shrink-0" />
                <span class="text-sm text-muted-foreground w-5 shrink-0">{{ index + 1 }}.</span>
                <span class="flex-1 text-sm font-medium">{{ getRoleName(role.game_role_id) }}</span>
                <div class="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-6"
                    :disabled="index === 0"
                    @click="moveRole(index, -1)"
                  >
                    <ChevronUp class="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-6"
                    :disabled="index === orderedRoles.length - 1"
                    @click="moveRole(index, 1)"
                  >
                    <ChevronDown class="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="(form.custom_fields?.length ?? 0) > 0" class="space-y-3">
            <h4 class="text-sm font-medium">{{ t('server.events.application.customFields') }}</h4>
            <div v-for="field in form.custom_fields ?? []" :key="field.id" class="space-y-1">
              <Label :for="`field-${field.id}`">
                {{ field.name }}
                <span v-if="field.is_required" class="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                :id="`field-${field.id}`"
                v-model="filledFields[field.id]"
                :placeholder="field.name"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false">
            {{ t('server.events.actions.cancel') }}
          </Button>
          <Button :disabled="!canSubmit || isSubmitting" @click="handleSubmit">
            <Loader2 v-if="isSubmitting" class="mr-2 size-4 animate-spin" />
            {{ t('server.events.application.submitButton') }}
          </Button>
        </DialogFooter>
      </template>
    </DialogContent>
  </Dialog>
</template>
