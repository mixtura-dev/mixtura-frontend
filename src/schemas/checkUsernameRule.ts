import { checkUsername } from '@/api/endpoints/user'
import { useDebounceFn } from '@vueuse/core'

const debouncedCheck = useDebounceFn(async (value: string) => {
  const res = await checkUsername({ username: value })
  if (res.status === 'ok' && res.busy) {
    return false
  }
  return true
}, 200)

export const uniqueUsername = async (value: string) => {
  if (!value) return true
  return await debouncedCheck(value)
}
