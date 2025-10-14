<template>
  <div data-slot="kbd-group" :class="groupClasses" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { computed, type HTMLAttributes } from 'vue'

interface KbdGroupProps {
  class?: HTMLAttributes['class']
}
const props = defineProps<KbdGroupProps>()

const groupClasses = computed(() => cn('inline-flex items-center gap-1', props.class))
defineOptions({
  inheritAttrs: false,
})
</script>
