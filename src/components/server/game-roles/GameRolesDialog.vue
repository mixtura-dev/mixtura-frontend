<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-4xl! w-full max-h-[85vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>{{ t('server.gameRoles.dialog.title') }}</DialogTitle>
        <DialogDescription>{{ t('server.gameRoles.dialog.description') }}</DialogDescription>
      </DialogHeader>

      <div class="flex flex-1 min-h-0 gap-4">
        <div class="w-72 shrink-0 border-r pr-4 flex flex-col">
          <div v-if="isLoading" class="flex justify-center py-4">
            <Loader2 class="size-5 animate-spin text-muted-foreground" />
          </div>

          <ScrollArea v-else-if="roleSet" class="max-h-[500px]">
            <div
              class="group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted cursor-pointer"
              :class="{
                'bg-muted font-medium': selection?.type === 'roleSet',
              }"
              @click="selectRoleSet"
            >
              <span class="text-sm truncate">{{ roleSet.name }}</span>
              <Button
                variant="ghost"
                size="icon"
                class="size-5 opacity-0 group-hover:opacity-100"
                @click.stop="selectRoleSet"
              >
                <Pencil class="size-3" />
              </Button>
            </div>

            <div class="mt-0.5">
              <button
                v-for="role in roleSet.game_roles"
                :key="role.id"
                class="flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted pl-6"
                :class="{
                  'bg-muted': selection?.type === 'role' && selection?.roleId === role.id,
                }"
                @click="selectRole(role.id)"
              >
                <img
                  v-if="role.icon_url"
                  :src="role.icon_url"
                  class="size-4 rounded-sm shrink-0"
                  alt=""
                />
                <Swords v-else class="size-4 text-muted-foreground shrink-0" />
                <span class="truncate flex-1 text-left">{{ role.name }}</span>
                <Badge
                  v-if="role.hidden"
                  variant="secondary"
                  class="text-[10px] leading-none px-1 py-0"
                >
                  {{ t('server.gameRoles.role.hiddenBadge') }}
                </Badge>
              </button>

              <template v-if="addingRole">
                <div class="pl-4 pr-2 py-2 space-y-2 text-xs border-l-2 border-muted ml-3">
                  <Input
                    v-model="newRoleForm.name"
                    :placeholder="t('server.gameRoles.addRole.namePlaceholder')"
                    class="h-7 text-xs"
                    maxlength="32"
                  />
                  <div class="flex gap-2">
                    <div class="flex items-center gap-1">
                      <span class="text-muted-foreground whitespace-nowrap">{{
                        t('server.gameRoles.role.minInTeam')
                      }}</span>
                      <Input
                        v-model.number="newRoleForm.minInTeam"
                        type="number"
                        min="0"
                        class="h-7 w-14 text-xs"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-muted-foreground whitespace-nowrap">{{
                        t('server.gameRoles.role.maxInTeam')
                      }}</span>
                      <Input
                        v-model.number="newRoleForm.maxInTeam"
                        type="number"
                        min="0"
                        class="h-7 w-14 text-xs"
                      />
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox id="new-hidden" v-model="newRoleForm.hidden" class="size-3.5" />
                    <Label for="new-hidden" class="text-xs text-muted-foreground cursor-pointer">
                      {{ t('server.gameRoles.role.hidden') }}
                    </Label>
                  </div>
                  <div class="flex gap-2 pt-1">
                    <Button variant="ghost" size="sm" class="h-7 text-xs" @click="cancelAddRole">
                      {{ t('server.gameRoles.addRole.cancel') }}
                    </Button>
                    <Button
                      size="sm"
                      class="h-7 text-xs"
                      :disabled="!isAddRoleValid || isCreating"
                      @click="handleCreateRole"
                    >
                      <Loader2 v-if="isCreating" class="size-3 animate-spin mr-1" />
                      {{ t('server.gameRoles.addRole.confirm') }}
                    </Button>
                  </div>
                </div>
              </template>
              <Button
                v-else
                variant="ghost"
                size="sm"
                class="w-full justify-start pl-6 text-muted-foreground h-7"
                @click="startAddRole"
              >
                <Plus class="size-3.5 mr-1" />
                {{ t('server.gameRoles.addRole.button') }}
              </Button>
            </div>
          </ScrollArea>

          <div
            v-else
            class="flex h-full flex-col items-center justify-center text-muted-foreground"
          >
            <Swords class="size-12 mb-3 opacity-50" />
            <p class="text-sm">{{ t('server.gameRoles.dialog.noRoleSets') }}</p>
          </div>
        </div>

        <div class="flex-1 min-w-0 overflow-hidden">
          <GameRoleSetEditor
            v-if="selection?.type === 'roleSet' && roleSet"
            :key="`set-${roleSet.id}`"
            :role-set="roleSet"
            :server-id="serverId"
          />
          <GameRoleEditor
            v-else-if="selection?.type === 'role' && roleSet && selectedRole"
            :key="`role-${selectedRole.id}`"
            :role="selectedRole"
            :role-set-id="roleSet.id"
            :server-id="serverId"
            @deleted="handleRoleDeleted"
          />
          <div
            v-else
            class="flex h-full flex-col items-center justify-center text-muted-foreground"
          >
            <Swords class="size-12 mb-3 opacity-50" />
            <p>{{ t('server.gameRoles.dialog.selectToEdit') }}</p>
            <p class="text-sm">{{ t('server.gameRoles.dialog.orCreateNew') }}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Loader2, Pencil, Plus, Swords } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { components } from '@/types/api'
