<template>
  <div class="flex h-full flex-col">
    <div class="md:hidden h-14 border-b flex items-center justify-between px-3 bg-background">
      <div class="text-sm">
        <Scale />
      </div>

      <Drawer v-model:open="appStore.state.isDrawerOpen">
        <DrawerTrigger asChild>
          <Button class="size-8" variant="secondary" size="icon">
            <MenuIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent class=" h-[85dvh] md:max-h-[500px]">
          <DrawerHeader>
            <div class="flex flex-col mt-2 gap-2">
              <Button @click="appStore.closeDrawer" size="sm" class="justify-start " variant="ghost"
                v-for="item in MAIN_NAV" :key="item.path" asChild>
                <RouterLink :to="item.path" :title="item.labelKey"
                  class="flex items-center justify-center text-muted-foreground/60 hover:text-foreground transition-colors">
                  <component :is="item.icon" class="size-5" />
                  {{ $t(item.labelKey) }}
                </RouterLink>
              </Button>
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>

    <MainHeader />
    <div :inert="appStore.state.isDrawerOpen ? true : false" class="flex flex-1  w-full overflow-y-hidden ">
      <MainSidebar v-if="!hideSidebar" />
      <main id="main" class="flex-grow h-full overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>


<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MenuIcon, Scale } from 'lucide-vue-next'

import MainSidebar from '@/components/MainSidebar.vue'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader } from '@/components/ui/drawer'

import { MAIN_NAV } from '@/constants/navigation'
import MainHeader from '@/components/header/MainHeader.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore.store'
const route = useRoute()
const hideSidebar = computed(() => route.meta.hideSidebar === true)

const appStore = useAppStore()

</script>
<style scoped>
.router-link-exact-active {

  color: var(--foreground) !important;
  background-color: var(--muted) !important;

}
</style>