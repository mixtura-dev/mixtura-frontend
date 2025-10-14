<template>
  <a
    v-if="isExternalLink"
    v-bind="$attrs"
    :href="normalizedHref"
    :target="target"
    rel="noopener noreferrer"
  >
    <slot />
  </a>

  <router-link v-else v-bind="$props" custom v-slot="{ isExactActive, href, navigate }">
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isExactActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </router-link>
</template>

<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue'
import { RouterLink, type RouterLinkProps } from 'vue-router'

interface LinkProps extends RouterLinkProps {
  inactiveClass?: HTMLAttributes['class']
  target?: '_blank' | '_self' | '_parent' | '_top'
}

defineOptions({ inheritAttrs: false })

const props = defineProps<LinkProps>()

const isExternalLink = computed(() => typeof props.to === 'string' && props.to.startsWith('http'))
const normalizedHref = computed(() => String(props.to))
const target = computed(() => props.target ?? '_blank')
</script>
