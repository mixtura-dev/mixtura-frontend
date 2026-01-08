import { computed, ref, watch, toValue, type MaybeRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import type { Server } from '@/types/user'

export interface UseServerSearchOptions {
  debounce?: number
  syncUrl?: boolean
  urlParam?: string
}

export function useServerSearch(
  servers: MaybeRef<Server[] | undefined>,
  options: UseServerSearchOptions = {},
) {
  const { debounce = 300, syncUrl = true, urlParam = 'q' } = options

  const router = useRouter()
  const route = useRoute()

  const searchInput = ref('')
  const debouncedSearch = ref('')

  if (syncUrl) {
    const initialQuery = route.query[urlParam]
    if (typeof initialQuery === 'string') {
      searchInput.value = initialQuery
      debouncedSearch.value = initialQuery
    }
  }

  const updateDebouncedSearch = useDebounceFn((value: string) => {
    debouncedSearch.value = value

    if (syncUrl) {
      const query = { ...route.query }
      if (value) {
        query[urlParam] = value
      } else {
        delete query[urlParam]
      }
      router.replace({ query })
    }
  }, debounce)

  watch(searchInput, (value) => {
    updateDebouncedSearch(value)
  })

  // Получение списка серверов
  const getServerList = (): Server[] => {
    return toValue(servers) ?? []
  }

  // Фильтрация
  const filteredServers = computed<Server[]>(() => {
    const serverList = getServerList()

    if (!serverList.length) return []
    if (!debouncedSearch.value.trim()) return serverList

    const query = debouncedSearch.value.toLowerCase().trim()

    return serverList.filter((server) => {
      const matchName = server.name.toLowerCase().includes(query)
      const matchDesc = server.description?.toLowerCase().includes(query) ?? false

      // Безопасная проверка games с использованием 'in'
      // Если в типе списка нет games, эта часть просто вернет false, но не упадет
      let matchGame = false
      if ('games' in server && Array.isArray(server.games)) {
        // Приводим к типу, у которого есть games, для проверки
        const games = server.games as { name: string }[]
        matchGame = games.some((game) => game.name.toLowerCase().includes(query))
      }

      return matchName || matchDesc || matchGame
    })
  })

  // Статистика
  const totalCount = computed(() => getServerList().length)
  const filteredCount = computed(() => filteredServers.value.length)
  const hasActiveSearch = computed(() => !!debouncedSearch.value.trim())
  const isFiltered = computed(
    () => hasActiveSearch.value && filteredCount.value !== totalCount.value,
  )

  function clearSearch() {
    searchInput.value = ''
    debouncedSearch.value = ''
    if (syncUrl) {
      const query = { ...route.query }
      delete query[urlParam]
      router.replace({ query })
    }
  }

  function setSearch(value: string) {
    searchInput.value = value
  }

  return {
    search: searchInput,
    debouncedSearch,
    filteredServers,
    totalCount,
    filteredCount,
    hasActiveSearch,
    isFiltered,
    clearSearch,
    setSearch,
  }
}
