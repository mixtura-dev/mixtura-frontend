<template>
  <div
    ref="parentRef"
    class="h-full overflow-y-auto"
    :class="containerClass"
    @scroll="handleScroll"
  >
    <div
      :style="{
        height: `${virtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }"
    >
      <div
        v-for="item in virtualizer.getVirtualItems()"
        :key="getItemKey(item.index)"
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${item.size}px`,
          transform: `translateY(${item.start}px)`,
        }"
      >
        <slot :item="data[item.index]" :index="item.index" />
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-3">
      <Loader2 class="size-4 animate-spin text-muted-foreground" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ref, computed, watch } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { Loader2 } from 'lucide-vue-next'

export interface VirtualListExposed {
  scrollToIndex: (index: number) => void
  scrollToTop: () => void
}

const props = withDefaults(
  defineProps<{
    data: T[]
    estimateSize?: number
    overscan?: number
    containerClass?: string
    isLoading?: boolean
    hasNextPage?: boolean
    onLoadMore?: () => void
    loadMoreThreshold?: number
  }>(),
  {
    estimateSize: 48,
    overscan: 5,
    containerClass: '',
    isLoading: false,
    hasNextPage: false,
    loadMoreThreshold: 200,
  },
)

const parentRef = ref<HTMLElement | null>(null)

const count = computed(() => props.data.length)

const virtualizer = useVirtualizer({
  get count() {
    return count.value
  },
  getScrollElement: () => parentRef.value,
  estimateSize: () => props.estimateSize,
  overscan: props.overscan,
})

watch(
  () => props.data.length,
  (newLen, oldLen) => {
    if (oldLen > 0 && newLen < oldLen && newLen < 20) {
      parentRef.value?.scrollTo({ top: 0 })
    }
  },
)

function getItemKey(index: number): string | number {
  const item = props.data[index]
  if (item && typeof item === 'object' && 'id' in item) {
    return (item as { id: string | number }).id
  }
  return index
}

function handleScroll() {
  if (!parentRef.value || !props.hasNextPage || props.isLoading || !props.onLoadMore) return

  const { scrollTop, scrollHeight, clientHeight } = parentRef.value
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight

  if (distanceFromBottom < props.loadMoreThreshold) {
    props.onLoadMore()
  }
}

defineExpose({
  scrollToIndex: (index: number) => virtualizer.value.scrollToIndex(index),
  scrollToTop: () => parentRef.value?.scrollTo({ top: 0 }),
})
</script>
