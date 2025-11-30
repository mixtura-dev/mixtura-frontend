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
        <Button
          v-if="search"
          variant="ghost"
          size="icon"
          class="absolute right-1 top-1/2 size-7 -translate-y-1/2"
          @click="search = ''"
        >
          <X class="size-4" />
          <span class="sr-only">Clear search</span>
        </Button>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="icon" @click="refetch">
          <RefreshCw class="size-4" :class="{ 'animate-spin': isRefetching }" />
          <span class="sr-only">Refresh</span>
        </Button>
        <Button @click="showCreateDialog = true">
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
        <ServerSkeleton v-for="n in 6" :key="n" />
      </ul>
    </template>

    <template v-else-if="isError">
      <Alert variant="destructive" class="mt-6">
        <AlertCircle class="size-4" />
        <AlertTitle>Failed to load servers</AlertTitle>
        <AlertDescription class="flex flex-col gap-2">
          <span>{{ errorMessage }}</span>
          <Button variant="outline" size="sm" class="w-fit" @click="refetch">
            <RefreshCw class="mr-2 size-4" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    </template>

    <template v-else-if="filteredServers.length === 0 && search">
      <div class="mt-6 rounded-lg border border-dashed bg-card p-8 text-center">
        <SearchX class="mx-auto size-12 text-muted-foreground/50" />
        <h3 class="mt-4 text-lg font-semibold">No servers found</h3>
        <p class="mt-1 text-sm text-muted-foreground">
          No servers match "<span class="font-medium">{{ search }}</span
          >"
        </p>
        <Button variant="outline" class="mt-4" @click="search = ''"> Clear search </Button>
      </div>
    </template>

    <template v-else-if="servers?.length === 0">
      <div class="mt-6 rounded-lg border border-dashed bg-card p-8 text-center">
        <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
          <ServerIcon class="size-8 text-muted-foreground" />
        </div>
        <h3 class="mt-4 text-lg font-semibold">No servers yet</h3>
        <p class="mt-1 text-sm text-muted-foreground">
          Create your first server to start building your gaming community
        </p>
        <Button class="mt-4" @click="showCreateDialog = true">
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
          @edit="navigateToServerSettings"
          @delete="openDeleteDialog"
          @invite="openInviteDialog"
        />
      </ul>

      <!-- Results count -->
      <p v-if="search" class="mt-4 text-center text-sm text-muted-foreground">
        Showing {{ filteredServers.length }} of {{ servers?.length }} servers
      </p>
    </template>

    <!-- <CreateServerDialog v-model:open="showCreateDialog" />

    <DeleteServerDialog v-model:open="showDeleteDialog" :server="selectedServer" />

    <InviteDialog v-model:open="showInviteDialog" :server-id="selectedServer?.id" /> -->
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Plus, RefreshCw, Search, SearchX, ServerIcon, X } from 'lucide-vue-next'
import { useServersQuery } from '@/api/queries/server'
import ServerCard from '@/components/workspace/ServerCard.vue'
import ServerSkeleton from '@/components/workspace/ServerSkeleton.vue'
import type { Server } from '@/types/user'

const router = useRouter()
const search = ref('')
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const showInviteDialog = ref(false)
const selectedServer = ref<Server | null>(null)

const { data: servers, isLoading, isError, error, refetch, isRefetching } = useServersQuery()

const filteredServers = computed(() => {
  if (!servers.value) return []
  if (!search.value.trim()) return servers.value

  const query = search.value.toLowerCase().trim()
  return servers.value.filter(
    (server) =>
      server.name.toLowerCase().includes(query) ||
      server.description?.toLowerCase().includes(query),
  )
})

const errorMessage = computed(() => {
  const err = error.value
  return err?.response?.data?.message || err?.message || 'An unexpected error occurred'
})

function navigateToServer(server: Server) {
  router.push(`/servers/${server.id}`)
}

function navigateToServerSettings(server: Server) {
  router.push(`/servers/${server.id}/settings`)
}

function openDeleteDialog(server: Server) {
  selectedServer.value = server
  showDeleteDialog.value = true
}

function openInviteDialog(server: Server) {
  selectedServer.value = server
  showInviteDialog.value = true
}
</script>
