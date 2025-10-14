import { PASSWORD_REGEX, USERNAME_REGEX } from '@/lib/utils/validation'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'

export const createSignInSchema = () => {
  const { t } = useI18n()

  return z.object({
    login: z
      .string({
        required_error: t('validation.username.required'),
        invalid_type_error: t('validation.username.invalidType'),
      })
      .min(3, { message: t('validation.username.min') })
      .max(50, { message: t('validation.username.max') })
      .refine(
        (value) => USERNAME_REGEX.test(value) || z.string().email().safeParse(value).success,
        t('validation.login.invalid'),
      ),

    password: z
      .string({
        required_error: t('validation.password.required'),
        invalid_type_error: t('validation.password.invalidType'),
      })
      .min(6, { message: t('validation.password.min') })
      .max(32, { message: t('validation.password.max') })
      .regex(PASSWORD_REGEX, t('validation.password.invalid')),
  })
}
