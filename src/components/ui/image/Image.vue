<template>
  <div :class="cn('relative overflow-hidden', props.class)" data-slot="image">
    <slot v-if="isPlaceholderVisible" name="fallback">
      <slot name="loading">
        <Skeleton :width="width" :height="height" class="absolute inset-0" />
      </slot>
    </slot>

    <img
      v-else
      @load="($event.target as HTMLImageElement).style.opacity = '1'"
      :src="src.trim()"
      :alt="alt"
      :draggable="draggable"
      :loading="loading"
      :decoding="decoding"
      class="absolute inset-0 size-full object-cover opacity-0 transition-opacity"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { useImage } from '@vueuse/core'
import { computed, type HTMLAttributes } from 'vue'
import Skeleton from '../skeleton/Skeleton.vue'

export interface ImageProps {
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  class?: HTMLAttributes['class']
  draggable?: boolean
  loading?: 'eager' | 'lazy'
  decoding?: 'sync' | 'async' | 'auto'
}

const props = withDefaults(defineProps<ImageProps>(), {
  alt: '',
  width: '100%',
  height: '100%',
  draggable: false,
  loading: 'lazy',
  decoding: 'async',
})

const emit = defineEmits<{
  (e: 'error'): void
}>()

const handleError = () => {
  emit('error')
}

const { isLoading, error } = useImage({
  src: props.src.trim(),
})
const isPlaceholderVisible = computed(() => isLoading.value || error.value)
</script>
