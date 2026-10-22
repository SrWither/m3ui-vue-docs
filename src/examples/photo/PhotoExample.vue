<script setup lang="ts">
/*
 * Photo editor example ("Lightbench"), built only with m3ui-vue.
 * - Wide screens: a menu bar (MMenu with flyout submenus and shortcuts), a vertical floating
 *   MToolbar of tools, the tool's options in a floating MToolbar over the canvas, a side panel
 *   with MTabs (adjust, filters, layers, history) and a status bar.
 * - Phones: a top bar with a ⋮ menu (the same menus as push submenus), the canvas, the mode's
 *   panel and a docked MToolbar of modes.
 * - components/Stage        the canvas: zoom and pan, brush, text, color picker, crop frame, MContextMenu
 * - components/*Panel       MSlider adjustments + histogram, filter thumbnails, MDragDropList layers, history
 * - components/*Dialog      export, open (MFileUpload), text, stickers (MEmojiSelector), shortcuts (MKbd)
 * - usePhoto.ts / imaging.ts / samples.ts   state and undo history, pixel processing, sample photos
 */
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  MBottomSheet, MButton, MConfirmDialog, MDialog, MHotkeys, MIcon, MIconButton, MMenu, MMenuItem, MSplitButton,
  MTabs, MTextField, MTooltip, useTheme, useWindowSizeClass, type HotkeyBinding,
} from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { tools, usePhoto, type Tool } from './usePhoto'
import Stage from './components/Stage.vue'
import ToolRail from './components/ToolRail.vue'
import ToolOptions from './components/ToolOptions.vue'
import MenuSection from './components/MenuSection.vue'
import AdjustPanel from './components/AdjustPanel.vue'
import FiltersPanel from './components/FiltersPanel.vue'
import LayersPanel from './components/LayersPanel.vue'
import HistoryPanel from './components/HistoryPanel.vue'
import ExportDialog from './components/ExportDialog.vue'
import OpenDialog from './components/OpenDialog.vue'
import TextDialog from './components/TextDialog.vue'
import StickerDialog from './components/StickerDialog.vue'
import ShortcutsDialog from './components/ShortcutsDialog.vue'

const p = usePhoto()
const { doc, tool, dialogs, panelTab, brush, showOriginal, selected, renameId } = p
const router = useRouter()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('photo'), '_blank', 'noopener')

const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')

// ─── Menus ──────────────────────────────────────────────────────────────────

const menus = [
  { id: 'file', label: 'File', icon: 'folder' },
  { id: 'edit', label: 'Edit', icon: 'edit' },
  { id: 'image', label: 'Image', icon: 'image' },
  { id: 'layer', label: 'Layer', icon: 'layers' },
  { id: 'filter', label: 'Filter', icon: 'filter_vintage' },
  { id: 'view', label: 'View', icon: 'visibility' },
  { id: 'help', label: 'Help', icon: 'help' },
] as const

const panelTabs = [
  { value: 'adjust', label: 'Adjust', icon: 'tune' },
  { value: 'filters', label: 'Filters', icon: 'filter_vintage' },
  { value: 'layers', label: 'Layers', icon: 'layers' },
  { value: 'history', label: 'History', icon: 'history' },
]
const tab = computed({ get: () => panelTab.value, set: (v: string | number) => (panelTab.value = v as typeof panelTab.value) })
// "History…" opens the history tab on wide screens and a sheet on phones.
watch(() => dialogs.history, (open) => {
  if (open && wide.value) {
    panelTab.value = 'history'
    dialogs.history = false
  }
})
// Selecting a layer (by clicking text, adding one) shows the layers tab.
watch(() => doc.value.layers.length, (n, old) => { if (n > old && wide.value && panelTab.value !== 'layers') panelTab.value = 'layers' })

