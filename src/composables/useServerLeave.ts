import { useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { useKickMemberMutation } from '@/api/queries/server'
import { queryKeys } from '@/api/queries/server/keys'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
import { type ServerID } from '@/types/user'

export function useServerLeave(serverId: () => ServerID, currentMemberId: () => string | null) {
  const { t } = useI18n()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { mutate: kickMember, isPending } = useKickMemberMutation()

  function leave() {
    const memberId = currentMemberId()
    if (!memberId) return

    kickMember(
      { serverId: serverId(), memberId },
      {
        onSuccess: () => {
          toast.success(t('server.leave.toast.success'))
          queryClient.invalidateQueries({ queryKey: queryKeys.servers.all })
          router.replace('/servers')
        },
        onError: () => {
          toast.error(t('server.leave.toast.error'))
        },
      },
    )
  }

  return { leave, isPending }
}
