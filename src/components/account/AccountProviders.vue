<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $t('account.connections.title') }}</CardTitle>
      <CardDescription>{{ $t('account.connections.description') }}</CardDescription>
    </CardHeader>
    <CardContent>
      <div
        v-if="!providersData"
        class="grid gap-4"
        role="status"
        aria-busy="true"
        aria-live="polite"
      >
        <Skeleton class="h-6 w-full sm:w-full" />
        <Skeleton class="h-6 w-full sm:w-3/4" />
        <Skeleton class="h-6 w-full sm:w-2/4" />
      </div>

      <ul role="list" class="space-y-4">
        <li
          v-for="item in connectionItems"
          :key="item.id"
          role="listitem"
          class="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-4 items-center py-2"
        >
          <div class="flex items-center gap-4 col-span-full sm:col-span-1">
            <Image
              v-if="item.iconUrl"
              :src="item.iconUrl"
              :alt="item.name"
              width="32"
              height="32"
              class="size-8 aspect-square shrink-0"
            />
            <div class="cursor-auto">
              <p class="font-medium text-muted-foreground text-sm">{{ item.name }}</p>
              <div v-if="item.connectedCount > 0" class="mt-1 space-y-1">
                <div
                  v-for="(acc, idx) in item.connectedAccounts"
                  :key="idx"
                  class="text-sm inline after:content-[',_'] last:after:content-none"
                >
                  @{{ acc.client_username || 'unknown' }}
                </div>
              </div>
              <p v-else class="text-sm text-muted-foreground">
                {{ $t('account.connections.connectAccount', { provider: item.name }) }}
              </p>
            </div>
          </div>

          <div class="flex justify-end col-span-full sm:col-span-1">
            <span
              v-if="!item.canConnectMore"
              class="text-xs text-primary font-medium ml-auto sm:w-auto"
              role="note"
            >
              {{ $t('account.connections.maxAccounts', { limit: item.limit }) }}
            </span>

            <Button v-else variant="outline" size="sm" class="w-full sm:w-auto" asChild>
              <Link :to="item.redirectUri" target="_self">
                {{
                  item.connectedCount > 0
                    ? $t('account.connections.connectAnother')
                    : $t('account.connections.connect')
                }}
              </Link>
            </Button>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
<script setup lang="ts">
import { useProvidersQuery, useUserQuery } from '@/composables/useAuthQuery'
import { computed } from 'vue'
import { Card, CardDescription, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import Link from '../ui/link/Link.vue'
const { data: userData } = useUserQuery()
const { data: providersData } = useProvidersQuery()

const connectionItems = computed(() => {
  if (!providersData.value) return []

  const oauthProviders = providersData.value.oauth_providers || []
  const userProviders = userData.value?.providers || []

  return oauthProviders.map((provider) => {
    const connectedAccounts = userProviders.filter((up) => up.name === provider.id)
    const connectedCount = connectedAccounts.length
    const canConnectMore = connectedCount < provider.limit

    return {
      id: provider.id,
      name: provider.display_name,
      redirectUri: provider.redirect_uri.trim(),
      iconUrl: provider.icon_url?.trim() || '',
      limit: provider.limit,
      connectedCount,
      connectedAccounts,
      canConnectMore,
    }
  })
})
</script>
