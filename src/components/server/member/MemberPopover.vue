<template>
  <Popover v-model:open="open">
    <PopoverAnchor as-child>
      <div ref="virtualAnchorRef" class="pointer-events-none fixed size-0" :style="anchorStyles" />
    </PopoverAnchor>

    <PopoverContent
      class="w-72 overflow-hidden p-0"
      side="left"
      :side-offset="8"
      align="start"
      :collision-padding="16"
      @interact-outside="open = false"
      @escape-key-down="open = false"
    >
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <Loader2 class="size-6 animate-spin text-muted-foreground" />
      </div>

      <template v-else-if="member">
        <div class="relative">
          <div
            class="h-14"
            :style="{
              background: `linear-gradient(135deg, hsl(${memberHue}, 55%, 45%) 0%, hsl(${memberHue}, 45%, 35%) 100%)`,
            }"
          />

          <div class="absolute -bottom-6 left-4">
            <MemberAvatar
              :member-id="memberId!"
              :nickname="member.nickname"
              size="lg"
              class="cursor-pointer border-[3px] border-popover shadow-md transition-transform hover:scale-105"
              @click="handleViewProfile"
            />
          </div>

          <div class="absolute right-2 top-2 flex gap-1">
            <Badge v-if="isMe" variant="secondary" class="px-1.5 py-0 text-[10px]">
              {{ t('server.memberCardPopover.youBadge') }}
            </Badge>
            <Badge
              v-if="!member.user_id"
              variant="outline"
              class="bg-background/80 px-1.5 py-0 text-[10px]"
            >
              <Ghost class="mr-0.5 size-2.5" />
              {{ t('server.memberCardPopover.virtualBadge') }}
            </Badge>
          </div>
        </div>

        <div class="px-4 pb-3 pt-7">
          <div class="mb-2">
            <h3 class="truncate text-base font-semibold leading-tight">
              {{ member.nickname }}
            </h3>
            <div v-if="member.server_role" class="mt-1 flex items-center gap-1">
              <div
                class="size-2 rounded-full"
                :style="{
                  backgroundColor: `hsl(${hashToHue(member.server_role.name)}, 50%, 50%)`,
                }"
              />
              <span class="text-xs text-muted-foreground">{{ member.server_role.name }}</span>
            </div>
          </div>

          <div class="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
            <div v-if="member.joined_at" class="flex items-center gap-2">
              <Calendar class="size-3.5" />
              <span
                >{{ t('server.memberCardPopover.joinedPrefix') }}
                {{ formatSmartDate(member.joined_at) }}</span
              >
            </div>
            <div
              v-if="member.server_role?.permissions_list?.length"
              class="mt-1 flex items-center gap-2"
            >
              <Key class="size-3.5" />
              <span>
                {{
                  t(
                    'server.memberCardPopover.permissionsSuffix',
                    member.server_role.permissions_list.length,
                  )
                }}
              </span>
            </div>
          </div>

          <PermissionGuard action="VIEW_RESTRICTIONS">
            <div v-if="restrictions?.length" class="mt-2">
              <div
                class="flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1.5 text-xs text-destructive"
              >
                <Ban class="size-3.5" />
                <span>
                  {{ t('server.memberCardPopover.restrictionsSummary', restrictions.length) }}
                </span>
              </div>
            </div>
          </PermissionGuard>

          <div class="mt-3 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              class="h-7 flex-1 text-xs"
              @click="handleViewProfile"
            >
              {{ t('server.memberCardPopover.viewProfileButton') }}
            </Button>
            <PermissionGuard action="KICK_MEMBER" :target-member-id="memberId ?? undefined">
              <Button
                v-if="!isMe"
                variant="ghost"
                size="icon"
                class="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                @click="handleKick"
              >
                <UserX class="size-3.5" />
                <!-- Можно было бы добавить тултип с t('server.memberCardPopover.kickButton') -->
              </Button>
            </PermissionGuard>
          </div>
        </div>
      </template>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n' // <-- Импорт useI18n
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { Ban, Calendar, Ghost, Key, Loader2, UserX } from 'lucide-vue-next'
import { useServerMemberQuery, useMemberRestrictionsQuery } from '@/api/queries/server'
import { useServerPermissions } from '@/composables/useServerPermissions'
import PermissionGuard from '@/components/common/PermissionGuard.vue'
import MemberAvatar from './MemberAvatar.vue'
import type { ServerID } from '@/types/user'
import { hashToHue } from '@/lib/utils/colors'
import { useDateFormatter } from '@/lib/utils/date'

const props = defineProps<{
  serverId: ServerID
  memberId: string | null
  anchorEl: HTMLElement | null
}>()

const emit = defineEmits<{
  viewProfile: [memberId: string]
  kick: [memberId: string]
}>()

const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n() // <-- Получаем функцию перевода

const virtualAnchorRef = useTemplateRef('virtualAnchorRef')
const anchorRect = ref({ top: 0, left: 0, width: 0, height: 0 })

const anchorStyles = computed(() => ({
  top: `${anchorRect.value.top}px`,
  left: `${anchorRect.value.left}px`,
  width: `${anchorRect.value.width}px`,
  height: `${anchorRect.value.height}px`,
}))

function updateAnchorPosition() {
  if (props.anchorEl) {
    const rect = props.anchorEl.getBoundingClientRect()
    anchorRect.value = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }
  }
}

function handleScroll() {
  open.value = false
}

watch(
  () => props.anchorEl,
  (el) => {
    if (el) {
      updateAnchorPosition()
    }
  },
  { immediate: true },
)

watch(open, (isOpen) => {
  if (isOpen) {
    updateAnchorPosition()
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleScroll)
  } else {
    window.removeEventListener('scroll', handleScroll, true)
    window.removeEventListener('resize', handleScroll)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleScroll)
})

const { isMe: checkIsMe } = useServerPermissions()

const serverId = computed(() => props.serverId)
const activeMemberId = computed(() => (open.value && props.memberId ? props.memberId : ''))

const { data: member, isLoading } = useServerMemberQuery(serverId, activeMemberId)
const { data: restrictions } = useMemberRestrictionsQuery(serverId, activeMemberId)

const memberHue = computed(() => hashToHue(props.memberId))
const isMe = computed(() => (props.memberId ? checkIsMe(props.memberId) : false))

const { formatSmartDate } = useDateFormatter()

function handleViewProfile() {
  if (props.memberId) {
    emit('viewProfile', props.memberId)
  }
}

function handleKick() {
  if (props.memberId) {
    emit('kick', props.memberId)
  }
}
</script>