const exportItems = [
  { label: 'Quick export as PNG', icon: 'image', onClick: () => quickExport() },
  { label: 'Copy to clipboard', icon: 'content_copy', onClick: () => p.copyToClipboard() },
]
async function quickExport() {
  const blob = await p.exportBlob('image/png', 1, 1)
  if (!blob) return
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${doc.value.name}.png`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

// ─── Phone modes ────────────────────────────────────────────────────────────

type Mode = 'adjust' | 'filters' | 'crop' | 'draw' | 'text' | 'layers'
const modes: { id: Mode; label: string; icon: string }[] = [
  { id: 'adjust', label: 'Adjust', icon: 'tune' },
  { id: 'filters', label: 'Filters', icon: 'filter_vintage' },
  { id: 'crop', label: 'Crop', icon: 'crop_rotate' },
  { id: 'draw', label: 'Draw', icon: 'brush' },
  { id: 'text', label: 'Text', icon: 'title' },
  { id: 'layers', label: 'Layers', icon: 'layers' },
]
const mode = ref<Mode | null>('adjust')
const toolOf: Record<Mode, Tool> = { adjust: 'move', filters: 'move', layers: 'move', crop: 'crop', draw: 'brush', text: 'text' }
function setMode(m: Mode) {
  if (mode.value === m) {
    mode.value = null
    if (tool.value === 'crop') p.applyCrop()
    p.setTool('move')
    return
  }
  mode.value = m
  if (!(m === 'draw' && tool.value === 'eraser')) p.setTool(toolOf[m])
}
// Crop's Done/Cancel go back to the plain view.
watch(tool, (t, old) => { if (!wide.value && old === 'crop' && t === 'move' && mode.value === 'crop') mode.value = null })
const modeIsTool = computed(() => mode.value === 'crop' || mode.value === 'draw' || mode.value === 'text')

// ─── Shortcuts ──────────────────────────────────────────────────────────────

const anyDialog = computed(() => Object.values(dialogs).some(Boolean) || !!renameId.value)
const bindings = computed<HotkeyBinding[]>(() => {
  const off = anyDialog.value
  const cropping = tool.value === 'crop'
  return [
    { keys: 'mod+z', label: 'Undo', group: 'Edit', handler: p.undo, disabled: off },
    { keys: 'mod+shift+z', label: 'Redo', group: 'Edit', handler: p.redo, disabled: off },
    { keys: 'mod+y', label: 'Redo', group: 'Edit', handler: p.redo, disabled: off },
    { keys: 'delete', label: 'Delete layer', group: 'Edit', handler: () => selected.value && p.deleteLayer(selected.value.id), disabled: off || !selected.value },
    { keys: 'backspace', label: 'Delete layer', group: 'Edit', handler: () => selected.value && p.deleteLayer(selected.value.id), disabled: off || !selected.value },
    { keys: 'shift+?', label: 'Keyboard shortcuts', group: 'Edit', handler: () => (dialogs.shortcuts = true), disabled: off },
    { keys: 'mod+o', label: 'Open', group: 'File', handler: () => (dialogs.open = true), disabled: off },
    { keys: 'mod+e', label: 'Export', group: 'File', handler: () => (dialogs.export = true), disabled: off },
    { keys: 'mod+s', label: 'Export', group: 'File', handler: () => (dialogs.export = true), disabled: off },
    { keys: 'shift+c', label: 'Copy to clipboard', group: 'File', handler: p.copyToClipboard, disabled: off },
    { keys: 'shift+n', label: 'New paint layer', group: 'Layer', handler: () => p.addPaintLayer(), disabled: off },
    { keys: 'shift+a', label: 'Auto enhance', group: 'Image', handler: p.autoEnhance, disabled: off },
    { keys: 'mod+[', label: 'Rotate left', group: 'Image', handler: () => p.transformDoc('ccw'), disabled: off },
    { keys: 'mod+]', label: 'Rotate right', group: 'Image', handler: () => p.transformDoc('cw'), disabled: off },
    { keys: 'enter', label: 'Apply crop', group: 'Image', handler: p.applyCrop, disabled: off || !cropping },
    { keys: 'escape', label: 'Cancel crop', group: 'Image', handler: p.cancelCrop, disabled: off || !cropping },
    ...tools.map((t) => ({ keys: t.key.toLowerCase(), label: t.label, group: 'Tools', handler: () => p.setTool(t.id), disabled: off })),
    { keys: '[', label: 'Smaller brush', group: 'Tools', handler: () => (brush.size = Math.max(1, Math.round(brush.size / 1.25))), disabled: off },
    { keys: ']', label: 'Bigger brush', group: 'Tools', handler: () => (brush.size = Math.min(200, Math.round(brush.size * 1.25))), disabled: off },
    { keys: 'mod+=', label: 'Zoom in', group: 'View', handler: () => p.zoomAt(1.25), disabled: off },
    { keys: 'mod+-', label: 'Zoom out', group: 'View', handler: () => p.zoomAt(0.8), disabled: off },
    { keys: 'mod+0', label: 'Fit on screen', group: 'View', handler: p.fit, disabled: off },
    { keys: 'mod+1', label: 'Actual size', group: 'View', handler: () => p.zoomTo(1), disabled: off },
    { keys: '\\', label: 'Show original', group: 'View', handler: () => (showOriginal.value = !showOriginal.value), disabled: off },
  ]
})

// ─── Rename ─────────────────────────────────────────────────────────────────

const newName = ref('')
watch(renameId, (id) => { if (id) newName.value = p.layerById(id)?.name ?? '' })
function saveRename() {
  if (renameId.value) p.renameLayer(renameId.value, newName.value)
  renameId.value = null
}

const docInfo = computed(() => {
  const r = p.viewRect(false)
  return `${Math.round(r.w)} × ${Math.round(r.h)} px`
})
const toolHint = computed(() => tools.find((t) => t.id === tool.value)!.hint)
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-surface text-on-surface">
    <MHotkeys :bindings="bindings" />

    <!-- ─── Wide: menu bar ─── -->
    <header v-if="wide" class="flex h-14 shrink-0 items-center gap-1 border-b border-outline-variant px-2">
      <span class="mx-2 flex items-center gap-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-tertiary text-on-primary"><MIcon name="camera" :size="20" /></span>
        <span class="text-title-medium font-medium">Lightbench</span>
      </span>
      <nav class="flex items-center" aria-label="Menu bar">
        <MMenu v-for="m in menus" :key="m.id" align="left">
          <template #trigger>
            <MButton variant="text" size="xs" content-color="on-surface">{{ m.label }}</MButton>
          </template>
          <MenuSection :section="m.id" />
        </MMenu>
      </nav>
      <span class="mx-3 min-w-0 flex-1 truncate text-center text-body-medium text-on-surface-variant">
        {{ doc.name }}<span v-if="p.hasEdits.value" class="text-on-surface-variant/70"> — edited</span>
      </span>
      <MTooltip text="Undo (Ctrl+Z)" placement="bottom"><MIconButton icon="undo" label="Undo" :disabled="!p.canUndo.value" @click="p.undo" /></MTooltip>
      <MTooltip text="Redo (Ctrl+Shift+Z)" placement="bottom"><MIconButton icon="redo" label="Redo" :disabled="!p.canRedo.value" @click="p.redo" /></MTooltip>
      <MSplitButton label="Export" icon="download" size="xs" :items="exportItems" class="mx-1" @click="dialogs.export = true" />
      <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
      <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
      <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
    </header>

    <!-- ─── Phone: top bar ─── -->
    <header v-else class="flex h-14 shrink-0 items-center gap-0.5 px-1">
      <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
      <span class="min-w-0 flex-1 truncate px-1 text-title-medium">{{ doc.name }}</span>
      <MIconButton icon="undo" label="Undo" :disabled="!p.canUndo.value" @click="p.undo" />
      <MIconButton icon="redo" label="Redo" :disabled="!p.canRedo.value" @click="p.redo" />
      <MIconButton icon="code" label="View source on GitHub" @click="openSource" />
      <MMenu submenu-mode="push">
        <template #trigger><MIconButton icon="more_vert" label="Menu" /></template>
        <MMenuItem v-for="m in menus" :key="m.id" :icon="m.icon">
          {{ m.label }}
          <template #children><MenuSection :section="m.id" /></template>
        </MMenuItem>
      </MMenu>
      <MIconButton icon="download" label="Export" variant="filled" @click="dialogs.export = true" />
    </header>

    <div class="flex min-h-0 flex-1">
      <div class="relative flex min-h-0 min-w-0 flex-1">
        <Stage />
        <template v-if="wide">
          <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <ToolRail class="pointer-events-auto" />
          </div>
          <div class="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-20">
            <Transition name="lb-pop" mode="out-in">
              <ToolOptions :key="tool" layout="bar" class="pointer-events-auto max-w-full overflow-x-auto" />
            </Transition>
          </div>
        </template>
        <div v-else class="absolute top-2 right-2">
          <button
            type="button"
            class="flex h-10 items-center gap-1 rounded-full bg-inverse-surface/80 px-3 text-label-large text-inverse-on-surface backdrop-blur select-none"
            aria-label="Hold to compare with the original"
            @pointerdown="showOriginal = true"
            @pointerup="showOriginal = false"
            @pointerleave="showOriginal = false"
            @pointercancel="showOriginal = false"
            @contextmenu.prevent
          >
            <MIcon name="compare" :size="18" /> {{ showOriginal ? 'Original' : 'Hold' }}
          </button>
        </div>
      </div>

      <!-- ─── Wide: side panel ─── -->
      <aside v-if="wide" class="flex w-80 shrink-0 flex-col border-l border-outline-variant bg-surface-container-low">
        <div class="border-b-2 border-outline-variant/40">
          <MTabs v-model="tab" :tabs="panelTabs" class="-mb-px" />
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto">
          <AdjustPanel v-if="panelTab === 'adjust'" />
          <FiltersPanel v-else-if="panelTab === 'filters'" />
          <LayersPanel v-else-if="panelTab === 'layers'" />
          <HistoryPanel v-else />
        </div>
      </aside>
    </div>

    <!-- ─── Wide: status bar ─── -->
    <footer v-if="wide" class="flex h-8 shrink-0 items-center gap-4 border-t border-outline-variant px-4 text-label-medium text-on-surface-variant tabular-nums">
      <span class="flex items-center gap-1"><MIcon name="photo_size_select_large" :size="16" />{{ docInfo }}</span>
      <span class="flex items-center gap-1"><MIcon name="zoom_in" :size="16" />{{ p.zoomPct.value }}%</span>
      <span class="flex w-28 items-center gap-1"><MIcon name="my_location" :size="16" />{{ p.pointer.value ? `${p.pointer.value.x}, ${p.pointer.value.y}` : '–' }}</span>
      <span class="min-w-0 flex-1 truncate">{{ toolHint }}</span>
      <button type="button" class="flex items-center gap-1 rounded-full px-2 hover:bg-on-surface/8" @click="panelTab = 'history'">
        <MIcon name="history" :size="16" />{{ p.index.value }} {{ p.index.value === 1 ? 'step' : 'steps' }}
      </button>
    </footer>

    <!-- ─── Phone: mode panel and modes ─── -->
    <template v-else>
      <section v-if="mode" class="max-h-[42dvh] shrink-0 overflow-y-auto border-t border-outline-variant bg-surface-container-low">
        <ToolOptions v-if="modeIsTool" layout="panel" />
        <AdjustPanel v-else-if="mode === 'adjust'" compact />
        <FiltersPanel v-else-if="mode === 'filters'" compact />
        <LayersPanel v-else compact />
      </section>
      <nav class="flex h-20 shrink-0 items-stretch bg-surface-container px-1 pb-[env(safe-area-inset-bottom)]" aria-label="Editing modes">
        <button
          v-for="m in modes"
          :key="m.id"
          type="button"
          class="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 outline-none"
          :aria-pressed="mode === m.id"
          @click="setMode(m.id)"
        >
          <span
            class="flex h-8 w-14 items-center justify-center rounded-full transition-colors"
            :class="mode === m.id ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant'"
          ><MIcon :name="m.icon" :size="22" /></span>
          <span class="truncate text-label-medium" :class="mode === m.id ? 'text-on-surface' : 'text-on-surface-variant'">{{ m.label }}</span>
        </button>
      </nav>
    </template>

    <ExportDialog />
    <OpenDialog />
    <TextDialog />
    <StickerDialog />
    <ShortcutsDialog :bindings="bindings" />
    <MBottomSheet v-model="dialogs.history" title="History">
      <HistoryPanel compact />
    </MBottomSheet>
    <MConfirmDialog
      v-model="dialogs.revert"
      title="Revert to the original?"
      message="Adjustments, filters, crop and layers go away. You can still undo it."
      confirm-label="Revert"
      danger
      @confirm="p.revert(); dialogs.revert = false"
    />
    <MDialog :model-value="!!renameId" title="Rename layer" max-width="400px" @update:model-value="renameId = null">
      <MTextField v-model="newName" label="Name" @keydown.enter="saveRename" />
      <template #actions>
        <MButton variant="text" @click="renameId = null">Cancel</MButton>
        <MButton @click="saveRename">Rename</MButton>
      </template>
    </MDialog>
    <MDialog v-model="dialogs.about" max-width="420px">
      <div class="flex flex-col items-center gap-3 text-center">
        <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-tertiary text-on-primary"><MIcon name="camera" :size="36" /></span>
        <h2 class="text-headline-small">Lightbench</h2>
        <p class="text-body-medium text-on-surface-variant">
          A photo editor made only with m3ui-vue components and a canvas. Your photos never leave the browser.
          Every menu, toolbar and panel here is a library component; the pixels are plain JavaScript.
        </p>
      </div>
      <template #actions>
        <MButton variant="text" icon="code" @click="openSource">Source</MButton>
        <MButton @click="dialogs.about = false">Close</MButton>
      </template>
    </MDialog>
  </div>
</template>

<style scoped>
.lb-pop-enter-active,
.lb-pop-leave-active {
  transition: opacity 120ms ease, transform 160ms cubic-bezier(0.2, 0, 0, 1);
}
.lb-pop-enter-from,
.lb-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
