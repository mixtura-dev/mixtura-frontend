<template>
  <section
    class="flex flex-col items-center justify-center w-full h-full p-4 text-center"
    role="status"
    aria-live="polite"
    tabindex="-1"
  >
    <div class="inline-block mb-4">
      <Loader2Icon class="size-10 text-primary animate-spin" aria-hidden="true" />
      <p class="hidden-visually">{{ $t('common.loading') }}</p>
    </div>
    <p class="text-muted-foreground text-lg font-semibold">
      {{ $t('account.connections.connectingAccount') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Loader2Icon } from 'lucide-vue-next'
import { getQueryValue } from '@/lib/utils/router'
import { useCallbackProvidersMutation } from '@/composables/useAuthQuery'
import { createLogger } from '@/lib/logger'

const route = useRoute()
const router = useRouter()
const { mutateAsync } = useCallbackProvidersMutation()
const log = createLogger('OAuthPage')

onMounted(async () => {
  try {
    const provider = getQueryValue(route.params.provider)
    const code = getQueryValue(route.query.code)

    if (!provider || !code) {
      log.error('Missing provider or code')
      throw new Error('Missing provider or code')
    }
    await mutateAsync({ provider, code })
    log('OAuth success!')
    toast.success(`Successfully connected ${provider} account!`)
    log.debug('Redirecting to /account')
    router.push('/account')
  } catch (error) {
    log.error('OAuth callback error:', error)
    toast.error('Failed to connect account. Please try again.')
    log.debug('Redirecting to /account (error)')
    router.push('/account')
  }
})
</script>
