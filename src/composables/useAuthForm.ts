import { useMutation } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import type { Schema, z } from 'zod'

interface AuthResponse {
  success: boolean
  message?: string
}

interface ToastMessages {
  loading: string
  success: string
  error: (err: Error) => string
}

type AuthAction<T> = (data: T) => Promise<AuthResponse>

export const useAuthForm = <T extends z.infer<Schema>>(
  schema: Schema,
  initialValues: T,
  authAction: AuthAction<T>,
  toastMessages: ToastMessages,
  mutationKey: string | string[],
) => {
  const { isFieldDirty, handleSubmit } = useForm({
    validationSchema: toTypedSchema(schema),
    initialValues,
  })
  const { isPending, mutate } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: authAction,
    onMutate: () => {
      toast.loading(toastMessages.loading, { duration: 0 })
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(toastMessages.success)
    },
    onError: (err: Error) => {
      toast.dismiss()
      toast.error(toastMessages.error(err))
    },
  })

  const onSubmit = handleSubmit((values: T) => {
    mutate(values)
  })

  return { isFieldDirty, isLoading: isPending, onSubmit }
}
