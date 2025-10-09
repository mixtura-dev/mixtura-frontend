<template>
    <span :class="textClasses" v-bind="$attrs">
        <slot />
    </span>
</template>

<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface InputGroupTextProps {
    class?: HTMLAttributes["class"]
}

const props = defineProps<InputGroupTextProps>()

defineOptions({
    inheritAttrs: false
})

const textClasses = computed(() =>
    cn(
        "text-muted-foreground flex items-center gap-2 text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        props.class
    )
)
</script>