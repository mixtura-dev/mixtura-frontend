<template>
    <div class="flex px-4 flex-col h-full w-full items-center justify-center">
        <div class="flex flex-col gap-3 items-center">
            <span class="text-center text-2xl font-bold">Access Denied</span>
            <p class="text-center text-muted-foreground text-sm">
                You don't have permission to access this page.
            </p>
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
.dot-pattern {

    /* --dot-color: var(--muted-foreground);
    --dot-size: 1px;

    --dot-space: 22px;
    --gradient-color: var(--background);
    background: radial-gradient(circle, transparent 0%, var(--gradient-color) 100%),
        linear-gradient(90deg, var(--gradient-color) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
        linear-gradient(var(--gradient-color) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
        var(--dot-color);
        */
}
</style>