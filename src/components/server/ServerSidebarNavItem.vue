<script setup lang="ts">
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props extends PrimitiveProps {
  disabled?: boolean
  active?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  disabled: false,
  active: false,
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :disabled="disabled || undefined"
    :aria-current="active ? 'page' : undefined"
    :class="
      cn(
        'nav-item flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium outline-none',
        'transition-colors duration-150',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'disabled:pointer-events-none disabled:opacity-50',
        active && 'bg-accent text-accent-foreground',
        props.class,
      )
    "
  >
    <slot />
  </Primitive>
</template>

<style scoped>
@media (hover: hover) and (pointer: fine) {
  .nav-item:not([disabled]):hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-item {
    transition: none;
  }
}
</style>
