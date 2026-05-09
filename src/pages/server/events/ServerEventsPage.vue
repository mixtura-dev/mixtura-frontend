<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-foreground">
        {{ t('server.nav.events') }}
      </h1>
      <p class="mt-2 text-muted-foreground">
        {{ t('server.page.eventsPlaceholder') }}
      </p>
    </div>
  </div>
</template>
