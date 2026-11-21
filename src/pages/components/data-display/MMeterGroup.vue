<script setup lang="ts">
import { ref } from 'vue'
import { MMeterGroup, MCard, MButton } from '@m3ui-vue/m3ui-vue'
import type { MeterItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const storage: MeterItem[] = [
  { label: 'Photos', value: 52.4, icon: 'photo_library' },
  { label: 'Apps', value: 28.1, icon: 'apps' },
  { label: 'System', value: 17.6, icon: 'settings' },
]

const budget = ref<MeterItem[]>([
  { label: 'Rent', value: 950 },
  { label: 'Food', value: 420 },
  { label: 'Transport', value: 160 },
  { label: 'Fun', value: 210 },
])
function shuffle() {
  budget.value = budget.value.map((b) => ({ ...b, value: Math.round(b.value * (0.6 + Math.random() * 0.8)) }))
}
const eur = { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 } as const

const votes: MeterItem[] = [
  { label: 'Yes', value: 412, color: 'success' },
  { label: 'No', value: 268, color: 'error' },
  { label: 'Abstain', value: 64, color: 'outline' },
]

const props: PropDef[] = [
  { name: 'items', type: 'MeterItem[]', description: '{ label, value, color?, icon? }: color is an M3 role or any CSS color (defaults cycle primary, tertiary, secondary, error, success); icon replaces the legend dot' },
  { name: 'max', type: 'number', description: 'The whole bar; defaults to the sum of the values (no remaining part). Values over max are scaled to fit' },
  { name: 'label', type: 'string', description: 'Title above the bar' },
  { name: 'unit', type: 'string', description: 'Unit appended to formatted values (GB)' },
  { name: 'numberFormat', type: 'Intl.NumberFormatOptions', description: 'Options for formatting values (currency, decimals…)' },
  { name: 'format', type: '(value: number) => string', description: 'Formats a value; overrides unit and numberFormat' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Bar thickness: 4, 12 or 20px' },
  { name: 'legend', type: 'boolean', default: 'true', description: 'Legend below the bar' },
  { name: 'percent', type: 'boolean', default: 'false', description: "Each part's share in the legend" },
  { name: 'showRemaining', type: 'boolean', default: 'true', description: "With max, what's left as a last legend entry" },
  { name: 'remainingLabel', type: 'string', description: "The remaining entry's label; defaults to the locale's (Remaining)" },
  { name: 'summary', type: 'boolean', default: 'true', description: '“used of max” on the right of the header' },
  { name: 'animate', type: 'boolean', default: 'true', description: 'Grow the segments in on mount (off with reduced motion); changes always slide' },
  { name: 'locale', type: 'string', description: "BCP-47 language for numbers; defaults to the app's locale" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMeterGroup</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Several values sharing one bar, like a phone's storage screen. Each part is a segment with its own color,
      separated by the same gap as M3's linear progress indicator, growing in on mount and sliding when the values
      change. The legend lists each part with its value (and share); hovering a part highlights it in both places.
      Screen readers get every part in one label.
    </p>

    <ComponentDemo
      title="Storage"
      description="With max, the track shows what's left and the legend ends with it."
      :code="`<template>
  <MMeterGroup :items=&quot;storage&quot; :max=&quot;128&quot; unit=&quot;GB&quot; label=&quot;Storage&quot; />
</template>`"
    >
      <MCard variant="filled" class="w-full max-w-lg p-5">
        <MMeterGroup :items="storage" :max="128" unit="GB" :number-format="{ maximumFractionDigits: 1 }" label="Storage" />
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Budget"
      description="Currency through numberFormat, shares with percent, and the segments sliding to new values."
      :code="`<template>
  <MMeterGroup
    :items=&quot;budget&quot;
    :max=&quot;2000&quot;
    :number-format=&quot;{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }&quot;
    label=&quot;November&quot;
    percent
    size=&quot;lg&quot;
  />
</template>`"
    >
      <div class="flex w-full max-w-lg flex-col gap-4">
        <MMeterGroup :items="budget" :max="2000" :number-format="eur" label="November" percent size="lg" />
        <MButton variant="tonal" icon="shuffle" class="self-start" @click="shuffle">New month</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Results"
      description="Without max the parts fill the bar; colors by role, thin bar, no header."
      :code="`<template>
  <MMeterGroup :items=&quot;votes&quot; size=&quot;sm&quot; percent :summary=&quot;false&quot; />
</template>`"
    >
      <div class="w-full max-w-lg">
        <MMeterGroup :items="votes" size="sm" percent :summary="false" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events and Slots</h3>
    <ul class="mb-6 list-disc space-y-1 pl-6 text-body-medium text-on-surface-variant">
      <li><code>select</code>: a segment or legend entry clicked, with the item and its index</li>
      <li><code>#label</code> and <code>#summary</code>: the header's left and right text (<code>#summary</code> gets <code>{ used, max }</code>)</li>
      <li><code>#legend-item</code>: a legend entry; gets <code>{ item, percent, formatted, color }</code></li>
    </ul>

    <ComponentPager current="MMeterGroup" />
  </div>
</template>
