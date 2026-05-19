import { ref, computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
import type { ServerID } from '@/types/user'
import type { components } from '@/types/api'
import {
  useEventQuery,
  usePlayersQuery,
  useUpdatePlayerRolesMutation,
  useDraftsQuery,
  useCreateDraftMutation,
  useRunTeamFormationMutation,
  useTeamFormationQuery,
  useChooseTeamFormationVariantMutation,
} from '@/api/queries/event'
import { useRoleSetQuery } from '@/api/queries/server/useServerRoles'
import {
  useCreateCustomMutation,
  useUpdateCustomRatingMutation,
} from '@/api/queries/server/useServerRatings'

type EventPlayerResponse = components['schemas']['EventPlayerResponse']
type PlayerRoleResponse = components['schemas']['PlayerRoleResponse']
type CustomRatingResponse = components['schemas']['CustomRatingResponse']
type SelectedGameRoleResponse = components['schemas']['SelectedGameRoleResponse']
type TeamFormationVariantResponse = components['schemas']['TeamFormationVariantResponse']
type TeamFormationJobResponse = components['schemas']['TeamFormationJobResponse']
type CustomResponse = components['schemas']['CustomResponse']

type PlayerStatusFilter = 'ALL' | 'REGISTERED' | 'SELECTED' | 'PLAYING'

export type TeamPlayer = {
  memberId: string
  eventPlayerId: string
  gameRoleId: string
  calculatedRating: number
}

export type TempTeam = {
  teamIndex: number
  name: string
  players: TeamPlayer[]
}

export function useBalancer() {
  const route = useRoute()
  const { t } = useI18n()

  const serverId = computed<ServerID>(() => route.params.serverId as ServerID)
  const eventId = computed(() => route.params.eventId as string)

  // --- Phase state ---
  type Phase = 'config' | 'formation'
  const phase = ref<Phase>('config')

  // --- Data queries ---
  const { data: event, isLoading: eventLoading } = useEventQuery(serverId, eventId)
  const { data: players, isLoading: playersLoading } = usePlayersQuery(serverId, eventId)
  const { data: draftsData } = useDraftsQuery(serverId, eventId)
  const { data: roleSet } = useRoleSetQuery(serverId)

  // --- Game role name map ---
  const gameRoleNameMap = computed(() => {
    const map = new Map<string, string>()
    if (roleSet.value?.game_roles) {
      for (const role of roleSet.value.game_roles) {
        map.set(role.id, role.name)
      }
    }
    return map
  })

  function getRoleName(gameRoleId: string): string {
    return gameRoleNameMap.value.get(gameRoleId) ?? gameRoleId
  }

  // --- Player status filter ---
  const statusFilter = ref<PlayerStatusFilter>('ALL')

  const filteredPlayers = computed(() => {
    if (!players.value) return []
    if (statusFilter.value === 'ALL') return players.value
    return players.value.filter((p) => p.status === statusFilter.value)
  })

  // --- Player configuration state ---
  const playerRoleMap = ref<Record<string, PlayerRoleResponse[]>>({})
  const playerPinMap = ref<Record<string, boolean>>({})
  const playerCustomsMap = ref<Record<string, CustomResponse | null>>({})
  const draftPlayerIds = ref<Set<string>>(new Set())

  function initPlayerFromResponse(p: EventPlayerResponse) {
    if (!(p.id in playerRoleMap.value)) {
      playerRoleMap.value[p.id] = p.roles ? [...p.roles] : []
    }
    if (!(p.id in playerPinMap.value)) {
      playerPinMap.value[p.id] = p.is_draft_pinned
    }
    const memberId = p.member.id
    if (!(memberId in playerCustomsMap.value)) {
      playerCustomsMap.value[memberId] = p.custom ?? null
    }
  }

  watch(
    () => players.value,
    (newPlayers) => {
      if (newPlayers) {
        for (const p of newPlayers) {
          initPlayerFromResponse(p)
        }
      }
    },
    { immediate: true },
  )

  const registeredPlayers = computed(() =>
    (players.value ?? []).filter((p) => p.status === 'REGISTERED'),
  )

  const eventGameRoles = computed(() => event.value?.selected_game_roles ?? [])

  function getGameRoleName(gameRoleId: string): string {
    const found = eventGameRoles.value.find((r) => r.game_role_id === gameRoleId)
    return found?.game_role_id ?? gameRoleId
  }

  function findSelectedGameRole(gameRoleId: string): SelectedGameRoleResponse | undefined {
    return eventGameRoles.value.find((r) => r.game_role_id === gameRoleId)
  }

  // --- Role mutations ---
  const { mutate: updateRoles } = useUpdatePlayerRolesMutation()

  function savePlayerRoles(eventPlayerId: string, memberId: string) {
    const roles = playerRoleMap.value[eventPlayerId]
    if (!roles) return
    updateRoles({
      serverId: serverId.value,
      eventId: eventId.value,
      memberId,
      data: { roles: roles.map((r) => ({ game_role_id: r.game_role_id, priority: r.priority })) },
    })
  }

  function setPlayerRole(playerId: string, gameRoleId: string, priority: number) {
    if (!playerRoleMap.value[playerId]) {
      playerRoleMap.value[playerId] = []
    }
    const existing = playerRoleMap.value[playerId].findIndex((r) => r.game_role_id === gameRoleId)
    if (existing >= 0) {
      playerRoleMap.value[playerId][existing] = { game_role_id: gameRoleId, priority }
    } else {
      playerRoleMap.value[playerId].push({ game_role_id: gameRoleId, priority })
    }
  }

  function removePlayerRole(playerId: string, gameRoleId: string) {
    if (!playerRoleMap.value[playerId]) return
    playerRoleMap.value[playerId] = playerRoleMap.value[playerId].filter(
      (r) => r.game_role_id !== gameRoleId,
    )
  }

  // --- Pin mutations (local-only UI state; no dedicated API endpoint yet) ---

  function togglePin(playerId: string) {
    playerPinMap.value[playerId] = !playerPinMap.value[playerId]
  }

  function toggleDraftPlayer(playerId: string) {
    const set = draftPlayerIds.value
    const newSet = new Set(set)
    if (newSet.has(playerId)) {
      newSet.delete(playerId)
      // Remove from temp teams/unassigned
      for (const team of tempTeams.value) {
        team.players = team.players.filter((p) => p.eventPlayerId !== playerId)
      }
      unassignedPlayers.value = unassignedPlayers.value.filter(
        (p) => p.eventPlayerId !== playerId,
      )
    } else {
      newSet.add(playerId)
      // Add player to unassigned pool
      const ep = players.value?.find((p) => p.id === playerId)
      if (ep) {
        const existing =
          tempTeams.value.some((t) =>
            t.players.some((tp) => tp.eventPlayerId === playerId),
          ) || unassignedPlayers.value.some((p) => p.eventPlayerId === playerId)
        if (!existing) {
          unassignedPlayers.value.push({
            memberId: ep.member.id,
            eventPlayerId: ep.id,
            gameRoleId: '',
            calculatedRating: 0,
          })
        }
      }
    }
    draftPlayerIds.value = newSet
  }

  // --- Customs management ---
  const { mutate: createCustom } = useCreateCustomMutation()
  const { mutate: updateRating } = useUpdateCustomRatingMutation()

  async function ensureCustom(memberId: string): Promise<CustomResponse | null> {
    const existing = playerCustomsMap.value[memberId]
    if (existing) return existing

    return new Promise((resolve) => {
      createCustom(
        { serverId: serverId.value, memberId },
        {
          onSuccess: (data) => {
            const custom = data as unknown as CustomResponse
            playerCustomsMap.value[memberId] = custom
            resolve(custom)
          },
          onError: () => {
            resolve(null)
          },
        },
      )
    })
  }

  function setCustomRating(memberId: string, customId: string, gameRoleId: string, rating: number) {
    updateRating({
      serverId: serverId.value,
      memberId,
      customId,
      gameRoleId,
      data: { rating },
    })
  }

  function getCustomRatingForRole(
    custom: CustomResponse | null | undefined,
    gameRoleId: string,
  ): number | null {
    if (!custom?.custom_ratings) return null
    const entry = custom.custom_ratings.find(
      (cr: CustomRatingResponse) => cr.game_role.id === gameRoleId,
    )
    return entry?.rating ?? null
  }

  function hasCustomRatings(playerId: string): boolean {
    const custom = playerCustomsMap.value[playerId]
    return !!(custom && custom.custom_ratings && custom.custom_ratings.length > 0)
  }

  // --- Draft management ---
  const { mutate: createDraftMut } = useCreateDraftMutation()
  const { mutate: runFormation } = useRunTeamFormationMutation()
  const { mutate: chooseVariant } = useChooseTeamFormationVariantMutation()

  const currentDraftId = ref<string | null>(null)
  const isRunningFormation = ref(false)
  const formationError = ref<string | null>(null)

  // --- Team formation result ---
  const formationJob = ref<TeamFormationJobResponse | null>(null)
  const currentVariantIndex = ref(0)
  const variants = computed(() => formationJob.value?.variants ?? [])
  const currentVariant = computed(() => variants.value[currentVariantIndex.value] ?? null)

  const formationStatus = computed(() => formationJob.value?.status ?? null)

  // --- Polling with refetch ---
  const pollingDraftId = ref<string | null>(null)
  let pollingTimer: ReturnType<typeof setInterval> | null = null

  const {
    data: polledFormation,
    refetch: refetchFormation,
  } = useTeamFormationQuery(serverId, computed(() => pollingDraftId.value ?? ''), undefined)

  watch(polledFormation, (data) => {
    if (data) {
      formationJob.value = data as unknown as TeamFormationJobResponse
      const st = formationJob.value?.status
      if (st && st !== 'PENDING' && st !== 'RUNNING') {
        stopPolling()
        isRunningFormation.value = false
        if (st === 'COMPLETED' || st === 'SUCCESS') {
          phase.value = 'formation'
        } else if (formationJob.value?.error) {
          toast.error(formationJob.value.error)
        }
      }
    }
  })

  function startPolling() {
    if (pollingTimer) return
    pollingTimer = setInterval(() => {
      refetchFormation()
    }, 2000)
  }

  function stopPolling() {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
    if (phase.value !== 'formation') {
      pollingDraftId.value = null
    }
  }

  onUnmounted(() => {
    stopPolling()
  })

  // --- Actions ---
  async function runFormationFlow() {
    isRunningFormation.value = true
    formationError.value = null
    formationJob.value = null
    currentVariantIndex.value = 0

    try {
      // 1. Check for existing draft or create new one
      let draftId: string | null = null
      const existingDrafts = draftsData.value

      if (existingDrafts && existingDrafts.length > 0) {
        const first = existingDrafts[0] as unknown as { id?: string }
        if (first.id) {
          draftId = first.id
        }
      }

      if (!draftId) {
        const draftIds = Array.from(draftPlayerIds.value)
        const hasPinned = draftIds.some((id) => playerPinMap.value[id])

        await new Promise<void>((resolve, reject) => {
          createDraftMut(
            {
              serverId: serverId.value,
              eventId: eventId.value,
              data: {
                player_ids: draftIds.length > 0 ? draftIds : undefined,
                statuses: draftIds.length > 0 ? undefined : ['REGISTERED'],
                pinned_only: hasPinned,
              },
            },
            {
              onSuccess: (data) => {
                const created = data as unknown as { id: string }
                draftId = created.id
                resolve()
              },
              onError: (err) => {
                reject(err)
              },
            },
          )
        })
      }

      if (!draftId) throw new Error('Failed to create draft')

      currentDraftId.value = draftId
      pollingDraftId.value = draftId

      // 2. Build rating snapshot from draft-selected players
      const allPlayers = players.value ?? []
      const draftPlayers = allPlayers.filter((p) => draftPlayerIds.value.has(p.id))
      const teamCount = Math.max(2, Math.ceil(draftPlayers.length / (event.value?.team_size ?? 5)))

      const ratingSnapshot: Array<{
        member_id: string
        event_player_id: string
        game_role_id: string
        priority: number
        open_rating: number
      }> = []

      for (const player of draftPlayers) {
        const roles = playerRoleMap.value[player.id] ?? []
        const custom = playerCustomsMap.value[player.member.id]

        for (const role of roles) {
          const openRating = getCustomRatingForRole(custom, role.game_role_id) ?? 1000
          ratingSnapshot.push({
            member_id: player.member.id,
            event_player_id: player.id,
            game_role_id: role.game_role_id,
            priority: role.priority,
            open_rating: openRating,
          })
        }
      }

      // 3. POST team-formation
      if (!draftId) throw new Error('Draft ID is null')
      const safeDraftId = draftId

      await new Promise<void>((resolve, reject) => {
        runFormation(
          {
            serverId: serverId.value,
            draftId: safeDraftId,
            data: {
              use_effective_rating: false,
              rating_snapshot: ratingSnapshot,
              team_count: teamCount,
            },
          },
          {
            onSuccess: (data) => {
              formationJob.value = data as unknown as TeamFormationJobResponse
              const st = formationJob.value?.status
              if (st !== 'PENDING' && st !== 'RUNNING') {
                isRunningFormation.value = false
                if (st === 'COMPLETED' || st === 'SUCCESS') {
                  phase.value = 'formation'
                }
              } else {
                startPolling()
              }
              resolve()
            },
            onError: (err) => {
              reject(err)
            },
          },
        )
      })
    } catch (err: unknown) {
      formationError.value = err instanceof Error ? err.message : String(err)
      isRunningFormation.value = false
      toast.error(t('server.events.balancer.formationError'))
    }
  }

  // --- Variant navigation ---
  function prevVariant() {
    if (currentVariantIndex.value > 0) {
      currentVariantIndex.value--
    }
  }

  function nextVariant() {
    if (currentVariantIndex.value < variants.value.length - 1) {
      currentVariantIndex.value++
    }
  }

  // --- Choose variant ---
  function chooseCurrentVariant() {
    const variant = currentVariant.value
    if (!variant || !currentDraftId.value) return

    chooseVariant(
      {
        serverId: serverId.value,
        draftId: currentDraftId.value,
        variantId: variant.id,
      },
      {
        onSuccess: () => {
          toast.success(t('server.events.balancer.variantChosen'))
        },
        onError: () => {
          toast.error(t('server.events.balancer.variantError'))
        },
      },
    )
  }

  // --- Temporary team UI state for drag-and-drop ---
  const tempTeams = ref<TempTeam[]>([
    { teamIndex: 0, name: 'Team 1', players: [] },
    { teamIndex: 1, name: 'Team 2', players: [] },
  ])
  const unassignedPlayers = ref<TeamPlayer[]>([])

  function initTeamsFromVariant(variant: TeamFormationVariantResponse) {
    const teams = variant.teams ?? []
    tempTeams.value = teams.map((team) => ({
      teamIndex: team.team_index,
      name: team.name,
      players: team.event_player_ids.map((epId, idx) => ({
        memberId: team.member_ids[idx] ?? '',
        eventPlayerId: epId,
        gameRoleId: team.game_role_ids[idx] ?? '',
        calculatedRating: team.calculated_ratings[idx] ?? 0,
      })),
    }))
    unassignedPlayers.value = []
  }

  watch(currentVariant, (variant) => {
    if (variant && phase.value === 'formation') {
      initTeamsFromVariant(variant)
    }
  })

  function getPlayerNickname(eventPlayerId: string): string {
    const player = players.value?.find((p) => p.id === eventPlayerId)
    return player?.member.nickname ?? eventPlayerId
  }

  function getPlayerNicknameByMemberId(memberId: string): string {
    const player = players.value?.find((p) => p.member.id === memberId)
    return player?.member.nickname ?? memberId
  }

  // --- Team DnD operations ---
  function movePlayerToUnassigned(teamIndex: number, playerIndex: number) {
    const team = tempTeams.value[teamIndex]
    if (!team) return
    const [player] = team.players.splice(playerIndex, 1)
    if (player) {
      unassignedPlayers.value.push(player)
    }
  }

  function movePlayerToTeam(fromTeamIndex: number, playerIndex: number, toTeamIndex: number) {
    const fromTeam = tempTeams.value[fromTeamIndex]
    const toTeam = tempTeams.value[toTeamIndex]
    if (!fromTeam || !toTeam) return
    const [player] = fromTeam.players.splice(playerIndex, 1)
    if (player) {
      toTeam.players.push(player)
    }
  }

  function swapPlayers(
    teamAIndex: number,
    playerAIndex: number,
    teamBIndex: number,
    playerBIndex: number,
  ) {
    const teamA = tempTeams.value[teamAIndex]
    const teamB = tempTeams.value[teamBIndex]
    if (!teamA || !teamB) return
    const playerA = teamA.players[playerAIndex]
    const playerB = teamB.players[playerBIndex]
    if (playerA && playerB) {
      teamA.players[playerAIndex] = playerB
      teamB.players[playerBIndex] = playerA
    }
  }

  function moveUnassignedToTeam(unassignedIndex: number, teamIndex: number) {
    const team = tempTeams.value[teamIndex]
    if (!team) return
    const [player] = unassignedPlayers.value.splice(unassignedIndex, 1)
    if (player) {
      team.players.push(player)
    }
  }

  function backToConfig() {
    phase.value = 'config'
    currentDraftId.value = null
    formationJob.value = null
    currentVariantIndex.value = 0
    tempTeams.value = []
    unassignedPlayers.value = []
    stopPolling()
  }

  const isLoading = computed(() => eventLoading.value || playersLoading.value)

  return {
    serverId,
    eventId,
    event,
    players,
    filteredPlayers,
    registeredPlayers,
    eventGameRoles,
    isLoading,
    isRunningFormation,
    formationError,
    phase,
    statusFilter,
    playerRoleMap,
    playerPinMap,
    playerCustomsMap,
    setPlayerRole,
    removePlayerRole,
    savePlayerRoles,
    togglePin,
    toggleDraftPlayer,
    draftPlayerIds,
    ensureCustom,
    setCustomRating,
    getCustomRatingForRole,
    hasCustomRatings,
    findSelectedGameRole,
    runFormationFlow,
    formationJob,
    formationStatus,
    currentDraftId,
    currentVariantIndex,
    currentVariant,
    variants,
    prevVariant,
    nextVariant,
    chooseCurrentVariant,
    tempTeams,
    unassignedPlayers,
    getPlayerNickname,
    getPlayerNicknameByMemberId,
    getGameRoleName,
    getRoleName,
    gameRoleNameMap,
    movePlayerToUnassigned,
    movePlayerToTeam,
    swapPlayers,
    moveUnassignedToTeam,
    backToConfig,
  }
}
