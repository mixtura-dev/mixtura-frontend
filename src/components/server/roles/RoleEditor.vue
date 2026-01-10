<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <Shield class="size-5 text-muted-foreground" />
        <h3 class="font-semibold text-lg">{{ role.name }}</h3>
        <Badge variant="outline">
          <ArrowUpDown class="size-3 mr-1" />
          Position {{ role.position }}
        </Badge>
      </div>
      <Button variant="destructive" size="sm" :disabled="isDeleting" @click="handleDelete">
        <Trash2 v-if="!isDeleting" class="mr-1 size-3" />
        <Loader2 v-else class="mr-1 size-3 animate-spin" />
        Delete
      </Button>
    </div>

    <Tabs default-value="general" class="flex-1 flex flex-col min-h-0">
      <TabsList class="grid w-full grid-cols-2 shrink-0">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>

      <TabsContent value="general" class="space-y-4 mt-4">
        <div class="space-y-2">
          <Label>Role Name</Label>
          <Input v-model="form.name" placeholder="Role name" />
        </div>

        <div class="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
          <GripVertical class="inline size-4 mr-1 -mt-0.5" />
          To change the role's position, drag it in the roles list on the left.
        </div>

        <Button class="w-full" :disabled="!hasNameChanged || isSaving" @click="saveName">
          <Loader2 v-if="isSaving" class="mr-2 size-4 animate-spin" />
          Save Changes
        </Button>
      </TabsContent>

      <TabsContent value="permissions" class="flex-1 flex flex-col min-h-0 mt-4 overflow-hidden">
        <ScrollArea class="flex-1 max-h-[300px] min-h-0">
          <div class="space-y-2 pr-4">
            <div
              v-for="permission in allPermissions"
              :key="permission.code"
              class="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              <div class="flex-1 min-w-0 pr-4">
                <p class="font-medium text-sm">{{ permission.label }}</p>
                <p class="text-xs text-muted-foreground">{{ permission.description }}</p>
              </div>
              <Switch
                :checked="hasPermission(permission.code)"
                @update:checked="(val: boolean) => togglePermission(permission.code, val)"
              />
            </div>
          </div>
        </ScrollArea>

        <div class="pt-4 border-t mt-4 shrink-0">
          <Button
            class="w-full"
            :disabled="!hasPermissionChanges || isSavingPermissions"
            @click="savePermissions"
          >
            <Loader2 v-if="isSavingPermissions" class="mr-2 size-4 animate-spin" />
            Save Permissions
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowUpDown, GripVertical, Loader2, Shield, Trash2 } from 'lucide-vue-next'
import {
  useUpdateServerRoleMutation,
  useDeleteServerRoleMutation,
  useUpdateServerRolePermissionsMutation,
  useGlobalPermissionsQuery,
} from '@/api/queries/server'
import { PERMISSION_CODES } from '@/types/permissions'
import type { ServerID } from '@/types/user'

interface ServerRole {
  id: string
  name: string
  position: number
  permissions_list: Array<{ id: string; code: string }>
}

const props = defineProps<{
  role: ServerRole
  serverId: ServerID
}>()

const emit = defineEmits<{
  updated: []
  deleted: []
}>()

const form = reactive({
  name: props.role.name,
})

const selectedPermissionIds = ref<Set<string>>(
  new Set(props.role.permissions_list.map((p) => p.id)),
)

const selectedPermissionCodes = ref<Set<string>>(
  new Set(props.role.permissions_list.map((p) => p.code)),
)

const { mutate: updateRole, isPending: isSaving } = useUpdateServerRoleMutation()
const { mutate: deleteRole, isPending: isDeleting } = useDeleteServerRoleMutation()
const { mutate: updatePermissions, isPending: isSavingPermissions } =
  useUpdateServerRolePermissionsMutation()

const { data: permissionsList } = useGlobalPermissionsQuery()

const permissionCodeToId = computed(() => {
  const map = new Map<string, string>()
  if (permissionsList.value) {
    for (const perm of permissionsList.value) {
      map.set(perm.code, perm.id)
    }
  }
  return map
})

