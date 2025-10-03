import { PASSWORD_REGEX } from '@/lib/utils/validation'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'

export const createForgotPasswordEmailSchema = () => {
  const { t } = useI18n()
  return z.object({
    email: z.string().email({ message: t('validation.email.invalid') }),
  })
}

export const createForgotPasswordVerifySchema = () => {
  const { t } = useI18n()
  return z.object({
    token: z.array(z.coerce.string()).length(6, { message: t('validation.token.invalid') }),
  })
}

export const createForgotPasswordConfirmSchema = () => {
  const { t } = useI18n()
  return z
    .object({
      newPassword: z
        .string()
        .min(6, { message: t('validation.password.min') })
        .max(32, { message: t('validation.password.max') })
        .regex(PASSWORD_REGEX, t('validation.password.invalid')),
      confirmNewPassword: z
        .string()
        .min(6, { message: t('validation.password.min') })
        .max(32, { message: t('validation.password.max') })
        .regex(PASSWORD_REGEX, t('validation.password.invalid')),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t('validation.password.mismatch'),
      path: ['confirmNewPassword'],
    })
}
