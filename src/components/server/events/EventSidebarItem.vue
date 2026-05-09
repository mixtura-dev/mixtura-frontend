<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { components } from '@/types/api'
import type { ServerID } from '@/types/user'

type EventCard = components['schemas']['EventCardResponse']

defineProps<{
  event: EventCard
  serverId: ServerID
}>()
</script>

<template>
  <RouterLink
    :to="`/servers/${serverId}/events/${event.id}`"
    class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
  >
    <span
      class="size-2 shrink-0 rounded-full"
      :class="
        event.status === 'IN_PROGRESS'
          ? 'bg-green-500'
          : event.status === 'REGISTRATION'
            ? 'bg-blue-500'
            : 'bg-muted-foreground'
      "
    />
    <span class="truncate">{{ event.name }}</span>
  </RouterLink>
</template>
