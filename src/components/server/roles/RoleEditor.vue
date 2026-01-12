<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <Shield class="size-5 text-muted-foreground" />
        <h3 class="font-semibold text-lg">{{ role.name }}</h3>
        <Badge variant="outline">
          <ArrowUpDown class="size-3 mr-1" />
          {{ t('server.roleEditor.position') }} {{ role.position }}
        </Badge>
      </div>
      <Button variant="destructive" size="sm" :disabled="isDeleting" @click="handleDelete">
        <Trash2 v-if="!isDeleting" class="mr-1 size-3" />
        <Loader2 v-else class="mr-1 size-3 animate-spin" />
        {{ t('server.roleEditor.deleteButton') }}
      </Button>
    </div>

    <Tabs default-value="general" class="flex-1 flex flex-col min-h-0">
      <TabsList class="grid w-full grid-cols-2 shrink-0">
        <TabsTrigger value="general">{{ t('server.roleEditor.tabs.general') }}</TabsTrigger>
        <TabsTrigger value="permissions">{{ t('server.roleEditor.tabs.permissions') }}</TabsTrigger>
      </TabsList>

      <TabsContent value="general" class="space-y-4 mt-4">
        <div class="space-y-2">
          <Label>{{ t('server.roleEditor.roleName') }}</Label>
          <Input v-model="form.name" :placeholder="t('server.roleEditor.roleNamePlaceholder')" />
        </div>
        <div class="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
          <GripVertical class="inline size-4 mr-1 -mt-0.5" />
          {{ t('server.roleEditor.reorderHint') }}
        </div>

        <Button class="w-full" :disabled="!hasNameChanged || isSaving" @click="saveName">
          <Loader2 v-if="isSaving" class="mr-2 size-4 animate-spin" />
          {{ t('server.roleEditor.saveChanges') }}
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
                <p class="font-medium text-sm">
                  {{
                    t(`server.roleEditor.permissions.${permission.code}.label`, permission.label)
                  }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{
                    t(
                      `server.roleEditor.permissions.${permission.code}.description`,
                      permission.description,
                    )
                  }}
                </p>
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
            {{ t('server.roleEditor.savePermissions') }}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
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
import { formatCodeForDisplay } from '@/lib/utils/formatters'

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

const { t } = useI18n()

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
    label: formatCodeForDisplay(PERMISSION_CODES.ADMINISTRATOR),
    description: 'Full access to all server settings and actions',
  },
  {
    code: PERMISSION_CODES.MANAGE_SERVER,
    label: formatCodeForDisplay(PERMISSION_CODES.MANAGE_SERVER),
    description: 'Edit server settings, name, and icon',
  },
  {
    code: PERMISSION_CODES.MANAGE_ROLES,
    label: formatCodeForDisplay(PERMISSION_CODES.MANAGE_ROLES),
    description: 'Create, edit, and delete server roles',
  },
  {
    code: PERMISSION_CODES.MANAGE_INVITES,
    label: formatCodeForDisplay(PERMISSION_CODES.MANAGE_INVITES),
    description: 'Create and revoke invite links',
  },
  {
    code: PERMISSION_CODES.KICK_MEMBERS,
    label: formatCodeForDisplay(PERMISSION_CODES.KICK_MEMBERS),
    description: 'Remove members from the server',
  },
  {
    code: PERMISSION_CODES.MANAGE_NICKNAMES,
    label: formatCodeForDisplay(PERMISSION_CODES.MANAGE_NICKNAMES),
    description: "Change other members' nicknames",
  },
  {
    code: PERMISSION_CODES.VIEW_RESTRICTIONS,
    label: formatCodeForDisplay(PERMISSION_CODES.VIEW_RESTRICTIONS),
    description: 'View member restrictions and bans',
  },
  {
    code: PERMISSION_CODES.MANAGE_RESTRICTIONS,
    label: formatCodeForDisplay(PERMISSION_CODES.MANAGE_RESTRICTIONS),
    description: 'Add and remove member restrictions',
  },
  {
    code: PERMISSION_CODES.CREATE_VIRTUAL_MEMBER,
    label: formatCodeForDisplay(PERMISSION_CODES.CREATE_VIRTUAL_MEMBER),
    description: 'Create placeholder members',
  },
  {
    code: PERMISSION_CODES.MIGRATE_VIRTUAL_MEMBER,
    label: formatCodeForDisplay(PERMISSION_CODES.MIGRATE_VIRTUAL_MEMBER),
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
        toast.success(t('server.roleEditor.toast.roleUpdated'))
        emit('updated')
      },
      onError: () => toast.error(t('server.roleEditor.toast.roleUpdateFailed')),
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
        toast.success(t('server.roleEditor.toast.permissionsUpdated'))
        emit('updated')
      },
      onError: () => toast.error(t('server.roleEditor.toast.permissionsUpdateFailed')),
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
        toast.success(t('server.roleEditor.toast.roleDeleted'))
        emit('deleted')
      },
      onError: () => toast.error(t('server.roleEditor.toast.roleDeleteFailed')),
    },
  )
}
</script>
