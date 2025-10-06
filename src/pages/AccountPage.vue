<template>
    <div class="flex flex-col md:flex-row min-h-full">
        <div class="w-full mx-auto max-w-[1200px] p-4 md:p-8 space-y-6">
            <h1 class="text-2xl font-bold">{{ $t('account.title') }}</h1>

            <Card>
                <CardHeader>
                    <CardTitle>{{ $t('account.profile.title') }}</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormField v-slot="{ componentField }" name="username">
                        <FormItem>
                            <FormLabel>{{ $t('common.forms.username') }}</FormLabel>
                            <FormControl>
                                <Input autocomplete="username" class="!bg-card" v-bind="componentField" type="text"
                                    :placeholder="$t('common.forms.username')" />
                            </FormControl>
                            <FormMessage class="text-xs text-destructive" />
                        </FormItem>
                    </FormField>
                </CardContent>
                <CardFooter>
                    <Button size="sm">
                        {{ $t('common.save') }}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{{ $t('account.connections.title') }}</CardTitle>
                    <CardDescription>{{ $t('account.connections.description') }}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div v-if="!providersData" class="grid gap-4" role="status" aria-live="polite">
                        <Skeleton class="h-6 w-full sm:w-1/2" />
                        <Skeleton class="h-6 w-full sm:w-1/3" />
                        <Skeleton class="h-6 w-full sm:w-1/4" />
                    </div>

                    <ul role="list" class="space-y-4">
                        <li v-for="item in connectionItems" :key="item.id" role="listitem"
                            class="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-4 items-center py-2">
                            <div class="flex items-center gap-4 col-span-full sm:col-span-1">
                                <Image v-if="item.iconUrl" :src="item.iconUrl" :alt="item.name" width="32" height="32"
                                    class="w-8 h-8 aspect-square shrink-0" />
                                <div>
                                    <p class="font-medium text-muted-foreground text-sm">{{ item.name }}</p>

                                    <div v-if="item.connectedCount > 0" class="mt-1 space-y-1">
                                        <div v-for="(acc, idx) in item.connectedAccounts" :key="idx" class="text-sm">
                                            @{{ acc.client_username || 'unknown' }}
                                        </div>
                                    </div>

                                    <p v-else class="text-sm text-muted-foreground">
                                        {{ $t('account.connections.connectAccount', { provider: item.name }) }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex justify-end col-span-full sm:col-span-1">
                                <span v-if="!item.canConnectMore"
                                    class="text-xs text-primary font-medium ml-auto sm:w-auto">
                                    {{ $t('account.connections.maxAccounts', { limit: item.limit }) }}
                                </span>

                                <Button v-else variant="outline" size="sm" class="w-full sm:w-auto" asChild>
                                    <a :href="item.redirectUri">
                                        {{ item.connectedCount > 0
                                            ? $t('account.connections.connectAnother')
                                            : $t('account.connections.connect') }}
                                    </a>
                                </Button>
                            </div>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <AccountDelete />
        </div>
    </div>
</template>

<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button';
import AccountDelete from '@/components/account/AccountDelete.vue';
import { computed } from 'vue';
import { useProvidersQuery, useUserQuery } from '@/composables/useAuthQuery';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';
import Image from '@/components/ui/image/Image.vue';
import Card from '@/components/ui/card/Card.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardContent from '@/components/ui/card/CardContent.vue';

import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
const { data: userData } = useUserQuery()
const { data: providersData } = useProvidersQuery()

const connectionItems = computed(() => {
    if (!providersData.value) return []

    const oauthProviders = providersData.value.oauth_providers || []
    const userProviders = userData.value?.providers || []

    return oauthProviders
        .map(provider => {
            const connectedAccounts = userProviders.filter(up => up.name === provider.id)
            const connectedCount = connectedAccounts.length
            const canConnectMore = connectedCount < provider.limit

            return {
                id: provider.id,
                name: provider.display_name,
                redirectUri: provider.redirect_uri.trim(),
                iconUrl: provider.icon_url?.trim() || '',
                limit: provider.limit ,
                connectedCount,
                connectedAccounts,
                canConnectMore
            }
        })
})

</script>