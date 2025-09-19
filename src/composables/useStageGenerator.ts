import {
  ensureNoDuplicates,
  extractParticipantsFromSeeding,
  fixSeeding,
} from '@/lib/tournament/helpers'
import type { Id, InputStage, OmitId, Seeding } from '@/types/tournament/tournament'
import { ref } from 'vue'

export type ParticipantSlot = { id: Id | null; position?: number } | null

export const useStageGenerator = (stage: InputStage, storage: ) => {
  const stageRef = ref<InputStage>(stage)

  const roundRobin = () => {}

  const singleElimination = () => {}

  const doubleElimination = () => {}

  const createDoubleElimination = () => {}

  const createDoubleEliminationSkipFirstRound = () => {}

  const createRoundRobinGroup = () => {}

  const createStandardBracket = () => {}

  const createLowerBracket = () => {}

  const createUniqueMatchBracket = () => {}

  const createRound = () => {}

  const createMatch = () => {}

  const getSlots = (position?: number) => {
    let seeding = stageRef.value.seedingIds || stageRef.value.seeding
    const size = stageRef.value.settings?.size || (seeding ? seeding.length : 0)

    if (size && !seeding) {
      return Array.from({ length: size }, (_, i) => ({ id: null, position: i + 1 }))
    }

    if (!seeding) {
      throw Error('No seeding information available')
    }

    stageRef.value.settings = {
      ...stageRef.value.settings,
      size,
    }
    ensureNoDuplicates(seeding)
    seeding = fixSeeding(seeding, size)
  if (stageRef.value.type !== 'round_robin' && stageRef.value.settings.balanceByes) {
    seeding = balanceByes(seeding, stageRef.value.settings.size)
  }

  const getSlotsUsingName = (seeding: Seeding, positions: number[]) => {
    const participants = extractParticipantsFromSeeding(stageRef.value.tournamentId, seeding)



  }

  const registerParticipants = (participants: OmitId<Participant>[]) => {
  }

  const run = () => {
    switch (stageRef.value.type) {
      case 'round_robin':
        roundRobin()
        break
      case 'single_elim':
        singleElimination()
        break
      case 'double_elim':
        doubleElimination()
        break
      default:
        throw Error('Unknown stage type.')
    }
    
  }
  return {
    run,
    getSlots,
  }
}

