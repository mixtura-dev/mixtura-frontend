<template>
  <Button
    v-bind="{ ...buttonProps, ...$attrs }"
    :type="type"
    :variant="variant"
    :data-size="size"
    :class="buttonClasses"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import { Button, type ButtonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { computed, type HTMLAttributes } from 'vue'

const inputGroupButtonVariants = cva('flex items-center gap-2 text-sm shadow-none', {
  variants: {
    size: {
      xs: 'h-6 gap-1 rounded-[calc(var(--radius)-5px)] [&>svg]:size-3.5',
      sm: 'h-8 gap-1.5 rounded-md px-2.5 [&>svg]:size-4',
      'icon-xs': 'size-6 rounded-[calc(var(--radius)-5px)] !p-0',
      'icon-sm': 'size-8 !p-0',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
})

type InputGroupButtonVariantProps = VariantProps<typeof inputGroupButtonVariants>

type InputGroupButtonProps = {
  class?: HTMLAttributes['class']
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariants['variant']
  size?: InputGroupButtonVariantProps['size']
}

const props = withDefaults(defineProps<InputGroupButtonProps>(), {
  type: 'button',
  variant: 'ghost',
  size: 'xs',
})

defineOptions({ inheritAttrs: false })

const buttonClasses = computed(() =>
  cn(inputGroupButtonVariants({ size: props.size }), props.class),
)
const buttonProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { size, ...rest } = props
  return rest
})
</script>
