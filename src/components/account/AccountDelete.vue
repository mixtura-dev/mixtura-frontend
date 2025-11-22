<template>
  <Alert variant="destructive">
    <AlertTriangleIcon />
    <AlertTitle>{{ $t('account.deleteAccount.title') }}</AlertTitle>
    <AlertDescription>
      {{ $t('account.deleteAccount.warning') }}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button class="mt-1" variant="destructive" size="sm">
            {{ $t('account.deleteAccount.request') }}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{{ $t('common.absolutelySure') }}</AlertDialogTitle>
            <AlertDialogDescription>
              {{ $t('account.deleteAccount.description') }}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{{ $t('common.cancel') }}</AlertDialogCancel>
            <AlertDialogAction>{{ $t('common.next') }}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDescription>
  </Alert>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangleIcon } from 'lucide-vue-next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
</script>
