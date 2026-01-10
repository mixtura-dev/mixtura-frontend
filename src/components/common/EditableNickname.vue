<template>
  <div class="group relative inline-flex items-center gap-1">
    <template v-if="!isEditing">
      <span
        class="cursor-pointer rounded px-1 transition-colors"
        :class="{ 'hover:bg-muted': canEdit }"
        @dblclick="startEditing"
      >
        {{ modelValue }}
      </span>
      <Button
        v-if="canEdit"
        variant="ghost"
        size="icon"
        class="size-6 transition-opacity"
        @click="startEditing"
      >
        <Pencil class="size-3" />
      </Button>
    </template>

    <template v-else>
      <div class="flex items-center gap-1">
        <Input
          ref="inputRef"
          v-model="localValue"
          class="h-7 w-40 text-sm"
          :maxlength="32"
          @keydown.enter="save"
          @keydown.escape="cancel"
        />
        <Button variant="ghost" size="icon" class="size-6" :disabled="isSaving" @click="save">
          <Check v-if="!isSaving" class="size-3 text-primary" />
          <Loader2 v-else class="size-3 animate-spin" />
        </Button>
        <Button variant="ghost" size="icon" class="size-6" :disabled="isSaving" @click="cancel">
          <X class="size-3" />
        </Button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Loader2, Pencil, X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: string
    canEdit?: boolean
  }>(),
  {
    canEdit: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  save: [value: string]
}>()

const isEditing = ref(false)
const isSaving = ref(false)
const localValue = ref('')
const inputRef = ref<InstanceType<typeof Input> | null>(null)

function startEditing() {
  if (!props.canEdit) return
  localValue.value = props.modelValue
  isEditing.value = true
  nextTick(() => {
    const input = inputRef.value?.$el as HTMLInputElement | undefined
    input?.focus()
    input?.select()
  })
}

function save() {
  if (isSaving.value) return
  const trimmed = localValue.value.trim()

  if (!trimmed || trimmed === props.modelValue) {
    cancel()
    return
  }

  isSaving.value = true
  emit('save', trimmed)
  emit('update:modelValue', trimmed)
  isEditing.value = false
  isSaving.value = false
}

function cancel() {
  isEditing.value = false
  localValue.value = props.modelValue
}
</script>
