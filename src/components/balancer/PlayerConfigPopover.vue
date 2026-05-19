<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Settings2, Plus, Check, Loader2 } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { components } from '@/types/api'

type EventPlayerResponse = components['schemas']['EventPlayerResponse']
type PlayerRoleResponse = components['schemas']['PlayerRoleResponse']
type SelectedGameRoleResponse = components['schemas']['SelectedGameRoleResponse']
type CustomResponse = components['schemas']['CustomResponse']

interface Props {
  player: EventPlayerResponse
  gameRoles: SelectedGameRoleResponse[]
  rolePriorities: PlayerRoleResponse[]
  playerCustom: CustomResponse | null
  open: boolean
  roleNameMap: Map<string, string>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  saveRoles: [playerId: string, roles: Array<{ game_role_id: string; priority: number }>]
  updateRating: [memberId: string, customId: string, gameRoleId: string, rating: number]
  createCustom: [memberId: string]
}>()

const localOpen = ref(false)

watch(() => props.open, (val) => { localOpen.value = val })
watch(localOpen, (val) => { emit('update:open', val) })

const { t } = useI18n()

const localRoles = ref<Record<string, number>>({})

watch(
  () => props.rolePriorities,
  (roles) => {
    const map: Record<string, number> = {}
    for (const r of roles) {
      map[r.game_role_id] = r.priority
    }
    localRoles.value = map
  },
  { immediate: true },
)

const localRatings = ref<Record<string, number>>({})

watch(
  () => props.playerCustom,
  (custom) => {
    const map: Record<string, number> = {}
    if (custom?.custom_ratings) {
      for (const cr of custom.custom_ratings) {
        map[cr.game_role.id] = cr.rating
      }
    }
    localRatings.value = map
  },
  { immediate: true },
)

function getPriority(gameRoleId: string): number {
  return localRoles.value[gameRoleId] ?? 1
}

function setPriority(gameRoleId: string, value: string | number) {
  const num = Number(value)
  if (!isNaN(num) && num >= 0) {
    localRoles.value[gameRoleId] = num
  }
}

function getRating(gameRoleId: string): number | null {
  return localRatings.value[gameRoleId] ?? null
}

function setRating(gameRoleId: string, value: string | number) {
  const num = Number(value)
  if (!isNaN(num) && num >= 0) {
    localRatings.value[gameRoleId] = num
  }
}

function handleSaveRating(gameRoleId: string) {
  const custom = props.playerCustom
  if (!custom) return
  const rating = localRatings.value[gameRoleId]
  if (rating !== undefined) {
    emit('updateRating', props.player.member.id, custom.id, gameRoleId, rating)
  }
}

function handleSaveRoles() {
  const roles = props.gameRoles
    .map((r) => ({
      game_role_id: r.game_role_id,
      priority: localRoles.value[r.game_role_id] ?? 1,
    }))
    .filter((r) => r.priority > 0)
  emit('saveRoles', props.player.id, roles)
}

function handleCreateCustom() {
  emit('createCustom', props.player.member.id)
}

function getRoleLabel(gameRoleId: string): string {
  return props.roleNameMap.get(gameRoleId) ?? gameRoleId
}

const hasCustom = computed(() => !!props.playerCustom)

const isLoadingCustom = ref(false)

watch(localOpen, (open) => {
  if (open && !hasCustom.value) {
    isLoadingCustom.value = true
  }
  if (!open) {
    isLoadingCustom.value = false
  }
})

watch(hasCustom, (val) => {
  if (val) {
    isLoadingCustom.value = false
  }
})
</script>

<template>
  <Popover v-model:open="localOpen">
    <PopoverTrigger as-child>
      <Button variant="ghost" size="icon" class="size-7">
        <Settings2 class="size-3.5" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80" side="left" align="start">
      <div class="space-y-3">
        <p class="text-sm font-semibold leading-none">
          {{ player.member.nickname }}
        </p>

        <!-- Loading state: only spinner, no UI -->
        <template v-if="isLoadingCustom">
          <div class="flex items-center gap-2 text-xs text-muted-foreground py-4 justify-center">
            <Loader2 class="size-4 animate-spin shrink-0" />
            {{ t('server.events.balancer.loadingCustom') }}
          </div>
        </template>

        <!-- Content ready -->
        <template v-else>
          <!-- No custom -->
          <template v-if="!hasCustom">
            <p class="text-xs text-muted-foreground">
              {{ t('server.events.balancer.noCustomYet') }}
            </p>
            <Button variant="outline" size="sm" class="w-full" @click="handleCreateCustom">
              <Plus class="mr-1.5 size-3.5" />
              {{ t('server.events.balancer.createCustom') }}
            </Button>
          </template>

          <!-- Column headers -->
          <div class="grid grid-cols-[1fr_52px_68px] gap-2 items-end">
            <span class="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
              {{ t('server.events.balancer.roleHeader') }}
            </span>
            <span class="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider text-center">
              # {{ t('server.events.balancer.priorityHeader') }}
            </span>
            <span class="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider text-center">
              {{ t('server.events.balancer.ratingHeader') }}
            </span>
          </div>

          <!-- Role rows -->
          <div class="space-y-1.5">
            <div
              v-for="sgRole in gameRoles"
              :key="sgRole.id"
              class="grid grid-cols-[1fr_52px_68px] gap-2 items-center"
            >
              <span class="text-sm truncate">{{ getRoleLabel(sgRole.game_role_id) }}</span>

              <Input
                type="number"
                min="0"
                max="99"
                class="h-8 text-center text-xs px-1"
                placeholder="1"
                :model-value="getPriority(sgRole.game_role_id)"
                @update:model-value="(v: string | number) => setPriority(sgRole.game_role_id, v)"
              />

              <template v-if="hasCustom">
                <Input
                  type="number"
                  min="0"
                  class="h-8 text-center text-xs px-1"
                  placeholder="—"
                  :model-value="getRating(sgRole.game_role_id) ?? ''"
                  @update:model-value="(v: string | number) => setRating(sgRole.game_role_id, v)"
                  @blur="handleSaveRating(sgRole.game_role_id)"
                  @keyup.enter="handleSaveRating(sgRole.game_role_id)"
                />
              </template>
              <div v-else class="h-8 flex items-center justify-center text-xs text-muted-foreground/30">
                —
              </div>
            </div>
          </div>

          <Button size="sm" class="w-full" @click="handleSaveRoles">
            <Check class="mr-1.5 size-3.5" />
            {{ t('server.events.balancer.saveRoles') }}
          </Button>
        </template>
      </div>
    </PopoverContent>
  </Popover>
</template>
