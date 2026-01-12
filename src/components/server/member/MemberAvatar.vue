<template>
  <div
    :class="cn(memberAvatarVariants({ size }), props.class)"
    :style="!imageUrl ? { backgroundColor: `hsl(${hue}, 50%, 45%)` } : undefined"
  >
    <img
      v-if="imageUrl && !imageError"
      :src="imageUrl"
      :alt="nickname"
      class="size-full object-cover"
      @error="imageError = true"
    />
    <span v-else class="select-none">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { hashToHue } from '@/lib/utils/colors'
import { getInitials } from '@/lib/utils/user'
import { memberAvatarVariants, type MemberAvatarSize } from './memberAvatarVariants'

interface Props {
  memberId: string
  nickname: string
  imageUrl?: string | null
  size?: MemberAvatarSize
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  imageUrl: null,
})

const imageError = ref(false)

watch(
  () => props.imageUrl,
  () => {
    imageError.value = false
  },
)

const hue = computed(() => hashToHue(props.memberId))
const initials = computed(() => getInitials(props.nickname))
</script>
