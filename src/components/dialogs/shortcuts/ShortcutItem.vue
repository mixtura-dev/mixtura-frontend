<template>
    <div class="box-border flex flex-col gap-2 p-3 rounded-md bg-muted/50">
        <div class="text-sm leading-none">{{ item.description }}</div>
        <div class="flex flex-col gap-2">
            <KbdGroup v-for="(combo, idx) in props.item.combos" :key="idx">
                <Kbd v-for="(key, i) in combo.keys" :key="i">
                    <component v-if="typeof key !== 'string'" :is="key" />
                    <span v-else>{{ key }}</span>
                </Kbd>
            </KbdGroup>
        </div>
    </div>
</template>


<script setup lang="ts">
import Kbd from '@/components/ui/kbd/Kbd.vue'
import KbdGroup from '@/components/ui/kbd/KbdGroup.vue'
import type { Component } from 'vue'

export interface Combo {
    keys: (string | Component)[]
}

export interface Shortcut {
    description: string
    combos: Combo[]
}

const props = defineProps<{ item: Shortcut }>()
</script>