export const queryKeys = {
  servers: {
    all: ['servers'] as const,
    list: () => [...queryKeys.servers.all, 'list'] as const,
    detail: (serverId: string) => [...queryKeys.servers.all, 'detail', serverId] as const,
    games: (serverId: string) => [...queryKeys.servers.all, serverId, 'games'] as const,
    members: (serverId: string) => [...queryKeys.servers.all, serverId, 'members'] as const,
    member: (serverId: string, memberId: string) =>
      [...queryKeys.servers.members(serverId), memberId] as const,
    invites: (serverId: string) => [...queryKeys.servers.all, serverId, 'invites'] as const,
    roleSet: (serverId: string) => [...queryKeys.servers.all, serverId, 'roleSet'] as const,
    ratingSet: (serverId: string) => [...queryKeys.servers.all, serverId, 'ratingSet'] as const,
    restrictions: (serverId: string, memberId: string) =>
      [...queryKeys.servers.member(serverId, memberId), 'restrictions'] as const,
    serverRoles: (serverId: string) => ['servers', serverId, 'serverRoles'] as const,
    customs: (serverId: string, memberId: string) =>
      [...queryKeys.servers.member(serverId, memberId), 'customs'] as const,
    custom: (serverId: string, memberId: string, customId: string) =>
      [...queryKeys.servers.customs(serverId, memberId), customId] as const,
  },

  global: {
    games: ['global', 'games'] as const,
    ratingTemplates: ['global', 'ratingTemplates'] as const,
    restrictions: ['global', 'restrictions'] as const,
    roleTemplates: ['global', 'roleTemplates'] as const,
    permissions: ['global', 'permissions'] as const,
  },

  invites: {
    byKey: (key: string) => ['invites', key] as const,
  },
} as const
