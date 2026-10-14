<script setup lang="ts">
import { useRouter } from 'vue-router'
import { MButton, MIcon, MShape } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useDesktop } from '../useDesktop'

const router = useRouter()
const { open } = useDesktop()

const tips = [
  { icon: 'touch_app', text: 'Double-click an icon to open an app (tap on touch screens).' },
  { icon: 'drag_pan', text: 'Drag a title bar to the top to maximize, or to a side to fill half.' },
  { icon: 'minimize', text: 'Minimize to the taskbar; click the app there to bring it back.' },
  { icon: 'palette', text: 'Change the theme, palette and wallpaper in Settings.' },
]
</script>

<template>
  <div class="flex h-full flex-col gap-4 overflow-auto p-5">
    <div class="flex items-center gap-4">
      <div class="relative h-16 w-16 shrink-0">
        <MShape shape="Cookie9Sided" class="m3d-welcome-shape h-16 w-16 text-primary" />
        <div class="absolute inset-0 flex items-center justify-center">
          <MIcon name="waving_hand" :size="28" class="text-on-primary" />
        </div>
      </div>
      <div>
        <h2 class="text-headline-small text-on-surface">Welcome</h2>
        <p class="text-body-medium text-on-surface-variant">A desktop made only with m3ui-vue.</p>
      </div>
    </div>

    <ul class="flex flex-col gap-2">
      <li v-for="t in tips" :key="t.text" class="flex items-start gap-3 rounded-xl bg-surface-container-low p-3">
        <MIcon :name="t.icon" :size="20" class="mt-0.5 shrink-0 text-primary" />
        <span class="text-body-medium text-on-surface">{{ t.text }}</span>
      </li>
    </ul>

    <div class="mt-auto flex flex-wrap gap-2">
      <MButton icon="folder" @click="open('files')">Open Files</MButton>
      <a :href="exampleSource('desktop')" target="_blank" rel="noopener" class="no-underline">
        <MButton variant="outlined" icon="code">View source</MButton>
      </a>
      <MButton variant="text" icon="menu_book" @click="router.push('/examples')">Back to docs</MButton>
    </div>
  </div>
</template>

<style scoped>
.m3d-welcome-shape {
  animation: m3d-welcome 24s linear infinite;
}
@keyframes m3d-welcome {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .m3d-welcome-shape {
    animation: none;
  }
}
</style>
