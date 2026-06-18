<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  MTopAppBar,
  MIconButton,
  MNavigationDrawer,
  MIcon,
  MMenu,
  MMenuItem,
  useTheme,
  useColorPalette,
} from '@m3ui-vue/m3ui-vue'

const route = useRoute()
const { theme, cycle } = useTheme()
const { palette, palettes, set: setPalette } = useColorPalette()

const themeIcon = computed(() => {
  switch (theme.value) {
    case 'dark': return 'dark_mode'
    case 'light': return 'light_mode'
    default: return 'contrast'
  }
})

const navSections = [
  {
    items: [
      { value: '/', label: 'Home', icon: 'home' },
    ],
  },
  {
    title: 'Components',
    items: [
      { value: '/components/buttons', label: 'Buttons', icon: 'smart_button' },
    ],
  },
  {
    title: 'Styles',
    items: [
      { value: '/styles/palettes', label: 'Palettes', icon: 'palette' },
    ],
  },
]

const currentPath = computed(() => route.path)
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-surface text-on-surface">
    <MNavigationDrawer
      :model-value="true"
      :selected="currentPath"
      :sections="navSections"
      title="M3UI Vue"
      :modal="false"
      @select="(val: string | number) => $router.push(String(val))"
    />

    <div class="flex flex-1 flex-col overflow-hidden">
      <MTopAppBar title="M3UI Vue" variant="small">
        <template #actions>
          <MMenu align="right">
            <template #trigger>
              <MIconButton icon="palette" label="Change palette" />
            </template>
            <div class="grid grid-cols-4 gap-1 p-2" style="min-width: 220px" @click.stop>
              <button
                v-for="p in palettes"
                :key="p.id"
                type="button"
                class="flex cursor-pointer flex-col items-center gap-1 rounded-lg p-2 transition-colors hover:bg-on-surface/8"
                :class="p.id === palette ? 'bg-secondary-container' : ''"
                :title="p.label"
                @click="setPalette(p.id)"
              >
                <span
                  class="h-6 w-6 rounded-full border-2 border-outline-variant"
                  :style="{ backgroundColor: p.seed }"
                />
                <span class="text-label-small leading-none">{{ p.label }}</span>
              </button>
            </div>
          </MMenu>

          <MIconButton
            :icon="themeIcon"
            label="Toggle theme"
            @click="cycle"
          />
        </template>
      </MTopAppBar>

      <main class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-5xl p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
