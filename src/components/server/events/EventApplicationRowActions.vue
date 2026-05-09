<script setup lang="ts">
import type { components } from '@/types/api'
import type { ServerID } from '@/types/user'
import { MoreHorizontal, Check, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useReviewApplicationMutation } from '@/api/queries/event'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

type Application = components['schemas']['ApplicationListItemResponse']

const { application, serverId, eventId } = defineProps<{
  application: Application
  serverId: ServerID
  eventId: string
}>()

const { t } = useI18n()
const { mutate: review, isPending } = useReviewApplicationMutation()

function handleReview(status: 'APPROVED' | 'REJECTED') {
  review(
    { serverId, eventId, applicationId: application.id, data: { status } },
    {
      onSuccess: () => {
        toast.success(
          status === 'APPROVED'
            ? t('server.events.applications.toast.approved')
            : t('server.events.applications.toast.rejected'),
        )
      },
      onError: () => toast.error(t('server.events.toast.actionError')),
    },
  )
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="size-8 p-0" :disabled="isPending">
        <span class="sr-only">{{ t('server.events.applications.actions.openMenu') }}</span>
        <MoreHorizontal class="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-40">
      <DropdownMenuLabel>{{ t('server.events.applications.actions.label') }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        :disabled="application.status === 'APPROVED' || isPending"
        @click="handleReview('APPROVED')"
      >
        <Check class="mr-2 size-4 text-green-600" />
        {{ t('server.events.applications.actions.approve') }}
      </DropdownMenuItem>
      <DropdownMenuItem
        :disabled="application.status === 'REJECTED' || isPending"
        @click="handleReview('REJECTED')"
      >
        <X class="mr-2 size-4 text-destructive" />
        {{ t('server.events.applications.actions.reject') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
