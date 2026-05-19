<script setup lang="ts">
import { ref } from 'vue'
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core'
import BalancerDraggablePlayer from '@/components/balancer/BalancerDraggablePlayer.vue'
import type { TempTeam } from '@/composables/useBalancer'

interface Props {
  team: TempTeam
  teamIndex: number
  getPlayerNickname: (id: string) => string
  getGameRoleName: (id: string) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  drop: [e: IDragEvent, teamIndex: number]
  removePlayer: [playerIndex: number]
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
        emit('drop', e, props.teamIndex)
      },
    },
  },
  () => props.team.players,
)
</script>

<template>
  <div
    ref="containerRef"
    class="flex flex-col rounded-lg border bg-background overflow-hidden transition-colors"
    :class="{ 'border-primary/50 bg-primary/5': isDragOver }"
  >
    <div class="px-3 py-1.5 border-b bg-muted/30">
      <h3 class="text-xs font-semibold truncate">
        {{ team.name || `Team ${team.teamIndex + 1}` }}
      </h3>
    </div>

    <div class="flex flex-col divide-y flex-1">
      <BalancerDraggablePlayer
        v-for="(p, pIdx) in team.players"
        :key="p.eventPlayerId + '-' + pIdx"
        :player="p"
        :players="team.players"
        :index="pIdx"
        :player-nickname="getPlayerNickname(p.eventPlayerId)"
        :game-role-name="getGameRoleName(p.gameRoleId)"
        @remove="emit('removePlayer', pIdx)"
      />

      <!-- Explicit drop zone for adding -->
      <div
        class="flex items-center justify-center gap-1.5 py-2 text-[11px] transition-colors cursor-pointer"
        :class="isDragOver ? 'bg-primary/10 text-primary' : 'text-muted-foreground/40 hover:bg-accent/30'"
      >
        Drop to add
      </div>
    </div>
  </div>
</template>
