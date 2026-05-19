<script setup lang="ts">
import { ref } from 'vue'
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core'
import RoleDragRow from '@/components/balancer/RoleDragRow.vue'

interface Props {
  roleOrder: string[]
  getRoleLabel: (id: string) => string
  getRating: (id: string) => number | null
  hasCustom: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  reorder: [newOrder: string[]]
  ratingChange: [gameRoleId: string, value: number]
  saveRating: [gameRoleId: string]
}>()

const listRef = ref<HTMLElement | null>(null)

makeDroppable(
  listRef,
  {
    groups: ['role-priority'],
    events: {
      onDrop(e: IDragEvent) {
        const result = e.helpers.suggestSort('vertical')
        if (!result) return
        emit('reorder', result.sourceItems as string[])
      },
    },
  },
  () => [...props.roleOrder],
)
</script>

<template>
  <div ref="listRef" class="space-y-1.5">
    <RoleDragRow
      v-for="(gameRoleId, index) in roleOrder"
      :key="gameRoleId"
      :game-role-id="gameRoleId"
      :index="index"
      :role-order="[...roleOrder]"
      :role-label="getRoleLabel(gameRoleId)"
      :has-custom="hasCustom"
      :rating="getRating(gameRoleId)"
      @rating-change="(gid: string, v: number) => emit('ratingChange', gid, v)"
      @save-rating="(gid: string) => emit('saveRating', gid)"
    />
  </div>
</template>
