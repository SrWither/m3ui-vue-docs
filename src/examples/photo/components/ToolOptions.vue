<script setup lang="ts">
/*
 * The selected tool's options. On wide screens they sit in a floating toolbar over the canvas
 * (`layout="bar"`); on phones they fill the panel above the bottom toolbar (`layout="panel"`).
 */
import { computed } from 'vue'
import {
  MButton, MChip, MIconButton, MMenu, MMenuDivider, MMenuItem, MSegmentedButton, MSlider, MToggleButton, MTooltip,
} from '@m3ui-vue/m3ui-vue'
import { fonts, ratios, tools, usePhoto, type TextLayer } from '../usePhoto'
import ColorButton from './ColorButton.vue'

const props = defineProps<{ layout: 'bar' | 'panel' }>()
const p = usePhoto()
const { tool, brush, doc, selectedText, cropRatio, cropDraft, dialogs, view } = p
const bar = computed(() => props.layout === 'bar')
const hint = computed(() => tools.find((t) => t.id === tool.value)!.hint)

const angle = computed({
  get: () => doc.value.angle,
  set: (v: number) => { doc.value.angle = v; p.commitSoon('Straighten', 'straighten') },
})
function resetCrop() {
  doc.value.angle = 0
  cropRatio.value = 'free'
  cropDraft.value = { x: 0, y: 0, ...p.docSize.value }
  p.commit('Reset crop', 'restart_alt')
}

const drawTool = computed({
  get: () => tool.value,
  set: (v: string | number | (string | number)[]) => p.setTool(v as 'brush' | 'eraser'),
})

function textProp<K extends 'size' | 'color' | 'font' | 'bold' | 'shadow'>(key: K, label: string, icon: string) {
  return computed<TextLayer[K]>({
    get: () => selectedText.value?.[key] as TextLayer[K],
    set: (v) => {
      if (!selectedText.value || v === undefined) return
      selectedText.value[key] = v
      if (key === 'size') p.commitSoon(label, icon)
      else p.commit(label, icon)
    },
  })
}
const textSize = textProp('size', 'Text size', 'format_size')
const textColor = textProp('color', 'Text color', 'format_color_text')
const textBold = textProp('bold', 'Bold', 'format_bold')
const textShadow = textProp('shadow', 'Text shadow', 'shadow')
const textFont = textProp('font', 'Font', 'font_download')
const maxText = computed(() => Math.round(Math.max(p.docSize.value.w, p.docSize.value.h) / 3))

const zoomSteps = [0.25, 0.5, 1, 2, 4]
</script>

