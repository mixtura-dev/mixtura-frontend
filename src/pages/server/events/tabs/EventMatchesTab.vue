<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Loader2, Play, ChevronLeft, ChevronRight, Pin, PinOff, Check, Plus, UserPlus } from 'lucide-vue-next'
import { DnDProvider, type IDragEvent } from '@vue-dnd-kit/core'
import { Button } from '@/components/ui/button'
import { useBalancer } from '@/composables/useBalancer'
import PlayerConfigPopover from '@/components/balancer/PlayerConfigPopover.vue'
import BalancerTeamDrop from '@/components/balancer/BalancerTeamDrop.vue'
import BalancerUnassignedDrop from '@/components/balancer/BalancerUnassignedDrop.vue'
import AddPlayerModal from '@/components/balancer/AddPlayerModal.vue'
import { handleDropOnTeam as dropOnTeam, handleDropOnUnassigned as dropOnUnassigned } from '@/composables/useBalancerDnd'

const { t } = useI18n()
const {
  serverId,
  eventId,
  event,
  filteredPlayers,
  eventGameRoles,
  isLoading,
  isRunningFormation,
  formationError,
  statusFilter,
  playerRoleMap,
  playerPinMap,
  playerCustomsMap,
  savePlayerRoles,
  togglePin,
  toggleDraftPlayer,
  draftPlayerIds,
  ensureCustom,
  setCustomRating,
  hasCustomRatings,
  runFormationFlow,
  currentVariant,
  currentVariantIndex,
  variants,
  formationStatus,
  prevVariant,
  nextVariant,
  chooseCurrentVariant,
  tempTeams,
  unassignedPlayers,
  getPlayerNickname,
  getRoleName,
  gameRoleNameMap,
  movePlayerToUnassigned,
  moveUnassignedToTeam,
} = useBalancer()

const configOpenPlayerId = ref<string | null>(null)
const showAddPlayerModal = ref(false)

function handleConfigOpenChange(val: boolean, playerId: string) {
  if (val) {
    configOpenPlayerId.value = playerId
    const player = filteredPlayers.value.find((p) => p.id === playerId)
    if (player) ensureCustom(player.member.id)
  } else {
    configOpenPlayerId.value = null
  }
}

const statusFilterOptions = [
  { value: 'ALL', label: 'common.all' },
  { value: 'REGISTERED', label: 'server.events.balancer.statusRegistered' },
  { value: 'SELECTED', label: 'server.events.balancer.statusSelected' },
  { value: 'PLAYING', label: 'server.events.balancer.statusPlaying' },
] as const

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleSaveRoles(playerId: string, _roles: Array<{ game_role_id: string; priority: number }>) {
  const player = filteredPlayers.value.find((p) => p.id === playerId)
  if (player) savePlayerRoles(playerId, player.member.id)
}

function handleUpdateRating(memberId: string, customId: string, gameRoleId: string, rating: number) {
  setCustomRating(memberId, customId, gameRoleId, rating)
}

function handleCreateCustom(memberId: string) {
  ensureCustom(memberId)
}

const variantMetrics = computed(() => currentVariant.value?.metrics ?? null)

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

const draftCount = computed(() => draftPlayerIds.value.size)

function handleDropOnTeam(e: IDragEvent, targetTeamIndex: number) {
  dropOnTeam(e, targetTeamIndex, tempTeams, unassignedPlayers, moveUnassignedToTeam)
}

