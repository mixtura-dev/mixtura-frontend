<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LayoutDashboard, Plus, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useCurrentMemberStore } from '@/stores/currentMember.store'
import { PERMISSION_CODES } from '@/types/permissions'
import { usePublicEventsQuery } from '@/api/queries/event'
import ServerSidebarNavItem from '@/components/server/ServerSidebarNavItem.vue'
import EventSidebarItem from '@/components/server/events/EventSidebarItem.vue'
import type { ServerID } from '@/types/user'

const props = defineProps<{ serverId: ServerID }>()

const emit = defineEmits<{
  createEvent: []
}>()

const { t } = useI18n()
const route = useRoute()
const memberStore = useCurrentMemberStore()

const { data: events, isLoading: isLoadingEvents } = usePublicEventsQuery(() => props.serverId)

const isAdmin = computed(() => memberStore.hasPermission(PERMISSION_CODES.ADMINISTRATOR))

const navItems = computed(() => {
  const base = `/servers/${props.serverId}`
  return [
    {
      to: `${base}/overview`,
      icon: LayoutDashboard,
      label: t('server.nav.overview'),
      isActive: route.path === `${base}/overview`,
    },
  ]
})
</script>

<template>
  <div class="mb-1 flex items-center justify-between px-2">
    <p class="text-xs font-bold text-muted-foreground">
      {{ t('server.nav.channels') }}
    </p>
  </div>
  <ServerSidebarNavItem
    v-for="item in navItems"
    :key="item.to"
    as-child
    :active="item.isActive"
  >
    <RouterLink :to="item.to">
      <component :is="item.icon" class="size-4" />
      {{ item.label }}
    </RouterLink>
  </ServerSidebarNavItem>

  <div class="mt-3 mb-1 flex items-center justify-between px-2">
    <p class="text-xs font-bold text-muted-foreground">
      {{ t('server.events.sidebarTitle') }}
    </p>
    <Button
      v-if="isAdmin"
      variant="ghost"
      size="icon"
      class="size-5"
      :aria-label="t('server.events.createEvent.title')"
      @click="emit('createEvent')"
    >
      <Plus class="size-3" />
    </Button>
  </div>
  <div v-if="isLoadingEvents" class="flex items-center justify-center py-2">
    <Loader2 class="size-4 animate-spin text-muted-foreground" />
  </div>
  <div v-else-if="events && events.length > 0" class="flex flex-col gap-0.5">
    <EventSidebarItem
      v-for="eventItem in events"
      :key="eventItem.id"
      :event="eventItem"
      :server-id="serverId"
    />
  </div>
  <p v-else class="px-2 text-xs text-muted-foreground">
    {{ t('server.events.noEvents') }}
  </p>
</template>
