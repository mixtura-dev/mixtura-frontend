<template>
  <section aria-labelledby="error-title" role="alert"
    class="flex relative px-4 flex-col h-full w-full  items-center justify-center" v-motion :initial="{ opacity: 0 }"
    :enter="{
      opacity: 1,
    }">
    <div class="flex flex-col items-center container max-w-xl">
      <p
        class="-z-1 absolute top-1/4  sm:top-1/2 -translate-y-1/2 font-mono font-bold  sm:text-muted/60 text-foregroun text-[35vw] leading-none select-none">
        {{ statusCode }}
      </p>

      <div class="size-24 cursor-pointer" @mouseenter="handleHover" aria-hidden="true">
        <Vue3Lottie ref="lottieRef" :animationData="duckNotFound" :autoPlay="true" :loop="false" renderer="svg"
          @onComplete="onAnimationComplete" />
      </div>

      <h1 id="error-title"
        class="mb-8 text-center font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground">
        {{ $t(`error.${title}`) }}
      </h1>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" class="hover:-rotate-3" @click="goBack">
          <ArrowLeft />
          {{ $t('common.back') }}
        </Button>
        <Button variant="outline" size="lg" class="px-8 hover:rotate-3" @click="goHome">
          <HomeIcon />
          {{ $t('menu.home') }}
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import duckNotFound from '@/assets/duckNotFound.json'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
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

const goHome = () => router.push('/')
const lottieRef = ref<typeof Vue3Lottie | null>(null)
const isPlaying = ref(false)

const handleHover = () => {
  if (isPlaying.value || !lottieRef.value) return
  isPlaying.value = true
  lottieRef.value.goToAndPlay(0, true)
}

const onAnimationComplete = () => {
  isPlaying.value = false
}
</script>
