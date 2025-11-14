import { type Directive } from 'vue'

/**
 * @property {string} text - The text to be copied to the clipboard.
 * @property {() => void} [onCopy] - Optional callback function executed after successful copy.
 */
interface CopyBinding {
  text: string
  onCopy?: () => void
}
/**
 * Vue directive that copies a given text to the clipboard when the bound element is clicked.
 *
 * @directive v-copy
 * @example
 * ```vue
 * <template>
 *   <button v-copy="{ text: 'Hello World', onCopy: onCopied }">Copy</button>
 * </template>
 *
 * <script setup lang="ts">
 *
 * const onCopied = () => {
 *   console.log('Text copied!')
 * }
 * </script>
 * ```
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard
 */
const copy: Directive<HTMLElement, CopyBinding> = {
  mounted(el, binding) {
    el.addEventListener('click', async () => {
      const { text, onCopy } = binding.value
      if (!text) return
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text)
        } else {
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          //For old browsers
          document.execCommand('copy')
          document.body.removeChild(textarea)
        }
        onCopy?.()
      } catch (err) {
        console.error('[Directives] Copy error:', err)
      }
    })
  },
}

export default copy
