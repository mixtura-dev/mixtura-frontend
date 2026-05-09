<template>
  <section class="flex h-full">
    <ServerSidebar
      v-if="isDesktop"
      :member="currentMember ?? null"
      :is-loading="isLoadingCurrentMember"
      :member-role="currentMemberRole"
      @view-profile="handleViewOwnProfile"
      @view-my-restrictions="openMyRestrictions"
      @leave="openLeave"
    >
      <template #nav>
        <ServerNavItems :server-id="serverId" @create-event="showCreateEventDialog = true" />
      </template>
    </ServerSidebar>

    <Sheet v-if="!isDesktop" :open="mobileNavOpen" @update:open="mobileNavOpen = $event">
      <SheetContent side="left" class="w-[220px] p-0">
        <ServerSidebar
          :member="currentMember ?? null"
          :is-loading="isLoadingCurrentMember"
          :member-role="currentMemberRole"
          @view-profile="handleViewOwnProfile"
          @view-my-restrictions="openMyRestrictions"
          @leave="openLeave"
        >
          <template #nav>
            <ServerNavItems :server-id="serverId" @create-event="showCreateEventDialog = true" />
          </template>
        </ServerSidebar>
      </SheetContent>
    </Sheet>

    <main class="flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="flex items-center gap-2 border-b px-3 md:hidden">
        <Button variant="ghost" size="icon" class="size-8" @click="mobileNavOpen = true">
          <Menu class="size-4" />
        </Button>
      </div>
      <div v-if="isLoadingCurrentMember" class="flex h-full items-center justify-center">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
      </div>
      <RouterView v-else />
    </main>

    <MemberListSidebar
      v-if="isDesktop && showMemberList && serverId"
      :server-id="serverId"
      @select-member="handleSelectMember"
      @close="showMemberList = false"
    />
    <Sheet
      v-if="!isDesktop"
      :open="showMemberList"
      @update:open="showMemberList = $event"
    >
      <SheetContent side="right" class="w-60 p-0">
        <MemberListSidebar
          :server-id="serverId"
          @select-member="handleSelectMember"
          @close="showMemberList = false"
        />
      </SheetContent>
    </Sheet>
    <MemberProfileDialog
      :key="selectedMemberId ?? 'none'"
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
    <ServerLeaveDialog
      v-model:open="showLeaveDialog"
      :is-pending="isLeaving"
      @confirm="handleLeaveServer"
    />
    <CreateEventModal v-model:open="showCreateEventDialog" :server-id="serverId" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Loader2, Menu } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useMediaQuery } from '@vueuse/core'
import { useServerPage } from '@/composables/useServerPage'
import { useServerLeave } from '@/composables/useServerLeave'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import MemberListSidebar from '@/components/server/sidebars/MemberListSidebar.vue'
import MemberProfileDialog from '@/components/server/member/MemberProfileDialog.vue'
import RolesManagementDialog from '@/components/server/roles/RolesManagementDialog.vue'
import RestrictionsManagementDialog from '@/components/server/restrictions/RestrictionsManagementDialog.vue'
import CreateVirtualMemberDialog from '@/components/server/member/CreateVirtualMemberDialog.vue'
import MigrateMemberDialog from '@/components/server/member/MigrateMemberDialog.vue'
import ServerInviteDialog from '@/components/server/invites/ServerInviteDialog.vue'
import ServerSidebar from '@/components/server/ServerSidebar.vue'
import ServerLeaveDialog from '@/components/server/ServerLeaveDialog.vue'
import ServerNavItems from '@/components/server/ServerNavItems.vue'
import CreateEventModal from '@/components/server/events/CreateEventModal.vue'

const { t } = useI18n()

const {
  serverId, server, currentMember, isLoadingCurrentMember,
  showProfileDialog, showLeaveDialog, showMigrateDialog,
  showInviteDialog, showRolesDialog, showRestrictionsDialog,
  showCreateVirtualDialog, selectedMemberId, migratingMemberId,
  showMemberList, handleSelectMember, handleMigrateMember,
  handleViewOwnProfile, openLeave, openMyRestrictions,
} = useServerPage()

const { leave: handleLeaveServer, isPending: isLeaving } = useServerLeave(
  () => serverId.value,
  () => currentMember.value?.member.id ?? null,
)

const currentMemberRole = computed(
  () => currentMember.value?.member.server_role?.name ?? t('server.memberProfileDialog.noRole'),
)

const isDesktop = useMediaQuery('(min-width: 768px)')
const mobileNavOpen = ref(false)
const showCreateEventDialog = ref(false)
</script>
