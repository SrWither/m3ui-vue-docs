<script setup lang="ts">
import { ref } from 'vue'
import { MChip, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const chipProps: PropDef[] = [
  { name: 'tone', type: "'neutral' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | CSS color", default: "'neutral'", description: 'Color tone or any CSS color string' },
  { name: 'selected', type: 'boolean', default: 'false', description: "Selected/active state — the chip's shape morphs from a rounded rect to a full pill when selected" },
  { name: 'removable', type: 'boolean', default: 'false', description: 'Show a remove (X) button' },
  { name: 'clickable', type: 'boolean', default: 'false', description: 'Makes the chip an interactive <button> with hover/press/focus feedback (otherwise renders as a plain <span>)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'icon', type: 'string', description: 'Leading Material Symbol icon' },
]

const chipEvents: EventDef[] = [
  { name: 'click', description: 'Emitted when a clickable, non-disabled chip is clicked' },
  { name: 'remove', description: 'Emitted when the remove (X) button is clicked (removable only)' },
]

const chipSelected = ref(true)
const removableChips = ref(['Vue', 'React', 'Svelte'])

function removeChip(label: string) {
  removableChips.value = removableChips.value.filter((c) => c !== label)
}
function resetChips() {
  removableChips.value = ['Vue', 'React', 'Svelte']
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MChip</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Compact elements for filters, input, or actions — named semantic tones or any CSS color, with
      optional icon, click, selection, and removal support.
    </p>

    <ComponentDemo
      title="Tones"
      description="Named semantic tones and custom CSS colors."
      :code="`<template>
  <MChip>Neutral</MChip>
  <MChip tone=&quot;primary&quot;>Primary</MChip>
  <MChip tone=&quot;secondary&quot;>Secondary</MChip>
  <MChip tone=&quot;tertiary&quot;>Tertiary</MChip>
  <MChip tone=&quot;success&quot;>Success</MChip>
  <MChip tone=&quot;error&quot;>Error</MChip>
  <MChip tone=&quot;#e91e63&quot;>Custom</MChip>
</template>`"
    >
      <MChip>Neutral</MChip>
      <MChip tone="primary">Primary</MChip>
      <MChip tone="secondary">Secondary</MChip>
      <MChip tone="tertiary">Tertiary</MChip>
      <MChip tone="success">Success</MChip>
      <MChip tone="error">Error</MChip>
      <MChip tone="#e91e63">Custom</MChip>
    </ComponentDemo>

    <ComponentDemo
      title="With Icons & Interaction"
      description="Clickable, selectable, and disabled chips. A selected chip's shape morphs into a full pill."
      :code="`<template>
  <MChip icon=&quot;code&quot;>With icon</MChip>
  <MChip :clickable=&quot;true&quot; tone=&quot;primary&quot; @click=&quot;handleClick&quot;>Clickable</MChip>
  <MChip :selected=&quot;selected&quot; :clickable=&quot;true&quot; tone=&quot;primary&quot; @click=&quot;selected = !selected&quot;>
    Selectable
  </MChip>
  <MChip :disabled=&quot;true&quot;>Disabled</MChip>
</template>`"
      :script="`const selected = ref(true)`"
    >
      <MChip icon="code">With icon</MChip>
      <MChip :clickable="true" tone="primary">Clickable</MChip>
      <MChip :selected="chipSelected" :clickable="true" tone="primary" @click="chipSelected = !chipSelected">
        {{ chipSelected ? 'Selected' : 'Unselected' }}
      </MChip>
      <MChip :disabled="true">Disabled</MChip>
    </ComponentDemo>

    <ComponentDemo
      title="Removable Chips"
      description="Chips that can be dismissed via the remove event."
      :code="`<template>
  <MChip
    v-for=&quot;chip in chips&quot;
    :key=&quot;chip&quot;
    :removable=&quot;true&quot;
    tone=&quot;primary&quot;
    @remove=&quot;remove(chip)&quot;
  >
    {{ chip }}
  </MChip>
</template>`"
      :script="`const chips = ref(['Vue', 'React', 'Svelte'])

function remove(label) {
  chips.value = chips.value.filter(c => c !== label)
}`"
    >
      <MChip
        v-for="chip in removableChips"
        :key="chip"
        :removable="true"
        tone="primary"
        @remove="removeChip(chip)"
      >
        {{ chip }}
      </MChip>
      <MButton v-if="removableChips.length === 0" variant="text" icon="refresh" @click="resetChips">Reset</MButton>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="chipProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="chipEvents" />

    <ComponentPager current="MChip" />
  </div>
</template>
