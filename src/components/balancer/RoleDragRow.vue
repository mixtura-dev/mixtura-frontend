<script setup lang="ts">
import { ref } from 'vue'
import { makeDraggable } from '@vue-dnd-kit/core'
import { GripVertical } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'

interface Props {
  gameRoleId: string
  index: number
  roleOrder: string[]
  roleLabel: string
  hasCustom: boolean
  rating: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  ratingChange: [gameRoleId: string, value: number]
  saveRating: [gameRoleId: string]
}>()

const elRef = ref<HTMLElement | null>(null)

makeDraggable(
  elRef,
  { groups: ['role-priority'] },
  () => [props.index, [...props.roleOrder]],
)

function onRatingInput(v: string | number) {
  const num = Number(v)
  if (!isNaN(num) && num >= 0) {
    emit('ratingChange', props.gameRoleId, num)
  }
}

function onRatingBlur() {
  emit('saveRating', props.gameRoleId)
}

function onRatingEnter() {
  emit('saveRating', props.gameRoleId)
}
</script>

<template>
  <div
    ref="elRef"
    class="grid grid-cols-[20px_1fr_72px] gap-2 items-center group/row cursor-grab active:cursor-grabbing"
  >
    <GripVertical class="size-3.5 text-muted-foreground/40 group-hover/row:text-muted-foreground transition-colors" />

    <span class="text-sm truncate select-none">{{ roleLabel }}</span>

    <template v-if="hasCustom">
      <Input
        type="number"
        min="0"
        class="h-8 text-center text-xs px-1"
        placeholder="—"
        :model-value="rating ?? ''"
        @update:model-value="onRatingInput"
        @blur="onRatingBlur"
        @keyup.enter="onRatingEnter"
      />
    </template>
    <div
      v-else
      class="h-8 flex items-center justify-center text-xs text-muted-foreground/30"
    >
      —
    </div>
  </div>
</template>
