<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { PaginationState, SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/vue-table'
import {
  getCoreRowModel, getSortedRowModel, getFilteredRowModel, useVueTable,
} from '@tanstack/vue-table'
import { useApplicationsQuery, useEventQuery } from '@/api/queries/event'
import { useRoleSetQuery } from '@/api/queries/server/useServerRoles'
import { useCurrentMemberStore } from '@/stores/currentMember.store'
import { PERMISSION_CODES } from '@/types/permissions'
import { valueUpdater } from '@/lib/utils'
import type { ServerID } from '@/types/user'
import EventApplicationDataTable from '@/components/server/events/EventApplicationDataTable.vue'
import EventApplicationTableToolbar from '@/components/server/events/EventApplicationTableToolbar.vue'
import { createApplicationColumns } from '@/components/server/events/EventApplicationColumns'

const route = useRoute()
const { t } = useI18n()
const memberStore = useCurrentMemberStore()

const serverId = computed<ServerID>(() => route.params.serverId as ServerID)
const eventId = computed(() => route.params.eventId as string)

const { data: event } = useEventQuery(serverId, eventId)
const { data: roleSet } = useRoleSetQuery(serverId)

const canModerate = computed(() => {
  if (memberStore.hasPermission(PERMISSION_CODES.ADMINISTRATOR)) return true
  const organizers = event.value?.organizers ?? []
  return organizers.some((o) => o.member_id === memberStore.memberId)
})

const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 20 })

const queryParams = computed(() => ({
  page: pagination.value.pageIndex + 1,
  page_size: pagination.value.pageSize,
}))

const { data, isPending } = useApplicationsQuery(serverId, eventId, queryParams)

const applications = computed(() => data.value ?? [])

const pageCount = computed(() => {
  if (!data.value) return 0
  if (data.value.length < pagination.value.pageSize) return pagination.value.pageIndex + 1
  return -1
})

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

const columns = computed(() => {
  const gameRolesMap = new Map<string, string>()
  if (roleSet.value) {
    for (const gameRole of roleSet.value.game_roles ?? []) {
      gameRolesMap.set(gameRole.id, gameRole.name)
    }
  }
  return createApplicationColumns(t, serverId.value, eventId.value, canModerate.value, gameRolesMap)
})

const table = useVueTable({
  get data() { return applications.value },
  get columns() { return columns.value },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  manualPagination: true,
  get pageCount() { return pageCount.value },
  onSortingChange: (updater) => valueUpdater(updater, sorting),
  onColumnFiltersChange: (updater) => valueUpdater(updater, columnFilters),
  onColumnVisibilityChange: (updater) => valueUpdater(updater, columnVisibility),
  onPaginationChange: (updater) => valueUpdater(updater, pagination),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get pagination() { return pagination.value },
  },
})
</script>

<template>
  <div class="space-y-4">
    <EventApplicationTableToolbar :table="table" />
    <EventApplicationDataTable
      :table="table"
      :is-loading="isPending"
    />
  </div>
</template>
