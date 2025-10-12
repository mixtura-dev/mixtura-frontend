<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import Avatar from '../avatar/Avatar.vue'
import AvatarFallback from '../avatar/AvatarFallback.vue'
import { cn } from '@/lib/utils'

interface AvatarGroupProps {
  max?: number | string
  overflowLabel?: string
  class?: string
}

const props = defineProps<AvatarGroupProps>()

const slots = useSlots()

const maxValue = computed(() =>
  typeof props.max === 'string' ? parseInt(props.max, 10) : props.max,
)

const children = computed(() => {
  const slotNodes = slots.default?.() || []
  return slotNodes
    .flatMap((node) => {
      if (typeof node.type === 'symbol') return []
      return node
    })
    .filter(Boolean)
})

const displayedAvatars = computed(() => {
  if (!maxValue.value || children.value.length <= maxValue.value) return children.value
  return children.value.slice(0, maxValue.value)
})

const overflowCount = computed(() => {
  if (!maxValue.value) return 0
  return Math.max(children.value.length - maxValue.value, 0)
})

const rootProps = reactiveOmit(props, ['max', 'overflowLabel'])
</script>
<template>
  <div :class="cn('flex flex-row-reverse justify-end items-center', props.class)">
    <Avatar
      v-if="overflowCount > 0"
      class="ring-[0.125em] ring-background -me-1.5 first:me-0 z-[1]"
    >
      <AvatarFallback class="text-[0.875em] bg-muted flex items-center justify-center">
        {{ props.overflowLabel ?? `+${overflowCount}` }}
      </AvatarFallback>
    </Avatar>

    <component
      v-for="(avatar, index) in displayedAvatars"
      :is="avatar"
      :key="index"
      v-bind="rootProps"
      class="ring-[0.125em] ring-background -me-1.5 first:me-0 z-[2]"
    />
  </div>
</template>
