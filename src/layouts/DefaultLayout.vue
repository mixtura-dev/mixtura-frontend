<template>
  <div class="flex h-full w-full">
    <ServerListSidebar class="flex-shrink-0" />

    <div class="flex flex-1 flex-col min-w-0">
      <MobileHeader class="md:hidden" :groups="visibleGroups" />
      <MainHeader />

      <main class="main flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>

    <ShortcutsDialog />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import MainHeader from '@/components/header/MainHeader.vue'
import MobileHeader from '@/components/header/MobileHeader.vue'
import ServerListSidebar from '@/components/server/sidebars/ServerListSidebar.vue'
import ShortcutsDialog from '@/components/dialogs/shortcuts/ShortcutsDialog.vue'

import { NAV_GROUPS } from '@/constants/navigation'

const route = useRoute()

const visibleGroups = computed(() => {
  const path = route.path
  return NAV_GROUPS.filter((group) => !group.match || group.match.test(path))
})
</script>
