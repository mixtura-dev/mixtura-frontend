<!-- components/server/roles/RoleEditor.vue -->
<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-medium">{{ role.name }}</h3>
      <Button variant="destructive" size="sm" :disabled="isDeleting" @click="handleDelete">
        <Trash2 v-if="!isDeleting" class="mr-1 size-3" />
        <Loader2 v-else class="mr-1 size-3 animate-spin" />
        Delete
      </Button>
    </div>

    <Tabs default-value="general">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="general" class="space-y-4 mt-4">
        <!-- Role Name -->
        <div class="space-y-2">
          <Label>Role Name</Label>
          <Input v-model="form.name" placeholder="Role name" />
        </div>

        <!-- Role Icon -->
        <div class="space-y-2">
          <Label>Icon</Label>
          <div class="flex items-center gap-3">
            <Avatar class="size-12">
              <AvatarImage v-if="role.icon_url" :src="role.icon_url" />
              <AvatarFallback>
                {{ role.name.charAt(0).toUpperCase() }}
              </AvatarFallback>
            </Avatar>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="triggerIconUpload">
                <Upload class="mr-1 size-3" />
                Upload
              </Button>
              <Button v-if="role.icon_url" variant="outline" size="sm" @click="handleRemoveIcon">
                <X class="mr-1 size-3" />
                Remove
              </Button>
            </div>
            <input
              ref="iconInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleIconUpload"
            />
          </div>
        </div>

        <Button class="w-full" :disabled="!hasGeneralChanges || isSaving" @click="saveGeneral">
          <Loader2 v-if="isSaving" class="mr-2 size-4 animate-spin" />
          Save Changes
        </Button>
      </TabsContent>

      <TabsContent value="settings" class="space-y-4 mt-4">
        <!-- Min in Team -->
        <div class="space-y-2">
          <Label>Minimum in Team</Label>
          <Input v-model.number="form.min_in_team" type="number" :min="0" />
        </div>

        <!-- Max in Team -->
        <div class="space-y-2">
          <Label>Maximum in Team</Label>
          <Input v-model.number="form.max_in_team" type="number" :min="0" />
        </div>

        <!-- Hidden -->
        <div class="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p class="font-medium text-sm">Hidden</p>
            <p class="text-xs text-muted-foreground">Hide this role from public view</p>
          </div>
          <Switch v-model:checked="form.hidden" />
        </div>

        <Button
          class="w-full"
          :disabled="!hasSettingsChanges || isSavingSettings"
          @click="saveSettings"
        >
          <Loader2 v-if="isSavingSettings" class="mr-2 size-4 animate-spin" />
          Save Settings
        </Button>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Trash2, Upload, X } from 'lucide-vue-next'

import type { ServerID } from '@/types/user'
import {
  useDeleteRoleIconMutation,
  useDeleteRoleMutation,
  useUpdateRoleIconMutation,
  useUpdateRoleMutation,
} from '@/api/queries/server'

interface GameRole {
  id: string
  name: string
  icon_url?: string | null
  min_in_team: number
  max_in_team: number
  hidden: boolean
}

const props = defineProps<{
  role: GameRole
  serverId: ServerID
  roleSetId: string
}>()

const emit = defineEmits<{
  updated: []
  deleted: []
}>()

const iconInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  name: props.role.name,
  min_in_team: props.role.min_in_team,
  max_in_team: props.role.max_in_team,
  hidden: props.role.hidden,
})

const { mutate: updateRole, isPending: isSaving } = useUpdateRoleMutation()
const { mutate: deleteRole, isPending: isDeleting } = useDeleteRoleMutation()
const { mutate: updateIcon } = useUpdateRoleIconMutation()
const { mutate: deleteIcon } = useDeleteRoleIconMutation()

const isSavingSettings = ref(false)

const hasGeneralChanges = computed(() => form.name !== props.role.name)

const hasSettingsChanges = computed(
  () =>
    form.min_in_team !== props.role.min_in_team ||
    form.max_in_team !== props.role.max_in_team ||
    form.hidden !== props.role.hidden,
)

watch(
  () => props.role,
  (newRole) => {
    form.name = newRole.name
    form.min_in_team = newRole.min_in_team
    form.max_in_team = newRole.max_in_team
    form.hidden = newRole.hidden
  },
  { deep: true },
)

function saveGeneral() {
  updateRole(
    {
      serverId: props.serverId,
      roleSetId: props.roleSetId,
      roleId: props.role.id,
      data: { name: form.name },
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

function saveSettings() {
  isSavingSettings.value = true
  updateRole(
    {
      serverId: props.serverId,
      roleSetId: props.roleSetId,
      roleId: props.role.id,
      data: {
        min_in_team: form.min_in_team,
        max_in_team: form.max_in_team,
        hidden: form.hidden,
      },
    },
    {
      onSuccess: () => {
        toast.success('Settings updated')
        emit('updated')
      },
      onError: () => toast.error('Failed to update settings'),
      onSettled: () => {
        isSavingSettings.value = false
      },
    },
  )
}

function handleDelete() {
  deleteRole(
    {
      serverId: props.serverId,
      roleSetId: props.roleSetId,
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

function triggerIconUpload() {
  iconInput.value?.click()
}

function handleIconUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  updateIcon(
    {
      serverId: props.serverId,
      roleSetId: props.roleSetId,
      roleId: props.role.id,
      icon: file,
    },
    {
      onSuccess: () => {
        toast.success('Icon updated')
        emit('updated')
      },
      onError: () => toast.error('Failed to update icon'),
    },
  )
}

function handleRemoveIcon() {
  deleteIcon(
    {
      serverId: props.serverId,
      roleSetId: props.roleSetId,
      roleId: props.role.id,
    },
    {
      onSuccess: () => {
        toast.success('Icon removed')
        emit('updated')
      },
      onError: () => toast.error('Failed to remove icon'),
    },
  )
}
</script>