function handleDropOnUnassigned(e: IDragEvent) {
  dropOnUnassigned(e, tempTeams, movePlayerToUnassigned)
}
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center py-16">
    <Loader2 class="size-8 animate-spin text-muted-foreground" />
  </div>

  <div v-else-if="!event" class="flex items-center justify-center py-16">
    <p class="text-muted-foreground">{{ t('server.events.detail.notFound') }}</p>
  </div>

  <div v-else class="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 h-full min-h-0">
    <!-- ===== LEFT: Player Pool ===== -->
    <div class="flex flex-col min-h-0">
      <!-- Filters -->
      <div class="flex items-center gap-0.5 mb-2 flex-wrap">
        <button
          v-for="opt in statusFilterOptions"
          :key="opt.value"
          class="px-1.5 py-0.5 text-[11px] font-medium rounded-sm transition-colors"
          :class="
            statusFilter === opt.value
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          "
          @click="statusFilter = opt.value"
        >
          {{ t(opt.label) }}
        </button>
        <span class="ml-auto text-[11px] text-muted-foreground tabular-nums">
          {{ filteredPlayers.length }}
        </span>
        <Button
          variant="ghost"
          size="icon"
          class="size-6"
          aria-label="Add player"
          @click="showAddPlayerModal = true"
        >
          <Plus class="size-3.5" />
        </Button>
      </div>

      <!-- Player list -->
      <div class="flex-1 overflow-y-auto space-y-1 pr-1">
        <div
          v-for="player in filteredPlayers"
          :key="player.id"
          class="flex items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent/50 transition-colors group/player select-none cursor-pointer"
          :class="{ 'bg-primary/5 ring-1 ring-primary/20': draftPlayerIds.has(player.id) }"
          @dblclick="toggleDraftPlayer(player.id)"
        >
          <!-- Pin -->
          <button
            class="shrink-0 p-0.5 rounded transition-colors"
            :class="
              playerPinMap[player.id]
                ? 'text-amber-500'
                : 'text-muted-foreground/30 group-hover/player:text-muted-foreground'
            "
            aria-label="Toggle pin"
            @click="togglePin(player.id)"
          >
            <Pin v-if="playerPinMap[player.id]" class="size-3.5" />
            <PinOff v-else class="size-3.5" />
          </button>

          <!-- Add to lobby -->
          <button
            class="shrink-0 p-0.5 rounded transition-colors"
            :class="
              draftPlayerIds.has(player.id)
                ? 'text-primary'
                : 'text-muted-foreground/30 group-hover/player:text-muted-foreground'
            "
            :aria-label="draftPlayerIds.has(player.id) ? 'Remove from lobby' : 'Add to lobby'"
            @click="toggleDraftPlayer(player.id)"
          >
            <UserPlus class="size-3.5" />
          </button>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium truncate">{{ player.member.nickname }}</p>
            <div class="flex items-center gap-1 mt-0.5 min-h-[16px]">
              <span
                v-for="(role, idx2) in playerRoleMap[player.id] ?? []"
                :key="role.game_role_id + '-' + idx2"
                class="text-[10px] text-muted-foreground"
              >
                {{ getRoleName(role.game_role_id) }}
                <span class="tabular-nums">P{{ role.priority }}</span>
              </span>
              <span
                v-if="hasCustomRatings(player.member.id)"
                class="size-1.5 rounded-full bg-emerald-500 shrink-0"
                :title="String(t('server.events.balancer.hasCustomRatings'))"
              />
            </div>
          </div>

          <!-- Config popover -->
          <PlayerConfigPopover
            :player="player"
            :game-roles="eventGameRoles"
            :role-priorities="playerRoleMap[player.id] ?? []"
            :player-custom="playerCustomsMap[player.member.id] ?? null"
            :open="configOpenPlayerId === player.id"
            :role-name-map="gameRoleNameMap"
            @update:open="(val: boolean) => handleConfigOpenChange(val, player.id)"
            @save-roles="handleSaveRoles"
            @update-rating="handleUpdateRating"
            @create-custom="handleCreateCustom"
          />
        </div>

        <p v-if="filteredPlayers.length === 0" class="text-center text-muted-foreground py-8 text-sm">
          {{ t('server.events.balancer.noPlayers') }}
        </p>
      </div>
    </div>

    <!-- ===== RIGHT: Lobby & Match ===== -->
    <div class="flex flex-col border-l pl-4 min-h-0">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-2">
        <Button size="sm" class="flex-1" :disabled="isRunningFormation || draftCount === 0" @click="runFormationFlow()">
          <Loader2 v-if="isRunningFormation" class="mr-1.5 size-3.5 animate-spin" />
          <Play v-else class="mr-1.5 size-3.5" />
          {{ t('server.events.balancer.runFormation') }}
        </Button>
        <span class="text-[11px] text-muted-foreground tabular-nums shrink-0">
          {{ draftCount }} {{ t('server.events.balancer.inLobby') }}
        </span>
      </div>

      <p v-if="formationError" class="text-xs text-destructive mb-2">{{ formationError }}</p>

      <!-- Formation loading -->
      <div
        v-if="formationStatus === 'PENDING' || formationStatus === 'RUNNING'"
        class="flex flex-col items-center justify-center gap-3 flex-1"
      >
        <Loader2 class="size-8 animate-spin text-primary" />
        <span class="text-sm text-muted-foreground">{{ t('server.events.balancer.formationRunning') }}</span>
      </div>

      <!-- Variant navigation (when formation done) -->
      <template v-else-if="variants.length > 0 && currentVariant">
        <div class="flex items-center justify-center gap-2 mb-2">
          <Button variant="outline" size="icon" class="size-7" :disabled="currentVariantIndex <= 0" @click="prevVariant">
            <ChevronLeft class="size-3.5" />
          </Button>
          <span class="text-xs font-medium tabular-nums">{{ currentVariantIndex + 1 }} / {{ variants.length }}</span>
          <Button
            variant="outline"
            size="icon"
            class="size-7"
            :disabled="currentVariantIndex >= variants.length - 1"
            @click="nextVariant"
          >
            <ChevronRight class="size-3.5" />
          </Button>
        </div>

        <div v-if="variantMetrics" class="flex flex-wrap gap-1 justify-center mb-2">
          <span
            class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-muted/50 tabular-nums"
            :class="variantMetrics.strength_diff < 100 ? 'text-emerald-500' : 'text-amber-500'"
          >
            {{ t('server.events.balancer.balanceScore') }} {{ variantMetrics.strength_diff.toFixed(0) }}
          </span>
          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-muted/50 tabular-nums text-emerald-500">
            {{ t('server.events.balancer.roleFit') }} {{ formatPercent(variantMetrics.role_fit) }}
          </span>
          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-muted/50 tabular-nums">
            {{ t('server.events.balancer.ratingSpread') }} {{ variantMetrics.rating_spread.toFixed(0) }}
          </span>
          <span
            v-if="variantMetrics.constraint_violations > 0"
            class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-destructive/10 tabular-nums text-destructive"
          >
            {{ t('server.events.balancer.constraintViolations') }} {{ variantMetrics.constraint_violations }}
          </span>
        </div>

        <Button size="sm" variant="outline" class="w-full mb-2 text-[11px]" @click="chooseCurrentVariant">
          <Check class="mr-1 size-3" />
          {{ t('server.events.balancer.chooseVariant') }}
        </Button>
      </template>

      <!-- LOBBY: always visible (teams + unassigned) -->
      <div class="flex-1 overflow-y-auto min-h-[200px]">
        <DnDProvider>
          <div class="grid grid-cols-2 gap-2 mb-2">
            <BalancerTeamDrop
              v-for="(team, tIdx) in tempTeams"
              :key="team.teamIndex"
              :team="team"
              :team-index="tIdx"
              :get-player-nickname="getPlayerNickname"
              :get-game-role-name="getRoleName"
              @drop="handleDropOnTeam"
              @remove-player="(idx: number) => movePlayerToUnassigned(tIdx, idx)"
            />
          </div>

          <BalancerUnassignedDrop
            :players="unassignedPlayers"
            :get-player-nickname="getPlayerNickname"
            :get-game-role-name="getRoleName"
            @drop="handleDropOnUnassigned"
          />
        </DnDProvider>

        <p
          v-if="draftCount === 0 && unassignedPlayers.length === 0"
          class="text-center text-xs text-muted-foreground pt-8"
        >
          {{ t('server.events.balancer.lobbyHint') }}
        </p>
      </div>

      <p v-if="formationStatus && formationStatus !== 'PENDING' && formationStatus !== 'RUNNING' && variants.length === 0" class="text-xs text-muted-foreground text-center pt-2">
        {{ t('server.events.balancer.noVariants') }}
      </p>
    </div>
  </div>

  <AddPlayerModal v-model:open="showAddPlayerModal" :server-id="serverId" :event-id="eventId" />
</template>
