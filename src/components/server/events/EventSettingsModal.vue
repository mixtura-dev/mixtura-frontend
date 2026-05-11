<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Loader2, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'
import {
  useOpenRegistrationMutation,
  useCloseRegistrationMutation,
  useAddIntegrationMutation,
  useRemoveIntegrationMutation,
  useAddGameRoleMutation,
  useRemoveGameRoleMutation,
  useUpdateEventMutation,
} from '@/api/queries/event'
import { useProvidersQuery } from '@/api/queries/user/useAuthQuery'
import { useRoleSetQuery } from '@/api/queries/server/useServerRoles'
import EventApplicationTab from '@/components/server/events/tabs/EventApplicationTab.vue'
import type { ServerID } from '@/types/user'
import type { components } from '@/types/api'

type EventDetail = components['schemas']['EventDetailResponse']
type GameRoleItem = components['schemas']['GameRoleItemResponse']

const props = defineProps<{
  serverId: ServerID
  eventId: string
  event: EventDetail
}>()

const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()

const { mutate: openRegistration, isPending: isOpening } = useOpenRegistrationMutation()
const { mutate: closeRegistration, isPending: isClosing } = useCloseRegistrationMutation()
const { mutate: addIntegration, isPending: isAddingIntegration } = useAddIntegrationMutation()
const { mutate: removeIntegration, isPending: isRemovingIntegration } =
  useRemoveIntegrationMutation()
const { mutate: addGameRole, isPending: isAddingGameRole } = useAddGameRoleMutation()
const { mutate: removeGameRole, isPending: isRemovingGameRole } = useRemoveGameRoleMutation()

const { data: providersData, isLoading: isLoadingProviders } = useProvidersQuery()
const { data: roleSets, isLoading: isLoadingRoleSets } = useRoleSetQuery(props.serverId)

const { mutate: updateEvent, isPending: isUpdating } = useUpdateEventMutation()

const selectedProviderId = ref<string>('')
const selectedGameRoleId = ref<string>('')

const isRegistrationOpen = computed(() => props.event.status === 'REGISTRATION')

const editForm = reactive({
  name: props.event.name,
  matchType: props.event.match_type,
  useApplication: props.event.use_application,
  isPublic: props.event.is_public,
  teamSize: props.event.team_size,
  teamFormation: props.event.team_formation,
  allowMultipleDrafts: props.event.allow_multiple_drafts,
})

watch(
  () => props.event,
  (ev) => {
    if (ev) {
      editForm.name = ev.name
      editForm.matchType = ev.match_type
      editForm.useApplication = ev.use_application
      editForm.isPublic = ev.is_public
      editForm.teamSize = ev.team_size
      editForm.teamFormation = ev.team_formation
      editForm.allowMultipleDrafts = ev.allow_multiple_drafts
    }
  },
  { immediate: true },
)

const hasChanges = computed(
  () =>
    editForm.name !== props.event.name ||
    editForm.matchType !== props.event.match_type ||
    editForm.useApplication !== props.event.use_application ||
    editForm.isPublic !== props.event.is_public ||
    editForm.teamSize !== props.event.team_size ||
    editForm.teamFormation !== props.event.team_formation ||
    editForm.allowMultipleDrafts !== props.event.allow_multiple_drafts,
)

const providerMap = computed(() => {
  const map = new Map<string, components['schemas']['Provider']>()
  if (!providersData.value) return map
  for (const p of providersData.value.oauth_providers) {
    map.set(p.id, p)
  }
  return map
})

const availableProviders = computed(() => {
  if (!providersData.value) return []
  const existingNames = new Set(props.event.required_integrations.map((i) => i.name))
  return providersData.value.oauth_providers.filter((p) => !existingNames.has(p.id))
})

const roleSetsArray = computed(() => {
  if (!roleSets.value) return []
  return Array.isArray(roleSets.value) ? roleSets.value : [roleSets.value]
})

