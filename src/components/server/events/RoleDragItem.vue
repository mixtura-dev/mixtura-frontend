<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { makeDraggable } from '@vue-dnd-kit/core'
import { GripVertical } from 'lucide-vue-next'
import type { components } from '@/types/api'

type Role = components['schemas']['SelectedGameRoleResponse']

const props = defineProps<{
  role: Role
  index: number
  items: Role[]
  label: string
}>()

const el = useTemplateRef<HTMLElement>('el')

const { isDragging, isDragOver } = makeDraggable(el, { groups: ['roles'] }, () => [props.index, props.items])

const isHovered = computed(() => isDragOver.value !== undefined)
</script>

<template>
  <div
    ref="el"
    class="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-sm cursor-grab active:cursor-grabbing select-none transition-all duration-200 hover:bg-accent/50"
    :class="{
      'opacity-40': isDragging,
      'border-primary bg-primary/5 ring-1 ring-primary/20': isHovered,
    }"
  >
    <GripVertical class="size-3.5 text-muted-foreground/60 shrink-0" />
    <span class="flex-1 truncate font-medium">{{ label }}</span>
  </div>
</template>
