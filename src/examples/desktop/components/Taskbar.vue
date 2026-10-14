<script setup lang="ts">
// Taskbar: start button + running apps in the middle, tray on the right (theme, docs, clock).
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MIcon, MIconButton, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { useDesktop } from '../useDesktop'
import StartMenu from './StartMenu.vue'

const router = useRouter()
const { runningApps, visible, active, toggle } = useDesktop()
const { theme, cycle } = useTheme()
const startOpen = ref(false)

const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const themeLabel = computed(() => `Theme: ${theme.value}`)

const now = ref(new Date())
let timer: ReturnType<typeof setInterval>
onMounted(() => (timer = setInterval(() => (now.value = new Date()), 15_000)))
onBeforeUnmount(() => clearInterval(timer))
const time = computed(() => now.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
const date = computed(() => now.value.toLocaleDateString([], { day: 'numeric', month: 'short' }))
</script>

<template>
  <footer class="absolute inset-x-0 bottom-0 z-[100000] flex h-14 items-center border-t border-outline-variant/40 bg-surface-container/85 px-2 backdrop-blur-xl">
    <div class="flex-1" />

    <!-- Start + running apps -->
    <nav class="flex items-center gap-1" aria-label="Taskbar">
      <button
        type="button"
        class="m3d-task"
        :class="startOpen && 'bg-on-surface/8'"
        aria-label="Start"
        :aria-expanded="startOpen"
        data-start-button
        @click="startOpen = !startOpen"
      >
        <MIcon name="grid_view" :size="24" class="text-primary" />
      </button>

      <button
        v-for="app in runningApps"
        :key="app.id"
        type="button"
        class="m3d-task"
        :class="active === app.id && visible[app.id] && 'bg-on-surface/8'"
        :aria-label="app.title"
        :title="app.title"
        @click="toggle(app.id)"
      >
        <MIcon :name="app.icon" :size="24" />
        <!-- Indicator: a bar for the window in front, a dot for the others -->
        <span
          class="absolute bottom-0.5 left-1/2 h-1 -translate-x-1/2 rounded-full transition-all duration-200"
          :class="active === app.id && visible[app.id] ? 'w-4 bg-primary' : 'w-1.5 bg-on-surface-variant'"
        />
      </button>
    </nav>

    <!-- Tray -->
    <div class="flex flex-1 items-center justify-end gap-1">
      <MTooltip :text="themeLabel" placement="top">
        <MIconButton :icon="themeIcon" size="sm" :label="themeLabel" @click="cycle" />
      </MTooltip>
      <MTooltip text="Back to the docs" placement="top">
        <MIconButton icon="menu_book" size="sm" label="Back to the docs" @click="router.push('/examples')" />
      </MTooltip>
      <div class="ml-1 hidden flex-col items-end px-2 leading-tight sm:flex">
        <span class="text-label-large tabular-nums text-on-surface">{{ time }}</span>
        <span class="text-label-small text-on-surface-variant">{{ date }}</span>
      </div>
    </div>

    <StartMenu v-model="startOpen" />
  </footer>
</template>

<style scoped>
.m3d-task {
  position: relative;
  display: flex;
  height: 44px;
  width: 44px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: var(--color-on-surface);
  outline: none;
  transition: background-color 150ms;
}
.m3d-task:hover {
  background-color: color-mix(in srgb, var(--color-on-surface) 8%, transparent);
}
.m3d-task:active {
  background-color: color-mix(in srgb, var(--color-on-surface) 12%, transparent);
}
.m3d-task:focus-visible {
  box-shadow: 0 0 0 2px var(--color-secondary);
}
</style>
