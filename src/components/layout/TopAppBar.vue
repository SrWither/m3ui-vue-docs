<script setup lang="ts">
import { computed } from 'vue'
import { MIcon, MMenu, MTooltip, useTheme, useColorPalette } from '@m3ui-vue/m3ui-vue'

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
  <header
    class="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-outline-variant bg-surface px-4 md:px-6"
  >
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8 active:bg-on-surface/12 md:hidden"
        aria-label="Open menu"
        @click="$emit('menuClick')"
      >
        <MIcon name="menu" :size="22" />
      </button>

      <span
        class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container"
      >
        <MIcon name="widgets" :size="22" />
      </span>
      <div class="leading-tight">
        <h1 class="text-title-medium font-medium text-on-surface">M3UI Vue</h1>
        <p class="text-label-small text-on-surface-variant">Documentation</p>
      </div>
    </div>

    <div class="flex items-center gap-1">
      <button
        type="button"
        class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8 active:bg-on-surface/12"
        :title="`Theme: ${themeLabel}`"
        @click="cycle"
      >
        <MIcon :name="themeIcon" :size="22" />
      </button>

      <MMenu>
        <template #trigger="{ open }">
          <button
            type="button"
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8 active:bg-on-surface/12"
            :class="open && 'bg-on-surface/8'"
            title="Color palette"
          >
            <MIcon name="palette" :size="22" />
          </button>
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
    </div>
  </header>
</template>
