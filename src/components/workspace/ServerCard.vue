<template>
  <li
    class="group relative overflow-hidden rounded-xl border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
  >
    <div class="relative h-24 overflow-hidden bg-muted">
      <img
        v-if="server.banner_url"
        :src="server.banner_url"
        :alt="`${server.name} banner`"
        class="h-full w-full object-cover transition-transform group-hover:scale-105"
      />
      <div v-else class="flex h-full items-center justify-center">
        <ImageIcon class="size-8 text-muted-foreground/50" />
      </div>

      <div class="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

      <div class="absolute -bottom-6 left-4">
        <Avatar class="size-14 border-4 border-card shadow-md">
          <AvatarImage :src="server.icon_url || ''" :alt="server.name" />
          <AvatarFallback class="text-lg font-semibold">
            {{ serverInitials }}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>

    <div class="p-4 pt-8">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-lg font-semibold">{{ server.name }}</h3>
          <p v-if="server.description" class="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {{ server.description }}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal class="size-4" />
              <span class="sr-only">Server actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="$emit('edit', server)">
              <Settings class="mr-2 size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem @click="$emit('invite', server)">
              <UserPlus class="mr-2 size-4" />
              Invite members
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              class="text-destructive focus:text-destructive"
              @click="$emit('delete', server)"
            >
              <Trash2 class="mr-2 size-4" />
              Delete server
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowRight, ImageIcon, MoreHorizontal, Settings, Trash2, UserPlus } from 'lucide-vue-next'
import type { Server } from '@/types/user'

const props = defineProps<{
  server: Server
}>()

defineEmits<{
  open: [server: Server]
  edit: [server: Server]
  delete: [server: Server]
  invite: [server: Server]
}>()

const serverInitials = computed(() => {
  return props.server.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})
</script>
