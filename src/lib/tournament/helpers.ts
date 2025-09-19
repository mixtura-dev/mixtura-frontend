import type {
  CustomParticipant,
  Id,
  Nullable,
  OmitId,
  Participant,
  Seeding,
} from '@/types/tournament/tournament'

export function ensureNoDuplicates<T>(array: Nullable<T>[]): void {
  const nonNull = getNonNull(array)
  const seen = new Set<string | number>()
  const duplicates: (T | string | number)[] = []

  nonNull.forEach((item) => {
    const key = (item as CustomParticipant)?.id ?? item
    if (seen.has(key as string | number)) {
      duplicates.push(item)
    } else {
      seen.add(key as string | number)
    }
  })

  if (duplicates.length > 0) {
    throw new Error(`Обнаружены дубликаты участников: ${JSON.stringify(duplicates)}`)
  }
}

export function getNonNull<T>(array: Nullable<T>[]): T[] {
  return array.filter((element): element is T => element !== null)
}

export function setArraySize<T>(array: T[], length: number, placeholder: T): T[] {
  if (length < 0) throw new Error('Size cant be negative')
  return Array.from({ length }, (_, i) => (i < array.length ? array[i] : placeholder))
}

export function fixSeeding(seeding: Seeding, participantCount: number): Seeding {
  if (seeding.length > participantCount)
    throw Error('The seeding has more participants than the size of the stage.')

  if (seeding.length < participantCount) {
    return setArraySize(seeding, participantCount, null)
  }
  return seeding
}

export function getNearestPowerOfTwo(input: number): number {
  if (input <= 0) throw new Error('Input must be a positive integer')
  return Math.pow(2, Math.ceil(Math.log2(input)))
}

export function balanceByes(seeding: Seeding, participantCount?: number): Seeding {
  seeding = getNonNull(seeding)
  participantCount = participantCount || getNearestPowerOfTwo(seeding.length)
  if (seeding.length < participantCount / 2) {
    const flat = seeding.flatMap((v) => [v, null])
    return setArraySize(flat, participantCount, null)
  }
  const nonNullCount = seeding.length
  const nullCount = participantCount - nonNullCount
  const againstEachOther = seeding
    .slice(0, nonNullCount - nullCount)
    .filter((_, i) => i % 2 === 0)
    .map((_, i) => [seeding[2 * i], seeding[2 * i + 1]])
  const againstNull = seeding.slice(nonNullCount - nullCount, nonNullCount).map((v) => [v, null])
  const flat = [...againstEachOther.flat(), ...againstNull.flat()]

  return setArraySize(flat, participantCount, null)
}

export function extractParticipantsFromSeeding(
  tournamentId: Id,
  seeding: Seeding,
): OmitId<Participant>[] {
  const withoutByes = seeding.filter(
    (name): name is /* ignore number (no IDs) */ string | CustomParticipant => name !== null,
  )

  const participants = withoutByes.map<OmitId<Participant>>((item) => {
    if (typeof item === 'string') {
      return {
        tournamentId,
        name: item,
      }
    }

    return {
      ...item,
      tournamentId,
      name: item.name,
    }
  })

  return participants
}
