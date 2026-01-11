<script setup lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>

<template>
  <main class="relative h-full w-full overflow-y-auto">
    <RouterView />
    <div class="fixed top-4 right-4 z-50">
      <LanguageSwitcher />
    </div>
  </main>
</template>
