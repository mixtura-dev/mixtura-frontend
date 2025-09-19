<template>
    <AuthForm formKey="form.signUp" linkTo="/sign-in" :isLoading="isLoading" :isFieldDirty="isFieldDirty"
        :onSubmit="onSubmit">
        <template #extra-fields>
            <FormField v-slot="{ componentField }" name="repeatPassword"
                :validate-on-blur="!isFieldDirty('repeatPassword')">
                <FormItem>
                    <FormLabel>{{ $t('form.repeatPassword') }}</FormLabel>
                    <div class="relative">
                        <FormControl>
                            <Input autocomplete="current-password" :type="showConfirmPassword ? 'text' : 'password'"
                                class="!bg-card pr-10" v-bind="componentField" />
                        </FormControl>
                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                            class="absolute right-0 top-1/2 h-full -translate-y-1/2 px-3 flex items-center text-muted-foreground hover:text-foreground">
                            <EyeIcon v-if="showConfirmPassword" class="h-4 w-4" />
                            <EyeOffIcon v-else class="h-4 w-4" />
                        </button>
                    </div>
                    <FormMessage class="text-xs text-destructive" />
                </FormItem>
            </FormField>
        </template>
    </AuthForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.store'
import { createSignUpSchema } from '@/schemas/signUpSchema'
import { useAuthForm } from '@/composables/useAuthForm'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import type { z } from 'zod'
import AuthForm from '@/components/auth/AuthForm.vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const showConfirmPassword = ref(false)
const authStore = useAuthStore()
const schema = createSignUpSchema()
type SignUpFormValues = z.infer<typeof schema>

const { isFieldDirty, isLoading, onSubmit } = useAuthForm<SignUpFormValues>(
    schema,
    {
        username: '',
        password: '',
        repeatPassword: ''
    },
    (values) => authStore.signup({ password_again: values.repeatPassword, password: values.password, username: values.username }),
    {
        loading: 'toast.signup.loading',
        success: 'toast.signup.success',
        error: (err: Error) => $t('error.signupFailed', { message: err.message })
    },
    'sign-up'
)
</script>