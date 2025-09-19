<template>
  <div class="max-w-2xl w-full mx-auto py-6 sm:p-4">
    <div class=" bg-card border  rounded ">
      <div class=" px-4 md:px-6 py-4 border-b">
        <h1 class="text-lg font-semibold ">Create New Workspace</h1>
        <p class=" text-muted-foreground text-sm">Here you can create new workspace with new players, and set them your
          rank.</p>
      </div>
      <div class="px-4 md:px-6 py-4 border-b">
        <Input />
      </div>
      <div class="flex sm:flex-row flex-col  px-4 md:px-6 py-4 justify-end gap-2">
        <Button variant="outline" size="sm" @click="router.back()">
          {{ $t('common.cancel') }}
        </Button>
        <Button size="sm" @click="handleSubmit">
          {{ $t('common.add') }}
        </Button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
const title = ref('')
const subtitle = ref('')
const router = useRouter()

function handleSubmit() {
  console.log('Created:', { title: title.value, subtitle: subtitle.value })

  router.push('/workspace')
}
</script>
