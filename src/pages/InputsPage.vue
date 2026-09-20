<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MTextField', description: 'Single- or multi-line text input, filled or outlined.' },
  { name: 'MNumberField', description: 'Numeric input with +/- stepper buttons and min/max clamping.' },
  { name: 'MMaskField', description: 'Text input with formatting masks — card, phone, date, and more.' },
  { name: 'MPinInput', description: 'Boxed OTP/PIN code input with paste and auto-advance support.' },
  { name: 'MPasswordMeter', description: 'A password strength bar that scores length and variety.' },
  { name: 'MSignaturePad', description: 'A canvas that captures pointer strokes for signature capture.' },
  { name: 'MSelect', description: 'Single-value dropdown select, docked or as a modal.' },
  { name: 'MMultiSelect', description: 'Multi-value select with removable chips and search.' },
  { name: 'MAutocomplete', description: 'Searchable single-value select with keyboard navigation.' },
  { name: 'MMultiAutocomplete', description: 'Searchable multi-value select with inline chips.' },
  { name: 'MTagInput', description: 'Free-form tag entry — type and press Enter or comma.' },
  { name: 'MCheckbox', description: 'Checkbox with checked, indeterminate, and disabled states.' },
  { name: 'MSwitch', description: 'A toggle switch with both M3 icon variants.' },
  { name: 'MRadioGroup', description: 'A group of radio buttons sharing a single selection.' },
  { name: 'MSlider', description: 'Standard, centered, or range slider — horizontal or vertical.' },
  { name: 'MRating', description: 'Star rating input with half-increment support.' },
  { name: 'MDatePicker', description: 'Inline calendar date picker with locale support.' },
  { name: 'MDatePickerModal', description: 'Modal calendar date picker with calendar and keyboard modes.' },
  { name: 'MDateRangePicker', description: 'Inline calendar picker for selecting a start and end date.' },
  { name: 'MDateRangePickerModal', description: 'Modal date range picker with range highlighting.' },
  { name: 'MTimePicker', description: 'Inline hour/minute picker with 12h/24h format support.' },
  { name: 'MTimePickerModal', description: 'Modal clock-dial time picker with AM/PM toggle.' },
  { name: 'MColorPicker', description: 'Inline hue/saturation color picker with preset swatches.' },
  { name: 'MColorPickerModal', description: 'Modal color picker with hex input and preset swatches.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Inputs</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Form controls for capturing user input.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/inputs/${c.name.toLowerCase()}`"
        class="no-underline"
      >
        <MCard clickable class="flex h-full flex-col gap-2 p-4">
          <div class="flex items-center gap-2">
            <MIcon :name="iconMap[c.name] ?? 'code'" :size="22" class="text-primary" />
            <span class="text-title-medium font-medium">{{ c.name }}</span>
          </div>
          <p class="text-body-small text-on-surface-variant">{{ c.description }}</p>
        </MCard>
      </router-link>
    </div>
  </div>
</template>
