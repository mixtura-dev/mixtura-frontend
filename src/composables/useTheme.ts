import { useColorMode, type BasicColorSchema } from '@vueuse/core'

export const useTheme = () => {
  const mode = useColorMode({
    attribute: 'class',
  })
  const changeTheme = (theme: BasicColorSchema) => {
    mode.value = theme
  }

  return {
    mode,
    changeTheme,
  }
}
