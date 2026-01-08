<template>
  <section class="mx-auto w-full max-w-[1200px] px-4 py-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">My Servers</h1>
        <p class="mt-1 text-muted-foreground">Manage your gaming communities and team servers</p>
      </div>
    </div>

    <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-xs">
        <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="search" type="search" placeholder="Search servers..." class="pl-9 pr-9" />
        <Transition
          enter-active-class="transition-opacity duration-150"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <Button
            v-if="search"
            variant="ghost"
            size="icon"
            class="absolute right-1 top-1/2 size-7 -translate-y-1/2"
            @click="clearSearch"
          >
            <X class="size-4" />
            <span class="sr-only">Clear search</span>
          </Button>
        </Transition>
      </div>

      <div class="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline" size="icon" :disabled="isFetching" @click="handleRefetch">
                <RefreshCw class="size-4" :class="{ 'animate-spin': isFetching }" />
                <span class="sr-only">Refresh</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh servers</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button @click="navigateToCreate">
          <Plus class="mr-2 size-4" />
          New server
        </Button>
      </div>
    </div>

    <template v-if="isLoading">
      <ul
        role="status"
        aria-busy="true"
        aria-label="Loading servers"
        class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <ServerSkeleton v-for="n in skeletonCount" :key="n" />
      </ul>
    </template>

    <template v-else-if="isError">
      <Alert variant="destructive" class="mt-6">
        <AlertCircle class="size-4" />
        <AlertTitle>Failed to load servers</AlertTitle>
        <AlertDescription class="flex flex-col gap-2">
          <span>{{ errorMessage }}</span>
          <Button
            variant="outline"
            size="sm"
            class="w-fit"
            :disabled="isFetching"
            @click="handleRefetch"
          >
            <RefreshCw class="mr-2 size-4" :class="{ 'animate-spin': isFetching }" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    </template>

    <template v-else-if="filteredServers.length === 0 && hasActiveSearch">
      <div class="mt-6 rounded-lg border border-dashed bg-card p-8 text-center">
        <SearchX class="mx-auto size-12 text-muted-foreground" />
        <h3 class="mt-4 text-lg font-semibold">No servers found</h3>
        <p class="mt-1 text-sm text-muted-foreground">
          No servers match "<span class="font-medium">{{ debouncedSearch }}</span
          >"
        </p>
        <Button variant="outline" class="mt-4" @click="clearSearch"> Clear search </Button>
      </div>
    </template>

    <template v-else-if="totalCount === 0">
      <div class="mt-6 rounded-lg border border-dashed bg-card p-8 text-center">
        <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
          <ServerIcon class="size-8 text-muted-foreground" />
        </div>
        <h3 class="mt-4 text-lg font-semibold">No servers yet</h3>
        <p class="mt-1 text-sm text-muted-foreground">
          Create your first server to start building your gaming community
        </p>
        <Button class="mt-4" @click="navigateToCreate">
          <Plus class="mr-2 size-4" />
          Create server
        </Button>
      </div>
    </template>

    <template v-else>
      <ul role="list" class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ServerCard
          v-for="server in filteredServers"
          :key="server.id"
          :server="server"
          @open="navigateToServer"
        />
      </ul>

      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <p v-if="isFiltered" class="mt-4 text-center text-sm text-muted-foreground">
          Showing {{ filteredCount }} of {{ totalCount }} servers
        </p>
      </Transition>
    </template>

    <ServerDeleteDialog
      v-model:open="showDeleteDialog"
      :server="selectedServer"
      @deleted="onServerDeleted"
    />

    <ServerInviteDialog v-model:open="showInviteDialog" :server="selectedServer" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { AlertCircle, Plus, RefreshCw, Search, SearchX, ServerIcon, X } from 'lucide-vue-next'

import ServerCard from '@/components/workspace/ServerCard.vue'
import ServerSkeleton from '@/components/workspace/ServerSkeleton.vue'
import ServerDeleteDialog from '@/components/workspace/ServerDeleteDialog.vue'
import ServerInviteDialog from '@/components/workspace/ServerInviteDialog.vue'

import { useServerSearch } from '@/composables/useServerSearch'
import { useApiError } from '@/composables/useApiError'

import type { Server } from '@/types/user'
import { useServersQuery } from '@/api/queries/server'

// ============================================
// Query
// ============================================

const { data: servers, isLoading, isError, error, isFetching, refetch } = useServersQuery()

const { errorMessage } = useApiError(error)

function handleRefetch() {
  refetch()
}

// ============================================
// Search
// ============================================

const {
  search,
  debouncedSearch,
  filteredServers,
  totalCount,
  filteredCount,
  hasActiveSearch,
  isFiltered,
  clearSearch,
} = useServerSearch(servers, {
  debounce: 250,
  syncUrl: true,
})

// ============================================
// UI State
// ============================================

const router = useRouter()
const showDeleteDialog = ref(false)
const showInviteDialog = ref(false)
const selectedServer = ref<Server | null>(null)

const skeletonCount = computed(() => {
  const previousCount = servers.value?.length
  if (previousCount && previousCount > 0) {
    return Math.min(previousCount, 6)
  }
  return 3
})

// ============================================
// Navigation
// ============================================

function navigateToCreate() {
  router.push('/servers/new')
}

function navigateToServer(server: Server) {
  router.push(`/servers/${server.id}`)
}

// function navigateToServerSettings(server: Server) {
//   router.push(`/servers/${server.id}/settings`)
// }

// ============================================
// Dialogs
// ============================================

// function openDeleteDialog(server: Server) {
//   selectedServer.value = server
//   showDeleteDialog.value = true
// }

// function openInviteDialog(server: Server) {
//   selectedServer.value = server
//   showInviteDialog.value = true
// }

function onServerDeleted() {
  showDeleteDialog.value = false
  selectedServer.value = null
}
</script>
