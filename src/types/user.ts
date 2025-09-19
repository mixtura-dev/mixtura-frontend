export interface Profile {
  id: number
  username: string
  active: boolean
}

export interface Role {
  id: number
  name: string
}

export interface WorkspaceBase {
  id: number
  name: string
  description: string
}

export interface WorkspaceCreator {
  id: number
  profile: Profile
  workspace: WorkspaceBaseWithCreator
  role: Role
  active: boolean
  premission: string[]
}

export interface WorkspaceBaseWithCreator extends WorkspaceBase {
  creator: Profile
}

export interface Player {
  id: number
  username: string
  creator: WorkspaceCreator
}

export interface Workspace extends WorkspaceBase {
  creator: WorkspaceCreator
  player: Player
}

export interface Custom {
  id: number
  TSR: number
  DSR: number
  HSR: number
}
