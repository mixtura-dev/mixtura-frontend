<template>
  <div class="img-pattern"></div>
  <RouterView :style="{
    paddingTop: top,
    paddingRight: right,
    paddingBottom: bottom,
    paddingLeft: left,
  }" />
  <Toaster position="top-right" class="pointer-events-auto" />
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import { useTheme } from './composables/useTheme'
import { useScreenSafeArea } from '@vueuse/core'
import { onMounted } from 'vue'
import { changeLocale, getInitialLocale } from '@/i18n'

const { top, right, bottom, left } = useScreenSafeArea()
useTheme()

const initialLocale = getInitialLocale()

onMounted(async () => {
  await changeLocale(initialLocale)
})

</script>
