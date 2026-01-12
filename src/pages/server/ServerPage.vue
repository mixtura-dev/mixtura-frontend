<template>
  <section class="flex h-full">
    <aside class="flex h-full w-[220px] shrink-0 flex-col border-r bg-background">
      <template v-if="isLoadingCurrentMember">
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

      <template v-else>
        <div class="flex items-center justify-center h-[65px] border-b">
          <div class="flex items-center justify-center gap-3 px-2">
            <div
              class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <ServerIcon class="size-4" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold">{{ server?.name ?? 'Server' }}</p>
            </div>

            <DropdownMenu v-if="hasAnyServerPermission">
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" class="size-7 shrink-0">
                  <ChevronDown class="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" class="w-56">
                <PermissionGuard action="MANAGE_INVITES">
                  <DropdownMenuItem @click="showInviteDialog = true">
                    <LinkIcon class="mr-2 size-4" />
                    Invite People
                  </DropdownMenuItem>
                </PermissionGuard>

                <PermissionGuard action="CHANGE_ROLE">
                  <DropdownMenuItem @click="showRolesDialog = true">
                    <Shield class="mr-2 size-4" />
                    Manage Roles
                  </DropdownMenuItem>
                </PermissionGuard>

                <PermissionGuard action="MANAGE_RESTRICTIONS">
                  <DropdownMenuItem @click="showRestrictionsDialog = true">
                    <Ban class="mr-2 size-4" />
                    Restrictions
                  </DropdownMenuItem>
                </PermissionGuard>

                <PermissionGuard action="CREATE_VIRTUAL">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="showCreateVirtualDialog = true">
                    <UserPlus class="mr-2 size-4" />
                    Create Virtual Member
                  </DropdownMenuItem>
                </PermissionGuard>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <nav class="flex flex-1 flex-col overflow-y-auto p-3">
          <div class="flex flex-col gap-1"></div>
        </nav>

        <div class="mt-auto border-t p-3">
          <div class="flex items-center gap-3 rounded-md px-2 py-1.5">
            <MemberAvatar
              size="sm"
              :member-id="currentMember?.member.id!"
              :nickname="currentMember?.member.nickname!"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">
                {{ currentMember?.member.nickname ?? 'Unknown' }}
              </p>
              <p class="truncate text-xs text-muted-foreground">
                {{ currentMember?.member.server_role?.name ?? 'No role' }}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" class="size-7 shrink-0">
                  <MoreHorizontal class="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-48">
                <DropdownMenuItem @click="handleViewOwnProfile">
                  <User class="mr-2 size-4" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem @click="showMyRestrictionsDialog = true">
                  <Eye class="mr-2 size-4" />
                  My Restrictions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </template>
    </aside>

    <main class="flex min-h-0 min-w-0 flex-1 flex-col">
      <div v-if="isLoadingCurrentMember" class="flex h-full items-center justify-center">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>

      <template v-else>
        <div class="min-h-0 flex-1 overflow-y-auto p-6">
          <div class="mx-auto max-w-3xl"></div>
        </div>
      </template>
    </main>

    <MemberListSidebar
      v-if="showMemberList && serverId"
      :server-id="serverId"
      @select-member="handleSelectMember"
      @close="showMemberList = false"
    />

    <MemberProfileDialog
      v-model:open="showProfileDialog"
      :server-id="serverId"
      :member-id="selectedMemberId"
      @migrate="handleMigrateMember"
    />

    <RolesManagementDialog v-model:open="showRolesDialog" :server-id="serverId" />

    <RestrictionsManagementDialog v-model:open="showRestrictionsDialog" :server-id="serverId" />

    <CreateVirtualMemberDialog v-model:open="showCreateVirtualDialog" :server-id="serverId" />

    <MigrateMemberDialog
      v-model:open="showMigrateDialog"
      :server-id="serverId"
      :member-id="migratingMemberId"
    />

    <ServerInviteDialog v-model:open="showInviteDialog" :server="server" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Ban,
  ChevronDown,
  Eye,
  Link as LinkIcon,
  Loader2,
  MoreHorizontal,
  Server as ServerIcon,
  Shield,
  User,
  UserPlus,
} from 'lucide-vue-next'
import PermissionGuard from '@/components/common/PermissionGuard.vue'
import MemberListSidebar from '@/components/server/sidebars/MemberListSidebar.vue'
import MemberProfileDialog from '@/components/server/member/MemberProfileDialog.vue'
import RolesManagementDialog from '@/components/server/roles/RolesManagementDialog.vue'
import RestrictionsManagementDialog from '@/components/server/restrictions/RestrictionsManagementDialog.vue'
import CreateVirtualMemberDialog from '@/components/server/member/CreateVirtualMemberDialog.vue'
import MigrateMemberDialog from '@/components/server/member/MigrateMemberDialog.vue'
import { useCurrentMemberQuery, useServerQuery } from '@/api/queries/server'
import ServerInviteDialog from '@/components/workspace/ServerInviteDialog.vue'
import { useServerPermissions } from '@/composables/useServerPermissions'
import MemberAvatar from '@/components/server/member/MemberAvatar.vue'

const route = useRoute()
const { can } = useServerPermissions()

const serverId = computed(() => route.params.serverId as string)

const hasAnyServerPermission = computed(() => {
  return (
    can('MANAGE_INVITES') ||
    can('CHANGE_ROLE') ||
    can('MANAGE_RESTRICTIONS') ||
    can('CREATE_VIRTUAL')
  )
})

const showMemberList = ref(true)
const showProfileDialog = ref(false)
const showRolesDialog = ref(false)
const showRestrictionsDialog = ref(false)
const showMyRestrictionsDialog = ref(false)
const showCreateVirtualDialog = ref(false)
const showMigrateDialog = ref(false)
const showInviteDialog = ref(false)
const selectedMemberId = ref<string | null>(null)
const migratingMemberId = ref<string | null>(null)

const { data: server } = useServerQuery(serverId)
const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMemberQuery(serverId)

function handleSelectMember(memberId: string) {
  selectedMemberId.value = memberId
  showProfileDialog.value = true
}

function handleViewOwnProfile() {
  if (currentMember.value?.member.id) {
    selectedMemberId.value = currentMember.value.member.id
    showProfileDialog.value = true
  }
}

function handleMigrateMember(memberId: string) {
  migratingMemberId.value = memberId
  showMigrateDialog.value = true
}
</script>
