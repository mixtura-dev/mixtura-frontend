<template>
  <section class="flex h-full">
    <main class="flex min-h-0 min-w-0 flex-1 flex-col">
      <div v-if="isLoadingCurrentMember" class="flex h-full items-center justify-center">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>

      <template v-else>
        <header class="flex h-12 shrink-0 items-center justify-between border-b px-4">
          <h1 class="font-semibold">{{ server?.name ?? 'Server' }}</h1>

          <div class="flex items-center gap-2">
            <PermissionGuard action="MANAGE_INVITES">
              <Button variant="ghost" size="icon" @click="showInviteDialog = true">
                <LinkIcon class="size-4" />
              </Button>
            </PermissionGuard>

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon">
                  <Settings class="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <PermissionGuard action="CHANGE_ROLE">
                  <DropdownMenuItem @click="showRolesDialog = true">
                    <Shield class="mr-2 size-4" />
                    Manage Roles
                  </DropdownMenuItem>
                </PermissionGuard>

                <PermissionGuard action="MANAGE_RESTRICTIONS">
                  <DropdownMenuItem @click="showRestrictionsDialog = true">
                    <Ban class="mr-2 size-4" />
                    Manage Restrictions
                  </DropdownMenuItem>
                </PermissionGuard>

                <PermissionGuard action="MANAGE_INVITES">
                  <DropdownMenuItem @click="showInviteDialog = true">
                    <LinkIcon class="mr-2 size-4" />
                    Manage Invites
                  </DropdownMenuItem>
                </PermissionGuard>

                <DropdownMenuItem @click="showMyRestrictionsDialog = true">
                  <Eye class="mr-2 size-4" />
                  My Restrictions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <PermissionGuard action="CREATE_VIRTUAL">
              <Button variant="ghost" size="icon" @click="showCreateVirtualDialog = true">
                <UserPlus class="size-4" />
              </Button>
            </PermissionGuard>

            <Button variant="ghost" size="icon" @click="toggleMemberList">
              <Users class="size-4" />
            </Button>
          </div>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto p-4">
          <p class="text-muted-foreground">Welcome to {{ server?.name }}</p>
        </div>
      </template>
    </main>

    <MemberListSidebar
      v-if="showMemberList && serverId"
      :server-id="serverId"
      @select-member="handleSelectMember"
    />

    <MemberProfileDialog
      v-model:open="showProfileDialog"
      :server-id="serverId"
      :member-id="selectedMemberId"
      @migrate="handleMigrateMember"
    />

    <RolesManagementDialog v-model:open="showRolesDialog" :server-id="serverId" />

    <RestrictionsManagementDialog v-model:open="showRestrictionsDialog" :server-id="serverId" />

    <!-- <MyRestrictionsDialog v-model:open="showMyRestrictionsDialog" :server-id="serverId" /> -->

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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Ban,
  Eye,
  Link as LinkIcon,
  Loader2,
  Settings,
  Shield,
  UserPlus,
  Users,
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

const route = useRoute()

const serverId = computed(() => route.params.serverId as string)

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
const { isLoading: isLoadingCurrentMember } = useCurrentMemberQuery(serverId)

function toggleMemberList() {
  showMemberList.value = !showMemberList.value
}

function handleSelectMember(memberId: string) {
  selectedMemberId.value = memberId
  showProfileDialog.value = true
}

function handleMigrateMember(memberId: string) {
  migratingMemberId.value = memberId
  showMigrateDialog.value = true
}
</script>
