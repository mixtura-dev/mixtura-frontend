<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { isAxiosError } from 'axios'
import { Loader2, Trash2, Clock, FileText, AlertCircle, ChevronDownIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { DateValue } from '@internationalized/date'
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  useApplicationFormQuery,
  useUpdateTimeSettingsMutation,
  useAddCustomFieldMutation,
  useUpdateCustomFieldMutation,
  useDeleteCustomFieldMutation,
} from '@/api/queries/event'
import type { ServerID } from '@/types/user'
import type { components } from '@/types/api'

type FormField = components['schemas']['ApplicationFormFieldResponse']

const props = defineProps<{
  serverId: ServerID
  eventId: string
  useApplication?: boolean
}>()

const { t } = useI18n()

const {
  data: form,
  isLoading,
  isError,
  error,
  refetch,
} = useApplicationFormQuery(props.serverId, props.eventId)

const isAppsDisabled = computed(() => {
  if (!error.value) return false
  return isAxiosError(error.value) && error.value.response?.status === 400
})

function onAppsError() {
  toast.error(t('server.events.settings.applicationTab.toast.appsDisabled'))
}

watch(
  () => props.useApplication,
  (val) => {
    if (val) {
      refetch()
    }
  },
)

const { mutate: updateTimeSettings, isPending: isSavingTime } = useUpdateTimeSettingsMutation()
const { mutate: addCustomField, isPending: isAddingField } = useAddCustomFieldMutation()
const { mutate: updateCustomField, isPending: isUpdatingField } = useUpdateCustomFieldMutation()
const { mutate: deleteCustomField, isPending: isDeletingField } = useDeleteCustomFieldMutation()

// ---- Time Settings ----

const hasServerTimes = computed(() => {
  if (!form.value?.time_settings) return false
  return form.value.time_settings.start_time != null || form.value.time_settings.end_time != null
})

const showScheduleEditor = ref(false)

watch(
  hasServerTimes,
  (val) => {
    if (val) showScheduleEditor.value = true
  },
  { immediate: true },
)

const startDate = ref<DateValue>()
const startTime = ref('00:00')
const startOpen = ref(false)
const endDate = ref<DateValue>()
const endTime = ref('00:00')
const endOpen = ref(false)

function parseISO(iso: string | null | undefined): { date: DateValue | undefined; time: string } {
  if (!iso) return { date: undefined, time: '00:00' }
  const d = new Date(iso)
  return {
    date: new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate()),
    time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
  }
}

function buildISO(date: DateValue | undefined, time: string): string | null {
  if (!date) return null
  const [h, m] = time.split(':').map(Number)
  const jsDate = date.toDate(getLocalTimeZone())
  jsDate.setHours(h || 0, m || 0, 0, 0)
  return jsDate.toISOString()
}

watch(
  () => form.value?.time_settings,
  (settings) => {
    if (settings) {
      const s = parseISO(settings.start_time)
      startDate.value = s.date
      startTime.value = s.time
      const e = parseISO(settings.end_time)
      endDate.value = e.date
      endTime.value = e.time
    }
  },
  { immediate: true },
)

function handleSwitchChange(val: boolean) {
  if (val) {
    showScheduleEditor.value = true
  } else {
    showScheduleEditor.value = false
    updateTimeSettings(
      {
        serverId: props.serverId,
        eventId: props.eventId,
        data: { start_time: null, end_time: null },
      },
      {
        onSuccess: () => {
          toast.success(t('server.events.settings.applicationTab.timeSettings.toast.reset'))
        },
        onError: (err) => {
          if (isAxiosError(err) && err.response?.status === 400) {
            onAppsError()
          } else {
            toast.error(t('server.events.settings.applicationTab.timeSettings.toast.error'))
          }
        },
      },
    )
  }
}

function handleSaveTime() {
  updateTimeSettings(
    {
      serverId: props.serverId,
      eventId: props.eventId,
      data: {
        start_time: buildISO(startDate.value, startTime.value),
        end_time: buildISO(endDate.value, endTime.value),
      },
    },
    {
      onSuccess: () =>
        toast.success(t('server.events.settings.applicationTab.timeSettings.toast.saved')),
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 400) {
          onAppsError()
        } else {
          toast.error(t('server.events.settings.applicationTab.timeSettings.toast.error'))
        }
      },
    },
  )
}

// ---- Custom Fields ----

const newFieldName = ref('')
const newFieldIsRequired = ref(false)
const newFieldIsPrivate = ref(false)

function handleAddField() {
  if (!newFieldName.value.trim()) return
  addCustomField(
    {
      serverId: props.serverId,
      eventId: props.eventId,
      data: {
        name: newFieldName.value.trim(),
        is_required: newFieldIsRequired.value,
        is_private: newFieldIsPrivate.value,
      },
    },
    {
      onSuccess: () => {
        toast.success(t('server.events.settings.applicationTab.customFields.toast.added'))
        newFieldName.value = ''
        newFieldIsRequired.value = false
        newFieldIsPrivate.value = false
      },
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 400) {
          onAppsError()
        } else {
          toast.error(t('server.events.settings.applicationTab.customFields.toast.error'))
        }
      },
    },
  )
}

