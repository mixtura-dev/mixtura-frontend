export type GameRole = 'T' | 'D' | 'H'

export type PlayerRole = {
  role: GameRole
  isPrimary: boolean
}

export type Player = {
  id: string
}
