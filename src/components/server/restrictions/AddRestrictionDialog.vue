<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ t('server.addRestriction.title') }}</DialogTitle>
        <DialogDescription> {{ t('server.addRestriction.description') }} </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label>{{ t('server.addRestriction.restrictionType') }}</Label>
          <Select v-model="form.restriction_id">
            <SelectTrigger>
              <SelectValue :placeholder="t('server.addRestriction.selectRestrictionType')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="type in restrictionTypes" :key="type.id" :value="type.id">
                {{
                  t(
                    `server.addRestriction.restrictionCodes.${type.code}`,
                    formatCodeForDisplay(type.code),
                  )
                }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label>{{ t('server.addRestriction.reason') }}</Label>
          <Textarea
            v-model="form.reason"
            :placeholder="t('server.addRestriction.enterReason')"
            rows="3"
          />
        </div>

        <div class="space-y-2">
          <Label>{{ t('server.addRestriction.duration') }}</Label>
          <div class="flex gap-2">
            <Input
              v-model.number="form.duration"
              type="number"
              min="1"
              :placeholder="t('server.addRestriction.durationPlaceholder')"
              class="flex-1"
              :disabled="form.duration_unit === 'permanent'"
            />
            <Select v-model="form.duration_unit">
              <SelectTrigger class="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">{{
                  t('server.addRestriction.durationUnits.minutes')
                }}</SelectItem>
                <SelectItem value="hours">{{
                  t('server.addRestriction.durationUnits.hours')
                }}</SelectItem>
                <SelectItem value="days">{{
                  t('server.addRestriction.durationUnits.days')
                }}</SelectItem>
                <SelectItem value="weeks">{{
                  t('server.addRestriction.durationUnits.weeks')
                }}</SelectItem>
                <SelectItem value="permanent">{{
                  t('server.addRestriction.durationUnits.permanent')
                }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false">
            {{ t('server.addRestriction.cancel') }}
          </Button>
          <Button type="submit" :disabled="!isValid || isPending">
            <Loader2 v-if="isPending" class="mr-2 size-4 animate-spin" />
            {{ t('server.addRestriction.addRestrictionButton') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-vue-next'

import type { ServerID } from '@/types/user'
import { useAddRestrictionMutation, useGlobalRestrictionsQuery } from '@/api/queries/server'
import { formatCodeForDisplay } from '@/lib/utils/formatters' // <-- Импорт новой утилиты

type DurationUnit = 'minutes' | 'hours' | 'days' | 'weeks' | 'permanent'

const props = defineProps<{
  serverId: ServerID
  memberId?: string | null
}>()

const emit = defineEmits<{
  added: []
}>()

const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()

const form = reactive({
  restriction_id: '',
  reason: '',
  duration: 1,
  duration_unit: 'days' as DurationUnit,
})

const { mutate: addRestriction, isPending } = useAddRestrictionMutation()
const { data: restrictionsData } = useGlobalRestrictionsQuery()

const restrictionTypes = computed(() => restrictionsData.value ?? [])

const isValid = computed(
  () =>
    form.restriction_id &&
    form.reason.trim() &&
    (form.duration_unit === 'permanent' || (form.duration && form.duration > 0)),
)

function calculateExpirationDate(): string {
  if (form.duration_unit === 'permanent') {
    return new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
  }

  const multipliers: Record<DurationUnit, number> = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    permanent: 0,
  }

  const ms = form.duration * multipliers[form.duration_unit]
  return new Date(Date.now() + ms).toISOString()
}

function handleSubmit() {
  if (!props.memberId || !isValid.value) return

  addRestriction(
    {
      serverId: props.serverId,
      memberId: props.memberId,
      data: {
        restriction_id: form.restriction_id,
        reason: form.reason.trim(),
        expiration_date: calculateExpirationDate(),
      },
    },
    {
      onSuccess: () => {
        toast.success(t('addRestriction.toast.success'))
        emit('added')
        resetForm()
      },
      onError: () => toast.error(t('addRestriction.toast.error')),
    },
  )
}

function resetForm() {
  form.restriction_id = ''
  form.reason = ''
  form.duration = 1
  form.duration_unit = 'days'
}
</script>
