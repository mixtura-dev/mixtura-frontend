<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md overflow-hidden p-0">
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>

      <div v-else-if="isError || !member" class="py-16 text-center">
        <AlertCircle class="mx-auto mb-2 size-8 text-muted-foreground" />
        <p class="text-sm text-muted-foreground">Failed to load member</p>
      </div>

      <template v-else>
        <div
          class="relative h-24"
          :style="{
            background: `linear-gradient(135deg, hsl(${memberHue}, 60%, 40%) 0%, hsl(${memberHue}, 40%, 25%) 100%)`,
          }"
        >
          <div class="absolute -bottom-10 left-6">
            <Avatar class="size-20 border-4 border-background shadow-lg">
              <AvatarFallback
                class="text-2xl font-bold text-white"
                :style="{ backgroundColor: `hsl(${memberHue}, 50%, 45%)` }"
              >
                {{ getInitials(member.nickname) }}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div class="flex justify-end px-4 pt-2">
          <PermissionGuard v-if="!isMe" action="EDIT_NICKNAME" :target-member-id="memberId">
            <Button variant="outline" size="sm" @click="handleEdit">
              <Pencil class="mr-1 size-3" />
              Edit
            </Button>
          </PermissionGuard>
        </div>

        <div class="px-6 pb-6 pt-6">
          <div class="mb-4">
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold">{{ member.nickname }}</h2>
              <Badge v-if="isMe" variant="secondary" class="text-xs">You</Badge>
            </div>

            <div class="mt-2 flex flex-wrap gap-1.5">
              <Badge v-if="member.server_role" variant="outline">
                <Shield class="mr-1 size-3" />
                {{ member.server_role.name }}
              </Badge>
              <Badge v-if="!member.user_id" variant="secondary">
                <Ghost class="mr-1 size-3" />
                Virtual User
              </Badge>
            </div>
          </div>

          <Separator />

          <div class="mt-4 space-y-4">
            <div>
              <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Member Since
              </h3>
              <div class="flex items-center gap-2 text-sm">
                <Calendar class="size-4 text-muted-foreground" />
                <span>{{ formatFullDate(member.joined_at) }}</span>
              </div>
            </div>

            <div v-if="member.user_id">
              <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                User ID
              </h3>
              <div class="flex items-center gap-2">
                <code class="rounded bg-muted px-2 py-1 text-xs">{{ member.user_id }}</code>
                <Button variant="ghost" size="icon" class="size-6" @click="copyUserId">
                  <Copy class="size-3" />
                </Button>
              </div>
            </div>

            <div v-if="member.server_role?.permissions_list.length">
              <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Permissions
              </h3>
              <div class="flex flex-wrap gap-1">
                <Badge
                  v-for="perm in member.server_role.permissions_list"
                  :key="perm.id"
                  variant="secondary"
                  class="text-xs"
                >
                  {{ formatPermissionCode(perm.code) }}
                </Badge>
              </div>
            </div>

            <PermissionGuard action="VIEW_RESTRICTIONS">
              <div v-if="restrictions?.length">
                <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-destructive">
                  Active Restrictions
                </h3>
                <div class="space-y-2">
                  <div
                    v-for="restriction in restrictions"
                    :key="restriction.id"
                    class="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-2"
                  >
                    <div class="flex items-center gap-2">
                      <Ban class="size-4 text-destructive" />
                      <div>
                        <p class="text-sm font-medium">{{ restriction.restriction.code }}</p>
                        <p class="text-xs text-muted-foreground">{{ restriction.reason }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-muted-foreground">
                        {{ formatDate(restriction.expiration_date) }}
                      </span>
                      <PermissionGuard action="MANAGE_RESTRICTIONS" :target-member-id="memberId">
                        <Button
                          variant="ghost"
                          size="icon"
                          class="size-6 text-destructive hover:text-destructive"
                          @click="handleRemoveRestriction(restriction.id)"
                        >
                          <Trash2 class="size-3" />
                        </Button>
                      </PermissionGuard>
                    </div>
                  </div>
                </div>
              </div>
            </PermissionGuard>
          </div>

          <template v-if="!isMe && hasAnyAction">
            <Separator class="my-4" />

            <div class="grid grid-cols-2 gap-2">
              <PermissionGuard action="CHANGE_ROLE" :target-member-id="memberId">
                <Button variant="outline" class="w-full" @click="handleChangeRole">
                  <Shield class="mr-2 size-4" />
                  Change Role
                </Button>
              </PermissionGuard>

              <PermissionGuard action="MANAGE_RESTRICTIONS" :target-member-id="memberId">
                <Button variant="outline" class="w-full" @click="handleAddRestriction">
                  <Ban class="mr-2 size-4" />
                  Add Restriction
                </Button>
              </PermissionGuard>

              <PermissionGuard
                v-if="!member.user_id"
                action="MIGRATE_VIRTUAL"
                :target-member-id="memberId"
              >
                <Button variant="outline" class="w-full" @click="handleMigrate">
                  <ArrowRightLeft class="mr-2 size-4" />
                  Migrate
                </Button>
              </PermissionGuard>

              <PermissionGuard action="KICK_MEMBER" :target-member-id="memberId">
                <Button variant="destructive" class="w-full" @click="handleKick">
                  <UserX class="mr-2 size-4" />
                  Kick
                </Button>
              </PermissionGuard>
            </div>
          </template>
        </div>
      </template>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  AlertCircle,
  ArrowRightLeft,
  Ban,
  Calendar,
  Copy,
  Ghost,
  Loader2,
  Pencil,
  Shield,
  Trash2,
  UserX,
} from 'lucide-vue-next'

