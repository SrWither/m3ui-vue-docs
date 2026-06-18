<script setup lang="ts">
import { ref } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'

const props = defineProps<{ code: string }>()

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

<template>
  <span
    class="inline-flex cursor-pointer items-center gap-1 rounded-md bg-surface-container-high px-2 py-0.5 text-body-small transition-colors hover:bg-surface-container-highest"
    @click="copy"
  >
    <code class="font-['Roboto_Mono'] text-primary">{{ code }}</code>
    <MIcon
      :name="copied ? 'check' : 'content_copy'"
      :size="14"
      :class="copied ? 'text-primary' : 'text-outline'"
    />
  </span>
</template>
