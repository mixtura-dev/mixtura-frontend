<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { DnDProvider, type IDragEvent } from '@vue-dnd-kit/core'
import { Check, ExternalLink, Loader2, Plus } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useProvidersQuery, useUserQuery } from '@/api/queries/user/useAuthQuery'
import { useRoleSetQuery } from '@/api/queries/server/useServerRoles'
import { useRolePriorityManager, type Tier } from '@/composables/useRolePriorityManager'
import RoleDragItem from './RoleDragItem.vue'
import TierSection from './TierSection.vue'
import UndesiredSection from './UndesiredSection.vue'
import type { ServerID } from '@/types/user'

const props = defineProps<{ serverId: ServerID; eventId: string }>()
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()

const { data: form, isLoading } = useApplicationFormQuery(props.serverId, props.eventId)
const { data: roleSets } = useRoleSetQuery(props.serverId)
const { mutate: submit, isPending: isSubmitting } = useSubmitApplicationMutation()
const { data: userData } = useUserQuery()
const { data: providersData } = useProvidersQuery()

const filledFields = ref<Record<string, string>>({})
const step = ref(1)
const selectedIntegrationMap = ref<Record<string, string>>({})

const {
  allRoles,
  selectedIds,
  tiers,
  undesiredRoles,
  initialize,
  toggleRole,
  addTier,
  removeTier,
  computePriorities,
  applyDrop,
  selectedCount,
  totalCount,
  hasSelected,
} = useRolePriorityManager()

watch(
  () => form.value?.available_roles,
  (roles) => {
    if (roles) {
      initialize(roles)
      step.value = 1
      selectedIntegrationMap.value = {}
    }
  },
  { immediate: true },
)

const availableIntegrations = computed(() => {
  const required = form.value?.required_integrations ?? []
  if (required.length === 0) return []

  const userProviders = userData.value?.providers ?? []
  const allProviders = providersData.value?.oauth_providers ?? []

  return required.map((req) => {
    const provider = allProviders.find((p) => p.id === req.name)
    const userAccounts = userProviders.filter((up) => up.name === req.name)
    return {
      requiredId: req.id,
      providerId: req.name,
      displayName: provider?.display_name ?? req.name,
      iconUrl: provider?.icon_url ?? '',
      accounts: userAccounts.map((acc) => ({
        id: acc.id,
        username: acc.client_username ?? 'unknown',
      })),
    }
  })
})

function selectIntegration(requiredId: string, clientId: string) {
  selectedIntegrationMap.value[requiredId] = clientId
}

const gameRoleNameMap = computed(() => {
  const map = new Map<string, string>()
  roleSets.value?.game_roles.forEach((r) => map.set(r.id, r.name))
  return map
})

function getRoleName(gameRoleId: string): string {
  return gameRoleNameMap.value.get(gameRoleId) ?? t('server.events.application.unknownRole')
}

function handleTierDrop(e: IDragEvent, tier: Tier) {
  applyDrop(e, tier.roles)
}

function handleUndesiredDrop(e: IDragEvent) {
  applyDrop(e, undesiredRoles.value)
}

const rolePriorities = computed(() => computePriorities())

const canSubmit = computed(() => {
  if (!form.value) return false
  return (
    form.value.custom_fields
      ?.filter((f) => f.is_required)
      .every((f) => filledFields.value[f.id]?.trim()) ?? true
  )
})

const hasFormContent = computed(() => {
  if (!form.value) return false
  return (
    (form.value.required_integrations?.length ?? 0) > 0 ||
    (form.value.available_roles?.length ?? 0) > 0 ||
    (form.value.custom_fields?.length ?? 0) > 0
  )
})

