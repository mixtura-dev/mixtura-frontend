<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md overflow-hidden p-0">
      <div v-if="isLoading && !member" class="flex items-center justify-center py-16">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>

      <div v-else-if="isError && !member" class="py-16 text-center">
        <AlertCircle class="mx-auto mb-2 size-8 text-muted-foreground" />
        <p class="text-sm text-muted-foreground">Failed to load member</p>
      </div>

      <template v-else-if="member">
        <div
          class="relative h-24"
          :style="{
            background: `linear-gradient(135deg, hsl(${memberHue}, 60%, 40%) 0%, hsl(${memberHue}, 40%, 25%) 100%)`,
          }"
        >
          <div class="absolute -bottom-10 left-6">
            <MemberAvatar
              class="border-4 border-background"
              :nickname="member.nickname"
              :member-id="memberId"
              size="xl"
            />
          </div>

          <div v-if="isFetching" class="absolute left-3 top-3">
            <Loader2 class="size-4 animate-spin text-white/70" />
          </div>
        </div>

        <div class="px-6 pb-6 pt-9">
          <div class="mb-4">
            <div class="flex items-center gap-2">
              <EditableNickname
                :model-value="member.nickname"
                :can-edit="canEditNickname"
                @save="handleSaveNickname"
              />
              <Badge v-if="isMe" variant="secondary" class="text-xs">You</Badge>
            </div>

            <div class="mt-2 flex flex-wrap gap-1.5">
              <DropdownMenu v-if="canChangeRole && !isMe && member.user_id">
                <DropdownMenuTrigger as-child>
                  <Badge variant="outline" class="cursor-pointer hover:bg-muted">
                    <Shield class="mr-1 size-3" />
                    {{ member.server_role?.name ?? 'No Role' }}
                    <ChevronDown class="ml-1 size-3" />
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    v-for="role in availableServerRoles"
                    :key="role.id"
                    @click="handleChangeRole(role.id)"
                  >
                    <Shield class="mr-2 size-3 text-muted-foreground" />
                    {{ role.name }}
                    <Check v-if="role.id === member.server_role?.id" class="ml-2 size-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Badge v-else-if="member.server_role" variant="outline">
                <Shield class="mr-1 size-3" />
                {{ member.server_role.name }}
              </Badge>
              <Badge v-if="!member.user_id" variant="secondary">
                <Ghost class="mr-1 size-3" />
                {{ t('server.memberProfileDialog.virtualUserBadge') }}
              </Badge>
            </div>
          </div>

          <Separator />

          <div class="mt-4 space-y-4">
            <div v-if="member.joined_at" class="rounded-lg bg-muted/50 p-3">
              <div
                class="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {{ t('server.memberProfileDialog.memberSince') }}
              </div>
              <div class="flex items-center gap-2 text-sm">
                <Calendar class="size-4 text-muted-foreground" />
                {{ formatSmartDate(member.joined_at) }}
              </div>
            </div>

            <div v-if="member.server_role?.permissions_list?.length">
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
                  {{
                    t(
                      `server.roleEditor.permissions.${perm.code}.label`,
                      formatCodeForDisplay(perm.code),
                    )
                  }}
                </Badge>
              </div>
            </div>

            <PermissionGuard v-if="member.user_id" action="VIEW_RESTRICTIONS">
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
                        {{
                          t(
                            `server.addRestriction.restrictionCodes.${restriction.restriction.code}`,
                            formatCodeForDisplay(restriction.restriction.code),
                          )
                        }}
                        <p class="text-xs text-muted-foreground">{{ restriction.reason }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-muted-foreground">
                        {{ formatDateTime(restriction.expiration_date) }}
                      </span>
                      <PermissionGuard action="MANAGE_RESTRICTIONS" :target-member-id="memberId">
                        <Button
                          variant="ghost"
                          size="icon"
                          class="size-6 text-destructive hover:text-destructive"
                          :disabled="removingRestrictionId === restriction.id"
                          @click="handleRemoveRestriction(restriction.id)"
                        >
                          <Loader2
                            v-if="removingRestrictionId === restriction.id"
                            class="size-3 animate-spin"
                          />
                          <Trash2 v-else class="size-3" />
                        </Button>
                      </PermissionGuard>
                    </div>
                  </div>
                </div>
              </div>
            </PermissionGuard>
          </div>

          <template v-if="!isMe && hasAnyAction">
            <div class="mt-4 grid grid-cols-2 gap-2">
              <PermissionGuard
                v-if="member.user_id"
                action="MANAGE_RESTRICTIONS"
                :target-member-id="memberId"
              >
                <Button variant="outline" class="w-full" @click="showAddRestrictionDialog = true">
                  <Ban class="mr-2 size-4" />
                  {{ t('server.memberProfileDialog.addRestrictionButton') }}
                </Button>
              </PermissionGuard>

              <PermissionGuard
                v-if="!member.user_id"
                action="MIGRATE_VIRTUAL"
                :target-member-id="memberId"
              >
                <Button variant="outline" class="w-full" @click="handleMigrate">
                  <ArrowRightLeft class="mr-2 size-4" />
                  {{ t('server.memberProfileDialog.migrateButton') }}
                </Button>
              </PermissionGuard>

              <PermissionGuard action="KICK_MEMBER" :target-member-id="memberId">
                <Button
                  variant="destructive"
                  class="w-full"
                  :disabled="isKicking"
                  @click="handleKick"
                >
                  <Loader2 v-if="isKicking" class="mr-2 size-4 animate-spin" />
                  <UserX v-else class="mr-2 size-4" />
                  {{ t('server.memberProfileDialog.kickButton') }}
                </Button>
              </PermissionGuard>
            </div>
          </template>
        </div>
      </template>
    </DialogContent>
  </Dialog>

  <AddRestrictionDialog
    v-if="memberId && member?.user_id"
    v-model:open="showAddRestrictionDialog"
    :server-id="serverId"
    :member-id="memberId"
    @added="handleRestrictionAdded"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertCircle,
  ArrowRightLeft,
  Ban,
  Calendar,
  Check,
  ChevronDown,
  Ghost,
  Loader2,
  Shield,
  Trash2,
  UserX,
} from 'lucide-vue-next'

