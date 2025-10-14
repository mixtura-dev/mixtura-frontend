<template>
  <div
    role="group"
    data-slot="input-group-addon"
    :data-align="align"
    :class="addonClasses"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { computed, type HTMLAttributes } from 'vue'

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
        'inline-end': 'order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]',
        'block-start':
          '[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5',
        'block-end':
          '[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
)
type InputGroupAddonVariantProps = VariantProps<typeof inputGroupAddonVariants>
interface InputGroupAddonProps {
  class?: HTMLAttributes['class']
  align?: InputGroupAddonVariantProps['align']
}
const props = withDefaults(defineProps<InputGroupAddonProps>(), {
  align: 'inline-start',
})
const addonClasses = computed(() =>
  cn(inputGroupAddonVariants({ align: props.align }), props.class),
)
const handleClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('button')) {
    return
  }
  const currentTarget = e.currentTarget as HTMLElement
  const parent = currentTarget.parentElement
  const input = parent?.querySelector('input')
  if (input) {
    ;(input as HTMLElement).focus()
  }
}
</script>
