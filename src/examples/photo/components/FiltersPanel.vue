<script setup lang="ts">
/* Filter presets as live thumbnails of the photo, plus how strongly the chosen one applies. */
import { computed, shallowRef, watch } from 'vue'
import { MSlider } from '@m3ui-vue/m3ui-vue'
import { neutral, presets, renderPhoto } from '../imaging'
import { usePhoto } from '../usePhoto'

defineProps<{ compact?: boolean }>()
const p = usePhoto()
const { doc } = p

const thumbs = shallowRef<Record<string, string>>({})
// Thumbnails follow the photo and its straighten angle, not the sliders, so they show each filter on its own.
watch(
  () => [doc.value.source, doc.value.angle] as const,
  ([src, angle]) => {
    const scale = 160 / Math.max(src.width, src.height)
    const out: Record<string, string> = {}
    for (const pr of presets) {
      out[pr.id] = renderPhoto(src, angle, { adjust: neutral(), preset: pr.id, intensity: 100 }, scale).toDataURL('image/jpeg', 0.85)
    }
    thumbs.value = out
  },
  { immediate: true },
)

const intensity = computed({
  get: () => doc.value.look.intensity,
  set: (v: number) => { doc.value.look.intensity = v; p.commitSoon('Filter strength', 'filter_vintage') },
})
</script>

<template>
  <div :class="compact ? 'py-3' : 'p-4'">
    <div :class="compact ? 'flex gap-3 overflow-x-auto px-4 pb-1' : 'grid grid-cols-3 gap-3'">
      <button
        v-for="pr in presets"
        :key="pr.id"
        type="button"
        class="group flex shrink-0 flex-col items-center gap-1.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        :class="compact ? 'w-20' : ''"
        :aria-pressed="doc.look.preset === pr.id"
        @click="p.setPreset(pr.id)"
      >
        <span
          class="block aspect-square w-full overflow-hidden rounded-lg ring-offset-2 ring-offset-surface-container-low transition-shadow"
          :class="doc.look.preset === pr.id ? 'ring-3 ring-primary' : 'group-hover:ring-2 group-hover:ring-outline-variant'"
        >
          <img :src="thumbs[pr.id]" alt="" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </span>
        <span class="text-label-medium" :class="doc.look.preset === pr.id ? 'text-primary' : 'text-on-surface-variant'">{{ pr.name }}</span>
      </button>
    </div>
    <div v-if="doc.look.preset !== 'none'" class="mt-4 flex items-center gap-3" :class="compact ? 'px-4' : ''">
      <span class="text-body-medium text-on-surface">Strength</span>
      <MSlider v-model="intensity" :min="0" :max="100" show-tooltip class="flex-1" aria-label="Filter strength" />
      <span class="w-10 text-right text-label-medium tabular-nums text-on-surface-variant">{{ intensity }}</span>
    </div>
  </div>
</template>
