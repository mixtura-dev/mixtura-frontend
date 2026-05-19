<template>
  <section class="flex flex-col h-full gap-4 p-4">
    <div class="flex items-center gap-4">
      <label class="text-sm font-medium">
        Max players per team:
        <input
          v-model.number="maxPlayers"
          type="number"
          min="1"
          max="10"
          class="ml-2 w-16 px-2 py-1 border rounded text-center"
        />
      </label>
    </div>

    <DnDProvider>
      <div
        ref="screenshotRef"
        class="grid w-full h-fit grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5"
      >
        <TeamContainer
          :players="teamAPlayers"
          :team-name="settings.state.teams.teamA.name"
          :team-color="settings.state.teams.teamA.color"
          :max-players="maxPlayers"
          align-right
          @drop="handleDrop"
        />

        <span class="self-center justify-self-center text-2xl font-black italic">VS</span>

        <TeamContainer
          :players="teamBPlayers"
          :team-name="settings.state.teams.teamB.name"
          :team-color="settings.state.teams.teamB.color"
          :max-players="maxPlayers"
          @drop="handleDrop"
        />
      </div>

      <div class="max-w-md mx-auto w-full">
        <BenchContainer :players="benchPlayers" @drop="handleDrop" />
      </div>
    </DnDProvider>

    <div class="flex gap-3 flex-row py-4">
      <Button variant="secondary"> Balance teams </Button>
      <Button @click="makeScreenshot" size="icon" variant="outline">
        <ClipboardIcon />
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DnDProvider, type ISuggestSwapResult, type ISuggestSortResult } from '@vue-dnd-kit/core'
import { useSettingsStore } from '@/stores/settingsStore.store'
import { Button } from '@/components/ui/button'
import { ClipboardIcon } from 'lucide-vue-next'
import type { Player, GameRole } from '@/types/balancer'

import { useScreenshot } from '@/composables/useScreenshot'
import TeamContainer from '@/components/balancer/TeamContainer.vue'
import BenchContainer from '@/components/balancer/BenchContainer.vue'

const screenshotRef = ref<HTMLElement | null>(null)

const { makeScreenshot } = useScreenshot(screenshotRef)

const settings = useSettingsStore()

const maxPlayers = ref(5)

const teamAPlayers = ref<Player[]>([
  {
    id: 1,
    name: 'PlayerOne',
    roles: [{ role: 'T' as GameRole, isPrimary: true }],
    rankPoints: 3200,
  },
  {
    id: 2,
    name: 'PlayerTwo',
    roles: [
      { role: 'D' as GameRole, isPrimary: true },
      { role: 'H' as GameRole, isPrimary: false },
    ],
    rankPoints: 3100,
  },
  {
    id: 3,
    name: 'PlayerThree',
    roles: [{ role: 'H' as GameRole, isPrimary: true }],
    rankPoints: 3300,
  },
  {
    id: 4,
    name: 'PlayerFour',
    roles: [{ role: 'D' as GameRole, isPrimary: true }],
    rankPoints: 3000,
  },
  {
    id: 5,
    name: 'PlayerFive',
    roles: [
      { role: 'T' as GameRole, isPrimary: true },
      { role: 'D' as GameRole, isPrimary: false },
    ],
    rankPoints: 3200,
  },
])

const teamBPlayers = ref<Player[]>([
  {
    id: 6,
    name: 'PlayerSix',
    roles: [
      { role: 'T' as GameRole, isPrimary: true },
      { role: 'D' as GameRole, isPrimary: false },
    ],
    rankPoints: 3200,
  },
])

const benchPlayers = ref<Player[]>([
  {
    id: 7,
    name: 'PlayerSeven',
    roles: [{ role: 'H' as GameRole, isPrimary: true }],
    rankPoints: 2900,
  },
  {
    id: 8,
    name: 'PlayerEight',
    roles: [{ role: 'D' as GameRole, isPrimary: true }],
    rankPoints: 3050,
  },
])

const allLists = [teamAPlayers, teamBPlayers, benchPlayers] as const

function handleDrop(payload: {
  result: ISuggestSwapResult | ISuggestSortResult
  sourceItems: Player[]
  targetItems: Player[]
  isSwap: boolean
}) {
  const { result, sourceItems, targetItems, isSwap } = payload

  const sourceRef = allLists.find((list) => list.value === sourceItems)
  if (!sourceRef) return

  sourceRef.value = result.sourceItems as Player[]

  if (!result.sameList) {
    const targetRef = allLists.find((list) => list.value === targetItems)
    if (!targetRef) return

    if (targetRef === benchPlayers.value) {
      targetRef.value = result.targetItems as Player[]
      return
    }

    if ((result.targetItems as Player[]).length > maxPlayers.value) return

    targetRef.value = result.targetItems as Player[]
  } else if (isSwap) {
    sourceRef.value = result.targetItems as Player[]
  }
}
</script>
