<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $t('account.profile.title') }} </CardTitle>
    </CardHeader>

    <CardContent> </CardContent>
    <CardFooter>
      <Button size="sm">
        {{ $t('common.save') }}
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardFooter, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script>
