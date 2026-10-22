<script setup lang="ts">
import { MCard, MIcon, vFocusRing } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const tiles = [
  { icon: 'photo_library', label: 'Photos' },
  { icon: 'music_note', label: 'Music' },
  { icon: 'movie', label: 'Videos' },
  { icon: 'description', label: 'Documents' },
]

const swatches = [
  { label: 'Secondary (default)', value: undefined },
  { label: 'Primary', value: 'var(--color-primary)' },
  { label: 'Tertiary', value: 'var(--color-tertiary)' },
  { label: 'Pink', value: '#e91e63' },
]

const types: TypeDef[] = [
  {
    name: 'FocusRingValue',
    description: 'What v-focus-ring accepts',
    fields: [
      { name: '(none) / true', type: 'undefined | true', description: 'Ring on, in secondary, 2px outside the element' },
      { name: 'false', type: 'false', description: 'No ring (same as { disabled: true })' },
      { name: "'#e91e63'", type: 'string', description: 'Ring on, in that CSS color (same as { color })' },
      { name: '{ … }', type: 'FocusRingOptions', description: 'Several settings at once' },
    ],
  },
  {
    name: 'FocusRingOptions',
    fields: [
      { name: 'disabled', type: 'boolean', description: 'No ring while true' },
      { name: 'color', type: 'string', description: 'Any CSS color or token; defaults to var(--color-secondary)' },
      { name: 'inset', type: 'boolean', description: "Draws the ring inside the element's edge instead of outside it, for elements a parent clips (rows in a rounded list with overflow-hidden)" },
      { name: 'within', type: 'boolean', description: 'Also shows while an element inside it has keyboard focus: a card around a link or a field' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">v-focus-ring</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The Material 3 focus indicator on any element of your own: a 3dp ring in the secondary color, 2dp outside
      the element and following its corners. It shows on keyboard focus only, never on a click or a tap, and wins
      over an <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">outline-none</code> class
      on the same element.
    </p>

    <ComponentDemo
      title="Basic"
      description="Press Tab to move through the tiles; clicking them shows no ring."
      :code="`<div
  v-for=&quot;tile in tiles&quot;
  :key=&quot;tile.label&quot;
  v-focus-ring
  v-state-layer
  tabindex=&quot;0&quot;
  class=&quot;rounded-2xl bg-surface-container p-4 outline-none&quot;
>
  <MIcon :name=&quot;tile.icon&quot; />
  {{ tile.label }}
</div>`"
      :script="`// With createM3UI() installed, v-focus-ring is already registered.
// Without the plugin, import it: a vFocusRing variable becomes v-focus-ring in the template.
import { vFocusRing } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          v-for="tile in tiles"
          :key="tile.label"
          v-focus-ring
          v-state-layer
          tabindex="0"
          class="flex cursor-pointer select-none flex-col items-center gap-2 rounded-2xl bg-surface-container p-4 text-label-large outline-none"
        >
          <MIcon :name="tile.icon" class="text-primary" />
          {{ tile.label }}
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Color"
      description="Pass a CSS color or a theme token."
      :code="`<button v-focus-ring=&quot;'var(--color-tertiary)'&quot;>Tertiary</button>
<button v-focus-ring=&quot;{ color: '#e91e63' }&quot;>Pink</button>`"
    >
      <div class="flex flex-wrap gap-3">
        <button
          v-for="s in swatches"
          :key="s.label"
          v-focus-ring="s.value"
          type="button"
          class="rounded-full border border-outline-variant px-4 py-2 text-label-large outline-none"
        >
          {{ s.label }}
        </button>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Inset and within"
      description="In a list that clips its rows (overflow-hidden), inset draws the ring inside each row so it isn't cut. With within, the card shows the ring while its link or field has keyboard focus."
      :code="`<ul class=&quot;overflow-hidden rounded-xl bg-surface-container&quot;>
  <li v-for=&quot;…&quot; v-focus-ring=&quot;{ inset: true }&quot; tabindex=&quot;0&quot;>…</li>
</ul>

<div v-focus-ring=&quot;{ within: true }&quot; class=&quot;rounded-xl&quot;>
  <a href=&quot;#&quot; class=&quot;outline-none&quot;>Read more</a>
</div>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <ul class="overflow-hidden rounded-xl bg-surface-container">
          <li
            v-for="tile in tiles.slice(0, 3)"
            :key="tile.label"
            v-focus-ring="{ inset: true }"
            v-state-layer
            tabindex="0"
            class="flex cursor-pointer select-none items-center gap-4 px-4 py-3 outline-none"
          >
            <MIcon :name="tile.icon" class="text-on-surface-variant" />
            <span class="text-body-large">{{ tile.label }}</span>
          </li>
        </ul>
        <div v-focus-ring="{ within: true }" class="flex flex-col gap-2 rounded-xl border border-outline-variant p-4">
          <p class="text-title-medium">Storage almost full</p>
          <p class="text-body-medium text-on-surface-variant">You've used 92% of your space.</p>
          <a href="#" class="self-start text-label-large text-primary outline-none" @click.prevent>Manage storage</a>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Value</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>It's an outline, so it follows the element's rounded corners and takes no space in the layout</li>
        <li>It shows on <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">:focus-visible</code> only: an element that can't take focus needs a <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">tabindex</code>. <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">within</code> uses <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">:has()</code></li>
        <li>The ring's rule is in the library's theme stylesheet (<code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">[data-m3-focus-ring]</code>); the directive sets <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">--m3-focus-ring-color</code> and <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">--m3-focus-ring-offset</code> on the element</li>
        <li>On a component it lands on the component's root element, and Vue ignores it on components with more than one root</li>
      </ul>
    </MCard>

    <ComponentPager current="v-focus-ring" />
  </div>
</template>
