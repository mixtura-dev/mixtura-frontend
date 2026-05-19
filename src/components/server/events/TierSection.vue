<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core'
import { X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { components } from '@/types/api'

type ApplicationFormRoleResponse = components['schemas']['ApplicationFormRoleResponse']

const props = defineProps<{
  tier: {
    id: string
    priority: number
    roles: ApplicationFormRoleResponse[]
  }
  canRemove: boolean
  emptyText: string
}>()

const emit = defineEmits<{
  drop: [e: IDragEvent]
  remove: []
}>()

const el = useTemplateRef<HTMLElement>('el')

makeDroppable(el, {
  groups: ['roles'],
  events: { onDrop: (e) => emit('drop', e) },
}, () => props.tier.roles)
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-2">
      <Badge variant="secondary" class="text-xs font-semibold">
        {{ tier.priority }}
      </Badge>
      <span class="text-sm font-medium">
        {{ tier.roles.length === 1 ? '1 роль' : `${tier.roles.length} ролей` }}
      </span>
      <div class="flex-1" />
      <Button
        v-if="canRemove"
        variant="ghost"
        size="icon"
        class="size-6 text-muted-foreground hover:text-destructive"
        @click="emit('remove')"
      >
        <X class="size-3.5" />
      </Button>
    </div>

    <div
      ref="el"
      class="rounded-xl border bg-muted/20 p-2 space-y-1.5 min-h-[56px] transition-colors"
      :class="{ 'border-dashed border-muted-foreground/30': tier.roles.length === 0 }"
    >
      <div
        v-if="tier.roles.length === 0"
        class="text-xs text-muted-foreground text-center py-4 select-none"
      >
        {{ emptyText }}
      </div>
      <slot />
    </div>
  </div>
</template>
