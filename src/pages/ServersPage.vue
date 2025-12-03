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
        <Button @click="$router.push('/servers/new')">
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

      <p v-if="search" class="mt-4 text-center text-sm text-muted-foreground">
        Showing {{ filteredServers.length }} of {{ servers.length }} servers
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Plus, RefreshCw, Search, SearchX, ServerIcon, X } from 'lucide-vue-next'

import ServerCard from '@/components/workspace/ServerCard.vue'
import ServerSkeleton from '@/components/workspace/ServerSkeleton.vue'

import type { Server } from '@/types/user'

const router = useRouter()
const search = ref('')
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const showInviteDialog = ref(false)
const selectedServer = ref<Server | null>(null)

// ------------------------------------------------------
// ✅ MOCK DATA
// ------------------------------------------------------
const mockServers: Server[] = [
  {
    id: '1',
    name: 'Valorant EU Team',
    description: 'Competitive Valorant community server',
    icon_url: null,
    banner_url: null,
    owner_id: '123',
    public: true,
    created_at: '2024-01-12T10:00:00Z',
    rating_set: null,
    role_set: null,
    games: [
      {
        id: 'v1',
        name: 'Valorant',
        icon_url: '',
        banner_url: '',
      },
    ],
  },
  {
    id: '2',
    name: 'CS2 Matchmaking Hub',
    description: 'Classic competitive CS2 server',
    icon_url: null,
    banner_url: null,
    owner_id: '456',
    public: true,
    created_at: '2024-02-01T12:00:00Z',
    rating_set: null,
    role_set: null,
    games: [
      {
        id: 'cs2',
        name: 'Counter-Strike 2',
        icon_url: '',
        banner_url: '',
      },
    ],
  },
  {
    id: '3',
    name: 'Dota 2 CIS',
    description: 'Dota 2 community for tournaments',
    icon_url: null,
    banner_url: null,
    owner_id: '789',
    public: false,
    created_at: '2024-03-05T15:00:00Z',
    rating_set: null,
    role_set: null,
    games: [
      {
        id: 'd2',
        name: 'Dota 2',
        icon_url: '',
        banner_url: '',
      },
    ],
  },
]

// ------------------------------------------------------
// ✅ MOCKED QUERY STATE (замена useServersQuery)
// ------------------------------------------------------
const servers = ref<Server[]>(mockServers)
const isLoading = ref(false)
const isError = ref(false)
const error = ref(null)
const isRefetching = ref(false)

function refetch() {
  isRefetching.value = true
  setTimeout(() => {
    servers.value = [...mockServers] // можно обновить
    isRefetching.value = false
  }, 600)
}

// ------------------------------------------------------
// Logic from original component
// ------------------------------------------------------
const filteredServers = computed(() => {
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