import { useServerPermissions } from '@/composables/useServerPermissions'
import PermissionGuard from '@/components/common/PermissionGuard.vue'
import EditableNickname from '@/components/common/EditableNickname.vue'
import AddRestrictionDialog from '@/components/server/restrictions/AddRestrictionDialog.vue'
import { hashToHue } from '@/lib/utils/colors'
import type { ServerID } from '@/types/user'
import {
  useKickMemberMutation,
  useMemberRestrictionsQuery,
  useRemoveRestrictionMutation,
  useServerMemberQuery,
  useServerRolesQuery,
  useUpdateMemberMutation,
} from '@/api/queries/server'
import { useDateFormatter } from '@/lib/utils/date'
import MemberAvatar from './MemberAvatar.vue'
import { useI18n } from 'vue-i18n'
import { formatCodeForDisplay } from '@/lib/utils/formatters'

const { t } = useI18n()

const props = defineProps<{
  serverId: ServerID
  memberId: string | null
}>()

const emit = defineEmits<{
  migrate: [memberId: string]
}>()

const open = defineModel<boolean>('open', { required: true })

const { canActOn, isMe: checkIsMe } = useServerPermissions()

const showAddRestrictionDialog = ref(false)
const removingRestrictionId = ref<string | null>(null)

const serverId = computed(() => props.serverId)
const memberId = computed(() => props.memberId ?? '')

const { data: member, isLoading, isError, isFetching } = useServerMemberQuery(serverId, memberId)
const { data: restrictions } = useMemberRestrictionsQuery(serverId, memberId)
const { data: serverRoles } = useServerRolesQuery(serverId)

const { mutate: removeRestriction } = useRemoveRestrictionMutation()
const { mutate: kickMember, isPending: isKicking } = useKickMemberMutation()
const { mutate: updateMember } = useUpdateMemberMutation()

const memberHue = computed(() => hashToHue(props.memberId))
const isMe = computed(() => (memberId.value ? checkIsMe(memberId.value) : false))

const canEditNickname = computed(() =>
  memberId.value ? canActOn(memberId.value, 'EDIT_NICKNAME') : false,
)

const canChangeRole = computed(() =>
  memberId.value ? canActOn(memberId.value, 'CHANGE_ROLE') : false,
)

const availableServerRoles = computed(() => serverRoles.value ?? [])

const hasAnyAction = computed(() => {
  if (!memberId.value || isMe.value) return false

  const isVirtual = !member.value?.user_id

  return (
    canActOn(memberId.value, 'KICK_MEMBER') ||
    (isVirtual && canActOn(memberId.value, 'MIGRATE_VIRTUAL')) ||
    (!isVirtual && canActOn(memberId.value, 'MANAGE_RESTRICTIONS'))
  )
})

const { formatSmartDate, formatDateTime } = useDateFormatter()

function handleSaveNickname(newNickname: string) {
  if (!props.memberId) return

  updateMember(
    {
      serverId: props.serverId,
      memberId: props.memberId,
      data: { name: newNickname },
    },
    {
      onSuccess: () => toast.success(t('server.memberProfileDialog.toast.nicknameUpdated')),
      onError: () => toast.error(t('server.memberProfileDialog.toast.nicknameUpdateFailed')),
    },
  )
}

function handleChangeRole(roleId: string) {
  if (!memberId.value) return

  updateMember(
    {
      serverId: props.serverId,
      memberId: memberId.value,
      data: { server_role_id: roleId },
    },
    {
      onError: () => toast.error(t('server.memberProfileDialog.toast.roleUpdateFailed')),
    },
  )
}

function handleRemoveRestriction(restrictionId: string) {
  if (!props.memberId) return

  removingRestrictionId.value = restrictionId

  removeRestriction(
    {
      serverId: props.serverId,
      memberId: props.memberId,
      restrictionId,
    },
    {
      onSuccess: () => toast.success(t('server.memberProfileDialog.toast.restrictionRemoved')),
      onError: () => toast.error(t('server.memberProfileDialog.toast.restrictionRemoveFailed')),
      onSettled: () => {
        removingRestrictionId.value = null
      },
    },
  )
}

function handleRestrictionAdded() {
  showAddRestrictionDialog.value = false
}

function handleMigrate() {
  if (props.memberId) {
    emit('migrate', props.memberId)
    open.value = false
  }
}

function handleKick() {
  if (!props.memberId || !member.value) return

  const nickname = member.value.nickname

  kickMember(
    { serverId: props.serverId, memberId: props.memberId },
    {
      onSuccess: () => {
        toast.success(t('server.memberProfileDialog.toast.kickSuccess', { nickname }))
        open.value = false
      },
      onError: () => toast.error(t('server.memberProfileDialog.toast.kickFailed')),
    },
  )
}
</script>
