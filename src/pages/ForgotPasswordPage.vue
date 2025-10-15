<template>
  <section class="flex flex-col justify-center items-center pt-32">
    <div class="flex flex-col px-5 max-w-lg w-full">
      <h1 class="lg:text-3xl text-2xl tracking-tight font-bold mb-2">
        {{ $t('form.forgotPassword.title') }}
      </h1>
      <p class="text-muted-foreground mb-6">{{ $t('form.forgotPassword.subtitle') }}</p>

      <form @submit="onSubmit" class="w-full space-y-4">
        <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty('email')">
          <FormItem>
            <FormLabel>{{ $t('common.forms.email') }}</FormLabel>
            <FormControl>
              <Input v-bind="componentField" :placeholder="$t('common.forms.email')" type="email" autocomplete="email"
                class="!bg-card" />
            </FormControl>
            <FormMessage class="text-xs text-destructive" />
          </FormItem>
        </FormField>

        <Button type="submit" :disabled="isPending" class="w-full">
          {{ isPending ? $t('common.sending') : $t('form.forgotPassword.submit') }}
        </Button>
      </form>

      <div class="text-center text-sm mt-8">
        {{ $t('form.signIn.linkText') }}
        <Link to="/sign-in" class="text-primary hover:underline ml-1">
        {{ $t('form.signIn.linkLabel') }}
        </Link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { createForgotPasswordEmailSchema } from '@/schemas/forgotPasswordSchema'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useResetPasswordMutation } from '@/composables/useAuthQuery'
import { Link } from '@/components/ui/link'

const { t } = useI18n()
const router = useRouter()
const schema = createForgotPasswordEmailSchema()
type FormValues = { email: string }

const { mutate: resetPassword, isPending } = useResetPasswordMutation()
const { handleSubmit, isFieldDirty } = useForm<FormValues>({
  validationSchema: toTypedSchema(schema),
  initialValues: { email: '' },
})

const onSubmit = handleSubmit((values) => {
  resetPassword(values, {
    onSuccess: () => {
      toast.success(t('common.messages.checkEmail'))
      router.push({ path: '/forgot-password/verify', query: { email: values.email } })
    },
    onError: (error) => {
      toast.error(t('common.errors.resetFailed', { message: error.message }))
    },
  })
})
</script>
