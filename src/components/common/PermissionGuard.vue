<template>
  <slot v-if="hasAccess" />
  <slot v-else name="fallback" />
</template>

<script setup lang="ts">
import { computed, type MaybeRefOrGetter } from 'vue'
import { useServerPermissions } from '@/composables/useServerPermissions'
import type { ActionKey } from '@/types/permissions'

const props = defineProps<{
  action: ActionKey
  targetMemberId?: MaybeRefOrGetter<string>
}>()

const { can, canActOn } = useServerPermissions()

const hasAccess = computed(() => {
  if (props.targetMemberId) {
    return canActOn(props.targetMemberId, props.action)
  }
  return can(props.action)
})
</script>
