<template>
  <li
    class="group relative overflow-hidden rounded-xl border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
  >
    <div class="relative h-24 overflow-hidden bg-muted">
      <img
        v-if="server.banner_url"
        :src="server.banner_url"
        :alt="`${server.name} banner`"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="flex h-full items-center justify-center">
        <ImageIcon class="size-8 text-muted-foreground" />
      </div>

      <div class="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

      <div class="absolute right-2 top-2">
        <Badge :variant="server.public ? 'secondary' : 'outline'" class="text-xs">
          <Globe v-if="server.public" class="mr-1 size-3" />
          <Lock v-else class="mr-1 size-3" />
          {{ server.public ? 'Public' : 'Private' }}
        </Badge>
      </div>
    </div>

    <div class="relative z-10 -mt-7 ml-4">
      <Avatar class="size-14 border-2 border-card shadow-md">
        <AvatarImage v-if="server.icon_url" :src="server.icon_url" :alt="server.name" />
        <AvatarFallback class="bg-primary text-lg font-semibold text-primary-foreground">
          {{ serverInitials }}
        </AvatarFallback>
      </Avatar>
    </div>

    <div class="p-4 pt-2">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-lg font-semibold">{{ server.name }}</h3>
          <p v-if="server.description" class="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {{ server.description }}
          </p>
        </div>
      </div>

      <Button class="mt-4 w-full" @click="$emit('open', server)">
        Open server
        <ArrowRight class="ml-2 size-4" />
      </Button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Globe, ImageIcon, Lock } from 'lucide-vue-next'
import type { Server } from '@/types/user'
import { getInitials } from '@/lib/utils/user'

const props = defineProps<{
  server: Server
}>()

defineEmits<{
  open: [server: Server]
  edit: [server: Server]
  delete: [server: Server]
  invite: [server: Server]
}>()

const serverInitials = computed(() => getInitials(props.server.name))
</script>
