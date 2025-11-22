<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger>
      <Avatar>
        <!-- <AvatarImage draggable="false" src="https://github.com/unovue.png" alt="@unovue" /> -->
        <AvatarFallback class="text-[1em] font-bold" :style="avatarStyle">
          {{ initials }}
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-64" align="end" side="bottom" :alignOffset="4" :sideOffset="10">
      <DropdownMenuLabel class="px-2 py-1 flex flex-col gap-0">
        <span class="w-full text-left text-foreground truncate">{{
          authStore.user?.username
        }}</span>
        <span class="w-full text-left text-muted-foreground text-xs truncate">
          {{ blurredEmail }}
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
import { LogOutIcon, SettingsIcon } from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { computed } from 'vue'
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
import { hashToHue } from '@/lib/utils/colors'
import { getInitials, maskEmail } from '@/lib/utils/user'
const { store } = useTheme()
const authStore = useAuthStore()
const signOutMutation = useSignOutMutation()

const handleLogout = async () => {
  await signOutMutation.mutateAsync()
  authStore.handleUnauthorized()
}
const DEFAULT_ID = '0'

const avatarStyle = computed(() => {
  const id = authStore.user?.id?.toString() || DEFAULT_ID
  const hue = hashToHue(id)
  const hue2 = (hue + 45) % 360
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${hue2}, 70%, 55%))`,
    color: 'white',
  }
})
const blurredEmail = computed(() => maskEmail(authStore.user?.email))
const initials = computed(() => getInitials(authStore.user?.username))
</script>