function handleSubmit() {
  const selectedIntegrations = Object.values(selectedIntegrationMap.value).map((providerId) => ({
    integration_id: providerId,
  }))

  const rolePriorityArray = Object.entries(rolePriorities.value).map(([role_id, priority]) => ({
    role_id,
    priority,
  }))

  const filledFieldsArray = Object.entries(filledFields.value).map(([custom_field_id, value]) => ({
    custom_field_id,
    value,
  }))

  submit(
    {
      serverId: props.serverId,
      eventId: props.eventId,
      data: {
        integrations: selectedIntegrations,
        filled_fields: filledFieldsArray,
        role_priorities: rolePriorityArray,
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

function goToStep(n: number) {
  if (n === 2 && !hasSelected.value) return
  step.value = n
}

function getProviderRedirectUrl(providerId: string): string {
  const provider = providersData.value?.oauth_providers.find((p) => p.id === providerId)
  return provider?.redirect_uri ?? '#'
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-2xl max-h-[85vh] min-h-0 p-0 flex flex-col overflow-hidden">
      <DialogHeader class="px-6 pt-6 pb-3">
        <DialogTitle>
          {{ t('server.events.application.dialogTitle') }}
          <span v-if="form?.event_name" class="font-normal text-muted-foreground">
            · {{ form.event_name }}
          </span>
        </DialogTitle>
      </DialogHeader>

      <div v-if="isLoading" class="px-6 pb-6 space-y-3">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-16 w-full" />
      </div>

      <div v-else-if="!form" class="px-6 pb-6 text-center text-sm text-muted-foreground">
        {{ t('server.events.settings.applicationTab.loadError') }}
      </div>

      <template v-else>
        <div v-if="!hasFormContent" class="px-6 pb-6 text-center text-sm text-muted-foreground">
          {{ t('server.events.application.noRequirements') }}
        </div>

        <template v-else>
          <!-- Stepper -->
          <div class="px-6 pb-4">
            <div class="flex items-center gap-0">
              <button
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="
                  step === 1
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                "
                @click="goToStep(1)"
              >
                <span
                  class="flex items-center justify-center size-6 rounded-full text-xs font-bold border-2 transition-colors"
                  :class="
                    step === 1
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/30'
                  "
                >
                  <Check v-if="step > 1" class="size-3.5" />
                  <span v-else>1</span>
                </span>
                {{ t('server.events.application.stepSelectRoles') }}
              </button>

              <div class="flex-1 h-px mx-2 bg-border" />

              <button
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="[
                  step === 2
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                  !hasSelected && 'opacity-50 cursor-not-allowed',
                ]"
                :disabled="!hasSelected"
                @click="goToStep(2)"
              >
                <span
                  class="flex items-center justify-center size-6 rounded-full text-xs font-bold border-2 transition-colors"
                  :class="
                    step === 2
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/30'
                  "
                >
                  2
                </span>
                {{ t('server.events.application.stepPriorities') }}
              </button>
            </div>
          </div>

          <DnDProvider>
            <div class="flex-1 min-h-0 overflow-auto px-6 pb-6">
              <!-- Integration selection -->
              <div v-if="availableIntegrations.length > 0" class="mb-5 space-y-3">
                <div>
                  <h4 class="text-sm font-medium">
                    {{ t('server.events.application.integrationsRequired') }}
                  </h4>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    {{ t('server.events.application.integrationsHint') }}
                  </p>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="integration in availableIntegrations"
                    :key="integration.providerId"
                    class="rounded-lg border p-3 space-y-2"
                  >
                    <div class="flex items-center gap-2">
                      <img
                        v-if="integration.iconUrl"
                        :src="integration.iconUrl"
                        :alt="integration.displayName"
                        class="size-5 rounded"
                      />
                      <span class="text-sm font-medium">{{ integration.displayName }}</span>
                    </div>

                    <div v-if="integration.accounts.length === 0" class="text-xs text-muted-foreground">
                      {{ t('server.events.application.noConnectedAccounts') }}
                      <a
                        :href="getProviderRedirectUrl(integration.providerId)"
                        target="_self"
                        class="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        {{ t('server.events.application.connectAccount') }}
                        <ExternalLink class="size-3" />
                      </a>
                    </div>

                    <div v-else class="space-y-1.5">
                      <div
                        v-for="account in integration.accounts"
                        :key="account.id"
                        class="flex items-center gap-2"
                      >
                        <Checkbox
                          :id="`integration-${integration.requiredId}-${account.id}`"
                          :model-value="selectedIntegrationMap[integration.requiredId] === account.id"
                          @update:model-value="(val: boolean | 'indeterminate') => { if (val === true) selectIntegration(integration.requiredId, account.id) }"
                        />
                        <label :for="`integration-${integration.requiredId}-${account.id}`" class="text-sm cursor-pointer truncate">
                          @{{ account.username }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="step === 1 && (form.available_roles?.length ?? 0) > 0" class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium">
                      {{ t('server.events.application.selectRolesTitle') }}
                    </h4>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      {{ t('server.events.application.selectRolesHint') }}
                    </p>
                  </div>
                  <Badge variant="outline" class="text-xs">
                    {{ selectedCount }} / {{ totalCount }}
                  </Badge>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    v-for="role in allRoles"
                    :key="role.id"
                    class="relative flex items-center gap-2 rounded-xl border px-3 py-3 text-sm text-left transition-all"
                    :class="
                      selectedIds.has(role.id)
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'bg-card hover:bg-accent/50 hover:border-muted-foreground/50'
                    "
                    @click="toggleRole(role.id)"
                  >
                    <span
                      class="flex items-center justify-center size-5 rounded-md border-2 transition-colors shrink-0"
                      :class="
                        selectedIds.has(role.id)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/30'
                      "
                    >
                      <Check v-if="selectedIds.has(role.id)" class="size-3" />
                    </span>
                    <span class="flex-1 truncate font-medium">
                      {{ getRoleName(role.game_role_id) }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Step 2: Priority ordering -->
              <div v-if="step === 2 && (form.available_roles?.length ?? 0) > 0" class="space-y-5">
                <div>
                  <h4 class="text-sm font-medium">
                    {{ t('server.events.application.rolePriorities') }}
                  </h4>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    {{ t('server.events.application.rolePrioritiesHint') }}
                  </p>
                </div>

                <!-- Tiers -->
                <div class="space-y-4">
                  <TierSection
                    v-for="tier in tiers"
                    :key="tier.id"
                    :tier="tier"
                    :can-remove="tiers.length > 1"
                    :empty-text="t('server.events.application.dropRolesHere')"
                    @drop="handleTierDrop($event, tier)"
                    @remove="removeTier(tier.id)"
                  >
                    <RoleDragItem
                      v-for="(role, index) in tier.roles"
                      :key="role.id"
                      :role="role"
                      :index="index"
                      :items="tier.roles"
                      :label="getRoleName(role.game_role_id)"
                    />
                  </TierSection>

                  <Button variant="outline" size="sm" class="w-full gap-1.5" @click="addTier()">
                    <Plus class="size-3.5" />
                    {{ t('server.events.application.addPriority') }}
                  </Button>
                </div>

                <!-- Undesired -->
                <UndesiredSection
                  :roles="undesiredRoles"
                  :empty-text="t('server.events.application.noUndesiredRoles')"
                  :label="t('server.events.application.undesiredBucket')"
                  @drop="handleUndesiredDrop"
                >
                  <RoleDragItem
                    v-for="(role, index) in undesiredRoles"
                    :key="role.id"
                    :role="role"
                    :index="index"
                    :items="undesiredRoles"
                    :label="getRoleName(role.game_role_id)"
                  />
                </UndesiredSection>
              </div>

              <!-- Custom fields -->
              <div
                v-if="(form.custom_fields?.length ?? 0) > 0"
                class="space-y-3 mt-6 pt-6 border-t"
              >
                <h4 class="text-sm font-medium">
                  {{ t('server.events.application.customFields') }}
                </h4>
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
          </DnDProvider>

          <DialogFooter class="px-6 pb-6 pt-4">
            <Button type="button" variant="outline" @click="open = false">
              {{ t('server.events.actions.cancel') }}
            </Button>
            <template v-if="step === 1">
              <Button :disabled="!hasSelected" @click="goToStep(2)">
                {{ t('server.events.application.nextStep') }}
              </Button>
            </template>
            <template v-else>
              <Button variant="outline" @click="goToStep(1)">
                {{ t('server.events.application.prevStep') }}
              </Button>
              <Button :disabled="!canSubmit || isSubmitting" @click="handleSubmit">
                <Loader2 v-if="isSubmitting" class="mr-2 size-4 animate-spin" />
                {{ t('server.events.application.submitButton') }}
              </Button>
            </template>
          </DialogFooter>
        </template>
      </template>
    </DialogContent>
  </Dialog>
</template>
