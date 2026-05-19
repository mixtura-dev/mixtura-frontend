import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { type ISuggestSwapResult } from '@vue-dnd-kit/core'
import HomePage from '@/pages/HomePage.vue'
import type { Player } from '@/types/balancer'

vi.mock('@vue-dnd-kit/core', async () => {
  const actual = await vi.importActual<typeof import('@vue-dnd-kit/core')>('@vue-dnd-kit/core')

  const mockMakeDraggable = vi.fn(() => ({
    selected: ref(false),
    isDragging: ref(false),
    isAllowed: ref(true),
    isDragOver: ref(undefined),
  }))

  const mockMakeDroppable = vi.fn(() => ({
    isAllowed: ref(true),
    isDragOver: ref(undefined),
  }))

  return {
    ...actual,
    makeDraggable: mockMakeDraggable,
    makeDroppable: mockMakeDroppable,
    DnDProvider: {
      name: 'DnDProvider',
      template: '<div class="dnd-provider"><slot /></div>',
    },
  }
})

vi.mock('@/composables/useScreenshot', () => ({
  useScreenshot: () => ({ makeScreenshot: vi.fn() }),
}))

vi.mock('@/stores/settingsStore.store', () => ({
  useSettingsStore: () => ({
    state: {
      teams: {
        teamA: { name: 'Team A', color: '#1e90ff' },
        teamB: { name: 'Team B', color: '#ff6347' },
      },
    },
  }),
}))

vi.mock('@/components/balancer/TeamContainer.vue', () => ({
  default: {
    name: 'TeamContainer',
    template: '<div class="team-container" :data-team-name="teamName" :data-max-players="maxPlayers"><slot /></div>',
    props: ['players', 'teamName', 'teamColor', 'maxPlayers'],
    emits: ['drop'],
  },
}))

vi.mock('@/components/balancer/BenchContainer.vue', () => ({
  default: {
    name: 'BenchContainer',
    template: '<div class="bench-container"><slot /></div>',
    props: ['players'],
    emits: ['drop'],
  },
}))

function createSwapPayload(
  sourceItems: Player[],
  targetItems: Player[],
  sameList: boolean,
) {
  const result: ISuggestSwapResult = {
    sourceItems,
    targetItems,
    sourceIndexes: [0],
    targetIndex: 1,
    sameList,
  }
  return { result, sourceItems, targetItems, isSwap: true }
}

