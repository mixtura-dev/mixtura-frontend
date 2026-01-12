<template>
  <header
    role="banner"
    class="flex z-20 bg-background h-[65px] items-center flex-shrink-0 border-b w-full"
  >
    <div class="flex h-full items-center justify-between px-3 flex-1 overflow-x-auto gap-x-8">
      <div class="flex items-center gap-3">
        <!-- <template v-if="serverId">
          <div class="flex items-center gap-2">
            <ServerIcon class="size-5 text-muted-foreground" />
            <span class="font-semibold text-sm truncate max-w-[200px]">
              {{ server?.name ?? $t('common.loading') }}
            </span>
          </div>
        </template> -->
      </div>

      <nav class="flex items-center gap-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" class="!p-1 size-7">
                <HelpCircleIcon aria-hidden="true" />
                <span class="hidden-visually"> {{ $t('menu.help') }}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent class="bg-card shadow-lg border" side="bottom">
              <span class="font-medium text-xs text-muted-foreground">
                {{ $t('menu.help') }}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <ProfileMenu />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import ProfileMenu from './ProfileMenu.vue'
import { HelpCircleIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
</script>
