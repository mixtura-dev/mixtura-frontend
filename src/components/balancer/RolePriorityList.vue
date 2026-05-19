<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core'
import RoleSortableList from '@/components/balancer/RoleSortableList.vue'

interface Props {
  roleOrder: string[]
  getRoleLabel: (id: string) => string
  getRating: (id: string) => number | null
  hasCustom: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  reorder: [newOrder: string[]]
  ratingChange: [gameRoleId: string, value: number]
  saveRating: [gameRoleId: string]
}>()
</script>

<template>
  <DnDProvider>
    <RoleSortableList
      :role-order="roleOrder"
      :get-role-label="getRoleLabel"
      :get-rating="getRating"
      :has-custom="hasCustom"
      @reorder="(v: string[]) => emit('reorder', v)"
      @rating-change="(gid: string, v: number) => emit('ratingChange', gid, v)"
      @save-rating="(gid: string) => emit('saveRating', gid)"
    />
  </DnDProvider>
</template>
