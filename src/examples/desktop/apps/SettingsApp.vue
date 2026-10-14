<script lang="ts">
// Module-level state: survives the window being minimized (its content unmounts while hidden).
import { ref } from 'vue'

const section = ref('appearance')
const showDetail = ref(false)
</script>

<script setup lang="ts">
// MListDetail measures the window, not the screen: one pane at the normal size, both side by
// side once the window is maximized (or snapped wide enough).
import { computed } from 'vue'
import { MListDetail, MIcon, MIconButton, MSegmentedButton, MSwitch, palettes, useColorPalette, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { useDesktop, type Wallpaper } from '../useDesktop'

const { theme } = useTheme()
const { palette, set } = useColorPalette()
const { wallpaper } = useDesktop()

const sections = [
  { id: 'appearance', label: 'Appearance', icon: 'palette', hint: 'Theme and color palette' },
  { id: 'wallpaper', label: 'Wallpaper', icon: 'wallpaper', hint: 'Desktop background' },
  { id: 'about', label: 'About', icon: 'info', hint: 'This example' },
]
const current = computed(() => sections.find((s) => s.id === section.value)!)

const themeOptions = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
  { value: 'system', label: 'System', icon: 'brightness_auto' },
]
const wallpapers: { id: Wallpaper; label: string; preview: string }[] = [
  { id: 'aurora', label: 'Aurora', preview: 'bg-gradient-to-br from-primary-container via-surface-container-lowest to-tertiary-container' },
  { id: 'shapes', label: 'Shapes', preview: 'bg-primary-container' },
  { id: 'plain', label: 'Plain', preview: 'bg-surface-container' },
]
const reduceTransparency = ref(false)

function pick(id: string) {
  section.value = id
  showDetail.value = true
}
</script>

<template>
  <MListDetail v-model:show-detail="showDetail" list-width="220px" class="h-full">
    <template #list="{ twoPane }">
      <nav class="flex flex-col gap-0.5 p-2">
        <button
          v-for="s in sections"
          :key="s.id"
          type="button"
          class="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left"
          :class="twoPane && s.id === section ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface hover:bg-on-surface/8'"
          @click="pick(s.id)"
        >
          <MIcon :name="s.icon" />
          <span class="min-w-0 flex-1">
            <span class="block text-label-large">{{ s.label }}</span>
            <span class="block truncate text-body-small text-on-surface-variant">{{ s.hint }}</span>
          </span>
          <MIcon v-if="!twoPane" name="chevron_right" :size="20" class="text-on-surface-variant" />
        </button>
      </nav>
    </template>

    <template #detail="{ twoPane, back }">
      <div class="flex min-h-full flex-col gap-5 p-4" :class="twoPane && 'border-l border-outline-variant/60'">
        <div class="flex items-center gap-2">
          <MIconButton v-if="!twoPane" icon="arrow_back" size="sm" label="Back" @click="back" />
          <h2 class="text-title-large text-on-surface">{{ current.label }}</h2>
        </div>

        <template v-if="section === 'appearance'">
          <section class="flex flex-col gap-2">
            <h3 class="text-label-large text-on-surface-variant">Theme</h3>
            <MSegmentedButton v-model="theme" :options="themeOptions" />
          </section>
          <section class="flex flex-col gap-2">
            <h3 class="text-label-large text-on-surface-variant">Palette · {{ palettes.find((p) => p.id === palette)?.label }}</h3>
            <div class="grid grid-cols-[repeat(auto-fill,minmax(32px,1fr))] gap-2">
              <button
                v-for="p in palettes"
                :key="p.id"
                type="button"
                class="aspect-square cursor-pointer rounded-full outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-secondary"
                :class="p.id === palette && 'ring-2 ring-on-surface ring-offset-2 ring-offset-surface'"
                :style="{ background: p.seed }"
                :aria-label="p.label"
                :title="p.label"
                @click="set(p.id)"
              />
            </div>
          </section>
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <p class="text-body-large text-on-surface">Reduce transparency</p>
              <p class="text-body-small text-on-surface-variant">Just a switch to show MSwitch, it does nothing</p>
            </div>
            <MSwitch v-model="reduceTransparency" />
          </div>
        </template>

        <div v-else-if="section === 'wallpaper'" class="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
          <button
            v-for="w in wallpapers"
            :key="w.id"
            type="button"
            class="flex cursor-pointer flex-col gap-2 rounded-2xl p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            :class="wallpaper === w.id ? 'bg-secondary-container' : 'hover:bg-on-surface/8'"
            @click="wallpaper = w.id"
          >
            <span class="aspect-video rounded-xl border border-outline-variant/60" :class="w.preview" />
            <span class="flex items-center gap-1 text-label-large text-on-surface">
              <MIcon v-if="wallpaper === w.id" name="check" :size="18" />
              {{ w.label }}
            </span>
          </button>
        </div>

        <div v-else class="flex flex-col gap-3 text-body-medium text-on-surface">
          <p>A desktop environment built only with m3ui-vue components: MWindow for the windows (with snap and offscreen), MListDetail right here, MKanban, MCalendar, MSlider, MSegmentedButton, MShape and more.</p>
          <p class="text-on-surface-variant">Maximize this window to see Settings switch to two panes.</p>
          <a :href="exampleSource('desktop')" target="_blank" rel="noopener" class="flex items-center gap-1 text-primary">
            <MIcon name="code" :size="18" /> View the source on GitHub
          </a>
        </div>
      </div>
    </template>
  </MListDetail>
</template>
