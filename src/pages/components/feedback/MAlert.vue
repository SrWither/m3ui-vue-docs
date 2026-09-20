<script setup lang="ts">
import { ref } from 'vue'
import { MAlert, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const alertVisible = ref(true)

const alertProps: PropDef[] = [
  { name: 'type', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Alert variant and color' },
  { name: 'title', type: 'string', description: 'Bold title text' },
  { name: 'closeable', type: 'boolean', default: 'false', description: 'Show close button' },
  { name: 'closeAriaLabel', type: 'string', default: "'Close'", description: 'Aria label for the close button (falls back to the locale string)' },
]

const alertEvents: EventDef[] = [
  { name: 'close', description: 'Emitted when the close button is clicked. The parent owns visibility — pair with v-if/v-else to actually hide the alert.' },
]

const alertSlots: SlotDef[] = [
  { name: '#default', description: 'Alert body content' },
  { name: '#actions', description: 'Optional row of action buttons rendered below the body' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAlert</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An inline banner for contextual status messages — info, success, warning, or error.
    </p>

    <ComponentDemo
      title="Types"
      description="Four alert variants for different contexts."
      :code="`<template>
  <MAlert type=&quot;info&quot; title=&quot;Info&quot;>Informational message.</MAlert>
  <MAlert type=&quot;success&quot; title=&quot;Success&quot;>Operation completed.</MAlert>
  <MAlert type=&quot;warning&quot; title=&quot;Warning&quot;>Check your input.</MAlert>
  <MAlert type=&quot;error&quot; title=&quot;Error&quot;>Something went wrong.</MAlert>
</template>`"
    >
      <div class="w-full space-y-3">
        <MAlert type="info" title="Info">This is an informational message.</MAlert>
        <MAlert type="success" title="Success">Operation completed successfully.</MAlert>
        <MAlert type="warning" title="Warning">Please check your input.</MAlert>
        <MAlert type="error" title="Error">Something went wrong.</MAlert>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Closeable"
      description="Alerts with a dismiss button. Use v-if to toggle visibility and @close to handle dismissal."
      :code="`<MAlert
    v-if=&quot;visible&quot;
    type=&quot;info&quot;
    title=&quot;Heads up&quot;
    :closeable=&quot;true&quot;
    @close=&quot;visible = false&quot;
  >
    You can close this alert.
  </MAlert>
  <MButton v-else @click=&quot;visible = true&quot;>Show alert</MButton>`"
      :script="`const visible = ref(true)`"
    >
      <div class="w-full">
        <MAlert v-if="alertVisible" type="info" title="Heads up" :closeable="true" @close="alertVisible = false">
          Click the X to dismiss this alert, then use the button to bring it back.
        </MAlert>
        <MButton v-else variant="tonal" icon="visibility" @click="alertVisible = true">Show alert again</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Actions"
      description="Use the #actions slot to add buttons below the alert body."
      :code="`<MAlert type=&quot;warning&quot; title=&quot;Storage almost full&quot;>
  You're at 92% of your plan's storage.
  <template #actions>
    <MButton variant=&quot;text&quot;>Upgrade plan</MButton>
    <MButton variant=&quot;text&quot;>Dismiss</MButton>
  </template>
</MAlert>`"
    >
      <div class="w-full">
        <MAlert type="warning" title="Storage almost full">
          You're at 92% of your plan's storage.
          <template #actions>
            <MButton variant="text">Upgrade plan</MButton>
            <MButton variant="text">Dismiss</MButton>
          </template>
        </MAlert>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="alertProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="alertEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="alertSlots" />

    <ComponentPager current="MAlert" />
  </div>
</template>
