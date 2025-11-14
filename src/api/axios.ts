import router from '@/router'
import { useAuthStore } from '@/stores/authStore.store'
import axios, { AxiosError } from 'axios'

const TIMEOUT_TIME = 5000

export const baseApi = axios.create({
  baseURL: '/',
  withCredentials: true,
  timeout: TIMEOUT_TIME,
  headers: {
    'Content-Type': 'application/json',
  },
})

baseApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    const authStore = useAuthStore()
    const url = error.config?.url || ''

    if (
      error.response?.status === 401 &&
      !url.includes('/api/auth/callback') &&
      !window.location.pathname.startsWith('/oauth/callback')
    ) {
      authStore.handleUnauthorized()
      router.push('/sign-in')
    }

    console.log(error)
    const message = error.response?.data?.error || error.message
    return Promise.reject(new Error(message))
  },
)
