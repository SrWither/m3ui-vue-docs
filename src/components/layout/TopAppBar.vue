<script setup lang="ts">
import { computed } from 'vue'
import { MTopAppBar, MIconButton, MMenu, MTooltip, MIcon, useTheme, useColorPalette } from '@m3ui-vue/m3ui-vue'

defineEmits<{ menuClick: [] }>()

const { theme, cycle } = useTheme()
const { palette, palettes: paletteList, set: setPalette } = useColorPalette()

const themeIcon = computed(() => {
  if (theme.value === 'dark') return 'dark_mode'
  if (theme.value === 'light') return 'light_mode'
  return 'brightness_auto'
})

const themeLabel = computed(() => {
  if (theme.value === 'dark') return 'Dark'
  if (theme.value === 'light') return 'Light'
  return 'System'
})
</script>

<template>
  <MTopAppBar navigation-icon="menu" class="border-b border-outline-variant md:[&>div>button:first-child]:hidden" @navigation="$emit('menuClick')">
    <template #title>
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
          <MIcon name="widgets" :size="22" />
        </span>
        <div class="leading-tight">
          <span class="text-title-medium font-medium text-on-surface">M3UI Vue</span>
          <p class="text-label-small text-on-surface-variant">Documentation</p>
        </div>
      </div>
    </template>

    <template #actions>
      <MTooltip :text="`Theme: ${themeLabel}`">
        <MIconButton :icon="themeIcon" label="Toggle theme" @click="cycle" />
      </MTooltip>

      <MMenu>
        <template #trigger="{ open }">
          <MIconButton
            icon="palette"
            label="Color palette"
            :class="open && 'bg-on-surface/8'"
          />
        </template>
        <div class="px-4 py-3">
          <p class="mb-3 text-label-large font-medium text-on-surface">Color palette</p>
          <div class="grid grid-cols-5 gap-2">
            <MTooltip v-for="p in paletteList" :key="p.id" :text="p.label">
              <button
                type="button"
                class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-150 hover:scale-110"
                :class="palette === p.id ? 'ring-2 ring-on-surface ring-offset-2 ring-offset-surface' : ''"
                :style="{ backgroundColor: p.seed }"
                @click="setPalette(p.id)"
              >
                <MIcon v-if="palette === p.id" name="check" :size="18" class="text-white" />
              </button>
            </MTooltip>
          </div>
        </div>
      </MMenu>
    </template>
  </MTopAppBar>
</template>
