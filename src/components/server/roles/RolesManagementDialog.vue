<!-- components/server/roles/RolesManagementDialog.vue -->
<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-2xl max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Manage Roles</DialogTitle>
        <DialogDescription> Create, edit and manage server roles </DialogDescription>
      </DialogHeader>

      <div class="flex flex-1 min-h-0 gap-4">
        <!-- Roles list -->
        <div class="w-48 shrink-0 border-r pr-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-medium">Roles</h3>
            <Button variant="ghost" size="icon" class="size-6" @click="handleCreateRole">
              <Plus class="size-4" />
            </Button>
          </div>

          <div v-if="isLoading" class="flex justify-center py-4">
            <Loader2 class="size-5 animate-spin text-muted-foreground" />
          </div>

          <ScrollArea v-else class="h-[400px]">
            <div class="space-y-1">
              <button
                v-for="role in gameRoles"
                :key="role.id"
                class="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted text-left"
                :class="{ 'bg-muted': selectedRoleId === role.id }"
                @click="selectedRoleId = role.id"
              >
                <Avatar v-if="role.icon_url" class="size-5">
                  <AvatarImage :src="role.icon_url" />
                </Avatar>
                <div v-else class="size-3 rounded-full bg-muted-foreground/30" />
                <span class="truncate">{{ role.name }}</span>
              </button>
            </div>
          </ScrollArea>
        </div>

        <!-- Role editor -->
        <div class="flex-1 min-w-0">
          <template v-if="selectedRole">
            <RoleEditor
              :key="selectedRole.id"
              :role="selectedRole"
              :server-id="serverId"
              :role-set-id="roleSetId"
              @updated="handleRoleUpdated"
              @deleted="handleRoleDeleted"
            />
          </template>
          <div v-else class="flex h-full items-center justify-center text-muted-foreground">
            Select a role to edit
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>

  <!-- Create Role Dialog -->
  <CreateRoleDialog
    v-model:open="showCreateDialog"
    :server-id="serverId"
    :role-set-id="roleSetId"
    @created="handleRoleCreated"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Plus } from 'lucide-vue-next'
import RoleEditor from './RoleEditor.vue'
import CreateRoleDialog from './CreateRoleDialog.vue'
import type { ServerID } from '@/types/user'
import { useRoleSetQuery } from '@/api/queries/server'

const props = defineProps<{
  serverId: ServerID
}>()

const open = defineModel<boolean>('open', { required: true })

const selectedRoleId = ref<string | null>(null)
const showCreateDialog = ref(false)

const serverId = computed(() => props.serverId)
const { data: roleSet, isLoading } = useRoleSetQuery(serverId)

// game_roles - это правильное поле из API
const gameRoles = computed(() => roleSet.value?.game_roles ?? [])
const roleSetId = computed(() => roleSet.value?.id ?? '')

const selectedRole = computed(
  () => gameRoles.value.find((r) => r.id === selectedRoleId.value) ?? null,
)

function handleCreateRole() {
  showCreateDialog.value = true
}

function handleRoleCreated(roleId: string) {
  selectedRoleId.value = roleId
}

function handleRoleUpdated() {
  // Query will auto-refetch
}

function handleRoleDeleted() {
  selectedRoleId.value = null
}
</script>
