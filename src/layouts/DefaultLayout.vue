<template>
  <div class="flex h-full flex-col">
    <div class="md:hidden h-14 border-b flex items-center justify-between px-3 bg-background">
      <div class="text-sm">
        <Scale aria-hidden="true" />
      </div>

      <Drawer v-model:open="appStore.state.isDrawerOpen">
        <DrawerTrigger asChild>
          <Button class="size-8" variant="secondary" size="icon">
            <MenuIcon aria-hidden="true" />
            <span class="hidden-visually">{{ $t('menu.menu') }}</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent class="h-[85dvh] md:max-h-[500px]">
          <DrawerHeader>
            <div class="flex flex-col mt-2 gap-2">
              <template v-for="group in visibleGroups" :key="group.id">
                <Button
                  v-for="item in group.items"
                  :key="item.path"
                  @click="appStore.closeDrawer"
                  size="sm"
                  class="justify-start"
                  variant="ghost"
                  asChild
                >
                  <RouterLink
                    :to="item.path"
                    :title="item.labelKey"
                    class="flex items-center gap-2 text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    <component :is="item.icon" class="size-5" />
                    {{ $t(item.labelKey) }}
                  </RouterLink>
                </Button>
              </template>
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>

    <MainHeader />
    <div
      :inert="appStore.state.isDrawerOpen ? true : false"
      class="flex flex-1 w-full overflow-y-hidden"
    >
      <MainSidebar :groups="visibleGroups" v-if="!hideSidebar" />
      <Dialog v-model:open="open">
        <DialogContent class="sm:max-w-3xl max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] p-0">
          <DialogHeader class="p-6 pb-0">
            <DialogTitle class="flex items-center gap-2">
              <span class="text-2xl"> Комбинации клавиш </span>
              <KbdGroup> <Kbd>Ctrl</Kbd> + <Kbd>/</Kbd> </KbdGroup>
            </DialogTitle>
            <DialogDescription> Овладейте мастерством </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4 overflow-y-auto px-6">
            <div class="flex flex-col justify-between h-[300dvh]">
              <p>
                This is some placeholder content to show the scrolling behavior for modals. We use
                repeated line breaks to demonstrate how content can exceed minimum inner height,
                thereby showing inner scrolling. When content becomes longer than the predefined
                max-height of modal, content will be cropped and scrollable within the modal.
              </p>

              <p>This content should appear at the bottom after you scroll.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <main id="main" class="flex-grow h-full overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MenuIcon, Scale } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import MainSidebar from '@/components/MainSidebar.vue'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader } from '@/components/ui/drawer'

import MainHeader from '@/components/header/MainHeader.vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore.store'
import { NAV_GROUPS } from '@/constants/navigation'
import { useMagicKeys, whenever } from '@vueuse/core'
import Kbd from '@/components/ui/kbd/Kbd.vue'
import KbdGroup from '@/components/ui/kbd/KbdGroup.vue'
const route = useRoute()
const hideSidebar = computed(() => route.meta.hideSidebar === true)
const open = ref(false)

const appStore = useAppStore()
const keys = useMagicKeys()
whenever(keys.ctrl_slash, () => {
  open.value = !open.value
})
const visibleGroups = computed(() =>
  NAV_GROUPS.filter((group) => {
    if (!group.match) return true
    return group.match.test(route.path)
  }),
)
</script>
<style scoped>
.router-link-exact-active {
  color: var(--foreground) !important;
  background-color: var(--muted) !important;
}
</style>
