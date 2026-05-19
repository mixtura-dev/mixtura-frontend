<template>
  <div
    ref="elRef"
    class="relative"
    :class="{
      'opacity-50': isDragging,
      'swap-highlight': isHovered,
    }"
  >
    <div
      v-if="isHovered"
      class="absolute inset-0 z-10 flex items-center justify-center bg-primary/10 pointer-events-none"
    >
      <span class="text-2xl font-bold text-primary">⇄</span>
    </div>
    <PlayerItem
      :name="player.name"
      :roles="player.roles"
      :rank-points="player.rankPoints"
      :team-color="teamColor"
      :slot-index="index"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { makeDraggable } from '@vue-dnd-kit/core'
import PlayerItem from '@/components/balancer/PlayerItem.vue'
import type { Player } from '@/types/balancer'

interface Props {
  player: Player
  index: number
  players: Player[]
  teamColor: string
}

const props = defineProps<Props>()

const elRef = ref<HTMLElement | null>(null)

const { isDragging, isDragOver } = makeDraggable(
  elRef,
  {
    groups: ['player'],
  },
  () => [props.index, props.players],
)

const isHovered = computed(() => isDragOver.value !== undefined)
</script>

<style scoped>
.swap-highlight {
  outline: 2px dashed hsl(var(--primary));
  outline-offset: -2px;
  background-color: hsl(var(--primary) / 0.05);
  transition: all 0.2s ease;
}
</style>
