<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Add Restriction</DialogTitle>
        <DialogDescription> Add a new restriction to the member </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label>Restriction Type</Label>
          <Select v-model="form.restriction_id">
            <SelectTrigger>
              <SelectValue placeholder="Select restriction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="type in restrictionTypes" :key="type.id" :value="type.id">
                {{ formatRestrictionName(type.code) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Reason -->
        <div class="space-y-2">
          <Label>Reason</Label>
          <Textarea
            v-model="form.reason"
            placeholder="Enter reason for this restriction"
            rows="3"
          />
        </div>

        <!-- Duration -->
        <div class="space-y-2">
          <Label>Duration</Label>
          <div class="flex gap-2">
            <Input
              v-model.number="form.duration"
              type="number"
              min="1"
              placeholder="Duration"
              class="flex-1"
              :disabled="form.duration_unit === 'permanent'"
            />
            <Select v-model="form.duration_unit">
              <SelectTrigger class="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false"> Cancel </Button>
          <Button type="submit" :disabled="!isValid || isPending">
            <Loader2 v-if="isPending" class="mr-2 size-4 animate-spin" />
            Add Restriction
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { toast } from 'vue-sonner'
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

type DurationUnit = 'minutes' | 'hours' | 'days' | 'weeks' | 'permanent'

const props = defineProps<{
  serverId: ServerID
  memberId?: string | null
}>()

const emit = defineEmits<{
  added: []
}>()

const open = defineModel<boolean>('open', { required: true })

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
    (form.duration_unit === 'permanent' || form.duration > 0),
)

function formatRestrictionName(code: string): string {
  return code
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function calculateExpirationDate(): string {
  if (form.duration_unit === 'permanent') {
    return new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
  }

  const multipliers: Record<string, number> = {
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
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
        toast.success('Restriction added')
        emit('added')
        resetForm()
      },
      onError: () => toast.error('Failed to add restriction'),
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