const roleNameMap = computed(() => {
  const map = new Map<string, string>()
  for (const set of roleSetsArray.value) {
    for (const role of set.game_roles) {
      map.set(role.id, role.name)
    }
  }
  return map
})

const groupedAvailableRoles = computed(() => {
  const selectedIds = new Set(
    props.event.selected_game_roles.map((r: { game_role_id: string }) => r.game_role_id),
  )
  const map = new Map<string, GameRoleItem[]>()
  for (const set of roleSetsArray.value) {
    const available = set.game_roles.filter((role: GameRoleItem) => !selectedIds.has(role.id))
    if (available.length > 0) {
      map.set(set.name, available)
    }
  }
  return map
})

function handleUpdateEvent() {
  updateEvent(
    {
      serverId: props.serverId,
      eventId: props.eventId,
      data: {
        name: editForm.name,
        match_type: editForm.matchType,
        use_application: editForm.useApplication,
        is_public: editForm.isPublic,
        team_size: editForm.teamSize,
        team_formation: editForm.teamFormation,
        allow_multiple_drafts: editForm.allowMultipleDrafts,
      },
    },
    {
      onSuccess: () => toast.success(t('server.events.settings.eventDetails.toast.updated')),
      onError: () => toast.error(t('server.events.settings.toast.error')),
    },
  )
}

function handleOpenRegistration() {
  openRegistration(
    { serverId: props.serverId, eventId: props.eventId },
    {
      onSuccess: () => toast.success(t('server.events.settings.toast.registrationOpened')),
      onError: () => toast.error(t('server.events.settings.toast.error')),
    },
  )
}

function handleCloseRegistration() {
  closeRegistration(
    { serverId: props.serverId, eventId: props.eventId },
    {
      onSuccess: () => toast.success(t('server.events.settings.toast.registrationClosed')),
      onError: () => toast.error(t('server.events.settings.toast.error')),
    },
  )
}

function handleAddIntegration() {
  if (!selectedProviderId.value) return
  addIntegration(
    { serverId: props.serverId, eventId: props.eventId, data: { name: selectedProviderId.value } },
    {
      onSuccess: () => {
        toast.success(t('server.events.settings.toast.integrationAdded'))
        selectedProviderId.value = ''
      },
      onError: () => toast.error(t('server.events.settings.toast.error')),
    },
  )
}

function handleRemoveIntegration(integrationId: string) {
  removeIntegration(
    { serverId: props.serverId, eventId: props.eventId, integrationId },
    {
      onSuccess: () => toast.success(t('server.events.settings.toast.integrationRemoved')),
      onError: () => toast.error(t('server.events.settings.toast.error')),
    },
  )
}

function handleAddGameRole() {
  if (!selectedGameRoleId.value) return
  addGameRole(
    {
      serverId: props.serverId,
      eventId: props.eventId,
      data: {
        game_role_id: selectedGameRoleId.value,
      },
    },
    {
      onSuccess: () => {
        toast.success(t('server.events.settings.toast.roleAdded'))
        selectedGameRoleId.value = ''
      },
      onError: () => toast.error(t('server.events.settings.toast.error')),
    },
  )
}

