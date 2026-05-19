<script setup lang="ts">
import { ref } from 'vue'
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core'
import BalancerDraggablePlayer from '@/components/balancer/BalancerDraggablePlayer.vue'
import type { TeamPlayer } from '@/composables/useBalancer'

interface Props {
  players: TeamPlayer[]
  getPlayerNickname: (id: string) => string
  getGameRoleName: (id: string) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  drop: [e: IDragEvent]
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
        emit('drop', e)
      },
    },
  },
  () => props.players,
)
</script>

<template>
  <div
    ref="containerRef"
    class="rounded-lg border bg-muted/20 overflow-hidden transition-colors"
    :class="{ 'border-primary/50 bg-primary/5': isDragOver }"
  >
    <div class="px-4 py-2 border-b bg-muted/30">
      <h3 class="text-sm font-semibold text-muted-foreground">
        Unassigned
      </h3>
    </div>

    <div class="flex flex-col divide-y">
      <BalancerDraggablePlayer
        v-for="(p, pIdx) in players"
        :key="'un-' + p.eventPlayerId + '-' + pIdx"
        :player="p"
        :players="players"
        :index="pIdx"
        :player-nickname="getPlayerNickname(p.eventPlayerId)"
        :game-role-name="getGameRoleName(p.gameRoleId)"
        :show-remove="false"
      />

      <div
        v-if="players.length === 0"
        class="px-3 py-6 text-center text-sm text-muted-foreground"
      >
        Remove players from teams here
      </div>
    </div>
  </div>
</template>
