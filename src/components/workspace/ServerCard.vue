<template>
  <li
    class="relative group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-lg"
  >
    <!-- Server Banner -->
    <div class="relative h-24 flex-shrink-0 overflow-hidden bg-muted">
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
      <!-- Public/Private Badge -->
      <div class="absolute right-2 top-2">
        <Badge variant="secondary" class="text-xs backdrop-blur-sm">
          <Globe v-if="server.public" class="mr-1 size-3" />
          <Lock v-else class="mr-1 size-3" />
          {{ server.public ? 'Public' : 'Private' }}
        </Badge>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col p-4 pt-2">
      <!-- Server Icon -->
      <div class="relative z-10 -mt-10 mb-2 flex-shrink-0">
        <Avatar class="size-14 border-4 border-card shadow-md">
          <AvatarImage v-if="server.icon_url" :src="server.icon_url" :alt="server.name" />
          <AvatarFallback class="bg-primary text-lg font-semibold text-primary-foreground">
            {{ serverInitials }}
          </AvatarFallback>
        </Avatar>
      </div>

      <!-- Text content - grows to fill space -->
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <h3 class="truncate text-lg font-semibold">{{ server.name }}</h3>
          <!-- Joined Badge -->
          <Badge
            v-if="isMember"
            variant="outline"
            class="flex items-center gap-1 border-green-500/50 text-green-600"
          >
            <Check class="size-3" />
            Joined
          </Badge>
        </div>
        <p v-if="server.description" class="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {{ server.description }}
        </p>
      </div>

      <!-- Action Button - stays at the bottom -->
      <Button
        class="mt-4 w-full flex-shrink-0"
        :variant="shouldShowJoin ? 'default' : 'secondary'"
        :disabled="isJoining"
        @click.stop="shouldShowJoin ? handleJoin() : handleOpen()"
      >
        <Loader2 v-if="isJoining" class="mr-2 size-4 animate-spin" />
        <template v-else>
          <UserPlus v-if="shouldShowJoin" class="mr-2 size-4" />
          <ArrowRight v-else class="mr-2 size-4" />
          {{ shouldShowJoin ? 'Join Server' : 'Open Server' }}
        </template>
      </Button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Check, // <-- Добавлен значок галочки
  Globe,
  ImageIcon,
  Lock,
  Loader2,
  UserPlus,
} from 'lucide-vue-next'
import { getInitials } from '@/lib/utils/user'
import type { ServerListItem } from '@/types/user'

const props = defineProps<{
  server: ServerListItem
  isPublic?: boolean
  isJoining?: boolean
  isMember?: boolean
}>()

const emit = defineEmits<{
  open: [server: ServerListItem]
  join: [server: ServerListItem]
}>()

const shouldShowJoin = computed(() => props.isPublic && !props.isMember)

const serverInitials = computed(() => getInitials(props.server.name))

function handleOpen() {
  emit('open', props.server)
}

function handleJoin() {
  // Двойная проверка, чтобы избежать случайных join-эвентов
  if (props.isMember) {
    handleOpen()
    return
  }
  emit('join', props.server)
}
</script>
