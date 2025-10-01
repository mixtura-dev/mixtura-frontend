<!-- components/auth/AuthForm.vue -->
<template>
    <div class="flex flex-1 h-full">
        <div class="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r shadow-lg bg-background">
            <div class="flex-1 flex flex-col justify-center max-w-[400px] w-full">
                <!-- Заголовок -->
                <div class="mb-6">
                    <h1 class="mt-8 mb-2 text-2xl lg:text-3xl font-bold">
                        {{ $t(`${formKey}.title`) }}
                    </h1>
                    <h2 class="text-sm text-foreground-light">
                        {{ $t(`${formKey}.subtitle`) }}
                    </h2>
                </div>

                <!-- Иконки соцсетей (опционально, можно вынести в слот) -->
                <div class="flex gap-4 mb-6">
                    <Button variant="outline" size="icon">
                        <DiscrodIcon />
                    </Button>
                    <Button variant="outline" size="icon">
                        <TwitchIcon />
                    </Button>
                    <Button variant="outline" size="icon">
                        <BlizzardIcon />
                    </Button>
                </div>

                <!-- Разделитель -->
                <div class="relative text-center text-sm my-4">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-border"></div>
                    </div>
                    <span class="relative bg-background px-2 text-muted-foreground">
                        {{ $t('common.or') }}
                    </span>
                </div>

                <!-- Форма с СЛОТОМ -->
                <form @submit="onSubmit" class="space-y-4 flex flex-col">
                    <!-- Основной контент формы -->
                    <slot />

                    <!-- Кнопка отправки -->
                    <Button type="submit" :disabled="isLoading">
                        {{ $t(`${formKey}.submit`) }}
                    </Button>

                    <!-- Ссылка на другую форму -->
                    <div class="text-center text-sm mt-2">
                        {{ $t(`${formKey}.linkText`) }}
                        <RouterLink :to="linkTo" class="text-primary hover:underline ml-1">
                            {{ $t(`${formKey}.linkLabel`) }}
                        </RouterLink>
                    </div>
                </form>
            </div>

            <!-- Футер -->
            <p class="text-xs text-foreground text-center sm:mx-auto sm:max-w-md">
                {{ $t('form.terms') }}
            </p>
        </div>

        <!-- Aside (можно тоже вынести, но оставим) -->
        <aside class="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex">
            <blockquote class="text-3xl font-light italic max-w-md text-center">
                “The only true wisdom is in knowing you know nothing.” — Socrates
            </blockquote>
        </aside>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { RouterLink } from 'vue-router';
import DiscrodIcon from '@/components/icons/DiscordIcon.vue';
import BlizzardIcon from '@/components/icons/BlizzardIcon.vue';
import { TwitchIcon } from 'lucide-vue-next';

defineProps<{
    formKey: 'form.signIn' | 'form.signUp' | 'form.forgotPassword' | 'form.signUpEmail'
    linkTo: string
    isLoading: boolean
    onSubmit: (e: Event) => void
}>()
</script>