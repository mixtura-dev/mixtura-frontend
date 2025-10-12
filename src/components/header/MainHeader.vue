<template>
  <header
    role="banner"
    class="flex z-20 bg-background h-12 items-center flex-shrink-0 border-b w-full"
  >
    <div class="flex h-full items-center justify-between px-3 flex-1 overflow-x-auto gap-x-8">
      <div class="flex items-center">
        <RouterLink
          to="/"
          class="flex-shrink-0 hidden md:flex items-center justify-center"
          :aria-label="$t('menu.home')"
        >
          <Scale aria-hidden="true" />
        </RouterLink>
        <div class="flex items-center md:pl-2">
          <span class="pr-2 hidden md:block">
            <SlashIcon aria-hidden="true" />
          </span>

          <WorkspaceMenu />
        </div>
      </div>
      <div class="flex items-center gap-x-2">
        <Button variant="ghost" size="icon" class="!p-1 size-7">
          <HelpCircleIcon class="size-3.5" aria-hidden="true" />
          <span class="hidden-visually">Help</span>
        </Button>
        <ProfileMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ProfileMenu from './ProfileMenu.vue'
import SlashIcon from '../icons/SlashIcon.vue'
import { HelpCircleIcon, Scale } from 'lucide-vue-next'
import WorkspaceMenu from './WorkspaceMenu.vue'
import { Button } from '@/components/ui/button'
</script>
