<template>
  <MemberPopover
    :server-id="serverId"
    :member-id="member.id"
    @view-profile="$emit('viewProfile', member.id)"
    @edit="$emit('edit', member.id)"
    @add-restriction="$emit('addRestriction', member.id)"
    @kick="$emit('kick', member.id)"
  >
    <button
      class="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-muted"
    >
      <Avatar class="size-8">
        <AvatarFallback class="text-xs" :style="{ backgroundColor: `hsl(${memberHue}, 50%, 45%)` }">
          {{ getInitials(member.nickname) }}
        </AvatarFallback>
      </Avatar>

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
  </MemberPopover>
</template>

<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils/user'
import MemberPopover from './MemberPopover.vue'
import type { MemberListItem, ServerID } from '@/types/user'
import { computed } from 'vue'
import { hashToHue } from '@/lib/utils/colors'

const props = defineProps<{
  member: MemberListItem
  serverId: ServerID
}>()

defineEmits<{
  viewProfile: [memberId: string]
  edit: [memberId: string]
  addRestriction: [memberId: string]
  kick: [memberId: string]
}>()

const memberHue = computed(() => hashToHue(props.member.id))
</script>
