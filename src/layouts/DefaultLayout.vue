<template>
  <div class="flex h-full flex-col">
    <MobileHeader class="md:hidden" :groups="visibleGroups" />
    <MainHeader />
    <div class="flex flex-1 w-full overflow-y-hidden">
      <!-- <MainSidebar :groups="visibleGroups" v-if="!hideSidebar" /> -->
      <ServerListSidebar />
      <ShortcutsDialog />
      <main class="main min-h-0 min-w-0 flex-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const ShortcutsDialog = defineAsyncComponent(
  () => import('@/components/dialogs/shortcuts/ShortcutsDialog.vue'),
)
// const MainSidebar = defineAsyncComponent(() => import('@/components/MainSidebar.vue'))

import MainHeader from '@/components/header/MainHeader.vue'
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { NAV_GROUPS } from '@/constants/navigation'
import MobileHeader from '@/components/header/MobileHeader.vue'
import ServerListSidebar from '@/components/server/sidebars/ServerListSidebar.vue'

const route = useRoute()
// const hideSidebar = computed(() => route.meta.hideSidebar === true)

const visibleGroups = computed(() => {
  const path = route.path
  return NAV_GROUPS.filter((group) => !group.match || group.match.test(path))
})
</script>
