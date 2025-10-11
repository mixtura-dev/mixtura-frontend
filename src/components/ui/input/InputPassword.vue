<template>
    <InputGroup :class="cn('w-full', props.class)">
        <InputGroupInput v-model="modelValue" :type="showPassword ? 'text' : 'password'" :disabled="props.disabled"
            v-bind="$attrs" />
        <InputGroupAddon align="inline-end">
            <InputGroupButton v-if="modelValue" type="button" size="icon-xs" @click="clearInput"
                :disabled="props.disabled">
                <X />
            </InputGroupButton>
            <InputGroupButton type="button" size="icon-xs" @click="togglePassword" :disabled="props.disabled">
                <component :is="showPassword ? EyeOff : Eye" class="h-4 w-4" />
            </InputGroupButton>
        </InputGroupAddon>
    </InputGroup>
</template>

<script setup lang="ts">
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, X } from 'lucide-vue-next'
import { ref, type HTMLAttributes } from 'vue'

defineOptions({
    inheritAttrs: false
})

interface InputPasswordProps {
    modelValue?: string
    class?: HTMLAttributes['class']
    disabled?: boolean
}

const props = withDefaults(defineProps<InputPasswordProps>(), {
    modelValue: '',
    disabled: false,
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const modelValue = useVModel(props, 'modelValue', emit, {
    passive: true,
    defaultValue: '',
})

const showPassword = ref(false)

const togglePassword = () => {
    showPassword.value = !showPassword.value
}
const clearInput = () => {
    modelValue.value = ''
}

</script>