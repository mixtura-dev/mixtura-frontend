<template>
  <div data-slot="input-group" role="group" :class="groupClasses" v-bind="$attrs">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface InputGroupProps {
  class?: HTMLAttributes['class']
}
const props = defineProps<InputGroupProps>()

defineOptions({
  inheritAttrs: false,
})

const groupClasses = computed(() =>
  cn(
    'group/input-group dark:bg-input/30  relative flex w-full items-center rounded-md border outline-none transition-[color,box-shadow]',
    'h-9 has-[>textarea]:h-auto',

    // Variants based on alignment.
    'has-[>[data-align=inline-start]]:[&>input]:pl-2',
    'has-[>[data-align=inline-end]]:[&>input]:pr-2',
    'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
    'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',

    // Focus state.
    'has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-1',

    // Error state.
    'has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
    props.class,
  ),
)
</script>
