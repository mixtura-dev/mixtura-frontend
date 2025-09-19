<template>
    <aside class="items-center bg-background hidden w-12 border-r md:flex flex-col gap-4">
        <nav class="overflow-auto">
            <ul class="text flex w-full min-w-0 flex-col p-2 gap-1">
                <li v-for="item in MAIN_NAV" :key="item.path" v-motion="{
                    initial: { opacity: 0, y: -40 },
                    enter: { opacity: 1, y: 0 },
                }">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" class="size-8" asChild>
                                    <RouterLink :title="item.labelKey" :to="item.path"
                                        class="flex items-center justify-center text-muted-foreground/60 hover:text-foreground transition-colors">
                                        <component :is="item.icon" class="size-5" />
                                    </RouterLink>
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
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { MAIN_NAV } from "@/constants/navigation"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


</script>

<style scoped>
.router-link-exact-active {
    color: var(--foreground) !important;
    background-color: var(--muted) !important;
}
</style>
