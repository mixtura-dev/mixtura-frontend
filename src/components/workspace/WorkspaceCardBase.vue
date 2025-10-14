<template>
  <li :class="cn('flex flex-row  bg-card border p-5 rounded-md h-44', props.class)">
    <slot />
  </li>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>
