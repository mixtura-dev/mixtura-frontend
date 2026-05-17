import { useQuery } from '@tanstack/vue-query'
import { queryKeys } from './keys'
import { listTeams } from '@/api/endpoints/event/eventTeam'
import type { ServerID } from '@/types/user'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export function useTeamsQuery(
  serverId: MaybeRefOrGetter<ServerID>,
  eventId: MaybeRefOrGetter<string>,
  params?: MaybeRefOrGetter<{ page?: number; page_size?: number }>,
) {
  const sId = computed(() => toValue(serverId))
  const eId = computed(() => toValue(eventId))
  const p = computed(() => toValue(params))

  return useQuery({
    queryKey: computed(() => [...queryKeys.events.teams.list(sId.value, eId.value), p.value]),
    queryFn: () => listTeams(sId.value, eId.value, p.value),
    enabled: computed(() => !!sId.value && !!eId.value),
  })
}
