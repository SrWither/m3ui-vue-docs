<script setup lang="ts">
/* Logo, the project's name, what the chart shows, import and export, theme, docs and source. */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MIcon, MIconButton, MMenu, MMenuDivider, MMenuItem, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { autoSchedule, projectName, showBaselines, showCritical } from '../useProject'

defineProps<{ wide: boolean }>()
const emit = defineEmits<{ export: [format: 'csv' | 'json' | 'xml']; import: [file: File] }>()
const router = useRouter()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('roadmap'), '_blank', 'noopener')
const fileInput = ref<HTMLInputElement>()
function picked(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) emit('import', f)
  ;(e.target as HTMLInputElement).value = ''
}
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-1 px-2 sm:gap-2 sm:px-4">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary"><MIcon name="view_timeline" :size="22" /></span>
    <span v-if="wide" class="text-title-large font-medium">Tempo</span>
    <MIcon v-if="wide" name="chevron_right" :size="20" class="text-outline" />
    <input
      v-model="projectName"
      aria-label="Project name"
      class="min-w-0 flex-1 truncate rounded-sm bg-transparent px-2 py-1 text-title-medium text-on-surface outline-none hover:bg-on-surface/8 focus:bg-surface-container-highest sm:max-w-80"
    />
    <span v-if="wide" class="flex-1" />
    <MMenu align="right">
      <template #trigger>
        <MTooltip text="View" placement="bottom"><MIconButton icon="tune" label="View" /></MTooltip>
      </template>
      <MMenuItem :icon="showCritical ? 'check_box' : 'check_box_outline_blank'" @click="showCritical = !showCritical">Critical path</MMenuItem>
      <MMenuItem :icon="showBaselines ? 'check_box' : 'check_box_outline_blank'" @click="showBaselines = !showBaselines">Baselines</MMenuItem>
      <MMenuDivider />
      <MMenuItem :icon="autoSchedule ? 'check_box' : 'check_box_outline_blank'" @click="autoSchedule = !autoSchedule">Auto schedule</MMenuItem>
    </MMenu>
    <MMenu align="right">
      <template #trigger>
        <MTooltip text="Import and export" placement="bottom"><MIconButton icon="import_export" label="Import and export" /></MTooltip>
      </template>
      <MMenuItem icon="upload_file" @click="fileInput?.click()">Import CSV, JSON or MS Project…</MMenuItem>
      <MMenuDivider />
      <MMenuItem icon="table" @click="emit('export', 'csv')">Export CSV</MMenuItem>
      <MMenuItem icon="data_object" @click="emit('export', 'json')">Export JSON</MMenuItem>
      <MMenuItem icon="schema" @click="emit('export', 'xml')">Export MS Project XML</MMenuItem>
    </MMenu>
    <input ref="fileInput" type="file" accept=".csv,.json,.xml,text/csv,application/json,application/xml,text/xml" class="hidden" @change="picked" />
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MTooltip v-if="wide" text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
    <MTooltip v-if="wide" text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
  </header>
</template>
