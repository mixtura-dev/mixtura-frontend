<template>
  <div
    ref="containerRef"
    class="bench-container flex flex-col rounded-lg border-2 bg-muted/30 overflow-hidden min-w-3xs transition-colors duration-150"
    :class="{ 'border-dashed border-2': isDragOver }"
  >
    <h2 class="text-xl rounded-t font-semibold text-white p-2 bg-secondary">
      Bench
    </h2>
    <div class="flex flex-col p-1">
      <DraggablePlayer
        v-for="(player, index) in players"
        :key="player.id"
        :player="player"
        :index="index"
        :players="players"
        team-color="#6b7280"
      />
      <div
        v-if="players.length === 0"
        class="text-center text-sm text-muted-foreground py-4"
      >
        Drag players here from teams
      </div>
    </div>
    <div
      class="drop-zone flex items-center justify-center gap-2 py-6 border-t-2 border-dashed transition-all duration-150 cursor-pointer"
      :class="isDragOver ? 'bg-primary/10 border-primary' : 'border-muted-foreground/30 hover:bg-accent/50'"
    >
      <PlusIcon class="size-5" :class="isDragOver ? 'text-primary' : 'text-muted-foreground'" />
      <span class="text-sm font-medium" :class="isDragOver ? 'text-primary' : 'text-muted-foreground'">
        {{ isDragOver ? 'Drop to add' : 'Add player' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon } from 'lucide-vue-next'
import { makeDroppable, type IDragEvent, type ISuggestSwapResult, type ISuggestSortResult } from '@vue-dnd-kit/core'
import DraggablePlayer from '@/components/balancer/DraggablePlayer.vue'
import type { Player } from '@/types/balancer'

interface Props {
  players: Player[]
}

interface SwapPayload {
  result: ISuggestSwapResult
  sourceItems: Player[]
  targetItems: Player[]
  isSwap: true
}

interface MovePayload {
  result: ISuggestSortResult
  sourceItems: Player[]
  targetItems: Player[]
  isSwap: false
}

type DropPayload = SwapPayload | MovePayload

const props = defineProps<Props>()

const emit = defineEmits<{
  drop: [payload: DropPayload]
}>()

const containerRef = ref<HTMLElement | null>(null)
const isDragOver = ref(false)

makeDroppable(
  containerRef,
  {
    groups: ['player'],
    events: {
      onEnter() {
        isDragOver.value = true
      },
      onLeave() {
        isDragOver.value = false
      },
      onDrop(e: IDragEvent) {
        isDragOver.value = false

        const srcItems = e.draggedItems[0]?.items as Player[] | undefined
        const tgtItems = (e.hoveredDraggable?.items ?? e.dropZone?.items) as Player[] | undefined

        if (!srcItems || !tgtItems) return

        if (e.hoveredDraggable) {
          const result = e.helpers.suggestSwap()
          if (!result) return
          emit('drop', { result, sourceItems: srcItems, targetItems: tgtItems, isSwap: true })
        } else {
          const result = e.helpers.suggestSort('vertical')
          if (!result) return
          emit('drop', { result, sourceItems: srcItems, targetItems: tgtItems, isSwap: false })
        }
      },
    },
  },
  () => props.players,
)
</script>
