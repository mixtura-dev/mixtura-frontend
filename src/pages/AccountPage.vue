<template>
    <div class="flex flex-col md:flex-row h-full">
        <div class="w-full mx-auto max-w-[1200px] p-4 md:p-8 overflow-auto space-y-6">
            <h1 class="text-2xl font-bold">Preferences</h1>

            <div class="border bg-card rounded  overflow-auto">
                <div class="px-6 py-4 border-b">
                    <div class="font-semibold">
                        <h5 class="text-lg">Profile Information </h5>

                    </div>
                </div>
                <div class="px-6 py-4 space-y-6 border-b last:border-none">
                    <!-- Username Field -->
                    <FormField v-slot="{ componentField }" name="username">
                        <FormItem>
                            <FormLabel>{{ $t('form.username') }}</FormLabel>
                            <FormControl>
                                <Input autocomplete="username" class="!bg-card" v-bind="componentField" type="text"
                                    placeholder="Enter your username" />
                            </FormControl>
                            <FormMessage class="text-xs text-destructive" />
                        </FormItem>
                    </FormField>


                </div>

                <div class="px-6 py-4 flex justify-end">
                    <Button size="sm">
                        {{ $t('common.save') }}
                    </Button>
                </div>
            </div>
            
            <div class=" border bg-card rounded  overflow-auto">
                <div class="px-6 py-4 border-b">
                    <div class="font-semibold">
                        <h5 class="text-lg">Connections</h5>
                        <p class="text-sm text-muted-foreground">
                            Connect your Supabase account with other services
                        </p>
                    </div>
                </div>

                <div class="px-6 py-4 space-y-4">
                    <div v-for="(connection, index) in connections" :key="index"
                        class="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <component :is="connection.icon" class="w-6 h-6" />
                            <div>
                                <p class="font-medium text-sm">{{ connection.name }}</p>
                                <p class="text-sm text-muted-foreground">{{ connection.description }}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" class="w-full sm:w-auto">
                            {{ $t('common.connect') }}
                        </Button>
                    </div>
                </div>
            </div>


            <AccountDelete />
        </div>
    </div>
</template>

<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import DiscordIcon from '@/components/icons/DiscordIcon.vue';
import BlizzardIcon from '@/components/icons/BlizzardIcon.vue';
import { TwitchIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import AccountDelete from '@/components/account/AccountDelete.vue';

const connections = [
    {
        name: 'Discord',
        description: 'Connect your Discord account',
        icon: DiscordIcon,
    },
    {
        name: 'Twitch',
        description: 'Connect your Twitch account',
        icon: TwitchIcon,
    },
    {
        name: 'Blizzard',
        description: 'Connect your Blizzard account',
        icon: BlizzardIcon,
    },
];
</script>