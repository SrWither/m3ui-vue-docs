<script setup lang="ts">
/* A titled row of cards that scrolls sideways, with arrow buttons on devices with a pointer. */
import { ref } from 'vue'
import { MIconButton } from '@m3ui-vue/m3ui-vue'

defineProps<{ title: string }>()
const row = ref<HTMLElement>()
const scroll = (dir: number) => row.value?.scrollBy({ left: dir * row.value.clientWidth * 0.8, behavior: 'smooth' })
</script>

<template>
  <section class="mt-6">
    <div class="mb-1 flex items-center gap-1 px-2">
      <h2 class="flex-1 text-title-large text-on-surface">{{ title }}</h2>
      <span class="hidden gap-1 md:flex">
        <MIconButton icon="chevron_left" label="Scroll left" size="xs" @click="scroll(-1)" />
        <MIconButton icon="chevron_right" label="Scroll right" size="xs" @click="scroll(1)" />
      </span>
    </div>
    <div ref="row" class="-mx-1 flex snap-x scroll-px-1 gap-1 overflow-x-auto px-1 pb-2 [scrollbar-width:none]">
      <slot />
    </div>
  </section>
</template>
