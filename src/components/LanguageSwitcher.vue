<script setup lang="ts">
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/composables/useLanguage'
import type { SupportedLocale } from '@/i18n/messages'

import FlagEN from '@/assets/flags/en.svg'
import FlagRU from '@/assets/flags/ru.svg'

const { currentLocale, } = useLanguage()

const locales: { code: SupportedLocale; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: FlagEN },
    { code: 'ru', label: 'Русский', flag: FlagRU },
]
</script>

<template>
    <DropdownMenu :modal="false">
        <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm" class="flex items-center gap-2">
                <img :src="locales.find(l => l.code === currentLocale)?.flag" alt="flag" class="w-5 h-5 rounded-sm" />
                <span class="uppercase text-sm">{{ currentLocale }}</span>
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="min-w-[130px]">
            <DropdownMenuItem v-for="locale in locales" :key="locale.code" @click="currentLocale = locale.code"
                class="flex items-center gap-2 cursor-pointer">
                <img :src="locale.flag" :alt="locale.label" class="w-5 h-5 rounded-sm" />
                <span>{{ locale.label }}</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
