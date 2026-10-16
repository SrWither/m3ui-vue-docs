<script setup lang="ts">
/* Light, color and effect sliders, with the histogram, "Auto" and reset. Double-click a label to reset it. */
import { MButton, MIcon, MSlider } from '@m3ui-vue/m3ui-vue'
import { adjustDefs, type AdjustDef } from '../imaging'
import { usePhoto } from '../usePhoto'
import Histogram from './Histogram.vue'

defineProps<{ compact?: boolean }>()
const p = usePhoto()
const { doc } = p
const groups = ['Light', 'Color', 'Effects'] as const
const defsOf = (g: string) => adjustDefs.filter((d) => d.group === g)
const set = (d: AdjustDef, v: number | [number, number]) => p.setAdjust(d.key, v as number, d.label)
const fmt = (v: number) => (v > 0 ? `+${v}` : `${v}`)
</script>

<template>
  <div class="flex flex-col gap-4" :class="compact ? 'px-4 py-3' : 'p-4'">
    <Histogram v-if="!compact" />
    <div class="flex gap-2">
      <MButton variant="tonal" size="sm" icon="auto_fix_high" class="flex-1" @click="p.autoEnhance">Auto</MButton>
      <MButton variant="outlined" size="sm" icon="restart_alt" class="flex-1" @click="p.resetAdjustments">Reset all</MButton>
    </div>
    <section v-for="g in groups" :key="g">
      <h3 class="mb-1 text-label-large text-primary">{{ g }}</h3>
      <div v-for="d in defsOf(g)" :key="d.key" class="py-1">
        <div class="flex items-center gap-2 text-on-surface-variant">
          <MIcon :name="d.icon" :size="18" />
          <span
            class="flex-1 cursor-default text-body-medium text-on-surface select-none"
            title="Double-click to reset"
            @dblclick="set(d, 0)"
          >{{ d.label }}</span>
          <span class="w-10 text-right text-label-medium tabular-nums" :class="doc.look.adjust[d.key] ? 'text-primary' : ''">{{ fmt(doc.look.adjust[d.key]) }}</span>
        </div>
        <MSlider
          :model-value="doc.look.adjust[d.key]"
          :min="d.min"
          :max="100"
          :variant="d.min < 0 ? 'centered' : 'standard'"
          :aria-label="d.label"
          @update:model-value="set(d, $event)"
        />
      </div>
    </section>
  </div>
</template>
