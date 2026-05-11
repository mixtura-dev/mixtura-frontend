<template>
  <div
    class="player-card-hover flex select-none items-center bg-background transition-colors duration-150"
    draggable="false"
  >
    <div class="flex w-full items-center gap-3">
      <div
        class="relative flex h-[3.6rem] w-13 items-center justify-center"
        :style="{ backgroundColor: teamColor }"
      >
        <component :is="bgIconComponent" class="absolute top-1 size-[2.3em] opacity-70" />
        <div class="z-1 flex flex-col items-center leading-none">
          <img
            class="block size-[2.3rem] -mb-1"
            draggable="false"
            :src="`/img/ranks/${rankIconSrc}`"
            alt="Rank"
          />
          <span class="text-sm font-semibold text-white">
            {{ rankPoints }}
          </span>
        </div>
      </div>
      <div class="min-w-0 flex-1 overflow-hidden">
        <p class="truncate text-xl font-semibold">
          {{ name }}
        </p>
      </div>
      <div
        v-if="sortedRoles.length"
        class="mr-2 flex items-end gap-1"
        role="list"
        :aria-label="`Roles for ${name}`"
      >
        <component
          v-for="role in sortedRoles"
          :key="role.role"
          :is="getRoleIcon(role.role)"
          :class="[role.isPrimary ? 'size-6' : 'size-4 opacity-70']"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameRole, PlayerRole } from '@/types/balancer'
import { computed } from 'vue'
import { RANK_THRESHOLDS } from '@/constants/rank'
import { useSettingsStore } from '@/stores/settingsStore.store'
import TankIcon from '@/components/icons/TankIcon.vue'
import DpsIcon from '@/components/icons/DpsIcon.vue'
import SupportIcon from '@/components/icons/SupportIcon.vue'
import FlexIcon from '@/components/icons/FlexIcon.vue'

interface Props {
  name: string
  warn?: boolean
  roles: PlayerRole[]
  rankPoints: number
  teamColor: string
  slotIndex: number
}

const props = withDefaults(defineProps<Props>(), {
  warn: false,
})

const sortedRoles = computed(() =>
  [...props.roles].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)),
)

const settings = useSettingsStore()

const bgRole = computed(() => {
  const { tank, dps } = settings.state.roleAmount
  if (props.slotIndex < tank) return 'T'
  if (props.slotIndex < tank + dps) return 'D'
  return 'H'
})

const bgIconComponent = computed(() => getRoleIcon(bgRole.value))

const rankIconSrc = computed(
  () => RANK_THRESHOLDS.find((r) => props.rankPoints < r.max)?.icon ?? 'gm.png',
)

const getRoleIcon = (role: GameRole) => {
  switch (role) {
    case 'T':
      return TankIcon
    case 'D':
      return DpsIcon
    case 'H':
      return SupportIcon
    default:
      return FlexIcon
  }
}
</script>

<style scoped>
@media (hover: hover) and (pointer: fine) {
  .player-card-hover:hover {
    background-color: hsl(var(--accent));
  }
}

@media (prefers-reduced-motion: reduce) {
  .player-card-hover {
    transition: none;
  }
}
</style>
