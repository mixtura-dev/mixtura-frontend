<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ t('server.memberRestrictionsDialog.title') }}</DialogTitle>
        <DialogDescription v-if="member">
          {{ t('server.memberRestrictionsDialog.description', { nickname: member.nickname }) }}
        </DialogDescription>
      </DialogHeader>

      <div v-if="isLoading" class="flex justify-center py-8">
        <Loader2 class="size-6 animate-spin text-muted-foreground" />
      </div>

      <template v-else>
        <div v-if="!restrictions?.length" class="py-8 text-center text-muted-foreground">
          <Ban class="mx-auto mb-2 size-8 opacity-50" />
          <p>{{ t('server.memberRestrictionsDialog.noActiveRestrictions') }}</p>
        </div>

        <div v-else class="space-y-2 max-h-[300px] overflow-y-auto">
          <div
            v-for="restriction in restrictions"
            :key="restriction.id"
            class="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3"
          >
            <div class="flex items-center gap-3">
              <Ban class="size-5 text-destructive shrink-0" />
              <div class="min-w-0">
                <p class="font-medium text-sm">
                  {{
                    t(
                      `server.addRestriction.restrictionCodes.${restriction.restriction.code}`,
                      formatCodeForDisplay(restriction.restriction.code),
                    )
                  }}
                </p>
                <p class="text-xs text-muted-foreground truncate">{{ restriction.reason }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ t('server.memberRestrictionsDialog.expires')
                  }}{{ formatDateTime(restriction.expiration_date) }}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              class="size-8 text-destructive hover:text-destructive shrink-0"
              :disabled="isRemoving === restriction.id"
              @click="handleRemove(restriction.id)"
            >
              <Loader2 v-if="isRemoving === restriction.id" class="size-4 animate-spin" />
              <Trash2 v-else class="size-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="open = false">{{
            t('server.memberRestrictionsDialog.close')
          }}</Button>
          <Button @click="$emit('add-restriction')">
            <Plus class="mr-2 size-4" />
            {{ t('server.memberRestrictionsDialog.addRestrictionButton') }}
          </Button>
        </DialogFooter>
      </template>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Ban, Loader2, Plus, Trash2 } from 'lucide-vue-next'

import type { MemberListItem, ServerID } from '@/types/user'
import { useMemberRestrictionsQuery, useRemoveRestrictionMutation } from '@/api/queries/server'
import { useDateFormatter } from '@/lib/utils/date'
import { formatCodeForDisplay } from '@/lib/utils/formatters'

const props = defineProps<{
  serverId: ServerID
  member: MemberListItem | null
}>()

defineEmits<{
  'add-restriction': []
}>()

const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()

const isRemoving = ref<string | null>(null)

const memberId = computed(() => props.member?.id ?? '')
const serverId = computed(() => props.serverId)

const { data: restrictions, isLoading } = useMemberRestrictionsQuery(serverId, memberId)
const { mutate: removeRestriction } = useRemoveRestrictionMutation()

watch(open, (isOpen) => {
  if (!isOpen) {
    isRemoving.value = null
  }
})

const { formatDateTime } = useDateFormatter()

function handleRemove(restrictionId: string) {
  if (!props.member) return

  isRemoving.value = restrictionId

  removeRestriction(
    {
      serverId: props.serverId,
      memberId: props.member.id,
      restrictionId,
    },
    {
      onSuccess: () => {
        toast.success(t('server.memberRestrictionsDialog.toast.removedSuccess'))
      },
      onError: () => {
        toast.error(t('server.memberRestrictionsDialog.toast.removedError'))
      },
      onSettled: () => {
        isRemoving.value = null
      },
    },
  )
}
</script>