function handleRemoveGameRole(selectedRoleId: string) {
  removeGameRole(
    { serverId: props.serverId, eventId: props.eventId, selectedRoleId },
    {
      onSuccess: () => toast.success(t('server.events.settings.toast.roleRemoved')),
      onError: () => toast.error(t('server.events.settings.toast.error')),
    },
  )
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-lg max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ t('server.events.settings.title') }}</DialogTitle>
      </DialogHeader>

      <Tabs default-value="details">
        <TabsList class="w-full">
          <TabsTrigger value="details" class="flex-1">
            {{ t('server.events.settings.tabs.details') }}
          </TabsTrigger>
          <TabsTrigger value="settings" class="flex-1">
            {{ t('server.events.settings.tabs.settings') }}
          </TabsTrigger>
          <TabsTrigger value="application" class="flex-1">
            {{ t('server.events.settings.tabs.application') }}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" class="space-y-4 mt-4">
          <div class="space-y-2">
            <label class="text-xs text-muted-foreground">{{ t('server.events.createEvent.name') }}</label>
            <Input v-model="editForm.name" maxlength="64" />
          </div>
          <div class="space-y-2">
            <label class="text-xs text-muted-foreground">{{ t('server.events.createEvent.matchType') }}</label>
            <Select v-model="editForm.matchType">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE">{{ t('server.events.createEvent.single') }}</SelectItem>
                <SelectItem value="TOURNAMENT">{{ t('server.events.createEvent.tournament') }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <label class="text-xs text-muted-foreground">{{ t('server.events.createEvent.teamSize') }}</label>
            <Input v-model.number="editForm.teamSize" type="number" min="1" max="100" />
          </div>
          <div class="space-y-2">
            <label class="text-xs text-muted-foreground">{{ t('server.events.createEvent.teamFormation') }}</label>
            <Select v-model="editForm.teamFormation">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">{{ t('server.events.createEvent.draft') }}</SelectItem>
                <SelectItem value="BALANCE">{{ t('server.events.createEvent.balance') }}</SelectItem>
                <SelectItem value="MANUAL">{{ t('server.events.createEvent.manual') }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex items-center justify-between rounded-lg border p-3">
            <label class="text-sm font-normal">{{ t('server.events.createEvent.useApplication') }}</label>
            <Switch v-model="editForm.useApplication" />
          </div>
          <div class="flex items-center justify-between rounded-lg border p-3">
            <label class="text-sm font-normal">{{ t('server.events.createEvent.isPublic') }}</label>
            <Switch v-model="editForm.isPublic" />
          </div>
          <div class="flex items-center justify-between rounded-lg border p-3">
            <label class="text-sm font-normal">{{ t('server.events.createEvent.allowMultipleDrafts') }}</label>
            <Switch v-model="editForm.allowMultipleDrafts" />
          </div>
          <Button :disabled="!hasChanges || isUpdating" @click="handleUpdateEvent">
            <Loader2 v-if="isUpdating" class="mr-2 size-4 animate-spin" />
            {{ t('server.events.settings.eventDetails.save') }}
          </Button>
        </TabsContent>

        <TabsContent value="settings" class="space-y-6 mt-4">
          <!-- Section 1: Registration -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium">{{ t('server.events.settings.registration.title') }}</h3>
            <p class="text-sm text-muted-foreground">
              {{ t('server.events.settings.registration.currentStatus') }}: {{ event.status }}
            </p>
            <Button v-if="!isRegistrationOpen" :disabled="isOpening" @click="handleOpenRegistration">
              <Loader2 v-if="isOpening" class="mr-2 size-4 animate-spin" />
              {{ t('server.events.settings.registration.open') }}
            </Button>
            <Button
              v-else
              variant="destructive"
              :disabled="isClosing"
              @click="handleCloseRegistration"
            >
              <Loader2 v-if="isClosing" class="mr-2 size-4 animate-spin" />
              {{ t('server.events.settings.registration.close') }}
            </Button>
          </div>

          <Separator />

          <!-- Section 2: Integrations -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium">{{ t('server.events.settings.integrations.title') }}</h3>

            <div v-if="event.required_integrations.length === 0" class="text-sm text-muted-foreground">
              {{ t('server.events.settings.integrations.empty') }}
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="item in event.required_integrations"
                :key="item.id"
                class="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div class="flex items-center gap-2">
                  <img
                    v-if="providerMap.get(item.name)?.icon_url"
                    :src="providerMap.get(item.name)!.icon_url"
                    :alt="providerMap.get(item.name)!.display_name"
                    class="size-5"
                  />
                  <span class="text-sm">{{
                    providerMap.get(item.name)?.display_name || item.name
                  }}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8"
                  :disabled="isRemovingIntegration || isRegistrationOpen"
                  @click="handleRemoveIntegration(item.id)"
                >
                  <Trash2 class="size-4" />
                </Button>
              </div>
            </div>

            <div class="flex items-end gap-2">
              <div class="flex-1 space-y-1">
                <Select v-model="selectedProviderId" :disabled="isRegistrationOpen">
                  <SelectTrigger class="w-full">
                    <SelectValue :placeholder="t('server.events.settings.integrations.placeholder')" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="isLoadingProviders" value="" disabled>
                      {{ t('server.events.settings.integrations.loading') }}
                    </SelectItem>
                    <SelectItem
                      v-for="provider in availableProviders"
                      :key="provider.id"
                      :value="provider.id"
                    >
                      <div class="flex items-center gap-2">
                        <img
                          v-if="provider.icon_url"
                          :src="provider.icon_url"
                          :alt="provider.display_name"
                          class="size-4"
                        />
                        <span>{{ provider.display_name }}</span>
                      </div>
                    </SelectItem>
                    <div
                      v-if="!isLoadingProviders && availableProviders.length === 0"
                      class="px-2 py-1 text-sm text-muted-foreground"
                    >
                      {{ t('server.events.settings.integrations.empty') }}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <Button :disabled="!selectedProviderId || isAddingIntegration || isRegistrationOpen" @click="handleAddIntegration">
                <Loader2 v-if="isAddingIntegration" class="mr-2 size-4 animate-spin" />
                {{ t('server.events.settings.integrations.add') }}
              </Button>
            </div>
          </div>

          <Separator />

          <!-- Section 3: Game Roles -->
          <div class="space-y-3">
            <h3 class="text-sm font-medium">{{ t('server.events.settings.gameRoles.title') }}</h3>

            <div v-if="event.selected_game_roles.length === 0" class="text-sm text-muted-foreground">
              {{ t('server.events.settings.gameRoles.empty') }}
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="role in event.selected_game_roles"
                :key="role.id"
                class="rounded-md border p-3 space-y-2"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">
                    {{ roleNameMap.get(role.game_role_id) || role.game_role_id }}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-8"
                    :disabled="isRemovingGameRole || isRegistrationOpen"
                    @click="handleRemoveGameRole(role.id)"
                  >
                    <Trash2 class="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div class="space-y-2 pt-2 border-t">
              <div class="space-y-1">
                <Select v-model="selectedGameRoleId" :disabled="isRegistrationOpen">
                  <SelectTrigger class="w-full">
                    <SelectValue :placeholder="t('server.events.settings.gameRoles.placeholder')" />
                  </SelectTrigger>
                  <SelectContent>
                    <template v-if="isLoadingRoleSets">
                      <SelectItem value="" disabled>
                        {{ t('server.events.settings.gameRoles.loading') }}
                      </SelectItem>
                    </template>
                    <template v-else>
                      <template v-for="[setName, roles] in groupedAvailableRoles" :key="setName">
                        <SelectGroup>
                          <SelectLabel>{{ setName }}</SelectLabel>
                          <SelectItem v-for="role in roles" :key="role.id" :value="role.id">
                            {{ role.name }}
                          </SelectItem>
                        </SelectGroup>
                      </template>
                      <div
                        v-if="groupedAvailableRoles.size === 0"
                        class="px-2 py-1 text-sm text-muted-foreground"
                      >
                        {{ t('server.events.settings.gameRoles.empty') }}
                      </div>
                    </template>
                  </SelectContent>
                </Select>
              </div>

              <Button :disabled="!selectedGameRoleId || isAddingGameRole || isRegistrationOpen" @click="handleAddGameRole">
                <Loader2 v-if="isAddingGameRole" class="mr-2 size-4 animate-spin" />
                {{ t('server.events.settings.gameRoles.add') }}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="application" class="mt-4">
          <EventApplicationTab :server-id="serverId" :event-id="eventId" :use-application="editForm.useApplication" />
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>
