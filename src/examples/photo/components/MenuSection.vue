<script setup lang="ts">
/*
 * The contents of one menu of the menu bar. The same items fill the desktop menu bar (flyout
 * submenus) and the phone's ⋮ menu (push submenus), so both always match.
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MMenuDivider, MMenuItem, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { presets } from '../imaging'
import { samples } from '../samples'
import { tools, usePhoto } from '../usePhoto'
import LayerMenuItems from './LayerMenuItems.vue'

defineProps<{ section: 'file' | 'edit' | 'image' | 'layer' | 'filter' | 'view' | 'help' }>()

const p = usePhoto()
const { dialogs, doc, selected, tool } = p
const router = useRouter()
const { theme } = useTheme()
const themes = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
  { value: 'system', label: 'System', icon: 'brightness_auto' },
] as const
const openSource = () => window.open(exampleSource('photo'), '_blank', 'noopener')
const nextLabel = computed(() => p.history.value[p.index.value + 1]?.label)
const lastLabel = computed(() => p.history.value[p.index.value]?.label)
</script>

<template>
  <template v-if="section === 'file'">
    <MMenuItem icon="folder_open" shortcut="Ctrl+O" @click="dialogs.open = true">Open…</MMenuItem>
    <MMenuItem icon="photo_library">
      Open sample
      <template #children>
        <MMenuItem v-for="s in samples" :key="s.id" icon="image" @click="p.openSample(s.id)">{{ s.name }}</MMenuItem>
      </template>
    </MMenuItem>
    <MMenuDivider />
    <MMenuItem icon="download" shortcut="Ctrl+E" @click="dialogs.export = true">Export…</MMenuItem>
    <MMenuItem icon="content_copy" shortcut="Shift+C" @click="p.copyToClipboard">Copy to clipboard</MMenuItem>
    <MMenuDivider />
    <MMenuItem icon="history" :disabled="!p.hasEdits.value" danger @click="dialogs.revert = true">Revert to original…</MMenuItem>
    <MMenuItem icon="menu_book" @click="router.push('/examples')">Back to the docs</MMenuItem>
  </template>

  <template v-else-if="section === 'edit'">
    <MMenuItem icon="undo" shortcut="Ctrl+Z" :disabled="!p.canUndo.value" @click="p.undo">Undo {{ p.canUndo.value ? lastLabel?.toLowerCase() : '' }}</MMenuItem>
    <MMenuItem icon="redo" shortcut="Ctrl+Shift+Z" :disabled="!p.canRedo.value" @click="p.redo">Redo {{ nextLabel?.toLowerCase() ?? '' }}</MMenuItem>
    <MMenuItem icon="history" @click="dialogs.history = true">History…</MMenuItem>
    <MMenuDivider />
    <MMenuItem icon="handyman">
      Tool
      <template #children>
        <MMenuItem v-for="t in tools" :key="t.id" :icon="tool === t.id ? 'radio_button_checked' : 'radio_button_unchecked'" :shortcut="t.key" @click="p.setTool(t.id)">{{ t.label }}</MMenuItem>
      </template>
    </MMenuItem>
    <MMenuItem icon="keyboard" shortcut="?" @click="dialogs.shortcuts = true">Keyboard shortcuts</MMenuItem>
  </template>

  <template v-else-if="section === 'image'">
    <MMenuItem icon="auto_fix_high" shortcut="Shift+A" @click="p.autoEnhance">Auto enhance</MMenuItem>
    <MMenuItem icon="crop" shortcut="C" @click="p.setTool('crop')">Crop &amp; straighten…</MMenuItem>
    <MMenuItem icon="rotate_90_degrees_cw">
      Rotate
      <template #children>
        <MMenuItem icon="rotate_left" shortcut="Ctrl+[" @click="p.transformDoc('ccw')">90° left</MMenuItem>
        <MMenuItem icon="rotate_right" shortcut="Ctrl+]" @click="p.transformDoc('cw')">90° right</MMenuItem>
        <MMenuItem icon="sync" @click="p.transformDoc('cw'); p.transformDoc('cw')">180°</MMenuItem>
      </template>
    </MMenuItem>
    <MMenuItem icon="flip">
      Flip
      <template #children>
        <MMenuItem icon="swap_horiz" @click="p.transformDoc('h')">Horizontal</MMenuItem>
        <MMenuItem icon="swap_vert" @click="p.transformDoc('v')">Vertical</MMenuItem>
      </template>
    </MMenuItem>
    <MMenuDivider />
    <MMenuItem icon="restart_alt" @click="p.resetAdjustments">Reset adjustments</MMenuItem>
    <MMenuItem icon="crop_free" :disabled="!doc.crop" @click="doc.crop = null; p.commit('Remove crop', 'crop_free'); p.fitSoon()">Remove crop</MMenuItem>
  </template>

  <template v-else-if="section === 'layer'">
    <MMenuItem icon="brush" shortcut="Shift+N" @click="p.addPaintLayer()">New paint layer</MMenuItem>
    <MMenuItem icon="title" @click="p.addText(); dialogs.editText = true">New text</MMenuItem>
    <MMenuItem icon="add_reaction" @click="dialogs.sticker = true">Add sticker…</MMenuItem>
    <template v-if="selected">
      <MMenuDivider />
      <LayerMenuItems :id="selected.id" />
    </template>
  </template>

  <template v-else-if="section === 'filter'">
    <MMenuItem
      v-for="pr in presets"
      :key="pr.id"
      :icon="doc.look.preset === pr.id ? 'radio_button_checked' : 'radio_button_unchecked'"
      keep-open
      @click="p.setPreset(pr.id)"
    >{{ pr.name }}</MMenuItem>
  </template>

  <template v-else-if="section === 'view'">
    <MMenuItem icon="zoom_in" shortcut="Ctrl+=" @click="p.zoomAt(1.25)">Zoom in</MMenuItem>
    <MMenuItem icon="zoom_out" shortcut="Ctrl+-" @click="p.zoomAt(0.8)">Zoom out</MMenuItem>
    <MMenuItem icon="fit_screen" shortcut="Ctrl+0" @click="p.fit">Fit on screen</MMenuItem>
    <MMenuItem icon="1x_mobiledata" shortcut="Ctrl+1" @click="p.zoomTo(1)">Actual size</MMenuItem>
    <MMenuDivider />
    <MMenuItem :icon="p.showOriginal.value ? 'check_box' : 'check_box_outline_blank'" shortcut="\" keep-open @click="p.showOriginal.value = !p.showOriginal.value">Show original</MMenuItem>
    <MMenuItem icon="contrast">
      Theme
      <template #children>
        <MMenuItem v-for="t in themes" :key="t.value" :icon="theme === t.value ? 'radio_button_checked' : 'radio_button_unchecked'" @click="theme = t.value">{{ t.label }}</MMenuItem>
      </template>
    </MMenuItem>
  </template>

  <template v-else>
    <MMenuItem icon="keyboard" shortcut="?" @click="dialogs.shortcuts = true">Keyboard shortcuts</MMenuItem>
    <MMenuItem icon="code" @click="openSource">View source on GitHub</MMenuItem>
    <MMenuItem icon="menu_book" @click="router.push('/examples')">m3ui-vue docs</MMenuItem>
    <MMenuDivider />
    <MMenuItem icon="info" @click="dialogs.about = true">About Lightbench</MMenuItem>
  </template>
</template>
