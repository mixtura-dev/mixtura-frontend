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
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.clearUser()
    }
    console.log(error)
    //TODO: Make toast to show error
    const message = error.response?.data?.error || error.message
    return Promise.reject(new Error(message))
  },
)
