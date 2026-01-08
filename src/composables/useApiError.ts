import { computed, type Ref } from 'vue'
import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  message?: string
  detail?: string | { msg: string }[]
}

export function useApiError(error: Ref<Error | null>) {
  const errorMessage = computed(() => {
    const err = error.value

    if (!err) return null

    if (isAxiosError(err)) {
      const data = err.response?.data as ApiErrorResponse | undefined

      if (data?.message) return data.message
      if (typeof data?.detail === 'string') return data.detail
      if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
        return data.detail[0].msg
      }
    }

    if (err.message) return err.message

    return 'An unexpected error occurred'
  })

  return { errorMessage }
}

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  )
}

export function getErrorMessage(error: Error): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined

    if (data?.message) return data.message
    if (typeof data?.detail === 'string') return data.detail
    if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
      return data.detail[0].msg
    }
  }

  return error.message || 'An unexpected error occurred'
}
