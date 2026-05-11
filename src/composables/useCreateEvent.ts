import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { useCreateEventMutation } from '@/api/queries/event'
import { useCurrentMemberStore } from '@/stores/currentMember.store'
import { PERMISSION_CODES } from '@/types/permissions'
import type { ServerID } from '@/types/user'
import type { components } from '@/types/api'

type CreateEventData = components['schemas']['CreateEventRequest']

export function useCreateEvent(serverId: MaybeRefOrGetter<ServerID>) {
  const { t } = useI18n()
  const memberStore = useCurrentMemberStore()

  const isAdmin = computed(() => memberStore.hasPermission(PERMISSION_CODES.ADMINISTRATOR))

  const { mutate, isPending } = useCreateEventMutation()

  function handleCreate(
    data: CreateEventData,
    callbacks?: { onSuccess?: () => void; onError?: () => void },
  ) {
    if (!isAdmin.value) {
      toast.error(t('errors.forbidden'))
      callbacks?.onError?.()
      return
    }

    mutate(
      { serverId: toValue(serverId), data },
      {
        onSuccess: () => {
          toast.success(t('server.events.createEvent.toast.success'))
          callbacks?.onSuccess?.()
        },
        onError: () => {
          toast.error(t('server.events.createEvent.toast.error'))
          callbacks?.onError?.()
        },
      },
    )
  }

  return { handleCreate, isPending, isAdmin }
}
