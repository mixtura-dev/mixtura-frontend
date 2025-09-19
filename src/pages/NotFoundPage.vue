<template>
    <div class="flex px-4 dot-pattern flex-col h-full w-full items-center justify-center ">
        <div class="flex flex-col gap-3 items-center">
            <span class=" text-center text-2xl font-bold ">Look for something? </span>
            <p class="text-center text-muted-foreground text-sm">We couldn't find the page that you're looking for!</p>
        </div>
        <Button asChild class="mt-4" variant="outline">
            <router-link to="/">
                Go to Home
            </router-link>
        </Button>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
</script>

<style scoped>

</style>