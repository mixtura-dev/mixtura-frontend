import { useColorMode, type BasicColorSchema } from '@vueuse/core'
import { computed } from 'vue'

export const useTheme = () => {
  const { system, store } = useColorMode({
    attribute: 'class',
    modes: {
      solar: 'solar',
    },
  })
  const mode = computed({
    get: () => (store.value === 'auto' ? system.value : store.value),
    set: (theme: BasicColorSchema) => {
      store.value = theme
    },
  })

  const changeTheme = (theme: BasicColorSchema) => {
    mode.value = theme
  }

  return {
    mode,
    store,
    changeTheme,
  }
}
