import type { GroupType, Match } from '@/types/tournament/tournament'

export type ConnectionType = 'square' | 'straight' | false

export interface Connection {
  connectPrevious: ConnectionType
  connectNext: ConnectionType
}

export function getBracketConnection(
  alwaysConnectFirstRound: boolean,
  roundNumber: number,
  roundCount: number,
  match: Match,
  matchLocation: GroupType = 'single_bracket',
  connectFinal?: boolean,
): Connection {
  const connection: Connection = {
    connectPrevious: false,
    connectNext: false,
  }

  if (matchLocation === 'loser_bracket') {
    connection.connectPrevious = roundNumber > 1 && (roundNumber % 2 === 1 ? 'square' : 'straight')
    connection.connectNext =
      roundNumber < roundCount && (roundNumber % 2 === 0 ? 'square' : 'straight')
  } else {
    connection.connectPrevious = roundNumber > 1 && 'square'
    connection.connectNext = roundNumber < roundCount ? 'square' : connectFinal ? 'straight' : false
  }

  if (alwaysConnectFirstRound || roundNumber !== 2) return connection

  const upperBracket = matchLocation === 'single_bracket' || matchLocation === 'winner_bracket'

  if (
    upperBracket &&
    match.opponent1?.position === undefined &&
    match.opponent2?.position === undefined
  )
    connection.connectPrevious = false

  if (matchLocation === 'loser_bracket' && match.opponent2?.position === undefined)
    connection.connectPrevious = false

  return connection
}
