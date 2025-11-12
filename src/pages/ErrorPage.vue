<template>
  <section class="flex bg-background px-4 flex-col h-full w-full items-center justify-center">
    <div class="flex flex-col items-center container max-w-xl">
      <Badge variant="destructive" class="mb-6">
        <p role="alert" aria-live="assertive" class="font-bold tracking-tight">
          {{ statusCode }} <span class="mx-1">•</span> {{ $t('common.error') }}
        </p>
      </Badge>

      <!-- 
      <div class="size-12 cursor-pointer" @mouseenter="handleHover">
        <Vue3Lottie ref="lottieRef" :animationData="duckNotFound" :autoPlay="false" :loop="false" renderer="svg"
          @onComplete="onAnimationComplete" />
      </div> -->

      <h1 class="mb-7 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {{ $t(`error.${title}`) }}
      </h1>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" @click="goBack">
          <ArrowLeft />
          {{ $t('common.back') }}
        </Button>
        <Button variant="outline" size="lg" class="px-8" @click="goBack">
          <HomeIcon />
          {{ $t('menu.home') }}
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// import { Vue3Lottie } from 'vue3-lottie'
// import duckNotFound from '@/assets/duckNotFound.json'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import Badge from '@/components/ui/badge/Badge.vue'
import { ArrowLeft, HomeIcon } from 'lucide-vue-next'

interface ErrorPageProps {
  statusCode?: number
  message?: string
}
const props = withDefaults(defineProps<ErrorPageProps>(), {
  statusCode: 404,
  message: 'noResults',
})

const title = computed(() => props.message || 'noResults')

const router = useRouter()
const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

// const lottieRef = ref<typeof Vue3Lottie | null>(null)
// const isPlaying = ref(false)

// const handleHover = () => {
//   if (isPlaying.value || !lottieRef.value) return
//   isPlaying.value = true
//   lottieRef.value.goToAndPlay(0, true)
// }

// const onAnimationComplete = () => {
//   isPlaying.value = false
// }
</script>
