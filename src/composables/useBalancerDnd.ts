import type { Ref } from 'vue'
import type { IDragEvent } from '@vue-dnd-kit/core'
import type { TempTeam, TeamPlayer } from '@/composables/useBalancer'

export function handleDropOnTeam(
  e: IDragEvent,
  targetTeamIndex: number,
  tempTeams: Ref<TempTeam[]>,
  unassignedPlayers: Ref<TeamPlayer[]>,
  moveUnassignedToTeam: (unassignedIndex: number, teamIndex: number) => void,
) {
  const srcItems = e.draggedItems[0]?.items as TeamPlayer[] | undefined
  if (!srcItems) return

  const srcTeamIndex = tempTeams.value.findIndex((t) => t.players === srcItems)
  const srcIsUnassigned = unassignedPlayers.value === srcItems

  // Same-team: use suggestSort for reorder/swap
  if (srcTeamIndex === targetTeamIndex && !srcIsUnassigned) {
    const result = e.helpers.suggestSort('vertical')
    if (!result) return
    tempTeams.value[targetTeamIndex].players = result.sourceItems as TeamPlayer[]
    return
  }

  // Cross-team: swap if hovering over a player, otherwise move
  if (srcIsUnassigned) {
    const srcIdx = unassignedPlayers.value.findIndex((p) => srcItems.includes(p))
    if (srcIdx >= 0) moveUnassignedToTeam(srcIdx, targetTeamIndex)
  } else if (srcTeamIndex >= 0) {
    const hoveredItems = e.hoveredDraggable?.items
    const isCrossSwap = hoveredItems !== undefined && hoveredItems !== srcItems

    if (isCrossSwap) {
      const result = e.helpers.suggestSwap()
      if (!result) return
      tempTeams.value[srcTeamIndex].players = result.sourceItems as TeamPlayer[]
      if (!result.sameList) {
        tempTeams.value[targetTeamIndex].players = result.targetItems as TeamPlayer[]
      }
    } else {
      const result = e.helpers.suggestSort('vertical')
      if (!result) return
      tempTeams.value[srcTeamIndex].players = result.sourceItems as TeamPlayer[]
      if (!result.sameList) {
        tempTeams.value[targetTeamIndex].players = result.targetItems as TeamPlayer[]
      }
    }
  }
}

export function handleDropOnUnassigned(
  e: IDragEvent,
  tempTeams: Ref<TempTeam[]>,
  movePlayerToUnassigned: (teamIndex: number, playerIndex: number) => void,
) {
  const srcItems = e.draggedItems[0]?.items as TeamPlayer[] | undefined
  if (!srcItems) return
  const srcTeamIndex = tempTeams.value.findIndex((t) => t.players === srcItems)
  if (srcTeamIndex < 0) return
  const srcTeam = tempTeams.value[srcTeamIndex]
  const srcIdx = srcTeam.players.findIndex((p) => srcItems.includes(p))
  if (srcIdx >= 0) movePlayerToUnassigned(srcTeamIndex, srcIdx)
}
