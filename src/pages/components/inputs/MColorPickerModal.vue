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

const colorPickerModalProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Selected color in hex format (v-model)' },
  { name: 'show', type: 'boolean', default: 'false', description: 'Controls dialog visibility (v-model:show)' },
  { name: 'presets', type: 'string[]', default: '18-color default set', description: 'Preset color swatches shown in the dialog' },
  { name: 'title', type: 'string', default: "'Select color'", description: 'Dialog title' },
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
      A modal, centered color picker with saturation/brightness area, hue slider, hex input, and preset swatches —
      the sibling of MColorPicker, a fully separate component rather than a shared internal. Only emits on confirm.
    </p>

    <ComponentDemo
      title="Color Picker Modal"
      description="Modal color picker with saturation/brightness area, hue slider, hex input and preset swatches. Only emits on confirm."
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

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="colorPickerModalProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="colorPickerModalEvents" />

    <ComponentPager current="MColorPickerModal" />
  </div>
</template>
