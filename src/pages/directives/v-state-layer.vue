<script setup lang="ts">
import { ref } from 'vue'
import { MAvatar, MCard, MIcon, MSwitch, vStateLayer } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const rows = [
  { icon: 'person', title: 'Account', subtitle: 'Name, email, password' },
  { icon: 'notifications', title: 'Notifications', subtitle: 'Sounds, badges, quiet hours' },
  { icon: 'lock', title: 'Privacy', subtitle: 'Permissions, activity' },
]

const swatches = [
  { label: 'Primary', color: 'var(--color-primary)' },
  { label: 'Tertiary', color: 'var(--color-tertiary)' },
  { label: 'Error', color: 'var(--color-error)' },
  { label: 'Pink', color: '#e91e63' },
]

const enabled = ref(true)
const dragged = ref(false)

const types: TypeDef[] = [
  {
    name: 'StateLayerValue',
    description: 'What v-state-layer accepts',
    fields: [
      { name: '(none) / true', type: 'undefined | true', description: "State layer on, in the element's text color" },
      { name: 'false', type: 'false', description: 'No state layer (same as { disabled: true })' },
      { name: "'#e91e63'", type: 'string', description: 'State layer on, in that CSS color (same as { color })' },
      { name: '{ … }', type: 'StateLayerOptions', description: 'Several settings at once' },
    ],
  },
  {
    name: 'StateLayerOptions',
    fields: [
      { name: 'disabled', type: 'boolean', description: "No state layer while true; bind it to the element's disabled state. Elements with disabled or aria-disabled=\"true\" get none either way" },
      { name: 'color', type: 'string', description: 'Any CSS color or token (var(--color-primary)); defaults to currentColor' },
      { name: 'dragged', type: 'boolean', description: 'Holds the dragged state (16%) while true, e.g. while you drag the element' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">v-state-layer</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The Material 3 state layer on any element of your own: a tint in its text color that shows how you can
      interact with it, at 8% on hover, 10% on keyboard focus and while pressed, and 16% while dragged. The same
      feedback the library's buttons, chips and list items give. Pair it with v-ripple for the full M3 press.
    </p>

    <ComponentDemo
      title="Basic"
      description="Hover the rows, press them, or tab to them with the keyboard. Together with v-ripple it's the feedback of an M3 list item."
      :code="`<ul class=&quot;overflow-hidden rounded-xl bg-surface-container&quot;>
  <li
    v-for=&quot;row in rows&quot;
    :key=&quot;row.title&quot;
    v-state-layer
    v-ripple
    tabindex=&quot;0&quot;
    class=&quot;flex cursor-pointer items-center gap-4 px-4 py-3 outline-none&quot;
  >
    <MIcon :name=&quot;row.icon&quot; />
    <div>
      <p class=&quot;text-body-large&quot;>{{ row.title }}</p>
      <p class=&quot;text-body-medium text-on-surface-variant&quot;>{{ row.subtitle }}</p>
    </div>
  </li>
</ul>`"
      :script="`// With createM3UI() installed, v-state-layer is already registered.
// Without the plugin, import it: a vStateLayer variable becomes v-state-layer in the template.
import { vStateLayer } from '@m3ui-vue/m3ui-vue'`"
    >
      <ul class="w-full max-w-md overflow-hidden rounded-xl bg-surface-container">
        <li
          v-for="row in rows"
          :key="row.title"
          v-state-layer
          v-ripple
          tabindex="0"
          class="flex cursor-pointer select-none items-center gap-4 px-4 py-3 outline-none"
        >
          <MIcon :name="row.icon" class="text-on-surface-variant" />
          <div>
            <p class="text-body-large">{{ row.title }}</p>
            <p class="text-body-medium text-on-surface-variant">{{ row.subtitle }}</p>
          </div>
        </li>
      </ul>
    </ComponentDemo>

    <ComponentDemo
      title="Color"
      description="Pass a CSS color, or a theme token so it follows the palette and dark mode. It follows the element's corners."
      :code="`<div v-state-layer=&quot;'var(--color-primary)'&quot; class=&quot;rounded-2xl&quot;>Primary</div>
<div v-state-layer=&quot;'#e91e63'&quot; class=&quot;rounded-2xl&quot;>Pink</div>

<!-- same thing, as an option -->
<div v-state-layer=&quot;{ color: 'var(--color-tertiary)' }&quot;>Tertiary</div>`"
    >
      <div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          v-for="s in swatches"
          :key="s.label"
          v-state-layer="s.color"
          tabindex="0"
          class="flex h-24 cursor-pointer select-none items-center justify-center rounded-2xl border border-outline-variant text-label-large outline-none"
        >
          {{ s.label }}
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Disabled and dragged"
      description="Bind { disabled } to the element's own state (a disabled button gets none on its own), and { dragged } while you drag it."
      :code="`<MCard v-state-layer=&quot;{ disabled: !enabled, dragged }&quot; class=&quot;p-4&quot;>
  …
</MCard>`"
      :script="`import { ref } from 'vue'

const enabled = ref(true)
const dragged = ref(false)`"
    >
      <div class="flex w-full flex-col items-start gap-4">
        <div class="flex flex-wrap gap-6">
          <label class="flex items-center gap-3 text-body-large">
            <MSwitch v-model="enabled" />
            Enabled
          </label>
          <label class="flex items-center gap-3 text-body-large">
            <MSwitch v-model="dragged" />
            Dragged
          </label>
        </div>
        <MCard
          v-state-layer="{ disabled: !enabled, dragged }"
          variant="outlined"
          tabindex="0"
          class="flex w-full max-w-sm cursor-pointer select-none items-center gap-4 p-4 outline-none"
        >
          <MAvatar name="Ada Lovelace" />
          <div>
            <p class="text-title-medium">Ada Lovelace</p>
            <p class="text-body-medium text-on-surface-variant">Hover or press the card</p>
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Value</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>The layer is a span inside the element with <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">border-radius: inherit</code> and no pointer events; an element with <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">position: static</code> is made <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">relative</code></li>
        <li>Hover only shows on devices that really hover, so a tap on a phone doesn't leave the layer on; focus shows on keyboard focus only (<code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">:focus-visible</code>), so give non-interactive elements a <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">tabindex</code></li>
        <li>Use it on HTML elements. On a component it lands on the component's root element, and Vue ignores it on components with more than one root</li>
        <li>The opacities come from the <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">.m3-state-layer</code> rules in the library's theme stylesheet</li>
      </ul>
    </MCard>

    <ComponentPager current="v-state-layer" />
  </div>
</template>
