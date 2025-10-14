<template>
  <AuthForm formKey="form.signIn" linkTo="/sign-up" :isLoading="isPending" :onSubmit="onSubmit">
    <FormField v-slot="{ componentField }" name="login">
      <FormItem>
        <FormLabel>{{ $t('common.forms.usernameOrEmail') }}</FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            :placeholder="$t('common.forms.usernameOrEmail')"
            autocomplete="username"
            class="!bg-card"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <div class="flex justify-between items-center">
          <FormLabel class="h-5">{{ $t('common.forms.password') }}</FormLabel>
          <RouterLink to="/forgot-password" class="text-xs text-primary hover:underline">
            {{ $t('form.forgotPassword.title') }}
          </RouterLink>
        </div>
        <FormControl>
          <InputPassword
            v-bind="componentField"
            :placeholder="$t('common.forms.password')"
            autocomplete="current-password"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </AuthForm>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { createSignInSchema } from '@/schemas/signInSchema'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AuthForm from '@/components/auth/AuthForm.vue'
import { useSignInMutation } from '@/composables/useAuthQuery'
import InputPassword from '@/components/ui/input/InputPassword.vue'

const router = useRouter()
const route = useRoute()

const schema = createSignInSchema()
type SignInFormValues = { login: string; password: string }

const { mutate: signIn, isPending } = useSignInMutation()
const { handleSubmit } = useForm<SignInFormValues>({
  validationSchema: toTypedSchema(schema),
  initialValues: { login: '', password: '' },
})

const onSubmit = handleSubmit((values) => {
  signIn(values, {
    onSuccess: () => {
      toast.success('Successfully signed in')

      router.push(route.query.redirect?.toString() || '/')
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`)
    },
  })
})
</script>
