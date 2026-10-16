<script setup lang="ts">
import { ref } from 'vue'
import { MColorPicker } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const colorVal = ref('#6750a4')
const colorCustomPresets = ref('#1976d2')
const colorAlpha = ref('#6750a4cc')

const colorPickerProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Selected color in hex format (v-model): #rrggbb, or #rrggbbaa when alpha is on and the color isn\'t opaque. Updates live while picking' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'presets', type: 'string[]', default: '21-color default set', description: 'Preset color swatches shown in the panel' },
  { name: 'alpha', type: 'boolean', default: 'false', description: 'Adds an opacity slider and an alpha channel to the value' },
  { name: 'recent', type: 'boolean', default: 'true', description: 'Remember picked colors and show them above the presets (localStorage, shared by every picker)' },
  { name: 'recentLimit', type: 'number', default: '7', description: 'How many recent colors to keep' },
  { name: 'eyedropper', type: 'boolean', default: 'true', description: 'Show a button to pick a color from the screen, where the browser supports it (Chrome, Edge)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
  { name: 'error', type: 'boolean', description: 'Error state' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'hint', type: 'string', description: 'Hint text below the field' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the border' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MColorPicker</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An outlined field that opens a color picker in a dropdown: saturation/brightness area, hue slider, eyedropper,
      HEX/RGB/HSL fields, recent colors and preset swatches. The value updates live while picking; the preview shows
      the color the panel opened with next to the new one (click it to go back). Arrow keys move the area and the
      sliders (Shift for steps of 10).
    </p>

    <ComponentDemo
      title="Color Picker"
      description="Drag the area or the hue slider, type a value in HEX, RGB or HSL, or pick a swatch. Colors you pick show up under Recent."
      :code="`<template>
  <MColorPicker v-model=&quot;color&quot; label=&quot;Brand color&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MColorPicker v-model="colorVal" label="Brand color" />
        <div class="flex items-center gap-3">
          <span
            class="h-10 w-10 rounded-full border border-outline-variant"
            :style="{ backgroundColor: colorVal }"
          />
          <span class="text-body-medium text-on-surface-variant">{{ colorVal }}</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom presets"
      description="Override the default 21 swatches with your own brand palette."
      :code="`<MColorPicker
  v-model=&quot;color&quot;
  label=&quot;Accent&quot;
  :presets=&quot;['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2']&quot;
/>`"
    >
      <MColorPicker v-model="colorCustomPresets" label="Accent" :presets="['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2']" />
    </ComponentDemo>

    <ComponentDemo
      title="Opacity"
      description="alpha adds an opacity slider and an A field; the value becomes #rrggbbaa when the color isn't fully opaque."
      :code="`<MColorPicker v-model=&quot;color&quot; label=&quot;Overlay&quot; alpha />`"
    >
      <MColorPicker v-model="colorAlpha" label="Overlay" alpha />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="colorPickerProps" />

    <ComponentPager current="MColorPicker" />
  </div>
</template>
