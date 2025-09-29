<template>
  <AuthForm formKey="form.signIn" linkTo="/sign-up" :isLoading="isLoading" :isFieldDirty="isFieldDirty"
    :onSubmit="onSubmit" :showForgotPassword="true" />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore.store'
import { createSignInSchema } from '@/schemas/signInSchema'
import { useAuthForm } from '@/composables/useAuthForm'
import AuthForm from '@/components/auth/AuthForm.vue'
import type { z } from 'zod'

const authStore = useAuthStore()
const schema = createSignInSchema()
type SignInFormValues = z.infer<typeof schema>

const { isFieldDirty, isLoading, onSubmit } = useAuthForm<SignInFormValues>(
  schema,
  {
    username: '',
    password: ''
  },
  (values) => authStore.login({ password: values.password, username: values.username }),
  {
    loading: 'Logging in...',
    success: 'Logged in successfully!',
    error: (err: Error) => `Login failed: ${err.message}`
  },
  'sign-in'
)
</script>