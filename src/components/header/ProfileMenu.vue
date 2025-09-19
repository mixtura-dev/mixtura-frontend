<template>

    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Avatar class="cursor-pointer">
                <AvatarImage draggable="false" src="https://github.com/unovue.png" alt="@unovue" />
                <AvatarFallback class=" text-sm">CN</AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-64" align="end" side="bottom" :alignOffset="4">
            <DropdownMenuLabel class="px-2 py-1 flex flex-col gap-0">
                <span class="w-full text-left text-foreground truncate">Eg0r0k</span>
                <span class="w-full text-left text-muted-foreground text-xs truncate">
                    egokakill@gmail.com
                </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <RouterLink to="/account">
                    <span class="text-xs flex items-center gap-2 ">
                        <SettingsIcon class=" size-3.5" />
                        Account Preferences
                    </span>
                </RouterLink>

            </DropdownMenuItem>
            <DropdownMenuLabel class=" text-muted-foreground">Theme</DropdownMenuLabel>

            <DropdownMenuRadioGroup v-model="mode">
                <DropdownMenuRadioItem v-for="theme in THEMES" :value="theme.value" :key="theme.value">
                    <span class="text-xs"> {{ theme.label }}</span>
                </DropdownMenuRadioItem>

            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem @click="authStore.logout">
                <span class="text-xs">
                    Log out
                </span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

</template>

<script setup lang="ts">

//TODO: Add fetch user data from API

import { SettingsIcon } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DropdownMenuRadioGroup from '@/components/ui/dropdown-menu/DropdownMenuRadioGroup.vue'
import DropdownMenuRadioItem from '@/components/ui/dropdown-menu/DropdownMenuRadioItem.vue'
import { THEMES } from '@/constants/theme'
import { useAuthStore } from '@/stores/authStore.store'
import { useTheme } from '@/composables/useTheme'
const { mode } = useTheme()
const authStore = useAuthStore()

</script>