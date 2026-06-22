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
  <MTopAppBar navigation-icon="menu" :bordered="true" class="md:[&>div>button:first-child]:hidden" @navigation="$emit('menuClick')">
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
      <MTooltip text="GitHub">
        <a
          href="https://github.com/SrWither/m3ui-vue"
          target="_blank"
          rel="noopener"
          class="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.6 9.6 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
        </a>
      </MTooltip>

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