function handleUpdateField(field: FormField) {
  updateCustomField(
    {
      serverId: props.serverId,
      eventId: props.eventId,
      fieldId: field.id,
      data: {
        name: field.name,
        is_required: field.is_required,
        is_private: field.is_private,
      },
    },
    {
      onSuccess: () =>
        toast.success(t('server.events.settings.applicationTab.customFields.toast.updated')),
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 400) {
          onAppsError()
        } else {
          toast.error(t('server.events.settings.applicationTab.customFields.toast.error'))
        }
      },
    },
  )
}

function handleDeleteField(fieldId: string) {
  deleteCustomField(
    { serverId: props.serverId, eventId: props.eventId, fieldId },
    {
      onSuccess: () =>
        toast.success(t('server.events.settings.applicationTab.customFields.toast.deleted')),
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 400) {
          onAppsError()
        } else {
          toast.error(t('server.events.settings.applicationTab.customFields.toast.error'))
        }
      },
    },
  )
}

// Track editing state for each field
const editingFields = ref<Record<string, FormField>>({})

const formFields = computed(() => {
  if (!form.value?.custom_fields) return []
  return form.value.custom_fields
})

watch(
  formFields,
  (fields) => {
    for (const field of fields) {
      if (!editingFields.value[field.id]) {
        editingFields.value[field.id] = { ...field }
      }
    }
  },
  { immediate: true, deep: true },
)

function getFieldDraft(field: FormField): FormField {
  return editingFields.value[field.id]
}
</script>

