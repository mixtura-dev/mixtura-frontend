<template>
    <div class="h-14 border-b flex items-center justify-between px-3 bg-background">
        <div class="text-sm">
            <Scale aria-hidden="true" />
        </div>

        <Drawer v-model:open="appStore.state.isDrawerOpen">
            <DrawerTrigger asChild>
                <Button class="size-8" variant="secondary" size="icon" :aria-label="$t('menu.menu')">
                    <MenuIcon aria-hidden="true" />
                </Button>
            </DrawerTrigger>
            <DrawerContent class="h-[85dvh] md:max-h-[500px]">
                <DrawerHeader>
                    <div class="flex flex-col mt-2 gap-2">
                        <template v-for="group in groups" :key="group.id">
                            <Button v-for="item in group.items" :key="item.path" @click="appStore.closeDrawer" size="sm"
                                class="justify-start" variant="ghost" asChild>
                                <Link :to="item.path" :title="item.labelKey" active-class="text-foreground bg-muted"
                                    inactive-class="text-muted-foreground/60 hover:text-foreground "
                                    class="flex items-center gap-2 transition-colors">
                                <component :is="item.icon" class="size-5" />
                                {{ $t(item.labelKey) }}
                                </Link>
                            </Button>
                        </template>
                    </div>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    </div>

</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/appStore.store';
import { type NavGroup } from '@/constants/navigation'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link'

import { MenuIcon, Scale } from 'lucide-vue-next';
interface Props {
    groups: NavGroup[]
}
const appStore = useAppStore()

defineProps<Props>()
</script>