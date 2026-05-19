<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core'
import { Ban } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import type { components } from '@/types/api'

type ApplicationFormRoleResponse = components['schemas']['ApplicationFormRoleResponse']

const props = defineProps<{
  roles: ApplicationFormRoleResponse[]
  emptyText: string
  label: string
}>()

const emit = defineEmits<{
  drop: [e: IDragEvent]
}>()

const el = useTemplateRef<HTMLElement>('el')

makeDroppable(el, {
  groups: ['roles'],
  events: { onDrop: (e) => emit('drop', e) },
}, () => props.roles)
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-2">
      <Badge variant="destructive" class="text-xs font-semibold">0</Badge>
      <Ban class="size-3.5 text-muted-foreground" />
      <span class="text-sm font-medium text-muted-foreground">{{ label }}</span>
      <Badge variant="outline" class="ml-auto font-normal normal-case tracking-normal">
        {{ roles.length }}
      </Badge>
    </div>

    <div
      ref="el"
      class="rounded-xl border border-destructive/20 bg-destructive/5 p-2 space-y-1.5 min-h-[56px] transition-colors"
      :class="{ 'border-dashed': roles.length === 0 }"
    >
      <div
        v-if="roles.length === 0"
        class="text-xs text-muted-foreground text-center py-4 select-none"
      >
        {{ emptyText }}
      </div>
      <slot />
    </div>
  </div>
</template>
