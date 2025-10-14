<template>
  <Alert variant="destructive">
    <AlertTriangleIcon />
    <AlertTitle>Danger Zone</AlertTitle>
    <AlertDescription>
      After resetting the settings it will not be possible to return.
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button class="mt-1" variant="destructive" size="sm"> Reset Settings </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{{ $t('common.absolutelySure') }}</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently reset your settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{{ $t('common.cancel') }}</AlertDialogCancel>
            <AlertDialogAction @click="settings.resetSettings">{{
              $t('common.next')
            }}</AlertDialogAction>
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
import { useSettingsStore } from '@/stores/settingsStore.store'
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

const settings = useSettingsStore()
</script>
