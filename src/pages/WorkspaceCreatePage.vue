<template>
  <section class="max-w-2xl w-full mx-auto py-6 p-4 sm:p-4">
    <Card>
      <CardHeader>
        <CardTitle> Create New Workspace </CardTitle>
        <CardDescription>
          Here you can create new workspace with new players, and set them your rank.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input />
      </CardContent>
      <CardFooter class="flex sm:flex-row flex-col justify-end gap-2">
        <Button variant="outline" size="sm" @click="router.back()">
          {{ $t('common.cancel') }}
        </Button>
        <Button size="sm" @click="handleSubmit">
          {{ $t('common.add') }}
        </Button>
      </CardFooter>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
const title = ref('')
const subtitle = ref('')
const router = useRouter()

function handleSubmit() {
  console.log('Created:', { title: title.value, subtitle: subtitle.value })

  router.push('/workspace')
}
</script>
