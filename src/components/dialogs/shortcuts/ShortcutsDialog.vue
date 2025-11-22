<template>
  <Dialog v-model:open="open">
    <DialogContent
      class="sm:max-w-[950px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 transition-all duration-300 ease-in-out"
      :style="{ height: modalHeight }"
    >
      <DialogHeader class="p-6 pb-0">
        <DialogTitle class="text-start">
          <span class="text-2xl">
            Комбинации клавиш <KbdGroup><Kbd>Ctrl</Kbd><Kbd>/</Kbd> </KbdGroup>
          </span>
        </DialogTitle>
        <DialogDescription class="text-start"> Овладейте мастерством </DialogDescription>
      </DialogHeader>

      <div class="relative w-full overflow-hidden">
        <div
          class="flex transition-transform duration-300 ease-in-out"
          :style="{ transform: `translate3d(-${step * 100}%, 0, 0)` }"
        >
          <div v-for="(s, index) in steps" :key="index" class="w-full flex-shrink-0 p-6">
            <ShortcutsBody :sections="s.sections" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button size="sm" @click="prevStep" :disabled="step === 0">⬅️</Button>
        <Button size="sm" @click="nextStep" :disabled="step === steps.length - 1">➡️</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import ShortcutsBody, { type Section } from './ShortcutsBody.vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'

const open = ref(false)
const step = ref(0)
const modalHeight = ref('auto')

const steps = [
  {
    sections: [
      {
        title: 'Навигация',
        items: [
          {
            description: 'Переходите вперед и назад на истории страниц',
            combos: [{ keys: ['Alt', ArrowLeft] }, { keys: ['Alt', ArrowRight] }],
          },
        ],
      },
    ] as Section[],
  },
  {
    sections: [
      {
        title: 'Прочее',
        items: Array(20).fill({
          description: 'Открыть список команд',
          combos: [{ keys: ['Ctrl', '/'] }],
        }),
      },
    ] as Section[],
  },
]

watch(step, async () => {
  await nextTick()
})

// Функции переключения шагов
const nextStep = () => {
  if (step.value < steps.length - 1) step.value++
}
const prevStep = () => {
  if (step.value > 0) step.value--
}

// Magic keys для открытия модалки
const keys = useMagicKeys()
whenever(keys.ctrl_slash, () => {
  open.value = !open.value
})
</script>
