<template>
    <div class="grid gap-4 py-4 overflow-y-auto px-6">
        <div v-for="section in props.sections" :key="section.title" class="py-6 border-b last:border-b-0 last:py-0">
            <h2 class="text-lg font-semibold">{{ section.title }}</h2>
            <div class="grid gap-6 mt-2 py-2 grid-cols-[repeat(auto-fill,_minmax(180px,max-content))]">
                <ShortcutItem v-for="(item, i) in section.items" :key="i" :item="item" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ShortcutItem, { type Combo } from '@/components/dialogs/shortcuts/ShortcutItem.vue';

interface Shortcut {
    description: string
    combos: Combo[]
}

export interface Section {
    title: string
    items: Shortcut[]
}
const props = defineProps<{ sections: Section[] }>()
</script>
