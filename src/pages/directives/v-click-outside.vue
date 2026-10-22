<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MIcon, MTextField, vClickOutside } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const open = ref(false)
const toggle = ref<InstanceType<typeof MButton>>()

const editing = ref(false)
const title = ref('Quarterly report')

const types: TypeDef[] = [
  {
    name: 'ClickOutsideValue',
    description: 'What v-click-outside accepts',
    fields: [
      { name: 'close', type: '(event: PointerEvent | MouseEvent) => void', description: 'The handler, with the defaults' },
      { name: '{ … }', type: 'ClickOutsideOptions', description: 'The handler and its settings' },
    ],
  },
  {
    name: 'ClickOutsideOptions',
    fields: [
      { name: 'handler', type: '(event: PointerEvent | MouseEvent) => void', description: 'Called with the event that landed outside' },
      { name: 'exclude', type: '(HTMLElement | string)[]', description: 'Elements or CSS selectors that count as inside too: the button that toggles the panel, a popup the panel teleports to <body>' },
      { name: 'event', type: "'pointerdown' | 'click'", description: "'pointerdown' (default) reacts as the press starts, like menus; 'click' once it ends, so dragging out of a text selection doesn't count" },
      { name: 'disabled', type: 'boolean', description: 'Off while true' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">v-click-outside</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Run a function when a press lands outside an element: close your own panel, popover or inline editor. The
      library's menus, selects and dialogs already do this on their own.
    </p>

    <ComponentDemo
      title="Closing a panel"
      description="Open the panel and click anywhere else. The toggle button is excluded, so clicking it toggles instead of closing and reopening."
      :code="`<MButton ref=&quot;toggle&quot; @click=&quot;open = !open&quot;>Filters</MButton>

<div
  v-if=&quot;open&quot;
  v-click-outside=&quot;{ handler: () => (open = false), exclude: [toggle?.$el] }&quot;
  class=&quot;rounded-xl bg-surface-container-high p-4 shadow-elevation-2&quot;
>…</div>`"
      :script="`// With createM3UI() installed, v-click-outside is already registered.
// Without the plugin, import it: a vClickOutside variable becomes v-click-outside in the template.
import { ref } from 'vue'
import { vClickOutside } from '@m3ui-vue/m3ui-vue'

const open = ref(false)
const toggle = ref()`"
    >
      <div class="relative flex min-h-56 w-full flex-col items-start gap-3">
        <MButton ref="toggle" variant="tonal" icon="filter_list" @click="open = !open">Filters</MButton>
        <div
          v-if="open"
          v-click-outside="{ handler: () => (open = false), exclude: [toggle?.$el] }"
          class="flex w-72 flex-col gap-2 rounded-xl bg-surface-container-high p-4 shadow-elevation-2"
        >
          <p class="text-title-small">Show</p>
          <label v-for="f in ['Unread', 'Starred', 'With attachments']" :key="f" class="flex items-center gap-2 text-body-medium">
            <input type="checkbox" class="accent-primary" /> {{ f }}
          </label>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Inline editing"
      description="Click the title to edit it; clicking anywhere else ends the edit. With event: 'click', selecting text and releasing outside doesn't."
      :code="`<div v-if=&quot;editing&quot; v-click-outside=&quot;{ handler: () => (editing = false), event: 'click' }&quot;>
  <MTextField v-model=&quot;title&quot; label=&quot;Title&quot; />
</div>
<h2 v-else @click=&quot;editing = true&quot;>{{ title }}</h2>`"
    >
      <div class="flex min-h-20 w-full items-center">
        <div v-if="editing" v-click-outside="{ handler: () => (editing = false), event: 'click' }" class="w-full max-w-sm">
          <MTextField v-model="title" label="Title" />
        </div>
        <button
          v-else
          type="button"
          class="flex items-center gap-2 rounded-lg px-2 py-1 text-headline-small hover:bg-on-surface/8"
          @click="editing = true"
        >
          {{ title }}
          <MIcon name="edit" :size="20" class="text-on-surface-variant" />
        </button>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Value</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>It starts listening after the event that mounted the element, so the click that opened a panel doesn't close it right away</li>
        <li>Only the primary button counts (left click, touch, pen): a right click outside doesn't close anything</li>
        <li>Content the element teleports elsewhere (a menu opened inside the panel) isn't inside it in the DOM: add its selector to <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">exclude</code></li>
        <li>On a component it lands on the component's root element, and Vue ignores it on components with more than one root</li>
      </ul>
    </MCard>

    <ComponentPager current="v-click-outside" />
  </div>
</template>
