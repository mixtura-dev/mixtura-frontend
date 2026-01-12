<template>
  <button
    ref="buttonRef"
    class="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-muted"
    @click="handleClick"
  >
    <MemberAvatar :member-id="member.id" :nickname="member.nickname" size="sm" />

    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium">
        {{ member.nickname }}
      </p>
    </div>

    <div
      v-if="!member.user_id"
      class="size-2 rounded-full bg-muted-foreground/30"
      title="Virtual member"
    />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MemberListItem } from '@/types/user'
import MemberAvatar from './MemberAvatar.vue'

const props = defineProps<{
  member: MemberListItem
}>()

const emit = defineEmits<{
  click: [memberId: string, element: HTMLElement]
}>()

const buttonRef = ref<HTMLElement | null>(null)

function handleClick() {
  if (buttonRef.value) {
    emit('click', props.member.id, buttonRef.value)
  }
}
</script>
