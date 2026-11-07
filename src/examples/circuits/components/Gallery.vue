<script setup lang="ts">
/*
 * The way in: the circuits to start from as cards with a drawing of each (schematic.ts, in the theme's colors), plus
 * picking up where you left off, a blank canvas and the tutorial. Shown on a first visit and from the bar's button.
 */
import { computed, onBeforeUnmount, watch } from 'vue'
import { MIcon, MIconButton } from '@m3ui-vue/m3ui-vue'
import { presets, type Preset } from '../presets'
import { cssColors, schematicSVG } from '../schematic'
/** Brighter than the canvas: a thumbnail is small */
const thumbColors = { ...cssColors, part: 'var(--color-surface-container-highest)', border: 'var(--color-outline)', dim: 'var(--color-on-surface-variant)', low: 'color-mix(in srgb, var(--color-primary) 65%, var(--color-outline))' }
import { withCircuits } from '../library'

const open = defineModel<boolean>({ required: true })
const props = defineProps<{ canContinue: boolean }>()
const emit = defineEmits<{ pick: [id: string]; tutorial: []; continue: [] }>()

/** The ones that show best what it can do, first and wider */
const FEATURED = ['squash', 'cpu', 'music']
const list = computed(() => {
  const shown = presets.filter((p) => p.id !== 'blank')
  return [...FEATURED.map((id) => shown.find((p) => p.id === id)!).filter(Boolean), ...shown.filter((p) => !FEATURED.includes(p.id))]
})
// Drawn once, the first time the gallery opens
const thumbs = new Map<string, string>()
function thumb(p: Preset) {
  let svg = thumbs.get(p.id)
  if (!svg) {
    const main = { nodes: p.nodes, edges: p.edges }
    svg = withCircuits(p.circuits ?? [], () => schematicSVG(main, { colors: thumbColors, detail: 'thumb', pad: 30 }).svg)
      // Fills its frame, centered
      .replace(/^<svg([^>]*?) width="\d+" height="\d+"/, '<svg$1 width="100%" height="100%" preserveAspectRatio="xMidYMid meet"')
    thumbs.set(p.id, svg)
  }
  return svg
}
const partsOf = (p: Preset) => p.nodes.filter((n) => n.data?.kind !== 'point' && n.data?.kind !== 'text').length + (p.circuits ?? []).reduce((s, c) => s + c.nodes.length, 0)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    e.stopPropagation()
    open.value = false
  }
}
watch(open, (o) => (o ? window.addEventListener('keydown', onKey, true) : window.removeEventListener('keydown', onKey, true)), { immediate: true })
onBeforeUnmount(() => window.removeEventListener('keydown', onKey, true))
function pick(id: string) {
  emit('pick', id)
  open.value = false
}
</script>

<template>
  <Transition name="gallery">
    <div v-if="open" class="fixed inset-0 z-40 overflow-y-auto bg-surface-container" role="dialog" aria-modal="true" aria-label="Circuits to start from">
      <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-6 pb-16 sm:px-8 sm:pt-10">
        <header class="flex items-start gap-4">
          <span class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary"><MIcon name="memory" :size="32" /></span>
          <div class="min-w-0 flex-1">
            <h1 class="text-headline-medium sm:text-display-small">Bitloom</h1>
            <p class="mt-1 max-w-2xl text-body-large text-on-surface-variant">
              Wire gates, memories and devices into anything up to a CPU, and watch every wire carry its value as the clock ticks.
            </p>
          </div>
          <MIconButton v-if="props.canContinue" icon="close" label="Close" @click="open = false" />
        </header>

        <div class="grid gap-3 sm:grid-cols-3">
          <button v-if="props.canContinue" type="button" class="gallery-action bg-primary-container text-on-primary-container" @click="emit('continue'); open = false">
            <MIcon name="history" :size="24" />
            <span><span class="block text-title-medium">Continue</span><span class="text-body-small opacity-80">Where you left off</span></span>
          </button>
          <button type="button" class="gallery-action bg-tertiary-container text-on-tertiary-container" @click="emit('tutorial'); open = false">
            <MIcon name="school" :size="24" />
            <span><span class="block text-title-medium">Tutorial</span><span class="text-body-small opacity-80">Your first gate, then a half adder</span></span>
          </button>
          <button type="button" class="gallery-action bg-secondary-container text-on-secondary-container" @click="pick('blank')">
            <MIcon name="note_add" :size="24" />
            <span><span class="block text-title-medium">Blank canvas</span><span class="text-body-small opacity-80">Start from nothing</span></span>
          </button>
        </div>

        <section>
          <h2 class="mb-3 text-title-large">Start from a circuit</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              v-for="(p, i) in list"
              :key="p.id"
              type="button"
              class="gallery-card group"
              :class="i === 0 && 'sm:col-span-2 lg:row-span-2'"
              :style="{ '--i': i }"
              @click="pick(p.id)"
            >
              <span class="block overflow-hidden rounded-xl bg-surface" :class="i === 0 ? 'aspect-[16/10] lg:aspect-auto lg:min-h-0 lg:flex-1' : 'aspect-[16/10]'">
                <!-- eslint-disable-next-line vue/no-v-html -- our own SVG, from the preset's parts -->
                <span class="block size-full p-2 transition-transform duration-300 group-hover:scale-[1.03]" v-html="thumb(p)" />
              </span>
              <span class="flex items-center gap-2 pt-3">
                <span class="min-w-0 flex-1 truncate text-left text-title-medium">{{ p.name }}</span>
                <span v-if="FEATURED.includes(p.id)" class="shrink-0 rounded-full bg-primary px-2 py-0.5 text-label-small text-on-primary">Featured</span>
              </span>
              <span class="line-clamp-3 pt-1 text-left text-body-small text-on-surface-variant">{{ p.description }}</span>
              <span class="flex gap-3 pt-2 text-label-medium text-on-surface-variant">
                <span class="flex items-center gap-1"><MIcon name="memory" :size="14" />{{ partsOf(p) }} parts</span>
                <span v-if="p.circuits?.length" class="flex items-center gap-1"><MIcon name="developer_board" :size="14" />{{ p.circuits.length }} subcircuit{{ p.circuits.length > 1 ? 's' : '' }}</span>
                <span v-if="p.hz" class="flex items-center gap-1"><MIcon name="speed" :size="14" />{{ p.hz >= 1000 ? `${p.hz / 1000} kHz` : `${p.hz} Hz` }}</span>
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.gallery-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 20px;
  text-align: left;
  transition: filter 150ms, transform 150ms;
}
.gallery-action:hover { filter: brightness(1.06); }
.gallery-action:active { transform: scale(0.98); }
.gallery-action:focus-visible, .gallery-card:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}
.gallery-card {
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 24px;
  background: var(--color-surface-container-low);
  transition: background-color 150ms, box-shadow 200ms;
  animation: gallery-card-in 420ms cubic-bezier(0.2, 0, 0, 1) both;
  animation-delay: calc(var(--i) * 35ms);
}
.gallery-card:hover {
  background: var(--color-surface-container-high);
  box-shadow: var(--shadow-elevation-1);
}
@keyframes gallery-card-in {
  from { opacity: 0; transform: translateY(12px); }
}
.gallery-enter-active, .gallery-leave-active { transition: opacity 220ms, transform 220ms cubic-bezier(0.2, 0, 0, 1); }
.gallery-enter-from, .gallery-leave-to { opacity: 0; transform: scale(0.985); }
@media (prefers-reduced-motion: reduce) {
  .gallery-card { animation: none; }
}
</style>
