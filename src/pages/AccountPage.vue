<template>
    <div class="flex flex-col md:flex-row min-h-full">
        <div class="w-full mx-auto max-w-[1200px] p-4 md:p-8 space-y-6">
            <h1 class="text-2xl font-bold">{{ $t('account.title') }}</h1>

            <Card>
                <CardHeader>
                    <CardTitle>{{ $t('account.profile.title') }}</CardTitle>
                </CardHeader>
                <CardContent>

                </CardContent>
                <CardFooter>
                    <Button size="sm">
                        {{ $t('common.save') }}
                    </Button>
                </CardFooter>
            </Card>
            <AccountProviders />
            <AccountDelete />
        </div>
    </div>
</template>

<script setup lang="ts">

import { Button } from '@/components/ui/button';
import AccountDelete from '@/components/account/AccountDelete.vue';
import { Card, CardFooter, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import AccountProviders from '@/components/account/AccountProviders.vue';

</script>