<template>
  <div class="space-y-6">
    <!-- Apps not enabled -->
    <div v-if="useApplication === false" class="flex flex-col items-center gap-3 py-6 text-center">
      <AlertCircle class="size-8 text-muted-foreground" />
      <p class="text-sm text-muted-foreground">
        {{ t('server.events.settings.applicationTab.appsDisabled') }}
      </p>
    </div>

    <!-- Loading -->
    <template v-else-if="isLoading">
      <div class="space-y-3">
        <Skeleton class="h-5 w-40" />
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
      </div>
      <Separator />
      <div class="space-y-3">
        <Skeleton class="h-5 w-40" />
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-3/4" />
      </div>
    </template>

    <!-- Error: apps not enabled (API 400 fallback) -->
    <div v-else-if="isAppsDisabled" class="flex flex-col items-center gap-3 py-6 text-center">
      <AlertCircle class="size-8 text-muted-foreground" />
      <p class="text-sm text-muted-foreground">
        {{ t('server.events.settings.applicationTab.appsDisabled') }}
      </p>
    </div>

    <!-- Error: other -->
    <div v-else-if="isError" class="flex flex-col items-center gap-3 py-6 text-center">
      <AlertCircle class="size-8 text-destructive" />
      <p class="text-sm text-muted-foreground">
        {{ t('server.events.settings.applicationTab.loadError') }}
      </p>
      <Button variant="outline" size="sm" @click="refetch()">
        {{ t('server.events.settings.applicationTab.retry') }}
      </Button>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Time Settings Section -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <Clock class="size-4 text-muted-foreground" />
          <h3 class="text-sm font-medium">
            {{ t('server.events.settings.applicationTab.timeSettings.title') }}
          </h3>
        </div>

        <div class="rounded-md border p-3 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm" :class="hasServerTimes ? '' : 'text-muted-foreground'">
              {{
                hasServerTimes
                  ? t('server.events.settings.applicationTab.timeSettings.scheduledMode')
                  : t('server.events.settings.applicationTab.timeSettings.manualMode')
              }}
            </span>
            <Switch :modelValue="showScheduleEditor" @update:modelValue="handleSwitchChange" />
          </div>

          <p v-if="!showScheduleEditor" class="text-xs text-muted-foreground">
            {{ t('server.events.settings.applicationTab.timeSettings.manualDescription') }}
          </p>

          <template v-if="showScheduleEditor">
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-3">
                <Label for="start-date" class="px-1">{{
                  t('server.events.settings.applicationTab.timeSettings.startTime')
                }}</Label>
                <div class="flex gap-2">
                  <Popover v-model:open="startOpen">
                    <PopoverTrigger as-child>
                      <Button
                        id="start-date"
                        variant="outline"
                        :class="
                          cn(
                            'w-32 justify-between font-normal',
                            !startDate && 'text-muted-foreground',
                          )
                        "
                      >
                        {{
                          startDate
                            ? startDate.toDate(getLocalTimeZone()).toLocaleDateString()
                            : t('server.events.settings.applicationTab.timeSettings.pickDate')
                        }}
                        <ChevronDownIcon class="size-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        :model-value="startDate"
                        :max-value="today(getLocalTimeZone())"
                        @update:model-value="
                          (value) => {
                            if (value) {
                              startDate = value
                              startOpen = false
                            }
                          }
                        "
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    id="start-time"
                    v-model="startTime"
                    type="time"
                    step="1"
                    class="w-32 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <Label for="end-date" class="px-1">{{
                  t('server.events.settings.applicationTab.timeSettings.endTime')
                }}</Label>
                <div class="flex gap-2">
                  <Popover v-model:open="endOpen">
                    <PopoverTrigger as-child>
                      <Button
                        id="end-date"
                        variant="outline"
                        :class="
                          cn(
                            'w-32 justify-between font-normal',
                            !endDate && 'text-muted-foreground',
                          )
                        "
                      >
                        {{
                          endDate
                            ? endDate.toDate(getLocalTimeZone()).toLocaleDateString()
                            : t('server.events.settings.applicationTab.timeSettings.pickDate')
                        }}
                        <ChevronDownIcon class="size-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        :model-value="endDate"
                        :min-value="startDate ?? undefined"
                        :max-value="today(getLocalTimeZone())"
                        @update:model-value="
                          (value) => {
                            if (value) {
                              endDate = value
                              endOpen = false
                            }
                          }
                        "
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    id="end-time"
                    v-model="endTime"
                    type="time"
                    step="1"
                    class="w-32 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                  />
                </div>
              </div>
            </div>
            <Button :disabled="isSavingTime" @click="handleSaveTime">
              <Loader2 v-if="isSavingTime" class="mr-2 size-4 animate-spin" />
              {{ t('server.events.settings.applicationTab.timeSettings.save') }}
            </Button>
          </template>
        </div>
      </div>

      <Separator />

      <!-- Custom Fields Section -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <FileText class="size-4 text-muted-foreground" />
          <h3 class="text-sm font-medium">
            {{ t('server.events.settings.applicationTab.customFields.title') }}
          </h3>
        </div>

        <!-- Empty state -->
        <div
          v-if="formFields.length === 0"
          class="flex flex-col items-center gap-2 py-4 text-center"
        >
          <FileText class="size-8 text-muted-foreground/50" />
          <p class="text-sm text-muted-foreground">
            {{ t('server.events.settings.applicationTab.customFields.empty') }}
          </p>
        </div>

        <!-- Existing fields -->
        <div v-else class="space-y-2">
          <div v-for="field in formFields" :key="field.id" class="rounded-md border p-3 space-y-2">
            <div class="flex items-center gap-2">
              <Input v-model="getFieldDraft(field).name" class="flex-1" />
              <AlertDialog>
                <AlertDialogTrigger as-child>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-8 hover:text-destructive shrink-0"
                  >
                    <Trash2 class="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{{
                      t('server.events.settings.applicationTab.customFields.deleteConfirmTitle')
                    }}</AlertDialogTitle>
                    <AlertDialogDescription>{{
                      t(
                        'server.events.settings.applicationTab.customFields.deleteConfirmDescription',
                      )
                    }}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{{
                      t('server.events.settings.applicationTab.customFields.deleteConfirmCancel')
                    }}</AlertDialogCancel>
                    <AlertDialogAction @click="handleDeleteField(field.id)">
                      <Loader2 v-if="isDeletingField" class="mr-2 size-4 animate-spin" />
                      {{
                        t('server.events.settings.applicationTab.customFields.deleteConfirmAction')
                      }}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <Checkbox :id="`required-${field.id}`" v-model="getFieldDraft(field).is_required" />
                <Label :for="`required-${field.id}`">{{
                  t('server.events.settings.applicationTab.customFields.isRequired')
                }}</Label>
              </div>
              <div class="flex items-center gap-2">
                <Checkbox :id="`private-${field.id}`" v-model="getFieldDraft(field).is_private" />
                <Label :for="`private-${field.id}`">{{
                  t('server.events.settings.applicationTab.customFields.isPrivate')
                }}</Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                class="ml-auto"
                :disabled="
                  isUpdatingField ||
                  (getFieldDraft(field).name === field.name &&
                    getFieldDraft(field).is_required === field.is_required &&
                    getFieldDraft(field).is_private === field.is_private)
                "
                @click="handleUpdateField(getFieldDraft(field))"
              >
                <Loader2 v-if="isUpdatingField" class="mr-1 size-3 animate-spin" />
                {{ t('server.events.settings.applicationTab.customFields.save') }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Add new field form -->
        <div class="space-y-2 pt-2 border-t">
          <Input
            v-model="newFieldName"
            :placeholder="t('server.events.settings.applicationTab.customFields.addPlaceholder')"
          />
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <Checkbox
                id="new-field-required"
                :modelValue="newFieldIsRequired"
                @update:modelValue="newFieldIsRequired = $event as boolean"
              />
              <Label for="new-field-required">{{
                t('server.events.settings.applicationTab.customFields.isRequired')
              }}</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox
                id="new-field-private"
                :modelValue="newFieldIsPrivate"
                @update:modelValue="newFieldIsPrivate = $event as boolean"
              />
              <Label for="new-field-private">{{
                t('server.events.settings.applicationTab.customFields.isPrivate')
              }}</Label>
            </div>
          </div>
          <Button :disabled="!newFieldName.trim() || isAddingField" @click="handleAddField">
            <Loader2 v-if="isAddingField" class="mr-2 size-4 animate-spin" />
            {{ t('server.events.settings.applicationTab.customFields.addButton') }}
          </Button>
        </div>
      </div>
    </template>
  </div>
</template>