describe('HomePage.vue DnD integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  function mountHomePage() {
    return mount(HomePage)
  }

  describe('initial rendering', () => {
    it('renders DnDProvider wrapper', () => {
      const wrapper = mountHomePage()
      expect(wrapper.find('.dnd-provider').exists()).toBe(true)
    })

    it('renders two team containers and one bench container', () => {
      const wrapper = mountHomePage()
      expect(wrapper.findAll('.team-container')).toHaveLength(2)
      expect(wrapper.findAll('.bench-container')).toHaveLength(1)
    })

    it('passes maxPlayers prop to team containers', () => {
      const wrapper = mountHomePage()
      const teamContainers = wrapper.findAll('.team-container')
      expect(teamContainers[0].attributes('data-max-players')).toBe('5')
      expect(teamContainers[1].attributes('data-max-players')).toBe('5')
    })

    it('passes correct team props to first team container', () => {
      const wrapper = mountHomePage()
      const teamContainers = wrapper.findAll('.team-container')
      expect(teamContainers[0].attributes('data-team-name')).toBe('Team A')
    })

    it('passes correct team props to second team container', () => {
      const wrapper = mountHomePage()
      const teamContainers = wrapper.findAll('.team-container')
      expect(teamContainers[1].attributes('data-team-name')).toBe('Team B')
    })
  })

  describe('player state management', () => {
    it('initializes with correct number of players in each team', () => {
      const wrapper = mountHomePage()
      const teamContainers = wrapper.findAllComponents({ name: 'TeamContainer' })
      expect(teamContainers[0].props('players')).toHaveLength(5)
      expect(teamContainers[1].props('players')).toHaveLength(1)
    })

    it('initializes bench with players', () => {
      const wrapper = mountHomePage()
      const bench = wrapper.findComponent({ name: 'BenchContainer' })
      expect(bench.props('players')).toHaveLength(2)
    })
  })

  describe('swap functionality', () => {
    it('swaps players within same team (sameList)', async () => {
      const wrapper = mountHomePage()
      const teamContainers = wrapper.findAllComponents({ name: 'TeamContainer' })
      const originalPlayers = teamContainers[0].props('players') as Player[]

      const swapped = [originalPlayers[1], originalPlayers[0], ...originalPlayers.slice(2)]
      const payload = createSwapPayload(originalPlayers, swapped, true)

      teamContainers[0].vm.$emit('drop', payload)
      await nextTick()

      const updated = teamContainers[0].props('players') as Player[]
      expect(updated).toHaveLength(5)
      const ids = updated.map(p => p.id)
      expect(ids).toContain(1)
      expect(ids).toContain(2)
    })

    it('swaps players between Team A and Team B (cross-list)', async () => {
      const wrapper = mountHomePage()
      const teamContainers = wrapper.findAllComponents({ name: 'TeamContainer' })
      const teamAPlayers = teamContainers[0].props('players') as Player[]

      const newTeamB = [teamAPlayers[0]]
      const payload = createSwapPayload(teamAPlayers, newTeamB, false)

      teamContainers[0].vm.$emit('drop', payload)
      await nextTick()

      const updatedA = teamContainers[0].props('players') as Player[]
      const updatedB = teamContainers[1].props('players') as Player[]

      expect(updatedA).toHaveLength(5)
      expect(updatedB).toHaveLength(1)

      const allIds = [...updatedA.map(p => p.id), ...updatedB.map(p => p.id)]
      expect(new Set(allIds).size).toBe(allIds.length)
    })

    it('swaps player from bench to team (cross-list)', async () => {
      const wrapper = mountHomePage()
      const teamContainers = wrapper.findAllComponents({ name: 'TeamContainer' })
      const bench = wrapper.findComponent({ name: 'BenchContainer' })
      const benchPlayers = bench.props('players') as Player[]
      const teamBPlayers = teamContainers[1].props('players') as Player[]

      const newBench = [benchPlayers[1], teamBPlayers[0]]
      const payload = createSwapPayload(teamBPlayers, newBench, false)

      teamContainers[1].vm.$emit('drop', payload)
      await nextTick()

      const updatedB = teamContainers[1].props('players') as Player[]
      const updatedBench = bench.props('players') as Player[]

      expect(updatedB).toHaveLength(1)
      expect(updatedBench).toHaveLength(2)

      const allIds = [...updatedB.map(p => p.id), ...updatedBench.map(p => p.id)]
      expect(new Set(allIds).size).toBe(allIds.length)
    })

    it('moves player from team to bench (cross-list)', async () => {
      const wrapper = mountHomePage()
      const teamContainers = wrapper.findAllComponents({ name: 'TeamContainer' })
      const bench = wrapper.findComponent({ name: 'BenchContainer' })
      const teamAPlayers = teamContainers[0].props('players') as Player[]
      const benchPlayers = bench.props('players') as Player[]

      const newBench = [...benchPlayers, teamAPlayers[0]]
      const payload = {
        result: { sourceItems: teamAPlayers.slice(1), targetItems: newBench, draggedItems: [teamAPlayers[0]], sourceIndexes: [0], targetIndex: benchPlayers.length, mode: 'append' as const, sameList: false },
        sourceItems: teamAPlayers,
        targetItems: benchPlayers,
        isSwap: false,
      }

      teamContainers[0].vm.$emit('drop', payload)
      await nextTick()

      const updatedA = teamContainers[0].props('players') as Player[]
      const updatedBench = bench.props('players') as Player[]

      expect(updatedA).toHaveLength(4)
      expect(updatedBench).toHaveLength(3)

      const allIds = [...updatedA.map(p => p.id), ...updatedBench.map(p => p.id)]
      expect(new Set(allIds).size).toBe(allIds.length)
    })

    it('adds player from bench to team (cross-list)', async () => {
      const wrapper = mountHomePage()
      const teamContainers = wrapper.findAllComponents({ name: 'TeamContainer' })
      const bench = wrapper.findComponent({ name: 'BenchContainer' })
      const teamBPlayers = teamContainers[1].props('players') as Player[]
      const benchPlayers = bench.props('players') as Player[]

      const newTeamB = [...teamBPlayers, benchPlayers[0]]
      const newBench = benchPlayers.slice(1)
      const payload = {
        result: { sourceItems: newBench, targetItems: newTeamB, draggedItems: [benchPlayers[0]], sourceIndexes: [0], targetIndex: teamBPlayers.length, mode: 'append' as const, sameList: false },
        sourceItems: benchPlayers,
        targetItems: teamBPlayers,
        isSwap: false,
      }

      bench.vm.$emit('drop', payload)
      await nextTick()

      const updatedB = teamContainers[1].props('players') as Player[]
      const updatedBench = bench.props('players') as Player[]

      expect(updatedB).toHaveLength(2)
      expect(updatedBench).toHaveLength(1)

      const allIds = [...updatedB.map(p => p.id), ...updatedBench.map(p => p.id)]
      expect(new Set(allIds).size).toBe(allIds.length)
    })

    it('blocks swap if target team exceeds maxPlayers', async () => {
      const wrapper = mountHomePage()
      const teamContainers = wrapper.findAllComponents({ name: 'TeamContainer' })
      const teamAPlayers = teamContainers[0].props('players') as Player[]
      const teamBPlayers = teamContainers[1].props('players') as Player[]

      const newTeamB = [...teamBPlayers, teamAPlayers[0], teamAPlayers[1]]
      const payload = createSwapPayload(teamAPlayers, newTeamB, false)

      teamContainers[0].vm.$emit('drop', payload)
      await nextTick()

      const updatedB = teamContainers[1].props('players') as Player[]
      expect(updatedB).toHaveLength(1)
      expect(updatedB[0].id).toBe(6)
    })
  })

  describe('no duplicates', () => {
    it('ensures no player ID appears in more than one list after swap', async () => {
      const wrapper = mountHomePage()
      const teamContainers = wrapper.findAllComponents({ name: 'TeamContainer' })
      const bench = wrapper.findComponent({ name: 'BenchContainer' })

      const teamAPlayers = teamContainers[0].props('players') as Player[]

      const newTeamB = [teamAPlayers[0]]
      const payload = createSwapPayload(teamAPlayers, newTeamB, false)

      teamContainers[0].vm.$emit('drop', payload)
      await nextTick()

      const allPlayers = [
        ...teamContainers[0].props('players') as Player[],
        ...teamContainers[1].props('players') as Player[],
        ...bench.props('players') as Player[],
      ]
      const ids = allPlayers.map(p => p.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })
})
