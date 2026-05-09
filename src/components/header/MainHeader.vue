<template>
  <header
    role="banner"
    class="flex z-20 bg-background h-[65px] items-center flex-shrink-0 border-b w-full"
  >
    <div class="flex h-full items-center justify-between px-3 flex-1 overflow-x-auto gap-x-8">
      <div class="flex items-center gap-3">
        <template v-if="serverId">
          <DropdownMenu v-if="hasAnyServerPermission">
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon" class="size-8 shrink-0">
                <ChevronDown class="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" class="w-56">
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

          <span class="truncate text-sm font-semibold">{{ server?.name ?? $t('common.loading') }}</span>

          <Button
            variant="ghost"
            size="icon"
            class="size-8 shrink-0"
            @click="toggleMemberList"
          >
            <PanelRightClose v-if="showMemberList" class="size-4" />
            <PanelRightOpen v-else class="size-4" />
          </Button>
        </template>
      </div>

      <nav class="flex items-center gap-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" class="!p-1 size-7">
                <HelpCircleIcon aria-hidden="true" />
                <span class="hidden-visually"> {{ $t('menu.help') }}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent class="bg-card shadow-lg border" side="bottom">
              <span class="font-medium text-xs text-muted-foreground">
                {{ $t('menu.help') }}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <ProfileMenu />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProfileMenu from './ProfileMenu.vue'
import {
  Ban,
  ChevronDown,
  HelpCircleIcon,
  Link as LinkIcon,
  PanelRightClose,
  PanelRightOpen,
  Shield,
  UserPlus,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import PermissionGuard from '@/components/common/PermissionGuard.vue'
import { useServerQuery } from '@/api/queries/server'
import { useServerPermissions } from '@/composables/useServerPermissions'
import { useMemberListToggle } from '@/composables/useMemberListToggle'
import { useServerDialogs } from '@/composables/useServerDialogs'

const route = useRoute()

const serverId = computed(() => route.params.serverId as string)

const { data: server } = useServerQuery(serverId)
const { can } = useServerPermissions()
const { showMemberList, toggle: toggleMemberList } = useMemberListToggle()
const { showInviteDialog, showRolesDialog, showRestrictionsDialog, showCreateVirtualDialog } =
  useServerDialogs()

const hasAnyServerPermission = computed(() => {
  return (
    can('MANAGE_INVITES') ||
    can('CHANGE_ROLE') ||
    can('MANAGE_RESTRICTIONS') ||
    can('CREATE_VIRTUAL')
  )
})
</script>
