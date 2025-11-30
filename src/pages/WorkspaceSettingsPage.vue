<template>
  <section class="w-full mx-auto max-w-[1200px] p-4 md:p-8">
    <div class="flex justify-between mb-6">
      <h1 class="text-2xl font-bold">Settings</h1>
    </div>

    <div>
      <SettingsReset />
    </div>
  </section>
</template>

<script setup lang="ts">
import SettingsReset from '@/components/settings/SettingsReset.vue'
</script>
