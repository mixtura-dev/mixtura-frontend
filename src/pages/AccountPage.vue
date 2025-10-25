<template>
  <section class="flex flex-col md:flex-row min-h-full">
    <div class="w-full mx-auto max-w-[1200px] p-4 md:p-8 space-y-6">
      <h2 class="text-2xl font-bold">{{ $t('account.title') }}</h2>
      <LanguageSwitcher />
      <AccountCredentials />
      <AccountProviders />
      <AccountDelete />
    </div>
  </section>
</template>

<script setup lang="ts">
import AccountDelete from '@/components/account/AccountDelete.vue'
import AccountProviders from '@/components/account/AccountProviders.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import AccountCredentials from '@/components/account/AccountCredentials.vue'
// const appVersion = __APP_VERSION__ ?? 'n/a'
</script>
