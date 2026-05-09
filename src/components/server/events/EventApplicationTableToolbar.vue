<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { components } from '@/types/api'
import { useI18n } from 'vue-i18n'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { applicationStatuses } from './EventApplicationColumns'

type Application = components['schemas']['ApplicationListItemResponse']

const { table } = defineProps<{ table: Table<Application> }>()

const { t } = useI18n()

const statusColumn = table.getColumn('status')

function toggleStatus(value: string) {
  const current = (statusColumn?.getFilterValue() as string[]) ?? []
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value]
  statusColumn?.setFilterValue(next.length ? next : undefined)
}

function isActive(value: string) {
  const current = (statusColumn?.getFilterValue() as string[]) ?? []
  return current.includes(value)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Input
      :placeholder="t('server.events.applications.search')"
      :model-value="(table.getColumn('user')?.getFilterValue() as string) ?? ''"
      class="max-w-60"
      @update:model-value="table.getColumn('user')?.setFilterValue($event)"
    />
    <Button
      v-for="s in applicationStatuses"
      :key="s.value"
      variant="outline"
      size="sm"
      :class="isActive(s.value) ? 'bg-secondary' : ''"
      @click="toggleStatus(s.value)"
    >
      {{ t(s.label as any) }}
    </Button>
    <Button
      v-if="statusColumn?.getFilterValue()"
      variant="ghost"
      size="sm"
      @click="table.resetColumnFilters()"
    >
      {{ t('server.events.applications.actions.resetFilters') }}
    </Button>
  </div>
</template>
