export const queryKeys = {
  events: {
    all: ['events'] as const,
    health: () => [...queryKeys.events.all, 'health'] as const,
    list: (serverId: string) => [...queryKeys.events.all, 'list', serverId] as const,
    private: (serverId: string) => [...queryKeys.events.all, 'private', serverId] as const,
    detail: (serverId: string, eventId: string) => [...queryKeys.events.all, 'detail', serverId, eventId] as const,
    applications: {
      list: (serverId: string, eventId: string) => [...queryKeys.events.detail(serverId, eventId), 'applications'] as const,
      detail: (serverId: string, applicationId: string) => [...queryKeys.events.all, 'applications', serverId, applicationId] as const,
      form: (serverId: string, eventId: string) => [...queryKeys.events.detail(serverId, eventId), 'applicationForm'] as const,
    },
    organizers: {
      list: (serverId: string, eventId: string) => [...queryKeys.events.detail(serverId, eventId), 'organizers'] as const,
    },
    players: {
      list: (serverId: string, eventId: string) => [...queryKeys.events.all, 'players', serverId, eventId] as const,
      detail: (serverId: string, eventId: string, memberId: string) => [...queryKeys.events.all, 'players', serverId, eventId, memberId] as const,
    },
    drafts: {
      list: (serverId: string, eventId: string) => [...queryKeys.events.all, 'drafts', serverId, eventId] as const,
      detail: (serverId: string, draftId: string) => [...queryKeys.events.all, 'drafts', serverId, draftId] as const,
      formation: (serverId: string, draftId: string) => [...queryKeys.events.all, 'drafts', serverId, draftId, 'formation'] as const,
    },
    teams: {
      list: (serverId: string, eventId: string) => [...queryKeys.events.all, 'teams', serverId, eventId] as const,
    },
    matches: {
      list: (serverId: string, eventId: string) => [...queryKeys.events.all, 'matches', serverId, eventId] as const,
      detail: (serverId: string, matchId: string) => [...queryKeys.events.all, 'matches', serverId, matchId] as const,
    },
  },
} as const
