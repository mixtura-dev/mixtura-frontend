<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Swords } from 'lucide-vue-next'

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-muted-foreground">
    <Swords class="mb-3 size-12" />
    <p class="text-lg font-medium">{{ t('server.events.tabs.matches') }}</p>
    <p class="text-sm">{{ t('server.events.tabs.matchesEmpty') }}</p>
  </div>
</template>
