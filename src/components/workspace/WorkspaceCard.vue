<template>
    <RouterLink :to="`/workspace/${props.title.toLowerCase().replace(/\s+/g, '-')}`">
        <li
            class=" group  relative text-left bg-card border p-5 rounded-md flex flex-row transition ease-in-out duration-150 cursor-pointer min-h-32 md:min-h-44 h-44 !px-0 pt-5 pb-0 hover:bg-accent">
            <div class="flex h-full w-full flex-col space-y-2">
                <div class="w-full justify-between spac-ey-1.5 px-5">
                    <p class=" flex-shrink truncate text-sm font-semibold pr-4">
                        {{ props.title }}
                    </p>
                    <span class=" text-sm text-muted-foreground">
                        {{ props.subtitle }}
                    </span>
                </div>
                <div class="w-full mt-auto p-5">
                    <span class="text-sm ">
                    </span>
                </div>

            </div>
            <ChevronRight
                class=" absolute text-muted-foreground transition-all duration-200 right-4 top-4 group-hover:right-3  group-hover:text-foreground  " />

        </li>
    </RouterLink>

</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';

interface Props {
    title: string;
    subtitle: string
}
const props = defineProps<Props>()

</script>