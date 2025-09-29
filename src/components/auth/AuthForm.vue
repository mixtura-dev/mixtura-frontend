<template>
    <div class="flex flex-1 h-full">
        <div class="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r shadow-lg bg-background">
            <div class="flex-1 flex flex-col justify-center max-w-[400px] w-full ">
                <div class="mb-6">
                    <h1 class="mt-8 mb-2 text-2xl lg:text-3xl font-bold">{{ $t(`${formKey}.title`) }}</h1>
                    <h2 class="text-sm text-foreground-light">{{ $t(`${formKey}.subtitle`) }}</h2>
                </div>
                <div class="flex gap-4 ">

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

                <div class="relative text-center text-sm my-4">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-border"></div>
                    </div>
                    <span class="relative bg-background px-2 text-muted-foreground">
                        {{ $t('common.or') }}
                    </span>
                </div>
                <form @submit="onSubmit" class="space-y-4 flex flex-col">
                    <FormField v-slot="{ componentField }" name="username"
                        :validate-on-blur="!isFieldDirty('username')">
                        <FormItem>
                            <FormLabel>{{ $t('form.username') }}</FormLabel>
                            <FormControl>
                                <Input :placeholder="$t('form.username')" autocomplete="username" class="!bg-card"
                                    v-bind="componentField" type="text" />
                            </FormControl>
                            <FormMessage class="text-xs text-destructive" />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="password"
                        :validate-on-blur="!isFieldDirty('password')">
                        <FormItem>
                            <div class="flex justify-between items-center ">
                                <FormLabel class="h-5">{{ $t('form.password') }}</FormLabel>
                                <RouterLink v-if="showForgotPassword" to="/forgot-password"
                                    class="text-xs text-primary hover:underline">
                                    {{ $t('form.forgotPassword.title') }}
                                </RouterLink>
                            </div>
                            <div class="relative">
                                <FormControl>
                                    <Input :placeholder="$t('form.password')" autocomplete="current-password"
                                        class="!bg-card pr-10" v-bind="componentField"
                                        :type="showPassword ? 'text' : 'password'" />
                                </FormControl>
                                <button type="button" @click="showPassword = !showPassword"
                                    class="absolute right-0 top-1/2 h-full -translate-y-1/2 px-3 flex items-center text-muted-foreground hover:text-foreground">
                                    <EyeIcon v-if="showPassword" class="h-4 w-4" />
                                    <EyeOffIcon v-else class="h-4 w-4" />
                                </button>
                            </div>
                            <FormMessage class="text-xs text-destructive" />
                        </FormItem>
                    </FormField>

                    <slot name="extra-fields" />

                    <Button type="submit" :disabled="isLoading">
                        {{ $t(`${formKey}.submit`) }}
                    </Button>

                    <div class="text-center text-sm mt-2">
                        {{ $t(`${formKey}.linkText`) }}
                        <RouterLink :to="linkTo" class="text-primary hover:underline ml-1">
                            {{ $t(`${formKey}.linkLabel`) }}
                        </RouterLink>
                    </div>
                </form>

            </div>
            <p class="text-xs text-foreground text-center sm:mx-auto sm:max-w-md">
                {{ $t('form.terms') }}
            </p>
        </div>

        <aside class="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex">
            <blockquote class="text-3xl font-light italic max-w-md text-center">
                “The only true wisdom is in knowing you know nothing.” — Socrates
            </blockquote>
        </aside>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon, TwitchIcon } from 'lucide-vue-next'
import DiscrodIcon from '@/components/icons/DiscordIcon.vue'
import BlizzardIcon from '@/components/icons/BlizzardIcon.vue'

defineProps<{
    formKey: 'form.signIn' | 'form.signUp'
    linkTo: string
    isLoading: boolean
    isFieldDirty: <TPath extends string>(path: TPath) => boolean
    onSubmit: (e: Event) => void
    showForgotPassword?: boolean
}>()

const showPassword = ref(false)
</script>