<template>
  <aside class="flex w-16 flex-shrink-0 flex-col border-r bg-background">
    <div class="flex items-center justify-center p-2">
      <Button variant="secondary" size="icon" class="size-12 rounded-xl" @click="router.push('/')">
        <Icon class="size-7" icon="custom:logo" />
      </Button>
    </div>
    <Separator />
    <TooltipProvider :delay-duration="200">
      <div ref="listRef" class="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
        <div v-for="server in servers" :key="server.id" class="group relative mb-2">
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-muted transition-all"
                :class="{
                  'ring-2 ring-primary ring-offset-2 ring-offset-background': isActive(server.id),
                }"
                @click="selectServer(server.id)"
              >
                <img
                  v-if="server.icon_url"
                  :src="server.icon_url"
                  :alt="server.name"
                  class="size-full object-cover"
                />
                <span v-else class="text-sm font-semibold">
                  {{ getInitials(server.name) }}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {{ server.name }}
            </TooltipContent>
          </Tooltip>

          <div
            v-if="isActive(server.id)"
            class="absolute -left-2 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
          />
        </div>

        <Tooltip>
          <TooltipTrigger as-child>
            <button
              class="flex size-12 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              @click="router.push('/servers/new')"
            >
              <Plus class="size-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Create Server</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>

    <div v-if="isLoading" class="flex justify-center p-2">
      <Loader2 class="size-5 animate-spin text-muted-foreground" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { Loader2, Plus } from 'lucide-vue-next'
import { useServersQuery } from '@/api/queries/server'
import { getInitials } from '@/lib/utils/user'
import { Icon } from '@iconify/vue'
import Separator from '@/components/ui/separator/Separator.vue'

const router = useRouter()
const route = useRoute()

const { data: servers, isLoading } = useServersQuery()

const currentServerId = computed(() => route.params.serverId as string | undefined)

function isActive(serverId: string): boolean {
  return currentServerId.value === serverId
}

function selectServer(serverId: string) {
  router.push(`/servers/${serverId}`)
}
</script>
