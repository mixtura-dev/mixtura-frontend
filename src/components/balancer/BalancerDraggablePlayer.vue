<script setup lang="ts">
import { ref, computed } from 'vue'
import { makeDraggable } from '@vue-dnd-kit/core'
import { GripVertical, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import type { TeamPlayer } from '@/composables/useBalancer'

interface Props {
  player: TeamPlayer
  players: TeamPlayer[]
  index: number
  playerNickname: string
  gameRoleName: string
  showRemove?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRemove: true,
})

const emit = defineEmits<{
  remove: []
}>()

const elRef = ref<HTMLElement | null>(null)

const { isDragging, isDragOver } = makeDraggable(
  elRef,
  { groups: ['player'] },
  () => [props.index, props.players],
)

const isHovered = computed(() => isDragOver.value !== undefined)
</script>

<template>
  <div
    ref="elRef"
    class="flex items-center gap-2 px-3 py-2 hover:bg-accent/50 transition-colors group/p"
    :class="{
      'opacity-40': isDragging,
      'ring-2 ring-primary ring-inset': isHovered,
    }"
  >
    <GripVertical class="size-3.5 text-muted-foreground cursor-grab shrink-0" />
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium truncate">
        {{ playerNickname }}
      </p>
      <p class="text-[11px] text-muted-foreground">
        {{ gameRoleName }}
        <span v-if="player.calculatedRating" class="ml-1 tabular-nums">
          ({{ player.calculatedRating.toFixed(0) }})
        </span>
      </p>
    </div>
    <Button
      v-if="showRemove"
      variant="ghost"
      size="icon"
      class="size-6 opacity-0 group-hover/p:opacity-100 transition-opacity"
      @click="emit('remove')"
    >
      <X class="size-3" />
    </Button>
  </div>
</template>
