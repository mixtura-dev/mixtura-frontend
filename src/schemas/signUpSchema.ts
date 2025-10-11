import { PASSWORD_REGEX, USERNAME_REGEX } from '@/lib/utils/validation'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'
import { useUsernameValidator } from './checkUsernameRule'

export const createSignUpSchema = () => {
  const { t } = useI18n()

  const validateUsername = useUsernameValidator()
  return z
    .object({
      username: z
        .string({
          required_error: t('validation.username.required'),
          invalid_type_error: t('validation.username.invalidType'),
        })
        .min(3, { message: t('validation.username.min') })
        .max(20, { message: t('validation.username.max') })
        .regex(USERNAME_REGEX, { message: t('validation.username.invalid') })
        .refine(
          async (value) => {
            const isAvailable = await validateUsername(value)
            return isAvailable
          },
          { message: t('validation.username.busy') },
        ),

      password: z
        .string({
          required_error: t('validation.password.required'),
          invalid_type_error: t('validation.password.invalidType'),
        })
        .min(6, { message: t('validation.password.min') })
        .max(32, { message: t('validation.password.max') })
        .regex(PASSWORD_REGEX, { message: t('validation.password.invalid') }),

      repeatPassword: z
        .string({
          required_error: t('validation.repeatPassword.required'),
        })
        .min(1, { message: t('validation.repeatPassword.required') }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.repeatPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['repeatPassword'],
          message: t('validation.repeatPassword.mismatch'),
        })
      }
    })
}
export const createSignUpEmailSchema = () => {
  const { t } = useI18n()
  return z.object({
    email: z
      .string({ required_error: t('validation.email.required') })
      .email(t('validation.email.invalid')),
  })
}

export const createSignUpVerifySchema = () => {
  const { t } = useI18n()
  return z.object({
    token: z.array(z.coerce.string()).length(6, { message: t('validation.token.invalid') }),
  })
}