const allPermissions = computed(() => [
  {
    code: PERMISSION_CODES.ADMINISTRATOR,
    label: 'Administrator',
    description: 'Full access to all server settings and actions',
  },
  {
    code: PERMISSION_CODES.MANAGE_SERVER,
    label: 'Manage Server',
    description: 'Edit server settings, name, and icon',
  },
  {
    code: PERMISSION_CODES.MANAGE_ROLES,
    label: 'Manage Roles',
    description: 'Create, edit, and delete server roles',
  },
  {
    code: PERMISSION_CODES.MANAGE_INVITES,
    label: 'Manage Invites',
    description: 'Create and revoke invite links',
  },
  {
    code: PERMISSION_CODES.KICK_MEMBERS,
    label: 'Kick Members',
    description: 'Remove members from the server',
  },
  {
    code: PERMISSION_CODES.MANAGE_NICKNAMES,
    label: 'Manage Nicknames',
    description: "Change other members' nicknames",
  },
  {
    code: PERMISSION_CODES.VIEW_RESTRICTIONS,
    label: 'View Restrictions',
    description: 'View member restrictions and bans',
  },
  {
    code: PERMISSION_CODES.MANAGE_RESTRICTIONS,
    label: 'Manage Restrictions',
    description: 'Add and remove member restrictions',
  },
  {
    code: PERMISSION_CODES.CREATE_VIRTUAL_MEMBER,
    label: 'Create Virtual Members',
    description: 'Create placeholder members',
  },
  {
    code: PERMISSION_CODES.MIGRATE_VIRTUAL_MEMBER,
    label: 'Migrate Virtual Members',
    description: 'Transfer virtual members to real users',
  },
])

const hasNameChanged = computed(() => form.name !== props.role.name)

const hasPermissionChanges = computed(() => {
  const currentCodes = new Set(props.role.permissions_list.map((p) => p.code))
  if (currentCodes.size !== selectedPermissionCodes.value.size) return true
  for (const code of selectedPermissionCodes.value) {
    if (!currentCodes.has(code)) return true
  }
  return false
})

watch(
  () => props.role,
  (newRole) => {
    form.name = newRole.name
    selectedPermissionIds.value = new Set(newRole.permissions_list.map((p) => p.id))
    selectedPermissionCodes.value = new Set(newRole.permissions_list.map((p) => p.code))
  },
  { deep: true },
)

function hasPermission(code: string): boolean {
  return selectedPermissionCodes.value.has(code)
}

function togglePermission(code: string, enabled: boolean) {
  const permId = permissionCodeToId.value.get(code)

  if (enabled) {
    selectedPermissionCodes.value.add(code)
    if (permId) selectedPermissionIds.value.add(permId)
  } else {
    selectedPermissionCodes.value.delete(code)
    if (permId) selectedPermissionIds.value.delete(permId)
  }

  selectedPermissionCodes.value = new Set(selectedPermissionCodes.value)
  selectedPermissionIds.value = new Set(selectedPermissionIds.value)
}

function saveName() {
  updateRole(
    {
      serverId: props.serverId,
      roleId: props.role.id,
      data: {
        name: form.name,
        position: props.role.position,
      },
    },
    {
      onSuccess: () => {
        toast.success('Role updated')
        emit('updated')
      },
      onError: () => toast.error('Failed to update role'),
    },
  )
}

function savePermissions() {
  updatePermissions(
    {
      serverId: props.serverId,
      roleId: props.role.id,
      data: {
        permissions_ids: Array.from(selectedPermissionIds.value),
      },
    },
    {
      onSuccess: () => {
        toast.success('Permissions updated')
        emit('updated')
      },
      onError: () => toast.error('Failed to update permissions'),
    },
  )
}

function handleDelete() {
  deleteRole(
    {
      serverId: props.serverId,
      roleId: props.role.id,
    },
    {
      onSuccess: () => {
        toast.success('Role deleted')
        emit('deleted')
      },
      onError: () => toast.error('Failed to delete role'),
    },
  )
}
</script>
