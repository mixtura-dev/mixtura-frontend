<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <slot />
    </PopoverTrigger>
    <PopoverContent class="w-72 p-0" side="left" :side-offset="8" align="start">
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <Loader2 class="size-6 animate-spin text-muted-foreground" />
      </div>

      <template v-else-if="member">
        <div class="relative">
          <div
            class="h-16"
            :style="{
              background: `linear-gradient(135deg, hsl(${memberHue}, 60%, 40%) 0%, hsl(${memberHue}, 40%, 30%) 100%)`,
            }"
          />

          <div class="absolute -bottom-6 left-4">
            <Avatar class="size-14 border-4 border-popover">
              <AvatarFallback
                class="text-lg font-bold text-white"
                :style="{ backgroundColor: `hsl(${memberHue}, 50%, 45%)` }"
              >
                {{ getInitials(member.nickname) }}
              </AvatarFallback>
            </Avatar>
          </div>

          <Badge v-if="isMe" variant="secondary" class="absolute right-2 top-2 text-xs">
            You
          </Badge>
        </div>

        <div class="px-4 pb-4 pt-8">
          <div class="mb-3">
            <h3 class="text-lg font-semibold">{{ member.nickname }}</h3>
            <div class="flex flex-wrap items-center gap-1.5">
              <Badge v-if="member.server_role" variant="secondary" class="text-xs">
                <Shield class="mr-1 size-3" />
                {{ member.server_role.name }}
              </Badge>
              <Badge v-if="!member.user_id" variant="outline" class="text-xs">
                <Ghost class="mr-1 size-3" />
                Virtual
              </Badge>
            </div>
          </div>

          <Separator class="my-3" />

          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-muted-foreground">
              <Calendar class="size-4" />
              <span>Joined {{ formatDate(member.joined_at) }}</span>
            </div>

            <div v-if="member.user_id" class="flex items-center gap-2 text-muted-foreground">
              <User class="size-4" />
              <span class="truncate text-xs font-mono">{{ member.user_id }}</span>
            </div>

            <div
              v-if="member.server_role?.permissions_list.length"
              class="flex items-center gap-2 text-muted-foreground"
            >
              <Key class="size-4" />
              <span>{{ member.server_role.permissions_list.length }} permissions</span>
            </div>
          </div>

          <PermissionGuard action="VIEW_RESTRICTIONS">
            <template v-if="restrictions && restrictions.length > 0">
              <Separator class="my-3" />
              <div class="space-y-2">
                <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Active Restrictions
                </p>
                <div class="space-y-1">
                  <div
                    v-for="restriction in restrictions"
                    :key="restriction.id"
                    class="flex items-center gap-2 rounded-md bg-destructive/10 px-2 py-1.5 text-xs"
                  >
                    <Ban class="size-3 text-destructive" />
                    <span class="flex-1 truncate">{{ restriction.restriction.code }}</span>
                    <span class="text-muted-foreground">
                      {{ formatDate(restriction.expiration_date) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </PermissionGuard>

          <Separator class="my-3" />

          <div class="flex gap-2">
            <Button variant="outline" size="sm" class="flex-1" @click="handleViewProfile">
              <ExternalLink class="mr-1 size-3" />
              Profile
            </Button>

            <DropdownMenu v-if="hasAnyAction">
              <DropdownMenuTrigger as-child>
                <Button variant="outline" size="icon" class="size-8">
                  <MoreHorizontal class="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <PermissionGuard action="EDIT_NICKNAME" :target-member-id="memberId">
                  <DropdownMenuItem @click="handleEditMember">
                    <Pencil class="mr-2 size-4" />
                    Edit Nickname
                  </DropdownMenuItem>
                </PermissionGuard>

                <PermissionGuard action="CHANGE_ROLE" :target-member-id="memberId">
                  <DropdownMenuItem @click="handleChangeRole">
                    <Shield class="mr-2 size-4" />
                    Change Role
                  </DropdownMenuItem>
                </PermissionGuard>

                <PermissionGuard
                  v-if="!member.user_id"
                  action="MIGRATE_VIRTUAL"
                  :target-member-id="memberId"
                >
                  <DropdownMenuItem @click="handleMigrate">
                    <ArrowRightLeft class="mr-2 size-4" />
                    Migrate to User
                  </DropdownMenuItem>
                </PermissionGuard>

                <PermissionGuard action="MANAGE_RESTRICTIONS" :target-member-id="memberId">
                  <DropdownMenuItem @click="handleAddRestriction">
                    <Ban class="mr-2 size-4" />
                    Add Restriction
                  </DropdownMenuItem>
                </PermissionGuard>

                <PermissionGuard action="KICK_MEMBER" :target-member-id="memberId">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    class="text-destructive focus:text-destructive"
                    @click="handleKick"
                  >
                    <UserX class="mr-2 size-4" />
                    Kick
                  </DropdownMenuItem>
                </PermissionGuard>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </template>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowRightLeft,
  Ban,
  Calendar,
  ExternalLink,
  Ghost,
  Key,
  Loader2,
  MoreHorizontal,
  Pencil,
  Shield,
  User,
  UserX,
} from 'lucide-vue-next'
import { useServerMemberQuery, useMemberRestrictionsQuery } from '@/api/queries/server'
import { useServerPermissions } from '@/composables/useServerPermissions'
import PermissionGuard from '@/components/common/PermissionGuard.vue'
import { getInitials } from '@/lib/utils/user'
import type { ServerID } from '@/types/user'
import { hashToHue } from '@/lib/utils/colors'

const props = defineProps<{
  serverId: ServerID
  memberId: string
}>()

const emit = defineEmits<{
  viewProfile: [memberId: string]
  edit: [memberId: string]
  changeRole: [memberId: string]
  migrate: [memberId: string]
  addRestriction: [memberId: string]
  kick: [memberId: string]
}>()

const isOpen = ref(false)

const { canActOn, isMe: checkIsMe } = useServerPermissions()

const serverId = computed(() => props.serverId)
const activeMemberId = computed(() => (isOpen.value ? props.memberId : ''))

const { data: member, isLoading } = useServerMemberQuery(serverId, activeMemberId)
const { data: restrictions } = useMemberRestrictionsQuery(serverId, activeMemberId)

const memberHue = computed(() => hashToHue(props.memberId))

const isMe = computed(() => checkIsMe(props.memberId))

const hasAnyAction = computed(() => {
  if (isMe.value) return false

  return (
    canActOn(props.memberId, 'EDIT_NICKNAME') ||
    canActOn(props.memberId, 'CHANGE_ROLE') ||
    canActOn(props.memberId, 'KICK_MEMBER') ||
    canActOn(props.memberId, 'MANAGE_RESTRICTIONS') ||
    (!member.value?.user_id && canActOn(props.memberId, 'MIGRATE_VIRTUAL'))
  )
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function handleViewProfile() {
  emit('viewProfile', props.memberId)
  isOpen.value = false
}

function handleEditMember() {
  emit('edit', props.memberId)
  isOpen.value = false
}

function handleChangeRole() {
  emit('changeRole', props.memberId)
  isOpen.value = false
}

function handleMigrate() {
  emit('migrate', props.memberId)
  isOpen.value = false
}

function handleAddRestriction() {
  emit('addRestriction', props.memberId)
  isOpen.value = false
}

function handleKick() {
  emit('kick', props.memberId)
  isOpen.value = false
}
</script>