import type { ServerID } from '@/types/user'
import { useRoleSetQuery, useCreateRoleMutation } from '@/api/queries/server'
import GameRoleSetEditor from './GameRoleSetEditor.vue'
import GameRoleEditor from './GameRoleEditor.vue'

type GameRoleItemResponse = components['schemas']['GameRoleItemResponse']

type Selection = { type: 'roleSet' } | { type: 'role'; roleId: string } | null

const props = defineProps<{
  serverId: ServerID
}>()

const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()

const selection = ref<Selection>({ type: 'roleSet' })
const addingRole = ref(false)

const newRoleForm = reactive({
  name: '',
  minInTeam: 1,
  maxInTeam: 1,
  hidden: false,
})

const { data: roleSet, isLoading } = useRoleSetQuery(() => props.serverId)
const { mutateAsync: createRole, isPending: isCreating } = useCreateRoleMutation()

const selectedRole = computed(() => {
  const sel = selection.value
  if (!sel || sel.type !== 'role') return null
  return roleSet.value?.game_roles.find((r) => r.id === sel.roleId) ?? null
})

const isAddRoleValid = computed(() => {
  const name = newRoleForm.name.trim()
  return (
    name.length > 0 && newRoleForm.minInTeam >= 0 && newRoleForm.maxInTeam >= newRoleForm.minInTeam
  )
})

function selectRoleSet() {
  selection.value = { type: 'roleSet' }
  addingRole.value = false
}

function selectRole(roleId: string) {
  selection.value = { type: 'role', roleId }
  addingRole.value = false
}

function startAddRole() {
  addingRole.value = true
  newRoleForm.name = ''
  newRoleForm.minInTeam = 1
  newRoleForm.maxInTeam = 1
  newRoleForm.hidden = false
}

function cancelAddRole() {
  addingRole.value = false
}

async function handleCreateRole() {
  try {
    const newRole = (await createRole({
      serverId: props.serverId,
      roleSetId: roleSet.value!.id,
      data: {
        name: newRoleForm.name,
        min_in_team: newRoleForm.minInTeam,
        max_in_team: newRoleForm.maxInTeam,
        hidden: newRoleForm.hidden,
      },
    })) as unknown as GameRoleItemResponse

    toast.success(t('server.gameRoles.role.toast.created'))
    cancelAddRole()
    selection.value = {
      type: 'role',
      roleId: newRole.id,
    }
  } catch {
    toast.error(t('server.gameRoles.role.toast.createFailed'))
  }
}

function handleRoleDeleted() {
  if (selection.value?.type === 'role') {
    selection.value = { type: 'roleSet' }
  }
}
</script>
