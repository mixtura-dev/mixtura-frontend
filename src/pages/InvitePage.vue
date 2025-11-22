<template>
  <section class="flex relative px-4 flex-col h-full w-full items-center justify-center">
    <Card class="relative w-full max-w-md">
      <CardHeader class="flex flex-col items-center gap-4">
        <Avatar class="size-24">
          <AvatarFallback class="font-bold text-3xl"> G </AvatarFallback>
        </Avatar>

        <CardTitle
          class="text-center text-2xl font-bold tracking-tight text-foreground break-words leading-tight"
        >
          Test
        </CardTitle>

        <p class="text-sm text-muted-foreground text-center max-w-sm">
          Организовано <span class="font-semibold text-foreground"> test </span>
        </p>
        <Badge class="absolute top-4 right-3" variant="secondary"> 120 Members </Badge>
      </CardHeader>
      <CardContent class="space-y-4 text-muted-foreground"> </CardContent>

      <CardFooter>
        <Button class="w-full"> {{ $t('common.join') }} </Button>
      </CardFooter>
    </Card>
  </section>
</template>

<script lang="ts" setup>
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import { Button } from '@/components/ui/button'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
</script>
