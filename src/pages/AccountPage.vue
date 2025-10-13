<template>
  <section class="flex flex-col md:flex-row min-h-full">
    <div class="w-full mx-auto max-w-[1200px] p-4 md:p-8 space-y-6">
      <h2 class="text-2xl font-bold">{{ $t('account.title') }}</h2>
      {{ appVersion }}

      <Card>
        <CardHeader>
          <CardTitle>{{ $t('account.profile.title') }}</CardTitle>
        </CardHeader>
        <CardContent> </CardContent>
        <CardFooter>
          <Button size="sm">
            {{ $t('common.save') }}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Тема</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-12">
          <div class="col-span-full md:col-span-4 flex flex-col gap-5"></div>
          <div class="col-span-full md:col-span-8 flex flex-col gap-4"></div>
        </CardContent>
      </Card>
      <AccountProviders />
      <AccountDelete />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import AccountDelete from '@/components/account/AccountDelete.vue'
import { Card, CardFooter, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import AccountProviders from '@/components/account/AccountProviders.vue'
const appVersion = __APP_VERSION__ ?? 'n/a'
</script>
