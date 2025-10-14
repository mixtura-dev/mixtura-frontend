<template>
  <Textarea data-slot="input-group-control" :class="textareaClasses" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

interface InputGroupTextareaProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<InputGroupTextareaProps>()

defineOptions({
  inheritAttrs: false,
})

const textareaClasses = computed(() =>
  cn(
    'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent',
    props.class,
  ),
)
</script>