import {
  useServerMemberQuery,
  useMemberRestrictionsQuery,
  useRemoveRestrictionMutation,
  useKickMemberMutation,
} from '@/api/queries/server'
import { useServerPermissions } from '@/composables/useServerPermissions'
import { getErrorMessage } from '@/composables/useApiError'
import PermissionGuard from '@/components/common/PermissionGuard.vue'
import { getInitials } from '@/lib/utils/user'
import type { ServerID } from '@/types/user'
import { hashToHue } from '@/lib/utils/colors'

const props = defineProps<{
  serverId: ServerID
  memberId: string | null
}>()

const emit = defineEmits<{
  edit: [memberId: string]
  changeRole: [memberId: string]
  migrate: [memberId: string]
  addRestriction: [memberId: string]
}>()

const open = defineModel<boolean>('open', { required: true })

const { canActOn, isMe: checkIsMe } = useServerPermissions()
const { copy } = useClipboard()

const serverId = computed(() => props.serverId)
const memberId = computed(() => props.memberId ?? '')

const { data: member, isLoading, isError } = useServerMemberQuery(serverId, memberId)
const { data: restrictions } = useMemberRestrictionsQuery(serverId, memberId)

const { mutate: removeRestriction } = useRemoveRestrictionMutation()
const { mutate: kickMember } = useKickMemberMutation()

const memberHue = computed(() => hashToHue(props.memberId))
const isMe = computed(() => (props.memberId ? checkIsMe(props.memberId) : false))

const hasAnyAction = computed(() => {
  if (!props.memberId || isMe.value) return false

  return (
    canActOn(props.memberId, 'CHANGE_ROLE') ||
    canActOn(props.memberId, 'KICK_MEMBER') ||
    canActOn(props.memberId, 'MANAGE_RESTRICTIONS') ||
    (!member.value?.user_id && canActOn(props.memberId, 'MIGRATE_VIRTUAL'))
  )
})

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

function formatFullDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

function formatPermissionCode(code: string): string {
  return code
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function copyUserId() {
  if (member.value?.user_id) {
    copy(member.value.user_id)
    toast.success('User ID copied')
  }
}

function handleEdit() {
  if (props.memberId) {
    emit('edit', props.memberId)
    open.value = false
  }
}

function handleChangeRole() {
  if (props.memberId) {
    emit('changeRole', props.memberId)
    open.value = false
  }
}

function handleMigrate() {
  if (props.memberId) {
    emit('migrate', props.memberId)
    open.value = false
  }
}

function handleAddRestriction() {
  if (props.memberId) {
    emit('addRestriction', props.memberId)
    open.value = false
  }
}

function handleRemoveRestriction(restrictionId: string) {
  if (!props.memberId) return

  removeRestriction(
    {
      serverId: props.serverId,
      memberId: props.memberId,
      restrictionId,
    },
    {
      onSuccess: () => {
        toast.success('Restriction removed')
      },
      onError: (error) => {
        const err = error instanceof Error ? error : new Error('Unknown error')
        toast.error('Failed to remove restriction', {
          description: getErrorMessage(err),
        })
      },
    },
  )
}

function handleKick() {
  if (!props.memberId || !member.value) return

  const nickname = member.value.nickname

  kickMember(
    { serverId: props.serverId, memberId: props.memberId },
    {
      onSuccess: () => {
        toast.success(`${nickname} has been kicked`)
        open.value = false
      },
      onError: (error) => {
        const err = error instanceof Error ? error : new Error('Unknown error')
        toast.error('Failed to kick member', {
          description: getErrorMessage(err),
        })
      },
    },
  )
}
</script>
