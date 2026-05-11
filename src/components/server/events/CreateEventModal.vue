<script setup lang="ts">
import { computed, watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useCreateEvent } from '@/composables/useCreateEvent'
import { useUpdateEventMutation } from '@/api/queries/event'
import type { ServerID } from '@/types/user'
import type { components } from '@/types/api'

type EventDetail = components['schemas']['EventDetailResponse']

const props = defineProps<{
  serverId: ServerID
  event?: EventDetail | null
}>()

const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const { handleCreate, isPending: isCreatePending } = useCreateEvent(() => props.serverId)
const { mutate: updateEvent, isPending: isUpdatePending } = useUpdateEventMutation()

const isEditMode = computed(() => !!props.event)
const isPending = computed(() => isCreatePending.value || isUpdatePending.value)

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, t('validation.required')),
    matchType: z.enum(['SINGLE', 'TOURNAMENT'], {
      required_error: t('validation.required'),
    }),
    useApplication: z.boolean().default(false),
    isPublic: z.boolean().default(false),
    teamSize: z.coerce.number().min(1).max(100),
    teamFormation: z.enum(['DRAFT', 'BALANCE', 'MANUAL'], {
      required_error: t('validation.required'),
    }),
    allowMultipleDrafts: z.boolean().default(false),
  }),
)

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    matchType: 'SINGLE' as const,
    useApplication: false,
    isPublic: false,
    teamSize: 5,
    teamFormation: 'BALANCE' as const,
    allowMultipleDrafts: false,
  },
})

watch(
  () => props.event,
  (event) => {
    if (event) {
      setValues({
        name: event.name,
        matchType: event.match_type,
        useApplication: event.use_application,
        isPublic: event.is_public,
        teamSize: event.team_size,
        teamFormation: event.team_formation,
        allowMultipleDrafts: event.allow_multiple_drafts,
      })
    }
  },
  { immediate: true },
)

watch(open, (val) => {
  if (!val && !isEditMode.value) {
    resetForm()
  }
})

const onSubmit = handleSubmit((values) => {
  if (isEditMode.value && props.event) {
    updateEvent(
      {
        serverId: props.serverId,
        eventId: props.event.id,
        data: {
          name: values.name,
          match_type: values.matchType,
          use_application: values.useApplication,
          is_public: values.isPublic,
          team_size: values.teamSize,
          team_formation: values.teamFormation,
          allow_multiple_drafts: values.allowMultipleDrafts,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('server.events.updateEvent.toast.success'))
          open.value = false
        },
        onError: () => toast.error(t('server.events.updateEvent.toast.error')),
      },
    )
  } else {
    handleCreate(
      {
        name: values.name,
        match_type: values.matchType,
        use_application: values.useApplication,
        is_public: values.isPublic,
        team_size: values.teamSize,
        team_formation: values.teamFormation,
        allow_multiple_drafts: values.allowMultipleDrafts,
      },
      {
        onSuccess: () => {
          resetForm()
          open.value = false
        },
      },
    )
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{
            isEditMode ? t('server.events.updateEvent.title') : t('server.events.createEvent.title')
          }}
        </DialogTitle>
        <DialogDescription>
          {{
            isEditMode
              ? t('server.events.updateEvent.description')
              : t('server.events.createEvent.description')
          }}
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>{{ t('server.events.createEvent.name') }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                :placeholder="t('server.events.createEvent.namePlaceholder')"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="matchType">
          <FormItem>
            <FormLabel>{{ t('server.events.createEvent.matchType') }}</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue :placeholder="t('server.events.createEvent.matchTypePlaceholder')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">
                    {{ t('server.events.createEvent.single') }}
                  </SelectItem>
                  <SelectItem value="TOURNAMENT">
                    {{ t('server.events.createEvent.tournament') }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex flex-col gap-4">
          <FormField v-slot="{ field, handleChange }" name="useApplication">
            <FormItem class="flex items-center justify-between rounded-lg border p-3">
              <FormLabel class="mb-0 font-normal">
                {{ t('server.events.createEvent.useApplication') }}
              </FormLabel>
              <FormControl>
                <Switch :model-value="!!field.value" @update:model-value="handleChange" />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ field, handleChange }" name="isPublic">
            <FormItem class="flex items-center justify-between rounded-lg border p-3">
              <FormLabel class="mb-0 font-normal">
                {{ t('server.events.createEvent.isPublic') }}
              </FormLabel>
              <FormControl>
                <Switch :model-value="!!field.value" @update:model-value="handleChange" />
              </FormControl>
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ componentField }" name="teamSize">
          <FormItem>
            <FormLabel>{{ t('server.events.createEvent.teamSize') }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="number"
                min="1"
                max="100"
                :placeholder="t('server.events.createEvent.teamSizePlaceholder')"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="teamFormation">
          <FormItem>
            <FormLabel>{{ t('server.events.createEvent.teamFormation') }}</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue
                    :placeholder="t('server.events.createEvent.teamFormationPlaceholder')"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">
                    {{ t('server.events.createEvent.draft') }}
                  </SelectItem>
                  <SelectItem value="BALANCE">
                    {{ t('server.events.createEvent.balance') }}
                  </SelectItem>
                  <SelectItem value="MANUAL">
                    {{ t('server.events.createEvent.manual') }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field, handleChange }" name="allowMultipleDrafts">
          <FormItem class="flex items-center justify-between rounded-lg border p-3">
            <FormLabel class="mb-0 font-normal">
              {{ t('server.events.createEvent.allowMultipleDrafts') }}
            </FormLabel>
            <FormControl>
              <Switch
                :model-value="!!field.value"
                @update:model-value="handleChange"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false">
            {{ t('server.events.createEvent.cancel') }}
          </Button>
          <Button type="submit" :disabled="isPending || isSubmitting">
            <Loader2 v-if="isPending || isSubmitting" class="mr-2 size-4 animate-spin" />
            {{
              isEditMode
                ? t('server.events.updateEvent.saveButton')
                : t('server.events.createEvent.createButton')
            }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
