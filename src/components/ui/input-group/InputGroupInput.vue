<template>
    <Input data-slot="input-group-control" :class="inputClasses" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { Input } from "@/components/ui/input";

interface InputGroupInputProps {
    class?: string
}

const props = defineProps<InputGroupInputProps>()

defineOptions({
    inheritAttrs: false
})

const inputClasses = computed(() =>
    cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        props.class
    )
)
</script>