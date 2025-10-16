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
          <template v-if="isLoadingProviders">
            <Button variant="outline" size="icon" disabled>
              <LoaderIcon class="animate-spin" />
            </Button>
          </template>
          <template v-else-if="providers.length > 0">
            <Button v-for="provider in providers" :key="provider.id" variant="outline" size="icon" asChild>
              <Link target="_self" :to="provider.redirectUri">
              <Image v-if="provider.iconUrl" :src="provider.iconUrl" :alt="provider.name" width="32" height="32"
                class="size-5 aspect-square shrink-0" />
              </Link>
            </Button>
          </template>
          <template v-else>
            <p class="text-sm text-muted-foreground">
              {{ $t('common.noProvidersAvailable') }}
            </p>
          </template>
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
import { computed } from 'vue';
import { useProvidersQuery } from '@/composables/useAuthQuery';
import Image from '../ui/image/Image.vue';
import { LoaderIcon } from 'lucide-vue-next';

const { data: providersData, isLoading: isLoadingProviders } = useProvidersQuery();

const providers = computed(() => {
  if (!providersData.value?.oauth_providers) return [];

  return providersData.value.oauth_providers.map((provider) => ({
    id: provider.id,
    name: provider.display_name,
    redirectUri: provider.redirect_uri.trim(),
    iconUrl: provider.icon_url?.trim() || null,
  }));
});


defineProps<{
  formKey: 'form.signIn' | 'form.signUp' | 'form.forgotPassword' | 'form.signUpEmail'
  linkTo: string
  isLoading: boolean
  onSubmit: (e: Event) => void
}>()
</script>