<template>
  <div
    :class="bar
      ? 'flex h-14 items-center gap-1 rounded-full bg-surface-container px-2 text-on-surface shadow-elevation-3'
      : 'flex flex-col gap-4 px-4 py-3'"
  >
    <!-- Move: zoom controls -->
    <template v-if="tool === 'move'">
      <MTooltip text="Zoom out"><MIconButton icon="zoom_out" label="Zoom out" @click="p.zoomAt(1 / 1.25)" /></MTooltip>
      <MMenu align="left">
        <template #trigger>
          <MButton variant="text" size="sm" class="w-20 tabular-nums">{{ p.zoomPct.value }}%</MButton>
        </template>
        <MMenuItem v-for="z in zoomSteps" :key="z" :icon="Math.abs(view.zoom - z) < 0.001 ? 'check' : 'zoom_in'" @click="p.zoomTo(z)">{{ z * 100 }}%</MMenuItem>
        <MMenuDivider />
        <MMenuItem icon="fit_screen" shortcut="Ctrl+0" @click="p.fit">Fit on screen</MMenuItem>
      </MMenu>
      <MTooltip text="Zoom in"><MIconButton icon="zoom_in" label="Zoom in" @click="p.zoomAt(1.25)" /></MTooltip>
      <MTooltip text="Fit on screen (Ctrl+0)"><MIconButton icon="fit_screen" label="Fit on screen" @click="p.fit" /></MTooltip>
    </template>

    <!-- Crop -->
    <template v-else-if="tool === 'crop'">
      <MMenu v-if="bar" align="left">
        <template #trigger>
          <MButton variant="text" size="sm" icon="aspect_ratio">{{ ratios.find((r) => r.value === cropRatio)!.label }}</MButton>
        </template>
        <MMenuItem v-for="r in ratios" :key="r.value" :icon="cropRatio === r.value ? 'check' : 'crop_free'" @click="p.setRatio(r.value)">{{ r.label }}</MMenuItem>
      </MMenu>
      <div v-else class="-mx-4 flex gap-2 overflow-x-auto px-4">
        <MChip v-for="r in ratios" :key="r.value" clickable :selected="cropRatio === r.value" class="shrink-0" @click="p.setRatio(r.value)">{{ r.label }}</MChip>
      </div>

      <div :class="bar ? 'contents' : 'flex items-center gap-1'">
        <MTooltip text="Rotate left"><MIconButton icon="rotate_left" label="Rotate left" @click="p.transformDoc('ccw')" /></MTooltip>
        <MTooltip text="Rotate right"><MIconButton icon="rotate_right" label="Rotate right" @click="p.transformDoc('cw')" /></MTooltip>
        <MTooltip text="Flip horizontal"><MIconButton icon="flip" label="Flip horizontal" @click="p.transformDoc('h')" /></MTooltip>
        <MTooltip text="Flip vertical"><MIconButton icon="flip" label="Flip vertical" class="rotate-90" @click="p.transformDoc('v')" /></MTooltip>
        <MTooltip text="Reset"><MIconButton icon="restart_alt" label="Reset crop and angle" @click="resetCrop" /></MTooltip>
      </div>

      <div class="flex items-center gap-2" :class="bar ? 'mx-2 w-48' : ''">
        <MSlider v-model="angle" variant="centered" :min="-45" :max="45" :step="0.5" show-tooltip class="flex-1" aria-label="Straighten" />
        <span class="w-12 text-right text-label-large tabular-nums text-on-surface-variant">{{ angle.toFixed(1) }}°</span>
      </div>

      <div class="flex items-center gap-2" :class="bar ? 'ml-1' : 'justify-end'">
        <MButton variant="text" size="sm" @click="p.cancelCrop">Cancel</MButton>
        <MButton size="sm" icon="check" @click="p.applyCrop">Done</MButton>
      </div>
    </template>

    <!-- Brush and eraser -->
    <template v-else-if="tool === 'brush' || tool === 'eraser'">
      <MSegmentedButton
        v-if="!bar"
        v-model="drawTool"
        density="compact"
        :options="[{ value: 'brush', label: 'Brush', icon: 'brush' }, { value: 'eraser', label: 'Eraser', icon: 'ink_eraser' }]"
      />
      <div class="flex items-center gap-3" :class="bar ? 'mx-2' : 'flex-wrap'">
        <div class="flex items-center gap-2" :class="bar ? 'w-36' : 'min-w-40 flex-1'">
          <span class="w-10 text-label-medium text-on-surface-variant">Size</span>
          <MSlider v-model="brush.size" :min="1" :max="200" show-tooltip class="flex-1" aria-label="Brush size" />
        </div>
        <div v-if="tool === 'brush'" class="flex items-center gap-2" :class="bar ? 'w-36' : 'min-w-40 flex-1'">
          <span class="w-14 text-label-medium text-on-surface-variant">Opacity</span>
          <MSlider v-model="brush.opacity" :min="5" :max="100" show-tooltip class="flex-1" aria-label="Brush opacity" />
        </div>
        <div class="flex items-center gap-2" :class="bar ? 'w-36' : 'min-w-40 flex-1'">
          <span class="w-16 text-label-medium text-on-surface-variant">Hardness</span>
          <MSlider v-model="brush.hardness" :min="0" :max="100" show-tooltip class="flex-1" aria-label="Brush hardness" />
        </div>
      </div>
      <ColorButton v-if="tool === 'brush'" v-model="brush.color" label="Brush color" />
    </template>

    <!-- Text -->
    <template v-else-if="tool === 'text' && selectedText">
      <div class="flex items-center gap-1" :class="bar ? '' : 'flex-wrap'">
        <MTooltip text="Edit text"><MIconButton icon="edit" label="Edit text" @click="dialogs.editText = true" /></MTooltip>
        <MMenu align="left">
          <template #trigger>
            <MButton variant="text" size="sm" icon="font_download">{{ fonts.find((f) => f.id === textFont)?.label }}</MButton>
          </template>
          <MMenuItem v-for="f in fonts" :key="f.id" :icon="textFont === f.id ? 'check' : 'text_fields'" @click="textFont = f.id">
            <span :style="{ fontFamily: f.css }">{{ f.label }}</span>
          </MMenuItem>
        </MMenu>
        <MToggleButton v-model:checked="textBold" icon="format_bold" variant="tonal" size="xs" aria-label="Bold" />
        <MToggleButton v-model:checked="textShadow" icon="shadow" variant="tonal" size="xs" aria-label="Shadow" />
        <ColorButton v-model="textColor" label="Text color" />
      </div>
      <div class="flex items-center gap-2" :class="bar ? 'mx-2 w-40' : ''">
        <span class="w-10 text-label-medium text-on-surface-variant">Size</span>
        <MSlider v-model="textSize" :min="8" :max="maxText" show-tooltip class="flex-1" aria-label="Text size" />
      </div>
      <MTooltip text="Delete (Del)"><MIconButton icon="delete" label="Delete text" @click="p.deleteLayer(selectedText.id)" /></MTooltip>
    </template>

    <!-- Hints: text with nothing selected, color picker -->
    <template v-else>
      <ColorButton v-if="tool === 'eyedropper'" v-model="brush.color" label="Picked color" />
      <span class="text-body-medium text-on-surface-variant" :class="bar ? 'px-3' : ''">{{ hint }}</span>
      <MButton v-if="tool === 'text'" size="sm" variant="tonal" icon="add" @click="p.addText(); dialogs.editText = true">Add text</MButton>
    </template>
  </div>
</template>
