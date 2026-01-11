<template>
  <section ref="scrollContainer" class="mx-auto w-full max-w-[1200px] px-4 py-8 h-full">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Traveling</h1>
        <p class="mt-1 text-muted-foreground">Discover and join public gaming communities</p>
      </div>
    </div>

    <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-xs">
        <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="search"
          type="search"
          placeholder="Search servers..."
          class="pl-9 pr-9"
          @input="debouncedSearchHandler"
        />
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
      </div>
    </div>

    <template v-if="isLoading && !allServers.length">
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

    <template v-else-if="allServers.length === 0 && hasActiveSearch">
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

    <template v-else-if="allServers.length === 0">
      <div class="mt-6 rounded-lg border border-dashed bg-card p-8 text-center">
        <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
          <ServerIcon class="size-8 text-muted-foreground" />
        </div>
        <h3 class="mt-4 text-lg font-semibold">No public servers available</h3>
        <p class="mt-1 text-sm text-muted-foreground">
          Check back later or try searching for specific communities
        </p>
      </div>
    </template>

    <template v-else>
      <ul role="list" class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ServerCard
          v-for="server in allServers"
          :key="server.id"
          :server="server"
          :is-public="true"
          :is-member="currentMemberStore.isMemberOf(server.id)"
          :is-joining="joiningServerId === server.id"
          @join="handleJoinServer"
          @open="navigateToServer"
        />
      </ul>

      <!-- Loading more indicator -->
      <div
        v-if="isFetchingNextPage"
        class="mt-4 flex items-center justify-center text-sm text-muted-foreground"
      >
        <Loader2 class="mr-2 size-4 animate-spin" />
        Loading more...
      </div>
    </template>
  </section>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue' // 👈 Добавлен watchEffect
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertCircle, Loader2, RefreshCw, Search, SearchX, ServerIcon, X } from 'lucide-vue-next'
import ServerCard from '@/components/workspace/ServerCard.vue'
import ServerSkeleton from '@/components/workspace/ServerSkeleton.vue'
import { useApiError } from '@/composables/useApiError'
import {
  useJoinServerMutation,
  usePublicServersInfiniteQuery,
  useServersQuery,
} from '@/api/queries/server'
import type { ServerListItem, ServerID } from '@/types/user'
import { useCurrentMemberStore } from '@/stores/currentMember.store'

// ============================================
// Store & User Data
// ============================================
const currentMemberStore = useCurrentMemberStore()
// Получаем список серверов, где пользователь уже состоит
const { data: userServers } = useServersQuery()

// Заполняем store ID серверов пользователя, как только они загрузятся
watchEffect(() => {
  if (userServers.value) {
    const serverIds = userServers.value.map((s) => s.id)
    currentMemberStore.setUserServers(serverIds)
  }
})

// ============================================
// Query
// ============================================
const search = ref('')
const debouncedSearch = ref('')
const scrollContainer = ref<HTMLElement | null>(null)

const debouncedSearchHandler = useDebounceFn(() => {
  debouncedSearch.value = search.value
  scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}, 300)

const {
  data,
  isLoading,
  isError,
  error,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  refetch,
} = usePublicServersInfiniteQuery(debouncedSearch)

const { errorMessage } = useApiError(error)

const allServers = computed(() => {
  if (!data.value?.pages) return []
  return data.value.pages.flatMap((page) => page.items)
})

const skeletonCount = computed(() => 6)

function handleRefetch() {
  refetch()
}

// ============================================
// Search & Infinite Scroll
// ============================================
const clearSearch = () => {
  search.value = ''
  debouncedSearch.value = ''
  scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

const hasActiveSearch = computed(() => !!debouncedSearch.value)

const LOAD_MORE_THRESHOLD = 300

function handleScroll() {
  const element = scrollContainer.value
  if (!element || !hasNextPage.value || isFetchingNextPage.value) return

  const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight
  if (distanceFromBottom < LOAD_MORE_THRESHOLD) {
    fetchNextPage()
  }
}

onMounted(() => {
  scrollContainer.value?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  scrollContainer.value?.removeEventListener('scroll', handleScroll)
})

// ============================================
// Navigation & Actions
// ============================================
const router = useRouter()
const { mutate: joinServer, isPending: isJoining } = useJoinServerMutation()
const joiningServerId = ref<ServerID | null>(null)

function navigateToServer(server: ServerListItem) {
  router.push(`/servers/${server.id}`)
}

function handleJoinServer(server: ServerListItem) {
  if (isJoining.value) return

  joiningServerId.value = server.id // Устанавливаем ID для показа загрузки на конкретной карточке

  joinServer(
    {
      serverId: server.id,
      data: {},
    },
    {
      onSuccess: () => {
        toast.success(`Joined ${server.name}!`)
        currentMemberStore.addServer(server.id) // 👈 Обновляем store для мгновенного изменения UI
        router.push(`/servers/${server.id}`)
      },
      onError: (err) => {
        const { errorMessage: joinError } = useApiError(ref(err))
        toast.error(joinError.value || 'Failed to join server')
      },
      onSettled: () => {
        joiningServerId.value = null // Сбрасываем ID после завершения мутации
      },
    },
  )
}
</script>
