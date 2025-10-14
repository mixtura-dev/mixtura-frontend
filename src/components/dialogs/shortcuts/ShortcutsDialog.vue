<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-[950px] max-h-[80dvh] grid-rows-[auto_minmax(0,1fr)_auto] p-0">
      <DialogHeader class="p-6 pb-0">
        <DialogTitle class="text-start">
          <span class="text-2xl">
            Комбинации клавиш <KbdGroup><Kbd>Ctrl</Kbd><Kbd>/</Kbd></KbdGroup>
          </span>
        </DialogTitle>
        <DialogDescription class="text-start"> Овладейте мастерством </DialogDescription>
      </DialogHeader>
      <ShortcutsBody :sections="sections" />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ShortcutsBody, { type Section } from './ShortcutsBody.vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'

const open = ref(false)

const sections: Section[] = [
  {
    title: 'Навигация',
    items: [
      {
        description: 'Переходите вперед и назад на истории страниц',
        combos: [{ keys: ['Alt', ArrowLeft] }, { keys: ['Alt', ArrowRight] }],
      },
    ],
  },
  {
    title: 'Прочее',
    items: [
      {
        description: 'Открыть список команд',
        combos: [{ keys: ['Ctrl', '/'] }],
      },
    ],
  },
]

const keys = useMagicKeys()
whenever(keys.ctrl_slash, () => {
  open.value = !open.value
})
</script>
