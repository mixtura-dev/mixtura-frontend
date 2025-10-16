<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger>
      <Avatar>
        <AvatarImage draggable="false" src="https://github.com/unovue.png" alt="@unovue" />
        <AvatarFallback class="text-sm">
          <Loader2 class="animate-spin" />
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-64" align="end" side="bottom" :alignOffset="4">
      <DropdownMenuLabel class="px-2 py-1 flex flex-col gap-0">
        <span class="w-full text-left text-foreground truncate">{{
          authStore.user?.username
        }}</span>
        <span class="w-full text-left text-muted-foreground text-xs truncate">
          {{ authStore.user?.email }}
        </span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link to="/account">
        <span class="text-xs flex items-center gap-2">
          <SettingsIcon class="size-3.5" aria-hidden="true" />
          {{ $t('account.title') }}
        </span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuLabel class="text-muted-foreground">{{ $t('theme.title') }}</DropdownMenuLabel>

      <DropdownMenuRadioGroup v-model="store">
        <DropdownMenuRadioItem v-for="theme in THEMES" :value="theme.value" :key="theme.value">
          <span class="text-xs"> {{ $t(theme.label) }}</span>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>

      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleLogout" asChild>
        <span class="text-xs flex items-center gap-2">
          <LogOutIcon class="size-3.5" aria-hidden="true" />
          {{ $t('common.logout') }}
        </span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Loader2, LogOutIcon, SettingsIcon } from 'lucide-vue-next'
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
import { useSignOutMutation } from '@/composables/useAuthQuery'
import { Link } from '@/components/ui/link'
const { store } = useTheme()
const authStore = useAuthStore()
const signOutMutation = useSignOutMutation()

const handleLogout = async () => {
  await signOutMutation.mutateAsync()
  authStore.handleUnauthorized()
}
</script>
