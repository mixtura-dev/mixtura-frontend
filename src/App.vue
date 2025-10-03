<template>
  <RouterView class="test" />
  <Toaster position="top-right" class="pointer-events-auto" />
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css'
import { useTheme } from './composables/useTheme';

useTheme()
</script>
