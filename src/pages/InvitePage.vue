<template>
  <div class="flex h-full w-full items-center justify-center px-4 py-12">
    <div v-if="isLoading" class="flex flex-col items-center gap-4">
      <Loader2 class="size-10 animate-spin text-primary" />
      <p class="text-muted-foreground">Loading invite details...</p>
    </div>

    <Card v-else-if="isError || !invite" class="w-full max-w-md border-destructive/50">
      <CardHeader class="text-center">
        <div
          class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10"
        >
          <AlertCircle class="size-6 text-destructive" />
        </div>
        <CardTitle>Invalid Invite</CardTitle>
        <CardDescription>
          This invite link may be expired, invalid, or you may already be a member of this server.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button class="w-full" variant="outline" @click="router.push('/servers')">
          Go to Dashboard
        </Button>
      </CardFooter>
    </Card>

    <Card v-else class="relative w-full max-w-md overflow-hidden border-border bg-card">
      <Badge variant="secondary" class="absolute right-3 top-3 z-10">
        <Globe v-if="invite.server.public" class="mr-1 size-3" />
        <Lock v-else class="mr-1 size-3" />
        {{ invite.server.public ? 'Public' : 'Private' }}
      </Badge>

      <div
        v-if="invite.server.banner_url"
        class="absolute inset-x-0 top-0 h-32 bg-cover bg-center opacity-20"
        :style="{ backgroundImage: `url(${invite.server.banner_url})` }"
      />
      <div
        v-else
        class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent"
      />

      <CardHeader class="relative flex flex-col items-center gap-4 pt-16">
        <!-- Avatar -->
        <Avatar class="size-24 border-4 border-card shadow-xl">
          <AvatarImage
            v-if="invite.server.icon_url"
            :src="invite.server.icon_url"
            :alt="invite.server.name"
          />
          <AvatarFallback class="bg-primary text-3xl font-bold text-primary-foreground">
            {{ getInitials(invite.server.name) }}
          </AvatarFallback>
        </Avatar>

        <div class="text-center">
          <CardTitle class="text-2xl font-bold tracking-tight">
            {{ invite.server.name }}
          </CardTitle>
          <CardDescription class="mt-2 text-base">
            You've been invited to join this workspace
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent class="space-y-4 text-center text-muted-foreground">
        <div v-if="invite.inviter?.nickname" class="rounded-lg bg-muted/50 p-3 text-sm">
          Invited by
          <span class="font-semibold text-foreground">{{ invite.inviter.nickname }}</span>
        </div>

        <p v-if="invite.server.description" class="line-clamp-3 text-sm italic">
          "{{ invite.server.description }}"
        </p>
      </CardContent>

      <CardFooter class="flex flex-col gap-3">
        <Button class="w-full text-lg" size="lg" :disabled="isJoining" @click="handleJoin">
          <Loader2 v-if="isJoining" class="mr-2 size-5 animate-spin" />
          Join Server
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { AlertCircle, Globe, Loader2, Lock } from 'lucide-vue-next'

import { getErrorMessage } from '@/composables/useApiError'
import { getInitials } from '@/lib/utils/user'
import { useAcceptInviteMutation, useInviteByKeyQuery } from '@/api/queries/server'

const route = useRoute()
const router = useRouter()

const inviteKey = computed(() => route.params.key as string)

const { data: invite, isLoading, isError } = useInviteByKeyQuery(inviteKey)
const { mutate: acceptInvite, isPending: isJoining } = useAcceptInviteMutation()

function handleJoin() {
  if (!inviteKey.value) return

  acceptInvite(
    {
      key: inviteKey.value,
      data: {},
    },
    {
      onSuccess: () => {
        if (invite.value?.server.id) {
          toast.success(`Joined ${invite.value.server.name}!`)
          router.push(`/servers/${invite.value.server.id}`)
        } else {
          toast.success('Joined server!')
          router.push('/servers')
        }
      },
      onError: (error) => {
        const err = error instanceof Error ? error : new Error('Unknown error')
        toast.error('Failed to join server', {
          description: getErrorMessage(err),
        })
      },
    },
  )
}
</script>
