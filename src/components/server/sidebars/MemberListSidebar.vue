<template>
  <aside class="flex w-60 flex-shrink-0 flex-col border-l bg-background">
    <header class="flex shrink-0 items-center gap-2 border-b p-2">
      <div class="relative flex-1">
        <component
          :is="isSearching ? Loader2 : Search"
          :class="[
            'absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground',
            isSearching && 'animate-spin',
          ]"
        />
        <Input
          v-model="searchQuery"
          class="h-8 pl-8"
          placeholder="Search members..."
          @input="handleSearch"
        />
      </div>
    </header>

    <div v-if="isLoading && !allMembers.length" class="flex flex-1 items-center justify-center">
      <Loader2 class="size-6 animate-spin text-muted-foreground" />
    </div>

    <VirtualList
      v-else-if="allMembers.length > 0"
      ref="virtualListRef"
      :data="allMembers"
      :estimate-size="48"
      :overscan="10"
      :is-loading="isFetchingNextPage"
      :has-next-page="hasNextPage ?? false"
      :on-load-more="loadMore"
      :load-more-threshold="300"
      container-class="min-h-0 flex-1 p-2"
    >
      <template #default="{ item: member }">
        <MemberListItem :member="member" class="mb-1" @click="handleMemberClick" />
      </template>
    </VirtualList>

    <div v-else class="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <Users class="mb-2 size-8 text-muted-foreground/50" />
      <p class="text-sm text-muted-foreground">
        {{ debouncedSearchQuery ? 'No members found' : 'No members yet' }}
      </p>
    </div>

    <MemberPopover
      v-model:open="isPopoverOpen"
      :server-id="serverId"
      :member-id="activeMemberId"
      :anchor-el="anchorEl"
      @view-profile="handleViewProfile"
      @kick="handleKick"
    />
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Loader2, Search, Users } from 'lucide-vue-next'
import { useServerMembersInfiniteQuery, useKickMemberMutation } from '@/api/queries/server'
import { getErrorMessage } from '@/composables/useApiError'
import type { ServerID } from '@/types/user'
import MemberListItem from '../member/MemberListItem.vue'
import MemberPopover from '../member/MemberPopover.vue'
import VirtualList, { type VirtualListExposed } from '@/components/ui/virtual-list/VirtualList.vue'

const props = defineProps<{
  serverId: ServerID
}>()

const emit = defineEmits<{
  selectMember: [memberId: string]
  close: []
}>()

const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const isSearching = ref(false)

// Popover state
const isPopoverOpen = ref(false)
const activeMemberId = ref<string | null>(null)
const anchorEl = ref<HTMLElement | null>(null)

const virtualListRef = ref<VirtualListExposed | null>(null)
const serverId = computed(() => props.serverId)

const debouncedSearch = useDebounceFn(() => {
  debouncedSearchQuery.value = searchQuery.value
  isSearching.value = false
}, 300)

function handleSearch() {
  isSearching.value = true
  debouncedSearch()
}

const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
  useServerMembersInfiniteQuery(serverId, debouncedSearchQuery)

const { mutate: kickMember } = useKickMemberMutation()

const allMembers = computed(() => {
  if (!data.value?.pages) return []
  return data.value.pages.flatMap((page) => page.items)
})

function loadMore() {
  if (hasNextPage.value && !isFetchingNextPage.value) {
    fetchNextPage()
  }
}

watch(serverId, () => {
  searchQuery.value = ''
  debouncedSearchQuery.value = ''
  isSearching.value = false
  isPopoverOpen.value = false
})

watch(debouncedSearchQuery, () => {
  virtualListRef.value?.scrollToTop()
})

function handleMemberClick(memberId: string, element: HTMLElement) {
  // Если кликнули на того же члена - закрываем
  if (activeMemberId.value === memberId && isPopoverOpen.value) {
    isPopoverOpen.value = false
    return
  }

  activeMemberId.value = memberId
  anchorEl.value = element
  isPopoverOpen.value = true
}

function handleViewProfile(memberId: string) {
  emit('selectMember', memberId)
  isPopoverOpen.value = false
}

function handleKick(memberId: string) {
  const member = allMembers.value.find((m) => m.id === memberId)
  if (!member) return

  kickMember(
    { serverId: props.serverId, memberId },
    {
      onSuccess: () => {
        toast.success(`${member.nickname} has been kicked`)
        isPopoverOpen.value = false
      },
      onError: (error) => {
        const err = error instanceof Error ? error : new Error('Unknown error')
        toast.error('Failed to kick member', {
          description: getErrorMessage(err),
        })
      },
    },
  )
}
</script>
