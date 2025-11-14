<template>
  <aside class="md:grid hidden grid-rows-[1fr_auto] bg-background min-w-12 border-r h-full">
    <nav role="navigation" class="overflow-auto min-h-0 w-full hide-scrollbar"
      v-motion="{ initial: { opacity: 0, y: -40 }, enter: { opacity: 1, y: 0 } }">
      <template v-for="(group, gIndex) in groups" :key="group.id">
        <ul class="flex w-full flex-col gap-1 p-2">
          <li v-for="item in group.items" :key="item.path">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" class="size-8" asChild>
                    <Link :to="item.path" activeClass="text-foreground bg-muted"
                      inactiveClass="text-muted-foreground/60 hover:text-foreground transition-colors"
                      class="flex items-center justify-center size-8 rounded-md">
                    <component :is="item.icon" class="size-5" aria-hidden="true" />
                    <span class="hidden-visually">{{ $t(item.labelKey) }}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent class="bg-card shadow-lg border" side="right">
                  <p class="font-medium text-xs text-muted-foreground">
                    {{ $t(item.labelKey) }}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>

        <Separator aria-hidden="true" v-if="gIndex < groups.length - 1" class="max-w-[calc(100%-1rem)] mx-auto" />
      </template>
    </nav>
    <div class="p-2 empty:hidden">
      <slot name="footer" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { type NavGroup } from '@/constants/navigation'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Link } from '@/components/ui/link'

interface Props {
  groups: NavGroup[]
}

defineProps<Props>()
</script>
