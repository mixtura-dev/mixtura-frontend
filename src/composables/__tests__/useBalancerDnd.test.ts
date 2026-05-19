import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, type Ref } from 'vue'
import type { IDragEvent, ISuggestSortResult, ISuggestSwapResult } from '@vue-dnd-kit/core'
import { handleDropOnTeam, handleDropOnUnassigned } from '@/composables/useBalancerDnd'
import type { TempTeam, TeamPlayer } from '@/composables/useBalancer'

function makePlayer(id: string, memberId?: string): TeamPlayer {
  return {
    memberId: memberId ?? `m-${id}`,
    eventPlayerId: id,
    gameRoleId: 'role-1',
    calculatedRating: 1000,
  }
}

function suggestSortMock(
  _orientation: string,
  options: {
    srcList: TeamPlayer[]
    targetList: TeamPlayer[]
    dragIndex: number
    insertIndex: number
  },
): ISuggestSortResult {
  const { srcList, targetList, dragIndex, insertIndex } = options
  const sameList = srcList === targetList

  const dragged = srcList.slice(dragIndex, dragIndex + 1)

  if (sameList) {
    const items = [...srcList]
    items.splice(dragIndex, 1)
    items.splice(insertIndex, 0, ...dragged)
    return {
      sourceItems: items as unknown[],
      targetItems: items as unknown[],
      draggedItems: dragged as unknown[],
      sourceIndexes: [dragIndex],
      targetIndex: insertIndex,
      mode: 'insert',
      sameList: true,
    }
  }

  const sourceItems = [...srcList]
  sourceItems.splice(dragIndex, 1)
  const targetItems = [...targetList]
  targetItems.splice(insertIndex, 0, ...dragged)

  return {
    sourceItems: sourceItems as unknown[],
    targetItems: targetItems as unknown[],
    draggedItems: dragged as unknown[],
    sourceIndexes: [dragIndex],
    targetIndex: insertIndex,
    mode: 'insert',
    sameList: false,
  }
}

function suggestSwapMock(
  srcList: TeamPlayer[],
  targetList: TeamPlayer[],
  dragIndex: number,
  hoverIndex: number,
): ISuggestSwapResult {
  const sameList = srcList === targetList
  const dragged = srcList[dragIndex]
  const hovered = targetList[hoverIndex]

  const sourceItems = [...srcList]
  sourceItems[dragIndex] = hovered

  const targetItems = [...targetList]
  targetItems[hoverIndex] = dragged

  return {
    sourceItems: sourceItems as unknown[],
    targetItems: targetItems as unknown[],
    sourceIndexes: [dragIndex],
    targetIndex: hoverIndex,
    sameList,
  }
}

function createDragEvent(
  src: { list: TeamPlayer[]; index: number },
  suggestSortFn: (orientation: string) => ISuggestSortResult,
  hover?: { items: TeamPlayer[]; index: number } | null,
  dropItems?: TeamPlayer[],
  suggestSwapFn?: () => ISuggestSwapResult,
): IDragEvent {
  return {
    draggedItems: [
      {
        index: src.index,
        item: src.list[src.index],
        items: src.list as unknown[],
      },
    ],
    dropZone: {
      items: (dropItems ?? hover?.items ?? []) as unknown[],
      placement: undefined,
    },
    hoveredDraggable: hover
      ? ({
          items: hover.items as unknown[],
          index: hover.index,
        } as unknown as IDragEvent['hoveredDraggable'])
      : undefined,
    helpers: {
      suggestSort: vi.fn(suggestSortFn),
      suggestSwap: vi.fn(suggestSwapFn ?? vi.fn()),
      suggestCopy: vi.fn(),
      suggestRemove: vi.fn(),
    },
    provider: undefined as unknown as IDragEvent['provider'],
  } as unknown as IDragEvent
}

function makeEmptyDragEvent(): IDragEvent {
  return {
    draggedItems: [],
    dropZone: undefined as unknown as IDragEvent['dropZone'],
    hoveredDraggable: undefined,
    helpers: {
      suggestSort: vi.fn(),
      suggestSwap: vi.fn(),
      suggestCopy: vi.fn(),
      suggestRemove: vi.fn(),
    },
    provider: undefined as unknown as IDragEvent['provider'],
  } as unknown as IDragEvent
}

function makeSimpleDragEvent(
  srcList: TeamPlayer[],
  index: number,
  item?: TeamPlayer,
): IDragEvent {
  return {
    draggedItems: [{ index, item: item ?? srcList[index], items: srcList as unknown[] }],
    dropZone: undefined as unknown as IDragEvent['dropZone'],
    hoveredDraggable: undefined,
    helpers: {
      suggestSort: vi.fn(),
      suggestSwap: vi.fn(),
      suggestCopy: vi.fn(),
      suggestRemove: vi.fn(),
    },
    provider: undefined as unknown as IDragEvent['provider'],
  } as unknown as IDragEvent
}

