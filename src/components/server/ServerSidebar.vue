<template>
  <aside class="flex h-full w-[220px] shrink-0 flex-col border-r bg-background">
    <template v-if="isLoading">
      <div class="flex items-center gap-3 border-b p-3">
        <Skeleton class="size-8 rounded-full" />
        <Skeleton class="h-4 flex-1" />
      </div>
      <div class="flex flex-col gap-2 p-3">
        <Skeleton class="h-3 w-20" />
        <div class="flex flex-col gap-1">
          <Skeleton v-for="i in 3" :key="i" class="h-9 w-full" />
        </div>
      </div>
      <div class="mt-auto border-t p-3">
        <div class="flex items-center gap-3">
          <Skeleton class="size-9 rounded-full" />
          <div class="flex-1">
            <Skeleton class="mb-1 h-4 w-24" />
            <Skeleton class="h-3 w-16" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="member">
      <nav class="flex flex-1 flex-col overflow-y-auto p-3">
        <div class="flex flex-col gap-1">
          <slot name="nav" />
        </div>
      </nav>

      <div class="mt-auto border-t p-3">
        <div class="flex items-center gap-3 rounded-md px-2 py-1.5">
          <MemberAvatar
            size="sm"
            :member-id="member.member.id"
            :nickname="member.member.nickname"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium">
              {{ member.member.nickname }}
            </p>
            <p class="truncate text-xs text-muted-foreground">
              {{ memberRole }}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon" class="size-7 shrink-0">
                <MoreHorizontal class="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
              <DropdownMenuItem @click="$emit('viewProfile')">
                <User class="mr-2 size-4" />
                {{ t('server.sidebar.viewProfile') }}
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('viewMyRestrictions')">
                <Eye class="mr-2 size-4" />
                {{ t('server.sidebar.myRestrictions') }}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="$emit('leave')">
                <LogOut class="mr-2 size-4" />
                {{ t('server.leave.button') }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </template>
  </aside>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import MemberAvatar from '@/components/server/member/MemberAvatar.vue'
import { Eye, LogOut, MoreHorizontal, User } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { CurrentMemberResponse } from '@/types/user'

interface Props {
  member: CurrentMemberResponse | null
  isLoading?: boolean
  memberRole: string
}

defineProps<Props>()
defineEmits<{
  viewProfile: []
  viewMyRestrictions: []
  leave: []
}>()

const { t } = useI18n()
</script>
