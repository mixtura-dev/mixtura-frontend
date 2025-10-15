<template>
  <section class="flex flex-1 h-full" :aria-labelledby="`${formKey}-title`">
    <div class="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r shadow-lg bg-background">
      <div class="flex-1 flex flex-col justify-center max-w-[400px] w-full">
        <div class="mb-6">
          <h1 class="mt-8 mb-2 text-2xl lg:text-3xl font-bold">
            {{ $t(`${formKey}.title`) }}
          </h1>
          <h2 class="text-sm text-foreground-light">
            {{ $t(`${formKey}.subtitle`) }}
          </h2>
        </div>

        <div class="flex gap-4">
          <Button variant="outline" size="icon" asChild>
            <a aria-label="Войти через Discord"
              href="https://discord.com/api/oauth2/authorize?client_id=443050669079920640&response_type=code&scope=identify&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Foauth%2Fcallback%2Fdiscord">
              <DiscrodIcon />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a aria-label="Войти через Twitch"
              href="https://id.twitch.tv/oauth2/authorize?client_id=9vaajcndpjuw2hcxzcglzjcppxisv7&response_type=code&scope=&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Foauth%2Fcallback%2Ftwitch">
              <TwitchIcon />
            </a>
          </Button>
        </div>

        <div class="relative text-center text-sm my-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border"></div>
          </div>
          <span class="relative bg-background px-2 text-muted-foreground">
            {{ $t('common.or') }}
          </span>
        </div>

        <form @submit="onSubmit" class="space-y-4 flex flex-col">
          <slot />

          <Button type="submit" :disabled="isLoading" :aria-disabled="isLoading">
            {{ $t(`${formKey}.submit`) }}
          </Button>

          <div class="text-center text-sm mt-2">
            {{ $t(`${formKey}.linkText`) }}
            <Link :to="linkTo" class="text-primary hover:underline ml-1">
            {{ $t(`${formKey}.linkLabel`) }}
            </Link>
          </div>
        </form>
      </div>

      <p class="text-xs text-foreground text-center sm:mx-auto sm:max-w-md">
        {{ $t('form.terms') }}
      </p>
    </div>

    <aside class="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex">
      <blockquote class="text-3xl font-light italic max-w-md text-center">
        “The only true wisdom is in knowing you know nothing.”
        <cite class="block mt-2 text-sm font-normal">— Socrates</cite>
      </blockquote>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import DiscrodIcon from '@/components/icons/DiscordIcon.vue'
import { TwitchIcon } from 'lucide-vue-next'

defineProps<{
  formKey: 'form.signIn' | 'form.signUp' | 'form.forgotPassword' | 'form.signUpEmail'
  linkTo: string
  isLoading: boolean
  onSubmit: (e: Event) => void
}>()
</script>
