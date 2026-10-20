<script setup lang="ts">
/*
 * Wears a recipe's color scheme: everything inside picks up the scheme built from `seed`
 * (useScheme.ts). It sets its own text color too, since plain text inherits the color computed
 * outside, with the app's palette.
 */
import { useScheme } from '../useScheme'

const props = withDefaults(defineProps<{ seed?: string; as?: string }>(), { as: 'div' })
const style = useScheme(() => props.seed)
</script>

<template>
  <component :is="as" :style="style" class="text-on-surface">
    <slot />
  </component>
</template>
