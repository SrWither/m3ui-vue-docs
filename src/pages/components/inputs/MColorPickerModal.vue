<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MColorPickerModal } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const showColorPicker = ref(false)
const colorModalVal = ref('#6750a4')
const showAlpha = ref(false)
const alphaModalVal = ref('#00639b80')

const colorPickerModalProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Selected color in hex format (v-model): #rrggbb, or #rrggbbaa when alpha is on and the color isn\'t opaque' },
  { name: 'show', type: 'boolean', default: 'false', description: 'Controls dialog visibility (v-model:show)' },
  { name: 'presets', type: 'string[]', default: '21-color default set', description: 'Preset color swatches shown in the dialog' },
  { name: 'title', type: 'string', default: "locale's selectColor", description: 'Dialog title' },
  { name: 'alpha', type: 'boolean', default: 'false', description: 'Adds an opacity slider and an alpha channel to the value' },
  { name: 'recent', type: 'boolean', default: 'true', description: 'Remember confirmed colors and show them above the presets (localStorage, shared by every picker)' },
  { name: 'recentLimit', type: 'number', default: '7', description: 'How many recent colors to keep' },
  { name: 'eyedropper', type: 'boolean', default: 'true', description: 'Show a button to pick a color from the screen, where the browser supports it (Chrome, Edge)' },
]

const colorPickerModalEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string', description: 'Emitted when a color is confirmed — powers v-model. Only fires on confirm, not while dragging' },
  { name: 'update:show', payload: 'boolean', description: 'Emitted when the dialog opens or closes — powers v-model:show' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MColorPickerModal</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The same picker as MColorPicker in a dialog (built on MDialog): saturation/brightness area, hue slider,
      eyedropper, HEX/RGB/HSL fields, recent colors and preset swatches. The color only applies on confirm; the
      preview shows it next to the original (click the original to go back).
    </p>

    <ComponentDemo
      title="Color Picker Modal"
      description="Opens from any trigger; v-model only changes when the user confirms."
      :code="`<template>
  <MButton @click=&quot;show = true&quot;>Pick color</MButton>
  <MColorPickerModal v-model=&quot;color&quot; v-model:show=&quot;show&quot; />
</template>`"
    >
      <div class="flex items-center gap-4">
        <MButton @click="showColorPicker = true">Pick color</MButton>
        <span
          class="h-10 w-10 rounded-full border border-outline-variant"
          :style="{ backgroundColor: colorModalVal }"
        />
        <span class="text-body-medium text-on-surface-variant">{{ colorModalVal }}</span>
      </div>
      <MColorPickerModal v-model="colorModalVal" v-model:show="showColorPicker" />
    </ComponentDemo>

    <ComponentDemo
      title="Opacity"
      description="alpha adds an opacity slider; the confirmed value is #rrggbbaa when the color isn't fully opaque."
      :code="`<MColorPickerModal v-model=&quot;color&quot; v-model:show=&quot;show&quot; alpha />`"
    >
      <div class="flex items-center gap-4">
        <MButton variant="tonal" @click="showAlpha = true">Pick overlay</MButton>
        <span
          class="h-10 w-10 rounded-full border border-outline-variant"
          :style="{ background: `linear-gradient(${alphaModalVal}, ${alphaModalVal}), repeating-conic-gradient(#d4d4d4 0 25%, #fff 0 50%) 0 0 / 8px 8px` }"
        />
        <span class="text-body-medium text-on-surface-variant">{{ alphaModalVal }}</span>
      </div>
      <MColorPickerModal v-model="alphaModalVal" v-model:show="showAlpha" alpha />
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="colorPickerModalProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="colorPickerModalEvents" />

    <ComponentPager current="MColorPickerModal" />
  </div>
</template>
