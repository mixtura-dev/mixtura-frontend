<template>
  <div
    class="team-container flex min-w-3xs flex-col rounded-lg border-2 bg-background overflow-hidden"
  >
    <h2
      :class="['text-xl rounded-t font-semibold text-white p-2']"
      :style="{ backgroundColor: teamColor }"
    >
      {{ teamName }}
    </h2>
    <draggable v-model="localPlayers" group="teams" :swap="true" item-key="id">
      <template #item="{ element, index }">
        <PlayerItem
          :name="element.name"
          :roles="element.roles"
          :rank-points="element.rankPoints"
          :team-color="teamColor"
          :slot-index="index"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import PlayerItem from '@/components/balancer/PlayerItem.vue'
import type { Player } from '@/types/balancer'

interface Props {
  players: Player[]
  teamName: string
  teamColor: string
  alignRight?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:players': [value: Player[]]
}>()

const localPlayers = computed({
  get: () => props.players,
  set: (value) => emit('update:players', value),
})
</script>
