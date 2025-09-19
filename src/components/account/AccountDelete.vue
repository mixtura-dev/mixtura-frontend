<template>
    <Alert class="bg-destructive/15" variant="destructive">
        <AlertTriangleIcon />
        <AlertTitle>Request for account deletion</AlertTitle>
        <AlertDescription>
            Deleting your account is permanent and cannot be undone. Your data will be deleted within 30 days, except we
            may retain some metadata and logs for longer where required or permitted by law.
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button class=" mt-1" variant="destructive" size="sm">
                        Request to delete account
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently reset your settings.
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
