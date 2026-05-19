import { computed, ref } from 'vue'
import type { IDragEvent } from '@vue-dnd-kit/core'
import type { components } from '@/types/api'

type Role = components['schemas']['SelectedGameRoleResponse']

export interface Tier {
  id: string
  priority: number
  roles: Role[]
}

let idCounter = 0

function uid() {
  return `tier-${++idCounter}-${Date.now()}`
}

export function useRolePriorityManager() {
  const allRoles = ref<Role[]>([])
  const selectedIds = ref<Set<string>>(new Set())
  const tiers = ref<Tier[]>([])
  const undesiredRoles = ref<Role[]>([])

  function initialize(roles: Role[]) {
    idCounter = 0
    allRoles.value = roles
    selectedIds.value = new Set()
    tiers.value = [{ id: uid(), priority: 1, roles: [] }]
    undesiredRoles.value = []
  }

  function toggleRole(roleId: string) {
    const role = allRoles.value.find((r) => r.id === roleId)
    if (!role) return

    if (selectedIds.value.has(roleId)) {
      selectedIds.value.delete(roleId)
      for (const tier of tiers.value) {
        tier.roles = tier.roles.filter((r) => r.id !== roleId)
      }
      undesiredRoles.value.push(role)
    } else {
      selectedIds.value.add(roleId)
      undesiredRoles.value = undesiredRoles.value.filter((r) => r.id !== roleId)
      tiers.value[0]?.roles.push(role)
    }
  }

  function addTier() {
    const maxP = Math.max(0, ...tiers.value.map((t) => t.priority))
    tiers.value.push({ id: uid(), priority: maxP + 1, roles: [] })
  }

  function removeTier(tierId: string) {
    const idx = tiers.value.findIndex((t) => t.id === tierId)
    if (idx === -1 || tiers.value.length <= 1) return

    const tier = tiers.value[idx]
    const target = tiers.value[idx - 1] ?? tiers.value[0]
    target.roles.push(...tier.roles)
    tiers.value.splice(idx, 1)
    tiers.value.forEach((t, i) => {
      t.priority = i + 1
    })
  }

  function computePriorities(): Record<string, number> {
    const result: Record<string, number> = {}
    for (const tier of tiers.value) {
      for (const role of tier.roles) {
        result[role.id] = tier.priority
      }
    }
    for (const role of undesiredRoles.value) {
      result[role.id] = 0
    }
    return result
  }

  function applyDrop(e: IDragEvent, targetArray: Role[]) {
    const srcArr = e.draggedItems[0]?.items as Role[] | undefined
    if (!srcArr) return

    const srcTier = tiers.value.find((t) => t.roles === srcArr)
    const tgtTier = tiers.value.find((t) => t.roles === targetArray)
    const srcIsUndesired = undesiredRoles.value === srcArr
    const tgtIsUndesired = undesiredRoles.value === targetArray

    let newSrc: Role[]
    let newTgt: Role[]

    if (e.hoveredDraggable && targetArray.length > 0) {
      const result = e.helpers.suggestSwap()
      if (!result) return
      newSrc = result.sourceItems as Role[]
      newTgt = result.targetItems as Role[]
    } else {
      const result = e.helpers.suggestSort('vertical')
      if (!result) return
      newSrc = result.sourceItems as Role[]
      newTgt = result.targetItems as Role[]
    }

    if (srcTier && tgtTier) {
      if (srcTier.id === tgtTier.id) {
        tgtTier.roles = newSrc
      } else {
        tgtTier.roles = newTgt
        srcTier.roles = newSrc
      }
    } else if (tgtTier) {
      tgtTier.roles = newTgt
      if (srcTier) srcTier.roles = newSrc
      else if (srcIsUndesired) undesiredRoles.value = newSrc
    } else if (tgtIsUndesired) {
      undesiredRoles.value = newTgt
      if (srcTier) srcTier.roles = newSrc
    }
  }

  const selectedCount = computed(() => selectedIds.value.size)
  const totalCount = computed(() => allRoles.value.length)
  const hasSelected = computed(() => selectedIds.value.size > 0)

  return {
    allRoles,
    selectedIds,
    tiers,
    undesiredRoles,
    initialize,
    toggleRole,
    addTier,
    removeTier,
    computePriorities,
    applyDrop,
    selectedCount,
    totalCount,
    hasSelected,
  }
}
