<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MIconButton, MSwitch, MTextField, vTooltip } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const placements = ['top', 'right', 'bottom', 'left'] as const
const enabled = ref(true)
const label = ref('Archive')

const types: TypeDef[] = [
  {
    name: 'TooltipValue',
    description: 'What v-tooltip accepts',
    fields: [
      { name: "'Save'", type: 'string', description: 'The text, with the defaults' },
      { name: '{ … }', type: 'TooltipOptions', description: 'The text and its settings' },
    ],
  },
  {
    name: 'TooltipOptions',
    fields: [
      { name: 'text', type: 'string', description: 'The tooltip\'s text; nothing shows while it\'s empty' },
      { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", description: "Side of the element it shows on (default 'top'); it stays inside the window" },
      { name: 'delay', type: 'number', description: 'Delay before it shows on hover or keyboard focus, in ms (default 600)' },
      { name: 'disabled', type: 'boolean', description: 'Never shows while true' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">v-tooltip</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      MTooltip's plain tooltip on any element, without wrapping it in a component: a short label for an icon
      button, a truncated name, a control that needs a hint. Same look and the same behavior as MTooltip.
    </p>

    <ComponentDemo
      title="Basic"
      description="Hover with the mouse, tab to them with the keyboard, or long-press them on a phone (the press doesn't click the button)."
      :code="`<MIconButton v-tooltip=&quot;'Archive'&quot; icon=&quot;archive&quot; label=&quot;Archive&quot; />
<MIconButton v-tooltip=&quot;'Mark as unread'&quot; icon=&quot;mark_email_unread&quot; label=&quot;Mark as unread&quot; />
<MIconButton v-tooltip=&quot;'Delete'&quot; icon=&quot;delete&quot; label=&quot;Delete&quot; />`"
      :script="`// With createM3UI() installed, v-tooltip is already registered.
// Without the plugin, import it: a vTooltip variable becomes v-tooltip in the template.
import { vTooltip } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex items-center gap-2">
        <MIconButton v-tooltip="'Archive'" icon="archive" label="Archive" />
        <MIconButton v-tooltip="'Mark as unread'" icon="mark_email_unread" label="Mark as unread" />
        <MIconButton v-tooltip="'Delete'" icon="delete" label="Delete" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Placement and delay"
      description="An options object sets the side and the hover delay."
      :code="`<MButton v-tooltip=&quot;{ text: 'On top', placement: 'top' }&quot; variant=&quot;tonal&quot;>top</MButton>
<MButton v-tooltip=&quot;{ text: 'On the right', placement: 'right', delay: 0 }&quot; variant=&quot;tonal&quot;>right</MButton>`"
    >
      <div class="flex flex-wrap items-center gap-3 py-8">
        <MButton
          v-for="p in placements"
          :key="p"
          v-tooltip="{ text: `Shown ${p === 'top' || p === 'bottom' ? 'on the' : 'to the'} ${p}`, placement: p, delay: 0 }"
          variant="tonal"
        >
          {{ p }}
        </MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Reactive text, and turning it off"
      description="The text follows its binding (even while it shows), and { disabled } turns it off."
      :code="`<MTextField v-model=&quot;label&quot; label=&quot;Tooltip text&quot; />
<MSwitch v-model=&quot;enabled&quot; />

<MIconButton v-tooltip=&quot;{ text: label, disabled: !enabled }&quot; icon=&quot;info&quot; label=&quot;Info&quot; />`"
      :script="`import { ref } from 'vue'

const label = ref('Archive')
const enabled = ref(true)`"
    >
      <div class="flex flex-wrap items-center gap-4">
        <MTextField v-model="label" label="Tooltip text" class="w-56" />
        <label class="flex items-center gap-3 text-body-large">
          <MSwitch v-model="enabled" />
          Enabled
        </label>
        <MIconButton v-tooltip="{ text: label, disabled: !enabled, delay: 200 }" icon="info" label="Info" variant="tonal" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Value</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>Input as Compose's tooltips: a mouse shows it on hover, the keyboard on focus (not a click's focus), touch and pen on a long press, which swallows the click it ends in; after a long press it hides 1.5s after the finger lifts</li>
        <li>Escape hides it without closing a dialog around it, and any scroll hides it</li>
        <li>While it shows, the element is described by it (<code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">aria-describedby</code>); it's added to the end of &lt;body&gt;, so no parent clips it</li>
        <li>For a rich tooltip (a title, content, actions), use <router-link to="/components/feedback/mtooltip" class="text-primary">MTooltip</router-link> with <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">rich</code></li>
        <li>On a component it lands on the component's root element, and Vue ignores it on components with more than one root</li>
      </ul>
    </MCard>

    <ComponentPager current="v-tooltip" />
  </div>
</template>
