<template>
  <RouterView class="test" />
  <Toaster position="top-right" class="pointer-events-auto" />
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css'
import { useTheme } from './composables/useTheme';
import { useAuthStore } from './stores/authStore.store';
import { useUserQuery } from './composables/useAuthQuery';
import { watch } from 'vue';
const authStore = useAuthStore();
const userQuery = useUserQuery();

watch(
  () => userQuery.data.value,
  (user) => {
    if (user) {
      authStore.setUser(user);
    }
  }
);

watch(
  () => userQuery.error.value,
  (error) => {
    if (error) {
      authStore.clearUser();
    }
  }
);
useTheme()
</script>
