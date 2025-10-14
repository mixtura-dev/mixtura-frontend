<script setup lang="ts">
export interface Wave {
  x: number
  y: number
  date: number
  pointerId: number
}

export interface RippleProps {
  clicks: Wave[]
}
defineProps<RippleProps>()
</script>

<template>
  <span class="wrapper" aria-hidden="true">
    <span
      v-for="wave in clicks"
      :key="wave.date"
      class="wave"
      :style="{ top: `${wave.y}px`, left: `${wave.x}px` }"
    />
  </span>
</template>

<style scoped>
.wrapper {
  overflow: hidden;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transition: background-color 0.15s ease-out;
}

.wave {
  position: absolute;
  height: 24px;
  width: 24px;
  margin: -12px 0;
  border-radius: 50%;
  background: var(--tgui--outline, rgba(0, 0, 0, 0.2));
  animation: waveRise 0.3s cubic-bezier(0.3, 0.3, 0.5, 1);
  opacity: 0;
}

@keyframes waveRise {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    transform: scale(8);
    opacity: 0;
  }
}
</style>
