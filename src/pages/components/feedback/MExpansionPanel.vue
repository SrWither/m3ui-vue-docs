<script setup lang="ts">
import { ref } from 'vue'
import { MExpansionPanel, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const panel1 = ref(true)
const panel2 = ref(false)
const panel3 = ref(false)

const uncontrolledDisabled = ref(true)

const panelProps: PropDef[] = [
  { name: 'title', type: 'string', description: 'Panel header text' },
  { name: 'subtitle', type: 'string', description: 'Secondary text in the header, below the title' },
  { name: 'icon', type: 'string', description: 'Leading Material Symbol icon in the header' },
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model). Omit it entirely to let the panel manage its own open state internally (uncontrolled).' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables toggling' },
  { name: 'variant', type: "'outlined' | 'filled' | 'elevated'", default: "'outlined'", description: 'Visual style of the panel container' },
]

const panelEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when the panel is toggled — only meaningful when modelValue is passed (controlled usage); powers v-model' },
]

const panelSlots: SlotDef[] = [
  { name: '#default', description: 'Panel body content, revealed with a height animation when open' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MExpansionPanel</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A collapsible section with a smooth height animation. Works controlled via v-model, or uncontrolled by
      simply omitting modelValue.
    </p>

    <ComponentDemo
      title="Expansion Panel"
      description="Collapsible sections with smooth animation."
      :code="`<MExpansionPanel v-model=&quot;open&quot; title=&quot;Section Title&quot; icon=&quot;settings&quot;>
  Content goes here.
</MExpansionPanel>`"
      :script="`const open = ref(true)`"
    >
      <div class="w-full space-y-2">
        <MExpansionPanel v-model="panel1" title="General Settings" icon="settings" subtitle="App preferences">
          Configure your application preferences and default behavior here.
        </MExpansionPanel>
        <MExpansionPanel v-model="panel2" title="Notifications" icon="notifications">
          Manage which notifications you receive and how they are delivered.
        </MExpansionPanel>
        <MExpansionPanel v-model="panel3" title="Privacy" icon="lock">
          Control your privacy settings and data sharing preferences.
        </MExpansionPanel>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Variants"
      description="Outlined, filled, and elevated styles."
      :code="`<template>
  <MExpansionPanel title=&quot;Outlined&quot; variant=&quot;outlined&quot; />
  <MExpansionPanel title=&quot;Filled&quot; variant=&quot;filled&quot; />
  <MExpansionPanel title=&quot;Elevated&quot; variant=&quot;elevated&quot; />
</template>`"
    >
      <div class="w-full space-y-2">
        <MExpansionPanel title="Outlined" variant="outlined">Outlined content.</MExpansionPanel>
        <MExpansionPanel title="Filled" variant="filled">Filled content.</MExpansionPanel>
        <MExpansionPanel title="Elevated" variant="elevated">Elevated content.</MExpansionPanel>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Uncontrolled & disabled"
      description="Omit modelValue entirely and the panel manages its own open state internally — no v-model needed for simple cases. disabled prevents toggling altogether (e.g. while a related action is unavailable)."
      :code="`<!-- No v-model — opens/closes on its own -->
<MExpansionPanel title=&quot;FAQ: What is M3UI?&quot;>
  A Material Design 3 component library for Vue 3 + Tailwind.
</MExpansionPanel>

<MExpansionPanel title=&quot;Locked section&quot; :disabled=&quot;true&quot;>
  Unavailable until you upgrade your plan.
</MExpansionPanel>`"
    >
      <div class="w-full space-y-2">
        <MExpansionPanel title="FAQ: What is M3UI?" icon="help">
          A Material Design 3 component library for Vue 3 + Tailwind CSS v4.
        </MExpansionPanel>
        <MExpansionPanel title="Locked section" icon="lock" :disabled="uncontrolledDisabled">
          Unavailable until you upgrade your plan.
        </MExpansionPanel>
      </div>
      <MButton variant="text" class="mt-3" @click="uncontrolledDisabled = !uncontrolledDisabled">
        {{ uncontrolledDisabled ? 'Unlock section' : 'Lock section' }}
      </MButton>
    </ComponentDemo>

    <ComponentDemo
      title="Rich Content"
      description="Expansion panels can hold any complex content — forms, lists, cards, nested panels."
      :code="`<MExpansionPanel title=&quot;Account Details&quot; icon=&quot;person&quot;>
  <!-- any content here -->
</MExpansionPanel>`"
    >
      <div class="w-full space-y-2">
        <MExpansionPanel title="Account Details" icon="person" subtitle="Personal information and preferences" variant="outlined">
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-label-small text-on-surface-variant">Name</p>
                <p class="text-body-large text-on-surface">Fadel Chafworking</p>
              </div>
              <div>
                <p class="text-label-small text-on-surface-variant">Email</p>
                <p class="text-body-large text-on-surface">fadel@example.com</p>
              </div>
              <div>
                <p class="text-label-small text-on-surface-variant">Role</p>
                <p class="text-body-large text-on-surface">Administrator</p>
              </div>
              <div>
                <p class="text-label-small text-on-surface-variant">Joined</p>
                <p class="text-body-large text-on-surface">June 2024</p>
              </div>
            </div>
            <div class="flex gap-2">
              <MButton variant="tonal" icon="edit">Edit profile</MButton>
              <MButton variant="text" icon="logout" color="error">Sign out</MButton>
            </div>
          </div>
        </MExpansionPanel>

        <MExpansionPanel title="Billing History" icon="receipt_long" subtitle="Recent transactions" variant="filled">
          <div class="flex flex-col divide-y divide-outline-variant">
            <div v-for="(item, i) in [
              { date: 'Jun 15, 2026', desc: 'Pro Plan — Monthly', amount: '$12.00' },
              { date: 'May 15, 2026', desc: 'Pro Plan — Monthly', amount: '$12.00' },
              { date: 'Apr 15, 2026', desc: 'Pro Plan — Monthly', amount: '$12.00' },
              { date: 'Mar 10, 2026', desc: 'Storage Add-on', amount: '$4.00' },
            ]" :key="i" class="flex items-center justify-between py-3">
              <div>
                <p class="text-body-medium text-on-surface">{{ item.desc }}</p>
                <p class="text-body-small text-on-surface-variant">{{ item.date }}</p>
              </div>
              <p class="text-body-medium font-medium text-on-surface">{{ item.amount }}</p>
            </div>
          </div>
        </MExpansionPanel>

        <MExpansionPanel title="Danger Zone" icon="warning" subtitle="Irreversible actions" variant="elevated">
          <div class="flex flex-col gap-3">
            <p class="text-body-medium text-on-surface-variant">
              These actions are permanent and cannot be undone. Please proceed with caution.
            </p>
            <div class="flex gap-2">
              <MButton variant="tonal" color="error" icon="delete">Delete account</MButton>
              <MButton variant="text" color="error" icon="download">Export data</MButton>
            </div>
          </div>
        </MExpansionPanel>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="panelProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="panelEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="panelSlots" />

    <ComponentPager current="MExpansionPanel" />
  </div>
</template>
