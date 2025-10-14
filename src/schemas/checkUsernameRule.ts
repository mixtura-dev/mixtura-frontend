import { checkUsername } from '@/api/endpoints/user'
import { useDebounceFn } from '@vueuse/core'

export const useUsernameValidator = () => {
  const validate = async (username: string): Promise<boolean> => {
    if (!username) return false
    try {
      const { busy } = await checkUsername({ username })
      return !busy
    } catch {
      return false
    }
  }

  const debouncedValidate = (() => {
    const handler = useDebounceFn((resolve: (v: boolean) => void, name: string) => {
      validate(name).then(resolve)
    }, 500)

    return (name: string): Promise<boolean> => new Promise((resolve) => handler(resolve, name))
  })()

  return debouncedValidate
}
