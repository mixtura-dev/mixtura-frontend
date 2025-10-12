<template>
  <div class="flex px-4 dot-pattern flex-col h-full w-full items-center justify-center">
    <div class="container max-w-xl">
      <p class="mb-2 font-bold tracking-tight text-primary">{{ statusCode }} error</p>
      <h1 class="text-3xl font-bold tracking-tight lg:text-4xl mb-4">{{ title }}</h1>
      <Button @click="goBack"> Go to Home </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
interface ErrorPageProps {
  statusCode?: number
  message?: string
}
const props = withDefaults(defineProps<ErrorPageProps>(), {
  statusCode: 404,
  message: "We can't find this page",
})

const title = computed(() => {
  if (!props.message) return 'Error'
  return props.message
})
const router = useRouter()
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
