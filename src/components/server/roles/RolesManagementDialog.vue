<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-5xl! w-full max-h-[85vh] flex flex-col">
      <DialogHeader class="relative">
        <DialogTitle>Manage Server Roles</DialogTitle>
        <DialogDescription>
          Create and manage roles with permissions for server administration. Drag roles to reorder
          their hierarchy.
        </DialogDescription>

        <Transition name="fade">
          <div
            v-if="isSavingOrder"
            class="absolute right-0 top-0 flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
          >
            <Loader2 class="size-3 animate-spin" />
            {{ $t('common.loading') }}
          </div>
        </Transition>
      </DialogHeader>

      <div class="flex flex-1 min-h-0 gap-4">
        <div class="w-64 shrink-0 border-r pr-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-medium">Roles Hierarchy</h3>
            <Button variant="ghost" size="icon" class="size-6" @click="showCreateDialog = true">
              <Plus class="size-4" />
            </Button>
          </div>

          <p class="text-xs text-muted-foreground mb-3">
            <ArrowUpDown class="inline size-3 mr-1" />
            Drag to reorder. Higher = more authority.
          </p>

          <div v-if="isLoading" class="flex justify-center py-4">
            <Loader2 class="size-5 animate-spin text-muted-foreground" />
          </div>

          <ScrollArea v-else class="h-[420px]">
            <draggable
              v-model="localRoles"
              item-key="id"
              handle=".drag-handle"
              ghost-class="opacity-50"
              :animation="200"
              @end="handleDragEnd"
            >
              <template #item="{ element: role }">
                <button
                  @click="selectedRoleId = role.id"
                  class="flex items-center gap-2 w-full rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted mb-1 group"
                  :class="{ 'bg-muted': selectedRoleId === role.id }"
                >
                  <div
                    class="drag-handle cursor-grab active:cursor-grabbing p-1 -ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <GripVertical class="size-4 text-muted-foreground" />
                  </div>

                  <div class="flex-1 flex items-center gap-2 text-left min-w-0">
                    <Shield class="size-4 shrink-0 text-muted-foreground" />
                    <span class="truncate flex-1">{{ role.name }}</span>
                  </div>
                </button>
              </template>
            </draggable>

            <div v-if="!localRoles.length" class="py-8 text-center text-sm text-muted-foreground">
              No roles yet
            </div>
          </ScrollArea>
        </div>

        <div class="flex-1 min-w-0 overflow-hidden">
          <template v-if="selectedRole">
            <RoleEditor
              :key="selectedRole.id"
              :role="selectedRole"
              :server-id="serverId"
              @updated="handleRoleUpdated"
              @deleted="handleRoleDeleted"
            />
          </template>
          <div
            v-else
            class="flex h-full flex-col items-center justify-center text-muted-foreground"
          >
            <Shield class="size-12 mb-3 opacity-50" />
            <p>Select a role to edit</p>
            <p class="text-sm">or create a new one</p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>

  <CreateRoleDialog
    v-model:open="showCreateDialog"
    :server-id="serverId"
    @created="handleRoleCreated"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowUpDown, GripVertical, Loader2, Plus, Shield } from 'lucide-vue-next'
import type { ServerID } from '@/types/user'
import { useServerRolesQuery, useUpdateServerRoleSilentMutation } from '@/api/queries/server'
import CreateRoleDialog from './CreateRoleDialog.vue'
import RoleEditor from './RoleEditor.vue'
import { queryClient } from '@/api/queryClient'
import { queryKeys } from '@/api/queries/server/keys'

interface ServerRole {
  id: string
  name: string
  position: number
  permissions_list: Array<{ id: string; code: string }>
}

interface DragEndEvent {
  oldIndex: number
  newIndex: number
}

const props = defineProps<{
  serverId: ServerID
}>()

const open = defineModel<boolean>('open', { required: true })

const selectedRoleId = ref<string | null>(null)
const showCreateDialog = ref(false)
const isSavingOrder = ref(false)

const serverId = computed(() => props.serverId)
const { data: serverRoles, isLoading } = useServerRolesQuery(serverId)
const { mutateAsync: updateRoleSilent } = useUpdateServerRoleSilentMutation()

const localRoles = ref<ServerRole[]>([])

watch(
  () => serverRoles.value,
  (roles) => {
    if (roles) {
      localRoles.value = [...roles].sort((a, b) => b.position - a.position)
    }
  },
  { immediate: true },
)

const selectedRole = computed(
  () => localRoles.value.find((r) => r.id === selectedRoleId.value) ?? null,
)

async function handleDragEnd(event: DragEndEvent) {
  const { oldIndex, newIndex } = event
  if (oldIndex === newIndex) return

  isSavingOrder.value = true
  const previousRoles = localRoles.value.map((r) => ({ ...r }))

  try {
    const updates: Promise<unknown>[] = []
    const minIndex = Math.min(oldIndex, newIndex)
    const maxIndex = Math.max(oldIndex, newIndex)

    for (let i = minIndex; i <= maxIndex; i++) {
      const role = localRoles.value[i]
      const newPosition = localRoles.value.length - 1 - i

      if (role.position !== newPosition) {
        updates.push(
          updateRoleSilent({
            serverId: props.serverId,
            roleId: role.id,
            data: {
              name: role.name,
              position: newPosition,
            },
          }),
        )
        role.position = newPosition
      }
    }

    await Promise.all(updates)

    queryClient.invalidateQueries({
      queryKey: queryKeys.servers.serverRoles(props.serverId),
    })
  } catch {
    localRoles.value = previousRoles
    toast.error('Failed to update role order')
  } finally {
    isSavingOrder.value = false
  }
}
function handleRoleCreated(roleId: string) {
  selectedRoleId.value = roleId
  showCreateDialog.value = false
}

function handleRoleUpdated() {}

function handleRoleDeleted() {
  selectedRoleId.value = null
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
