<script setup lang="ts">
/*
 * Desktop example: a desktop environment built only with m3ui-vue.
 * - Wallpaper.vue    background (picked in Settings)
 * - DesktopIcons.vue icons on the desktop (double-click / tap to open)
 * - MWindow          one per running app, with snap + offscreen like a desktop
 * - Taskbar.vue      start menu, running apps, tray (theme, back to docs, clock)
 * - useDesktop.ts    shared state: which apps run, which windows show, which is in front
 * - apps/*.vue       the apps themselves; each keeps its state at module level, so it survives
 *                    being minimized (MWindow unmounts its content while hidden)
 */
import { defineAsyncComponent, nextTick, onMounted, reactive, watch, type Component } from 'vue'
import { MWindow, MIconButton } from '@m3ui-vue/m3ui-vue'
import { useDesktop, appById } from './useDesktop'
import Wallpaper from './components/Wallpaper.vue'
import DesktopIcons from './components/DesktopIcons.vue'
import Taskbar from './components/Taskbar.vue'

const { runningApps, visible, active, focusRequest, open, hide, quit } = useDesktop()

const views = new Map<string, Component>()
function view(id: string) {
  if (!views.has(id)) views.set(id, defineAsyncComponent(appById(id)!.component))
  return views.get(id)!
}

// Where each app's window first appears: cascading from the top-left, like a desktop.
const spawn = reactive<Record<string, { x: number; y: number }>>({})
let spawned = 0
watch(
  runningApps,
  (list) => {
    for (const app of list) {
      if (spawn[app.id]) continue
      const step = spawned++ % 6
      spawn[app.id] =
        app.id === 'welcome'
          ? // Centered over the desktop area (the screen minus the 56px taskbar).
            { x: Math.max(16, (window.innerWidth - app.width) / 2), y: Math.max(16, (window.innerHeight - 56 - app.height) / 2) }
          : { x: 140 + step * 36, y: 32 + step * 30 }
    }
  },
  { immediate: true },
)

// Taskbar / start menu / terminal ask for a window to come to the front through focusRequest.
const windows = new Map<string, InstanceType<typeof MWindow>>()
watch(focusRequest, async (req) => {
  if (!req) return
  await nextTick()
  windows.get(req.id)?.focus()
})

onMounted(() => open('welcome'))
</script>

<template>
  <div class="relative h-dvh w-full touch-manipulation overflow-hidden bg-surface text-on-surface select-none">
    <Wallpaper />

    <!-- Desktop area: windows are clamped/snapped to this, above the taskbar -->
    <main class="absolute inset-x-0 top-0 bottom-14 overflow-hidden">
      <DesktopIcons />

      <MWindow
        v-for="app in runningApps"
        :key="app.id"
        :ref="(el) => el ? windows.set(app.id, el as InstanceType<typeof MWindow>) : windows.delete(app.id)"
        v-model="visible[app.id]!"
        :title="app.title"
        :icon="app.icon"
        :width="`${app.width}px`"
        :height="`${app.height}px`"
        :x="spawn[app.id]?.x"
        :y="spawn[app.id]?.y"
        :minimizable="false"
        snap
        offscreen
        class="select-text"
        @close="quit(app.id)"
        @focus="active = app.id"
      >
        <!-- Minimize goes to the taskbar here, instead of MWindow's fold-to-title-bar -->
        <template #actions>
          <MIconButton icon="minimize" size="xs" label="Minimize" @click="hide(app.id)" />
        </template>
        <component :is="view(app.id)" />
      </MWindow>
    </main>

    <Taskbar />
  </div>
</template>
