<script setup lang="ts">
import { ref } from 'vue'
import { MSlider } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const sliderVal = ref(40)
const sliderCentered = ref(0)
const sliderRange = ref<[number, number]>([20, 70])
const musicVolume = ref(65)
const musicBass = ref(10)
const musicTreble = ref(-5)
const eqLow = ref(50)
const eqMid = ref(70)
const eqHigh = ref(40)
const vertCentered = ref(0)
const vertRange = ref<[number, number]>([30, 75])

const sliderProps: PropDef[] = [
  { name: 'modelValue', type: 'number | [number, number]', description: 'Current value — a tuple when variant is range' },
  { name: 'min', type: 'number', default: '0', description: 'Minimum value' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
  { name: 'step', type: 'number', default: '1', description: 'Step increment' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the slider' },
  { name: 'label', type: 'string', description: 'Label text' },
  { name: 'showValue', type: 'boolean', default: 'false', description: 'Show current value beside label' },
  { name: 'showTooltip', type: 'boolean', default: 'false', description: 'Show value tooltip while dragging' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Slider orientation' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'xs'", description: 'Track and thumb size' },
  { name: 'variant', type: "'standard' | 'centered' | 'range'", default: "'standard'", description: 'Standard, centered (from middle), or range (two thumbs)' },
  { name: 'stops', type: 'boolean', default: 'false', description: 'Show stop dots at each step (max 30 visible)' },
  { name: 'icon', type: 'string', description: 'Material Symbol icon shown before the slider — hides once the fill reaches it' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error'", default: "'primary'", description: 'Base color — used for the fill and thumb unless overridden by fillColor/thumbColor' },
  { name: 'fillColor', type: 'string', description: 'Custom color (hex, rgb(), a CSS var…) for the filled/active track and corner dot — not limited to the 4 M3 roles. Defaults to color' },
  { name: 'thumbColor', type: 'string', description: 'Custom color (hex, rgb(), a CSS var…) for the thumb (bar or icon) — not limited to the 4 M3 roles. Defaults to color' },
  { name: 'thumbIcon', type: 'string', description: 'Replaces the draggable bar thumb with a Material Symbol icon' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSlider</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The M3 slider — vertical bar thumb, rounded track with gap, standard/centered/range variants, horizontal or
      vertical.
    </p>

    <ComponentDemo
      title="Standard Slider"
      description="M3 slider with vertical bar thumb, rounded track with gap, and optional tooltip."
      :code="`<MSlider v-model=&quot;val&quot; label=&quot;Volume&quot; :show-value=&quot;true&quot; :show-tooltip=&quot;true&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderVal" label="Volume" :show-value="true" :show-tooltip="true" />
        <MSlider v-model="sliderVal" label="Tertiary" :show-value="true" color="tertiary" />
        <MSlider :model-value="60" label="Disabled" :disabled="true" :show-value="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Five track sizes from XS (default) to XL."
      :code="`<MSlider v-model=&quot;val&quot; size=&quot;md&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderVal" label="XS" size="xs" :show-value="true" />
        <MSlider v-model="sliderVal" label="SM" size="sm" :show-value="true" />
        <MSlider v-model="sliderVal" label="MD" size="md" :show-value="true" :show-tooltip="true" />
        <MSlider v-model="sliderVal" label="LG" size="lg" :show-value="true" :show-tooltip="true" />
        <MSlider v-model="sliderVal" label="XL" size="xl" :show-value="true" :show-tooltip="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Stops"
      description="Discrete slider with visible stop dots at each step."
      :code="`<MSlider v-model=&quot;val&quot; :step=&quot;10&quot; :stops=&quot;true&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderVal" label="Step 10" :step="10" :stops="true" :show-value="true" size="sm" />
        <MSlider v-model="sliderVal" label="Step 20" :step="20" :stops="true" :show-value="true" size="md" color="secondary" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical"
      description="Vertical orientation. Same design rotated — the thumb becomes horizontal. Supports icons, stops, and tooltip."
      :code="`<MSlider v-model=&quot;val&quot; orientation=&quot;vertical&quot; :show-tooltip=&quot;true&quot; />`"
    >
      <div class="flex items-stretch gap-8" style="height: 360px">
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="sliderVal" orientation="vertical" :show-tooltip="true" size="xs" />
          <span class="text-label-small text-on-surface-variant">XS</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="sliderVal" orientation="vertical" :show-tooltip="true" size="sm" icon="volume_up" />
          <span class="text-label-small text-on-surface-variant">Volume</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="sliderVal" orientation="vertical" :show-tooltip="true" size="md" icon="brightness_6" color="tertiary" />
          <span class="text-label-small text-on-surface-variant">Brightness</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="sliderVal" orientation="vertical" :show-tooltip="true" size="lg" icon="thermostat" color="secondary" :step="10" :stops="true" />
          <span class="text-label-small text-on-surface-variant">Temperature</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="sliderVal" orientation="vertical" :show-tooltip="true" size="xl" icon="speed" color="error" />
          <span class="text-label-small text-on-surface-variant">Speed</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Centered"
      description="Starts from the middle — for values like -50 to 50. The active track extends from center toward the value."
      :code="`<MSlider v-model=&quot;val&quot; :min=&quot;-50&quot; :max=&quot;50&quot; variant=&quot;centered&quot; :show-tooltip=&quot;true&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderCentered" :min="-50" :max="50" variant="centered" :show-tooltip="true" :show-value="true" label="Balance" size="sm" />
        <MSlider v-model="sliderCentered" :min="-50" :max="50" variant="centered" :show-tooltip="true" :show-value="true" label="Pan" size="md" color="tertiary" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Range"
      description="Two thumbs to select a range. The active track spans between both values."
      :code="`<MSlider v-model=&quot;range&quot; variant=&quot;range&quot; :show-tooltip=&quot;true&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderRange" variant="range" :show-tooltip="true" :show-value="true" label="Price range" size="sm" />
        <MSlider v-model="sliderRange" variant="range" :show-tooltip="true" :show-value="true" label="Age range" size="md" color="secondary" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Icon"
      description="Optional inset icon displayed before the slider. It fades out once the fill reaches it, same as the corner dot."
      :code="`<MSlider v-model=&quot;val&quot; icon=&quot;volume_up&quot; :show-tooltip=&quot;true&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderVal" icon="volume_up" :show-tooltip="true" size="sm" />
        <MSlider v-model="sliderVal" icon="brightness_6" :show-tooltip="true" size="md" color="tertiary" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Independent Colors"
      description="color picks an M3 role and is the shared default for both the fill and the thumb. fillColor and thumbColor override each independently — unlike color, they accept any CSS color (hex, rgb(), a var…), not just the four M3 roles, so you can match an arbitrary brand color. The unfilled track shade is derived automatically from it via color-mix()."
      :code="`<MSlider v-model=&quot;val&quot; color=&quot;tertiary&quot; :show-value=&quot;true&quot; label=&quot;color (M3 role)&quot; />
<MSlider v-model=&quot;val&quot; fill-color=&quot;#e63946&quot; :show-value=&quot;true&quot; label=&quot;fillColor (hex)&quot; />
<MSlider v-model=&quot;val&quot; thumb-color=&quot;#4361ee&quot; :show-value=&quot;true&quot; label=&quot;thumbColor (hex)&quot; />
<MSlider v-model=&quot;val&quot; fill-color=&quot;#2a9d8f&quot; thumb-color=&quot;#f4a261&quot; :show-value=&quot;true&quot; label=&quot;both, independent hex&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderVal" color="tertiary" :show-value="true" label="color (M3 role)" />
        <MSlider v-model="sliderVal" fill-color="#e63946" :show-value="true" label="fillColor (hex)" />
        <MSlider v-model="sliderVal" thumb-color="#4361ee" :show-value="true" label="thumbColor (hex)" />
        <MSlider v-model="sliderVal" fill-color="#2a9d8f" thumb-color="#f4a261" :show-value="true" label="both, independent hex" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Thumb Icon"
      description="thumbIcon replaces the draggable bar with a Material Symbol icon, with its own thumbColor. It keeps the same edge margin as the bar thumb, and grows slightly on press instead of pinching thin."
      :code="`<MSlider v-model=&quot;val&quot; thumb-icon=&quot;drag_indicator&quot; :show-value=&quot;true&quot; />
<MSlider v-model=&quot;val&quot; thumb-icon=&quot;volume_up&quot; thumb-color=&quot;#e76f51&quot; :show-value=&quot;true&quot; />
<MSlider v-model=&quot;range&quot; variant=&quot;range&quot; thumb-icon=&quot;drag_indicator&quot; thumb-color=&quot;#264653&quot; :show-value=&quot;true&quot; />`"
    >
      <div class="w-full space-y-6">
        <MSlider v-model="sliderVal" thumb-icon="drag_indicator" :show-value="true" label="Default" />
        <MSlider v-model="sliderVal" thumb-icon="volume_up" thumb-color="#e76f51" :show-value="true" label="Custom color (hex)" />
        <MSlider v-model="sliderRange" variant="range" thumb-icon="drag_indicator" thumb-color="#264653" :show-value="true" label="Range" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical Centered & Range"
      description="Centered and range variants also work vertically."
      :code="`<MSlider v-model=&quot;val&quot; orientation=&quot;vertical&quot; variant=&quot;centered&quot; :min=&quot;-50&quot; :max=&quot;50&quot; />
<MSlider v-model=&quot;range&quot; orientation=&quot;vertical&quot; variant=&quot;range&quot; />`"
    >
      <div class="flex items-stretch gap-8" style="height: 300px">
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="vertCentered" orientation="vertical" variant="centered" :min="-50" :max="50" :show-tooltip="true" size="sm" />
          <span class="text-label-small text-on-surface-variant">Centered</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="vertCentered" orientation="vertical" variant="centered" :min="-50" :max="50" :show-tooltip="true" size="md" color="tertiary" icon="swap_vert" />
          <span class="text-label-small text-on-surface-variant">With icon</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="vertRange" orientation="vertical" variant="range" :show-tooltip="true" size="sm" color="secondary" />
          <span class="text-label-small text-on-surface-variant">Range</span>
        </div>
        <div class="flex flex-1 flex-col items-center gap-2">
          <MSlider v-model="vertRange" orientation="vertical" variant="range" :show-tooltip="true" size="lg" color="error" />
          <span class="text-label-small text-on-surface-variant">Range LG</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Audio Mixer"
      description="Practical example combining horizontal and vertical sliders with icons, centered variant, and different sizes."
      :code="`<!-- Horizontal controls -->
<MSlider v-model=&quot;volume&quot; icon=&quot;volume_up&quot; label=&quot;Volume&quot; size=&quot;md&quot; />
<MSlider v-model=&quot;bass&quot; :min=&quot;-20&quot; :max=&quot;20&quot; variant=&quot;centered&quot; label=&quot;Bass&quot; />

<!-- Vertical EQ -->
<MSlider v-model=&quot;low&quot; orientation=&quot;vertical&quot; icon=&quot;graphic_eq&quot; size=&quot;lg&quot; />`"
    >
      <div class="w-full rounded-xl bg-surface-container p-6">
        <p class="mb-4 text-title-medium font-medium text-on-surface">Audio Mixer</p>

        <div class="mb-6 space-y-4">
          <MSlider v-model="musicVolume" icon="volume_up" label="Master Volume" :show-value="true" :show-tooltip="true" size="md" />
          <MSlider v-model="musicBass" :min="-20" :max="20" variant="centered" label="Bass" :show-value="true" :show-tooltip="true" size="sm" color="secondary" />
          <MSlider v-model="musicTreble" :min="-20" :max="20" variant="centered" label="Treble" :show-value="true" :show-tooltip="true" size="sm" color="tertiary" />
        </div>

        <p class="mb-3 text-label-large text-on-surface-variant">Equalizer</p>
        <div class="flex items-stretch gap-6" style="height: 240px">
          <div class="flex flex-1 flex-col items-center gap-1">
            <MSlider v-model="eqLow" orientation="vertical" :show-tooltip="true" size="lg" icon="graphic_eq" color="secondary" />
            <span class="text-label-small text-on-surface-variant">Low</span>
          </div>
          <div class="flex flex-1 flex-col items-center gap-1">
            <MSlider v-model="eqMid" orientation="vertical" :show-tooltip="true" size="lg" icon="graphic_eq" />
            <span class="text-label-small text-on-surface-variant">Mid</span>
          </div>
          <div class="flex flex-1 flex-col items-center gap-1">
            <MSlider v-model="eqHigh" orientation="vertical" :show-tooltip="true" size="lg" icon="graphic_eq" color="tertiary" />
            <span class="text-label-small text-on-surface-variant">High</span>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="sliderProps" />

    <ComponentPager current="MSlider" />
  </div>
</template>
