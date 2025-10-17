<script setup lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>

<template>
  <main class="relative h-full w-full">
    <RouterView />
    <div class="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>
  </main>
</template>
