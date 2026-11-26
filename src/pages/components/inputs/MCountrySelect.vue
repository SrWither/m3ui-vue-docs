<script setup lang="ts">
import { ref } from 'vue'
import { MCountrySelect } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const country = ref<string | null>('AR')
const shipping = ref<string | null>(null)

const selectProps: PropDef[] = [
  { name: 'modelValue', type: 'string | null', default: 'null', description: 'The country\'s ISO 3166-1 alpha-2 code (v-model): \'AR\', \'DE\'…' },
  { name: 'preferred', type: 'string[]', description: 'These codes first, above the rest (the countries your users pick most).' },
  { name: 'only', type: 'string[]', description: 'Only these countries, in this order.' },
  { name: 'flags', type: 'boolean', default: 'true', description: 'The flag emoji before each name (Windows has none: it shows the two letters).' },
  { name: 'label', type: 'string', description: 'The locale\'s "Country" by default.' },
  { name: 'mode', type: "'docked' | 'modal'", default: "'docked'", description: 'A dropdown, or a dialog with search (phones).' },
  { name: 'variant / clearable / hint / error / errorLabel / required / disabled', type: '…', description: 'As on MAutocomplete.' },
]
const selectEvents: EventDef[] = [{ name: 'update:modelValue', payload: 'string | null', description: 'A country was picked (its code), or cleared.' }]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MCountrySelect</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A country picker: every country, named in the app's language by the browser (Intl.DisplayNames), with its flag,
      searchable as you type. The v-model is the ISO code. Built on
      <RouterLink to="/components/inputs/mautocomplete" class="text-primary underline">MAutocomplete</RouterLink>, with the same
      country list as <RouterLink to="/components/inputs/mphoneinput" class="text-primary underline">MPhoneInput</RouterLink>.
      Switch the components' language in the top bar to see the names change.
    </p>

    <ComponentDemo
      title="Every country, a few first"
      description="Type to search; the ones in preferred come first. Below, an outlined one limited to the Southern Cone, without flags."
      :code="`<MCountrySelect v-model=&quot;country&quot; :preferred=&quot;['AR', 'UY', 'CL']&quot; clearable />
<MCountrySelect v-model=&quot;shipping&quot; :only=&quot;['AR', 'BR', 'CL', 'PY', 'UY']&quot; :flags=&quot;false&quot; label=&quot;Ships to&quot; variant=&quot;outlined&quot; />`"
      :script="`import { MCountrySelect } from '@m3ui-vue/m3ui-vue'

const country = ref('AR')`"
    >
      <div class="flex w-full max-w-sm flex-col gap-4">
        <MCountrySelect v-model="country" :preferred="['AR', 'UY', 'CL']" clearable />
        <MCountrySelect v-model="shipping" :only="['AR', 'BR', 'CL', 'PY', 'UY']" :flags="false" label="Ships to" variant="outlined" />
        <p class="text-body-small text-on-surface-variant">v-model: <code class="text-primary">{{ JSON.stringify(country) }}</code>, <code class="text-primary">{{ JSON.stringify(shipping) }}</code></p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="selectProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="selectEvents" />

    <ComponentPager current="MCountrySelect" />
  </div>
</template>
