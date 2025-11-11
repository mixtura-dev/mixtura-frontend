<template>
  <FormField v-slot="{ componentField, errorMessage }" name="captcha">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <VueHcaptcha
          :sitekey="sitekey"
          @verify="(token: string) => componentField.onChange(token)"
          @expired="() => componentField.onChange('')"
          @error="() => componentField.onChange('')"
        />
      </FormControl>
      <FormMessage>{{ errorMessage }}</FormMessage>
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
const sitekey = import.meta.env.VITE_HCAPTCHA_SITEKEY
defineProps<{
  label?: string
}>()
</script>
