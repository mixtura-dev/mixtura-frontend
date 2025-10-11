<template>
    <div class="flex px-4 dot-pattern flex-col h-full w-full items-center justify-center ">
        <div class="container max-w-xl">
            <p class="mb-2 font-bold tracking-tight text-primary">404 error</p>
            <h1 class="text-3xl font-bold tracking-tight lg:text-4xl mb-4">We can't find this page!</h1>
            <Button asChild>
                <router-link to="/">
                    Go to Home
                </router-link>
            </Button>
        </div>

    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
</script>
