<template>
  <section class="flex flex-row h-full">
    <div class="max-w-[1200px] w-full ml-auto p-4">
      <div
        ref="screenshotRef"
        class="grid w-full h-fit grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5"
      >
        <TeamContainer
          v-model:players="teamAPlayers"
          :team-name="settings.state.teams.teamA.name"
          :team-color="settings.state.teams.teamA.color"
          align-right
        />

        <span class="self-center justify-self-center text-2xl font-black italic">VS</span>

        <TeamContainer
          v-model:players="teamBPlayers"
          :team-name="settings.state.teams.teamB.name"
          :team-color="settings.state.teams.teamB.color"
        />
      </div>

      <div class="flex gap-3 flex-row py-4">
        <Button variant="secondary"> Balance teams </Button>
        <Button @click="makeScreenshot" size="icon" variant="outline">
          <ClipboardIcon />
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore.store'
import { Button } from '@/components/ui/button'
import { ClipboardIcon } from 'lucide-vue-next'
import type { Player } from '@/types/balancer'

import { useScreenshot } from '@/composables/useScreenshot'
import TeamContainer from '@/components/balancer/TeamContainer.vue'

const screenshotRef = ref<HTMLElement | null>(null)

const { makeScreenshot } = useScreenshot(screenshotRef)

const settings = useSettingsStore()

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
</script>