describe('handleDropOnTeam', () => {
  let tempTeams: Ref<TempTeam[]>
  let unassignedPlayers: Ref<TeamPlayer[]>
  let moveUnassignedToTeam: ReturnType<typeof vi.fn>

  const P1 = makePlayer('p1')
  const P2 = makePlayer('p2')
  const P3 = makePlayer('p3')
  const P4 = makePlayer('p4')

  beforeEach(() => {
    tempTeams = ref<TempTeam[]>([
      { teamIndex: 0, name: 'Team 1', players: [P1, P2] },
      { teamIndex: 1, name: 'Team 2', players: [P3] },
    ])
    unassignedPlayers = ref<TeamPlayer[]>([P4])
    moveUnassignedToTeam = vi.fn()
  })

  function callHandler(e: IDragEvent, targetTeamIndex: number) {
    handleDropOnTeam(e, targetTeamIndex, tempTeams, unassignedPlayers, moveUnassignedToTeam)
  }

  function allPlayerIds(): string[] {
    return [
      ...tempTeams.value.flatMap((t) => t.players.map((p) => p.eventPlayerId)),
      ...unassignedPlayers.value.map((p) => p.eventPlayerId),
    ]
  }

  describe('same-team reorder', () => {
    it('reorders players within the same team', () => {
      const srcList = tempTeams.value[0].players
      const result = suggestSortMock('vertical', {
        srcList,
        targetList: srcList,
        dragIndex: 0,
        insertIndex: 1,
      })
      const e = createDragEvent({ list: srcList, index: 0 }, () => result, {
        items: srcList,
        index: 1,
      })

      callHandler(e, 0)

      const ids = tempTeams.value[0].players.map((p) => p.eventPlayerId)
      expect(ids).toEqual(['p2', 'p1'])
      expect(tempTeams.value[0].players).toHaveLength(2)
      expect(tempTeams.value[1].players).toHaveLength(1)
      expect(unassignedPlayers.value).toHaveLength(1)
      expect(new Set(allPlayerIds()).size).toBe(allPlayerIds().length)
    })

    it('moves player to end when dragging last position', () => {
      const srcList = tempTeams.value[0].players
      const result = suggestSortMock('vertical', {
        srcList,
        targetList: srcList,
        dragIndex: 0,
        insertIndex: 2,
      })
      const e = createDragEvent({ list: srcList, index: 0 }, () => result, {
        items: srcList,
        index: 1,
      })

      callHandler(e, 0)

      const ids = tempTeams.value[0].players.map((p) => p.eventPlayerId)
      expect(ids).toEqual(['p2', 'p1'])
    })
  })

  describe('cross-team move', () => {
    it('moves player from Team A to Team B', () => {
      const srcList = tempTeams.value[0].players
      const tgtList = tempTeams.value[1].players
      const result = suggestSortMock('vertical', {
        srcList,
        targetList: tgtList,
        dragIndex: 0,
        insertIndex: 1,
      })
      const e = createDragEvent(
        { list: srcList, index: 0 },
        () => result,
        null,
        tgtList,
      )

      callHandler(e, 1)

      expect(tempTeams.value[0].players.map((p) => p.eventPlayerId)).toEqual(['p2'])
      expect(tempTeams.value[1].players.map((p) => p.eventPlayerId)).toEqual(['p3', 'p1'])
      expect(tempTeams.value[0].players).toHaveLength(1)
      expect(tempTeams.value[1].players).toHaveLength(2)
      expect(new Set(allPlayerIds()).size).toBe(allPlayerIds().length)
      expect(allPlayerIds()).toHaveLength(4)
    })

    it('moves player to empty team', () => {
      tempTeams.value[1].players = []
      const srcList = tempTeams.value[0].players
      const emptyList: TeamPlayer[] = []
      const result = suggestSortMock('vertical', {
        srcList,
        targetList: emptyList,
        dragIndex: 0,
        insertIndex: 0,
      })
      const e = createDragEvent(
        { list: srcList, index: 0 },
        () => result,
        null,
        emptyList,
      )

      callHandler(e, 1)

      expect(tempTeams.value[0].players.map((p) => p.eventPlayerId)).toEqual(['p2'])
      expect(tempTeams.value[1].players.map((p) => p.eventPlayerId)).toEqual(['p1'])
      expect(new Set(allPlayerIds()).size).toBe(allPlayerIds().length)
    })

    it('preserves player count after cross-team move', () => {
      const srcList = tempTeams.value[0].players
      const tgtList = tempTeams.value[1].players
      const result = suggestSortMock('vertical', {
        srcList,
        targetList: tgtList,
        dragIndex: 1,
        insertIndex: 0,
      })
      const e = createDragEvent({ list: srcList, index: 1 }, () => result, null, tgtList)

      const beforeCount = allPlayerIds().length
      callHandler(e, 1)
      expect(allPlayerIds()).toHaveLength(beforeCount)
    })

    it('has no duplicate player IDs after cross-team move', () => {
      const srcList = tempTeams.value[0].players
      const tgtList = tempTeams.value[1].players
      const result = suggestSortMock('vertical', {
        srcList,
        targetList: tgtList,
        dragIndex: 0,
        insertIndex: 0,
      })
      const e = createDragEvent({ list: srcList, index: 0 }, () => result, null, tgtList)

      callHandler(e, 1)

      const ids = allPlayerIds()
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('cross-team swap', () => {
    it('swaps player from Team A with player in Team B', () => {
      const srcList = tempTeams.value[0].players
      const tgtList = tempTeams.value[1].players
      const swapResult = suggestSwapMock(srcList, tgtList, 0, 0)

      const e = createDragEvent(
        { list: srcList, index: 0 },
        vi.fn(),
        { items: tgtList, index: 0 },
        tgtList,
        () => swapResult,
      )

      callHandler(e, 1)

      expect(tempTeams.value[0].players.map((p) => p.eventPlayerId)).toEqual(['p3', 'p2'])
      expect(tempTeams.value[1].players.map((p) => p.eventPlayerId)).toEqual(['p1'])
      expect(tempTeams.value[0].players).toHaveLength(2)
      expect(tempTeams.value[1].players).toHaveLength(1)
      expect(new Set(allPlayerIds()).size).toBe(allPlayerIds().length)
      expect(allPlayerIds()).toHaveLength(4)
    })

    it('preserves player count after swap', () => {
      const srcList = tempTeams.value[0].players
      const tgtList = tempTeams.value[1].players
      const swapResult = suggestSwapMock(srcList, tgtList, 1, 0)

      const e = createDragEvent(
        { list: srcList, index: 1 },
        vi.fn(),
        { items: tgtList, index: 0 },
        tgtList,
        () => swapResult,
      )

      const beforeCount = allPlayerIds().length
      callHandler(e, 1)
      expect(allPlayerIds()).toHaveLength(beforeCount)
    })

    it('has no duplicates after swap', () => {
      const srcList = tempTeams.value[0].players
      const tgtList = tempTeams.value[1].players
      const swapResult = suggestSwapMock(srcList, tgtList, 0, 0)

      const e = createDragEvent(
        { list: srcList, index: 0 },
        vi.fn(),
        { items: tgtList, index: 0 },
        tgtList,
        () => swapResult,
      )

      callHandler(e, 1)

      const ids = allPlayerIds()
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('unassigned to team', () => {
    it('moves player from unassigned to team', () => {
      const e = makeSimpleDragEvent(unassignedPlayers.value, 0, P4)

      callHandler(e, 1)

      expect(moveUnassignedToTeam).toHaveBeenCalledWith(0, 1)
    })
  })

  describe('edge cases', () => {
    it('does nothing when draggedItems is empty', () => {
      const e = makeEmptyDragEvent()

      const before = allPlayerIds().slice()
      callHandler(e, 0)
      expect(allPlayerIds()).toEqual(before)
    })

    it('does nothing when suggestSort returns null', () => {
      const srcList = tempTeams.value[0].players
      const e = createDragEvent({ list: srcList, index: 0 }, () => null as unknown as ISuggestSortResult, {
        items: srcList,
        index: 1,
      })

      const beforeIds = allPlayerIds().slice()
      callHandler(e, 0)
      expect(allPlayerIds()).toEqual(beforeIds)
    })

    it('inserts into first position when dragging to index 0', () => {
      const srcList = tempTeams.value[0].players
      const tgtList = tempTeams.value[1].players
      const result = suggestSortMock('vertical', {
        srcList,
        targetList: tgtList,
        dragIndex: 0,
        insertIndex: 0,
      })
      const e = createDragEvent({ list: srcList, index: 0 }, () => result, null, tgtList)

      callHandler(e, 1)

      expect(tempTeams.value[1].players.map((p) => p.eventPlayerId)).toEqual(['p1', 'p3'])
    })
  })
})

describe('handleDropOnUnassigned', () => {
  let tempTeams: Ref<TempTeam[]>
  let movePlayerToUnassigned: ReturnType<typeof vi.fn>

  const P1 = makePlayer('p1')
  const P2 = makePlayer('p2')

  beforeEach(() => {
    tempTeams = ref<TempTeam[]>([
      { teamIndex: 0, name: 'Team 1', players: [P1, P2] },
      { teamIndex: 1, name: 'Team 2', players: [] },
    ])
    movePlayerToUnassigned = vi.fn()
  })

  it('moves player from team to unassigned', () => {
    const srcList = tempTeams.value[0].players
    const e = makeSimpleDragEvent(srcList, 0, P1)

    handleDropOnUnassigned(e, tempTeams, movePlayerToUnassigned)

    expect(movePlayerToUnassigned).toHaveBeenCalledWith(0, 0)
  })

  it('does nothing when draggedItems is empty', () => {
    const e = makeEmptyDragEvent()

    handleDropOnUnassigned(e, tempTeams, movePlayerToUnassigned)
    expect(movePlayerToUnassigned).not.toHaveBeenCalled()
  })

  it('does nothing when source team not found', () => {
    const unknownList: TeamPlayer[] = [makePlayer('x')]
    const e = makeSimpleDragEvent(unknownList, 0)

    handleDropOnUnassigned(e, tempTeams, movePlayerToUnassigned)
    expect(movePlayerToUnassigned).not.toHaveBeenCalled()
  })
})
