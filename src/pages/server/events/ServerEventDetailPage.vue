<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Loader2, MoreVertical } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useEventQuery,
  useActivateEventMutation,
  useOpenRegistrationMutation,
  useCancelEventMutation,
  useCompleteEventMutation,
} from '@/api/queries/event'
import { useCurrentMemberStore } from '@/stores/currentMember.store'
import { PERMISSION_CODES } from '@/types/permissions'
import CreateEventModal from '@/components/server/events/CreateEventModal.vue'
import type { ServerID } from '@/types/user'
import type { components } from '@/types/api'

type EventDetail = components['schemas']['EventDetailResponse']

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const memberStore = useCurrentMemberStore()

const serverId = computed<ServerID>(() => route.params.serverId as ServerID)
const eventId = computed(() => route.params.eventId as string)

const { data: event, isLoading, isError } = useEventQuery(serverId, eventId)

const eventDetail = computed(() => event.value as EventDetail | null)

const isAdmin = computed(() => memberStore.hasPermission(PERMISSION_CODES.ADMINISTRATOR))
const isTerminal = computed(
  () => event.value?.status === 'COMPLETED' || event.value?.status === 'CANCELLED',
)
const isSingle = computed(() => event.value?.match_type === 'SINGLE')

const showEditModal = ref(false)

const { mutate: activateEvent, isPending: isActivating } = useActivateEventMutation()
const { mutate: openRegistration, isPending: isOpening } = useOpenRegistrationMutation()
const { mutate: cancelEvent, isPending: isCancelling } = useCancelEventMutation()
const { mutate: completeEvent, isPending: isCompleting } = useCompleteEventMutation()

const isPendingAction = computed(
  () => isActivating.value || isOpening.value || isCancelling.value || isCompleting.value,
)

const tabItems = computed(() => {
  const base = `/servers/${serverId.value}/events/${eventId.value}`
  return [
    { to: `${base}/overview`, label: t('server.events.tabs.overview') },
    { to: `${base}/applications`, label: t('server.events.tabs.applications') },
    { to: `${base}/matches`, label: t('server.events.tabs.matches') },
  ]
})

function isActiveTab(path: string) {
  return route.path === path
}

function handleActivate() {
  activateEvent(
    { serverId: serverId.value, eventId: eventId.value },
    {
      onSuccess: () => toast.success(t('server.events.toast.activated')),
      onError: () => toast.error(t('server.events.toast.actionError')),
    },
  )
}

function handleOpenRegistration() {
  openRegistration(
    { serverId: serverId.value, eventId: eventId.value },
    {
      onSuccess: () => toast.success(t('server.events.toast.registrationOpened')),
      onError: () => toast.error(t('server.events.toast.actionError')),
    },
  )
}

function handleCancel() {
  cancelEvent(
    { serverId: serverId.value, eventId: eventId.value },
    {
      onSuccess: () => toast.success(t('server.events.toast.cancelled')),
      onError: () => toast.error(t('server.events.toast.actionError')),
    },
  )
}

function handleComplete() {
  completeEvent(
    { serverId: serverId.value, eventId: eventId.value },
    {
      onSuccess: () => toast.success(t('server.events.toast.completed')),
      onError: () => toast.error(t('server.events.toast.actionError')),
    },
  )
}

const statusBadgeVariant = computed(() => {
  switch (event.value?.status) {
    case 'CREATED':
      return 'secondary' as const
    case 'REGISTRATION':
      return 'default' as const
    case 'IDLE':
      return 'outline' as const
    case 'FORMATION':
      return 'secondary' as const
    case 'IN_PROGRESS':
      return 'default' as const
    case 'COMPLETED':
      return 'secondary' as const
    case 'CANCELLED':
      return 'destructive' as const
    default:
      return 'secondary' as const
  }
})
</script>

<template>
  <div v-if="isLoading" class="flex h-full items-center justify-center">
    <Loader2 class="size-8 animate-spin text-muted-foreground" />
  </div>
  <div v-else-if="isError || !event" class="flex h-full items-center justify-center">
    <p class="text-muted-foreground">{{ t('server.events.detail.notFound') }}</p>
  </div>
  <div v-else class="flex flex-col gap-4 p-4">
    <div class="flex items-center gap-3">
      <h1 class="text-2xl font-bold">{{ event.name }}</h1>
      <Badge :variant="statusBadgeVariant">
        {{ event.status }}
      </Badge>

      <DropdownMenu v-if="isAdmin && !isTerminal">
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="size-8 ml-auto">
            <MoreVertical class="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-44">
          <DropdownMenuItem :disabled="isPendingAction" @click="handleActivate">
            <Loader2 v-if="isActivating" class="mr-2 size-4 animate-spin" />
            {{ t('server.events.actions.activate') }}
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="event.status !== 'REGISTRATION'"
            :disabled="isPendingAction"
            @click="handleOpenRegistration"
          >
            <Loader2 v-if="isOpening" class="mr-2 size-4 animate-spin" />
            {{ t('server.events.actions.openRegistration') }}
          </DropdownMenuItem>
          <DropdownMenuItem v-if="isSingle" :disabled="isPendingAction" @click="handleComplete">
            <Loader2 v-if="isCompleting" class="mr-2 size-4 animate-spin" />
            {{ t('server.events.actions.complete') }}
          </DropdownMenuItem>
          <DropdownMenuItem :disabled="isPendingAction" @click="showEditModal = true">
            {{ t('server.events.actions.update') }}
          </DropdownMenuItem>
          <DropdownMenuItem :disabled="isPendingAction" @click="handleCancel">
            <Loader2 v-if="isCancelling" class="mr-2 size-4 animate-spin" />
            {{ t('server.events.actions.cancel') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div class="overflow-x-auto -mx-4 px-4">
      <nav class="flex gap-1 border-b min-w-max">
        <button
          v-for="tab in tabItems"
          :key="tab.to"
          class="shrink-0 px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
          :class="
            isActiveTab(tab.to)
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          "
          @click="router.push(tab.to)"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <RouterView />

    <p v-if="isTerminal" class="text-sm text-muted-foreground">
      {{ t('server.events.detail.readOnly') }}
    </p>

    <CreateEventModal v-model:open="showEditModal" :server-id="serverId" :event="eventDetail" />
  </div>
</template>
