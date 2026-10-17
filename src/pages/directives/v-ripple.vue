<script setup lang="ts">
import { ref } from 'vue'
import { MAvatar, MButton, MCard, MFab, MIcon, MIconButton, MSwitch, vRipple } from '@m3ui-vue/m3ui-vue'
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

const types: TypeDef[] = [
  {
    name: 'RippleValue',
    description: 'What v-ripple accepts',
    fields: [
      { name: '(none) / true', type: 'undefined | true', description: 'Ripple on, in the element\'s text color' },
      { name: 'false', type: 'false', description: 'No ripple (same as { disabled: true })' },
      { name: "'#e91e63'", type: 'string', description: 'Ripple on, in that CSS color (same as { color })' },
      { name: '{ … }', type: 'RippleOptions', description: 'Both settings at once' },
    ],
  },
  {
    name: 'RippleOptions',
    fields: [
      { name: 'disabled', type: 'boolean', description: 'No ripple while true; bind it to the element\'s disabled state' },
      { name: 'color', type: 'string', description: 'Any CSS color or token (var(--color-primary)); defaults to currentColor' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">v-ripple</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The Material 3 press ripple, the same one MButton, MIconButton, MFab and the other buttons use, on any
      element of your own: cards, list rows, tiles, custom buttons. It spreads from where the pointer pressed,
      in the element's text color unless you give it one.
    </p>

    <ComponentDemo
      title="Basic"
      description="Add v-ripple to any element. It is clipped to the element's rounded corners, with no overflow-hidden needed."
      :code="`<div v-ripple class=&quot;rounded-xl bg-surface-container p-6&quot;>
  Press me
</div>

<ul class=&quot;overflow-hidden rounded-xl bg-surface-container&quot;>
  <li v-for=&quot;row in rows&quot; :key=&quot;row.title&quot; v-ripple class=&quot;flex cursor-pointer items-center gap-4 px-4 py-3&quot;>
    <MIcon :name=&quot;row.icon&quot; />
    <div>
      <p class=&quot;text-body-large&quot;>{{ row.title }}</p>
      <p class=&quot;text-body-medium text-on-surface-variant&quot;>{{ row.subtitle }}</p>
    </div>
  </li>
</ul>`"
      :script="`// With createM3UI() installed, v-ripple is already registered.
// Without the plugin, import it: a vRipple variable becomes v-ripple in the template.
import { vRipple } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <div
          v-ripple
          class="flex cursor-pointer select-none items-center justify-center rounded-xl bg-surface-container p-6 text-title-medium"
        >
          Press me
        </div>
        <ul class="overflow-hidden rounded-xl bg-surface-container">
          <li
            v-for="row in rows"
            :key="row.title"
            v-ripple
            class="flex cursor-pointer select-none items-center gap-4 px-4 py-3"
          >
            <MIcon :name="row.icon" class="text-on-surface-variant" />
            <div>
              <p class="text-body-large">{{ row.title }}</p>
              <p class="text-body-medium text-on-surface-variant">{{ row.subtitle }}</p>
            </div>
          </li>
        </ul>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Color"
      description="Pass a CSS color, or a theme token so it follows the palette and dark mode."
      :code="`<div v-ripple=&quot;'var(--color-primary)'&quot;>Primary</div>
<div v-ripple=&quot;'#e91e63'&quot;>Pink</div>

<!-- same thing, as an option -->
<div v-ripple=&quot;{ color: 'var(--color-tertiary)' }&quot;>Tertiary</div>`"
    >
      <div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          v-for="s in swatches"
          :key="s.label"
          v-ripple="s.color"
          class="flex h-24 cursor-pointer select-none items-center justify-center rounded-2xl border border-outline-variant text-label-large"
        >
          {{ s.label }}
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Turning it off"
      description="Bind false, or { disabled }, to the element's own state."
      :code="`<MSwitch v-model=&quot;enabled&quot; />

<MCard v-ripple=&quot;{ disabled: !enabled }&quot; class=&quot;p-4&quot;>
  …
</MCard>`"
      :script="`import { ref } from 'vue'

const enabled = ref(true)`"
    >
      <div class="flex w-full flex-col items-start gap-4">
        <label class="flex items-center gap-3 text-body-large">
          <MSwitch v-model="enabled" />
          Ripple {{ enabled ? 'on' : 'off' }}
        </label>
        <MCard v-ripple="{ disabled: !enabled }" variant="outlined" class="flex w-full max-w-sm cursor-pointer select-none items-center gap-4 p-4">
          <MAvatar name="Ada Lovelace" />
          <div>
            <p class="text-title-medium">Ada Lovelace</p>
            <p class="text-body-medium text-on-surface-variant">Tap the card</p>
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Buttons: rippleColor"
      description="The library's buttons use the same ripple, and take its color through a rippleColor prop."
      :code="`<MButton ripple-color=&quot;#e91e63&quot;>Filled</MButton>
<MButton variant=&quot;outlined&quot; ripple-color=&quot;var(--color-tertiary)&quot;>Outlined</MButton>
<MIconButton icon=&quot;favorite&quot; ripple-color=&quot;#e91e63&quot; />
<MFab icon=&quot;edit&quot; ripple-color=&quot;var(--color-primary)&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MButton ripple-color="#e91e63">Filled</MButton>
        <MButton variant="outlined" ripple-color="var(--color-tertiary)">Outlined</MButton>
        <MIconButton icon="favorite" label="Like" ripple-color="#e91e63" />
        <MFab icon="edit" ripple-color="var(--color-primary)" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Value</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>Each ripple is drawn in its own layer inside the element, with <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">border-radius: inherit</code>, so it follows the element's corners, even while they animate</li>
        <li>An element with <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">position: static</code> is made <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">relative</code> on the first press; an absolute, fixed or sticky one keeps its position</li>
        <li>Only the primary button starts a ripple (left click, touch, pen); right clicks don't</li>
        <li>Use it on HTML elements. On a component it lands on the component's root element, and Vue ignores it on components with more than one root</li>
        <li>The ripple's look (450ms, 15% opacity) comes from the <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">.m3-ripple</code> class in the library's theme stylesheet</li>
      </ul>
    </MCard>

    <ComponentPager current="v-ripple" />
  </div>
</template>
