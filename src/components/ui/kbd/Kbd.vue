<template>
    <kbd data-slot="kbd" :class="kbdClasses" v-bind="$attrs">
        <slot />
    </kbd>
</template>
<script setup lang="ts">
import { cn } from '@/lib/utils';
import { computed, type HTMLAttributes } from 'vue'
interface KbdProps {
    class?: HTMLAttributes['class']
}
const props = defineProps<KbdProps>()

const kbdClasses = computed(() => {
    return cn("bg-muted text-muted-foreground point-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        props.class
    )
})

defineOptions({
    inheritAttrs: false
})

</script>