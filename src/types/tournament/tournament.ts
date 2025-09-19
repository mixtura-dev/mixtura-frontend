export type Id = string | number

export type Result = 'win' | 'draw' | 'loss'

export type StageType = 'double_elim' | 'single_elim' | 'round_robin'

export type GroupType = 'single_bracket' | 'winner_bracket' | 'loser_bracket' | 'final_group'

export type GrandFinalType = 'none' | 'simple' | 'double'

export type FinalType = 'grand_final' | 'consolation_final'

export type OmitId<T> = Omit<T, 'id'>

export type RoundRobinMode = 'simple' | 'double'

export type IdSeeding = (Id | null)[]

export type CustomParticipant<ExtraFields = Record<string, unknown>> = Participant & ExtraFields

export type Nullable<T> = T | null | undefined

export type Seeding = (CustomParticipant | string | number | null)[]

export type SeedOrdering =
  | 'natural'
  | 'reverse'
  | 'half_shift'
  | 'reverse_half_shift'
  | 'pair_flip'
  | 'inner_outer'
  | 'groups.effort_balanced'
  | 'groups.seed_optimized'
  | 'groups.bracket_optimized'

export interface StageSettings {
  size?: number
  groupCount?: number

  /**
   * Whether to balance BYEs in the seeding of an elimination stage.
   *
   * This prevents having BYE against BYE in matches.
   */
  balanceByes?: boolean
  /**
   * Optional final between semi-final losers.
   */
  consolationFinal?: boolean
  /**
   * The mode for the round-robin stage.
   *
   * - If `simple`, each participant plays each opponent once.
   * - If `double`, each participant plays each opponent twice, once at home and once away.
   */
  roundRobinMode?: RoundRobinMode
  /**
   * Optional grand final between WB and LB winners.
   *
   * - If `none`, there is no grand final.
   * - If `simple`, the final is a single match. The winner is the winner of the stage.
   * - If `double`, if the WB winner wins, he's the winner of the stage. But if he loses, the final is reset and there is a very last match.
   * It might be fairer since it gives the WB winner the right to lose once during the stage...
   */
  grandFinal?: GrandFinalType
}

export enum Status {
  Locked = 0,
  Waiting = 1,
  Ready = 2,
  Running = 3,
  Completed = 4,
  Archived = 5,
}

export interface ParticipantResult {
  /** If `null`, the participant is to be determined. */
  id: Id | null

  /** Indicates where the participant comes from. */
  position?: number

  /** If this participant forfeits, the other automatically wins. */
  forfeit?: boolean

  /** The current score of the participant. */
  score?: number

  /** Tells what is the result of a duel for this participant. */
  result?: Result
}

export interface Participant {
  id: Id
  tournamentId: Id
  name: string
}

export interface MatchResults {
  status: Status
  opponent1: ParticipantResult | null
  opponent2: ParticipantResult | null
}

export interface Match extends MatchResults {
  /** ID of the match. */
  id: Id

  /** ID of the parent stage. */
  stageId: Id

  /** ID of the parent group. */
  groupId: Id

  /** ID of the parent round. */
  roundId: Id

  /** The number of the match in its round. */
  number: number

  /** The count of match games this match has. Can be `0` if it's a simple match, or a positive number for "Best Of" matches. */
  childCount: number
}

export interface MatchGame extends MatchResults {
  id: Id
  stageId: Id
  parentId: Id

  /** The number of the match game in its parent match. */
  number: number
}

export interface Round {
  id: Id
  stageId: Id
  groupId: Id
  /** The number of the round in its group. */
  number: number
}

export interface Group {
  id: Id
  stageId: Id

  /** The number of the group in its stage. */
  number: number
}

export interface Stage {
  id: Id
  tournamentId: Id
  name: string
  type: StageType
  /** The number of the stage in its tournament. */
  number: number
}

export interface InputStage {
  id?: Id // Make id optional for input
  tournamentId: Id

  name: string

  type: StageType
  /** The number of the stage in its tournament. Is determined if not given. */
  number?: number

  /** Contains participants or `null` for BYEs. */
  seeding?: Seeding
  seedingIds?: IdSeeding

  settings?: StageSettings
}

export interface DataTypes {
  stage: Stage
  group: Group
  round: Round
  match: Match
  matchGame: MatchGame
  participant: Participant
}

export type Table = keyof DataTypes

export interface CrudInterface {
  insert<T extends Table>(table: T, data: OmitId<DataTypes[T]>): Promise<number>
  insert<T extends Table>(table: T, values: OmitId<DataTypes[T]>[]): Promise<boolean>
  select<T extends Table>(table: T): Promise<Array<DataTypes[T]> | null>
  select<T extends Table>(table: T, id: Id): Promise<DataTypes[T] | null>
  select<T extends Table>(
    table: T,
    filter: Partial<DataTypes[T]>,
  ): Promise<Array<DataTypes[T]> | null>

  update<T extends Table>(table: T, id: Id, value: DataTypes[T]): Promise<boolean>

  update<T extends Table>(
    table: T,
    filter: Partial<DataTypes[T]>,
    value: Partial<DataTypes[T]>,
  ): Promise<boolean>

  delete<T extends Table>(table: T): Promise<boolean>

  delete<T extends Table>(table: T, filter: Partial<DataTypes[T]>): Promise<boolean>

  delete<T extends Table>(table: T, id: Id): Promise<void>
  getById<T extends Table>(table: T, id: Id): Promise<DataTypes[T] | null>
  getAll<T extends Table>(table: T, filter?: Partial<OmitId<DataTypes[T]>>): Promise<DataTypes[T][]>
}

export interface Storage extends CrudInterface {
  selectFirst<T extends Table>(
    table: T,
    filter: Partial<DataTypes[T]>,
    assertUnique?: boolean,
  ): Promise<DataTypes[T] | null>
  selectLast<T extends Table>(
    table: T,
    filter: Partial<DataTypes[T]>,
    assertUnique?: boolean,
  ): Promise<DataTypes[T] | null>
}
