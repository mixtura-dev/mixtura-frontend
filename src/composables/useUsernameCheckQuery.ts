import { checkUsernameTaken } from '@/api/endpoints/user'
import { useQuery } from '@tanstack/vue-query'

const USERNAME_STALE = 5 * 60 * 1000
const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 20
export const useUsernameTakenQuery = (username: string) => {
  return useQuery({
    queryKey: ['username-taken', username],
    queryFn: () => checkUsernameTaken(username),
    enabled: username.length >= MIN_USERNAME_LENGTH && username.length <= MAX_USERNAME_LENGTH,
    staleTime: USERNAME_STALE,
    retry: false,
  })
}
