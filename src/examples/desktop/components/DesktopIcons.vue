<script setup lang="ts">
// Desktop icons: click selects, double-click (or Enter) opens; on touch a single tap opens.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { useDesktop } from '../useDesktop'

const { apps, open } = useDesktop()
const icons = apps.filter((a) => a.onDesktop)
const selected = ref<string | null>(null)

function onPointerUp(e: PointerEvent, id: string) {
  selected.value = id
  if (e.pointerType === 'touch') open(id)
}

// Clicking anywhere else clears the selection, like a desktop.
function clear(e: PointerEvent) {
  if (!(e.target as Element).closest('[data-desktop-icon]')) selected.value = null
}
onMounted(() => document.addEventListener('pointerdown', clear))
onBeforeUnmount(() => document.removeEventListener('pointerdown', clear))

const tones = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
  error: 'bg-error-container text-on-error-container',
}
</script>

<template>
  <div class="absolute top-3 left-3 grid auto-cols-[88px] grid-flow-col grid-rows-[repeat(auto-fill,96px)] gap-1" style="height: calc(100% - 24px)">
    <button
      v-for="app in icons"
      :key="app.id"
      type="button"
      data-desktop-icon
      class="flex cursor-default flex-col items-center gap-1.5 rounded-xl p-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-secondary"
      :class="selected === app.id ? 'bg-primary/16' : 'hover:bg-on-surface/8'"
      @pointerup="onPointerUp($event, app.id)"
      @dblclick="open(app.id)"
      @keydown.enter="open(app.id)"
    >
      <span class="flex h-12 w-12 items-center justify-center rounded-2xl shadow-elevation-1" :class="tones[app.tone]">
        <MIcon :name="app.icon" :size="26" />
      </span>
      <span class="line-clamp-2 text-center text-label-medium text-on-surface">{{ app.title }}</span>
    </button>
  </div>
</template>
