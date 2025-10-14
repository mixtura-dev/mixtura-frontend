<template>
  <aside class="items-center bg-background hidden w-12 border-r md:flex flex-col gap-4">
    <nav
      role="navigation"
      class="overflow-auto w-full"
      v-motion="{ initial: { opacity: 0, y: -40 }, enter: { opacity: 1, y: 0 } }"
    >
      <template v-for="(group, gIndex) in groups" :key="group.id">
        <ul class="text flex w-full flex-col p-2 gap-1">
          <li v-for="item in group.items" :key="item.path">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" class="size-8" asChild>
                    <Link
                      :to="item.path"
                      activeClass="text-foreground bg-muted"
                      inactiveClass="text-muted-foreground/60 hover:text-foreground transition-colors"
                      class="flex items-center justify-center size-8 rounded-md"
                    >
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

        <Separator
          aria-hidden="true"
          v-if="gIndex < groups.length - 1"
          class="max-w-[calc(100%-1rem)] mx-auto"
        />
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { type NavGroup } from '@/constants/navigation'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import Link from '@components/ui/link/Link.vue'

interface Props {
  groups: NavGroup[]
}

defineProps<Props>()
</script>
