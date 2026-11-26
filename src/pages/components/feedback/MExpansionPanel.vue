<script setup lang="ts">
import { ref } from 'vue'
import { MExpansionPanel, MButton, MIcon, MListItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import ExpansionPanelWorkOrders from '@/components/demos/ExpansionPanelWorkOrders.vue'
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
  { name: 'title', type: 'string', description: 'Panel header text (or the #title slot)' },
  { name: 'subtitle', type: 'string', description: 'Secondary text in the header, below the title' },
  { name: 'icon', type: 'string', description: 'Leading Material Symbol icon in the header' },
  { name: 'modelValue', type: 'boolean', description: 'Open/closed state (v-model). Omit it entirely to let the panel manage its own open state internally (uncontrolled).' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables toggling (dimmed)' },
  { name: 'expandable', type: 'boolean', default: 'true', description: 'false: a plain header row with nothing to open (no chevron, not a button), not dimmed like disabled' },
  { name: 'flush', type: 'boolean', default: 'false', description: 'The body with no padding, for edge-to-edge content such as a list' },
  { name: 'unmountOnClose', type: 'boolean', default: 'false', description: 'Unmount the body while closed (MCollapse\'s)' },
  { name: 'variant', type: "'outlined' | 'filled' | 'elevated'", default: "'outlined'", description: 'Visual style of the panel container' },
]

const panelEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'boolean', description: 'Emitted when the panel is toggled — only meaningful when modelValue is passed (controlled usage); powers v-model' },
  { name: 'after-open / after-close', payload: '—', description: 'The open or close animation finished' },
]

const panelSlots: SlotDef[] = [
  { name: '#default', description: 'Panel body content, revealed with a height animation when open' },
  { name: '#leading', description: 'The header\'s start, instead of icon (a colored icon, an avatar)' },
  { name: '#title', description: 'The title, instead of the title text (highlighted parts, a chip)' },
  { name: '#subtitle', description: 'The line below the title, instead of the subtitle text' },
  { name: '#trailing', description: 'Content before the chevron (a count, a status)' },
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

    <ComponentDemo
      title="Custom headers, rows with nothing inside, and lists"
      description="Header slots: a colored icon, a title with a highlighted part, a count before the chevron. The second row has nothing to open (expandable false): a plain row, not dimmed. The third opens onto an edge-to-edge list (flush)."
      :code="`<MExpansionPanel>
  <template #leading>
    <span class=&quot;grid size-10 place-items-center rounded-full bg-tertiary-container text-on-tertiary-container&quot;><MIcon name=&quot;construction&quot; /></span>
  </template>
  <template #title>Obra <mark class=&quot;rounded bg-primary-container px-1 text-on-primary-container&quot;>Norte</mark></template>
  <template #subtitle>3 tasks due this week</template>
  <template #trailing><span class=&quot;rounded-full bg-error px-2 text-label-small text-on-error&quot;>3</span></template>
  …
</MExpansionPanel>
<MExpansionPanel title=&quot;Obra Sur&quot; subtitle=&quot;No tasks yet&quot; icon=&quot;construction&quot; :expandable=&quot;false&quot; />
<MExpansionPanel title=&quot;Team&quot; icon=&quot;group&quot; flush>
  <MListItem v-for=&quot;p in people&quot; :key=&quot;p&quot; :title=&quot;p&quot; />
</MExpansionPanel>`"
    >
      <div class="flex w-full max-w-xl flex-col gap-3">
        <MExpansionPanel>
          <template #leading>
            <span class="grid size-10 shrink-0 place-items-center rounded-full bg-tertiary-container text-on-tertiary-container"><MIcon name="construction" :size="22" /></span>
          </template>
          <template #title>Obra <mark class="rounded bg-primary-container px-1 text-on-primary-container">Norte</mark></template>
          <template #subtitle>3 tasks due this week</template>
          <template #trailing><span class="rounded-full bg-error px-2 text-label-small text-on-error">3</span></template>
          <p class="text-body-medium text-on-surface-variant">Pour the slab, check the scaffolding, order the windows.</p>
        </MExpansionPanel>
        <MExpansionPanel title="Obra Sur" subtitle="No tasks yet" icon="construction" :expandable="false" />
        <MExpansionPanel title="Team" icon="group" flush>
          <MListItem v-for="p in ['Ana López', 'Bruno Díaz', 'Carla Ruiz']" :key="p" :title="p" />
        </MExpansionPanel>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Everything custom: work orders"
      description="Every header slot at once. Search filters the orders and highlights the match in each title (#title); the status is a colored icon (#leading); client, due date and tags sit below (#subtitle); a progress ring follows the ticked tasks (#trailing). Each opens onto an edge-to-edge checklist (flush), one at a time (v-model), and an order with no tasks is a plain row (expandable false). Colors are yours too: each status tints its panel through class or style (bg-error-container/35 border-l-4 border-l-error, or any color: Paused is #7c4dff with color-mix), theme roles follow the palette and dark mode, and every tag has a color of its own."
      :code="`<MExpansionPanel
  v-for=&quot;o in shown&quot;
  :key=&quot;o.id&quot;
  :model-value=&quot;open === o.id&quot;
  :expandable=&quot;o.tasks.length > 0&quot;
  :class=&quot;STATUS[o.status].panel&quot;
  :style=&quot;STATUS[o.status].style&quot;
  flush
  @update:model-value=&quot;(v) => (open = v ? o.id : null)&quot;
>
  <template #leading>
    <span class=&quot;grid size-10 place-items-center rounded-full&quot; :class=&quot;STATUS[o.status].bubble&quot;><MIcon :name=&quot;STATUS[o.status].icon&quot; /></span>
  </template>
  <template #title>
    <template v-for=&quot;p in parts(o.name)&quot;><mark v-if=&quot;p.hit&quot;>{{ p.text }}</mark><template v-else>{{ p.text }}</template></template>
  </template>
  <template #subtitle>{{ o.client }} · {{ dueText(o) }} · <span v-for=&quot;t in o.tags&quot;>{{ t }}</span></template>
  <template #trailing>
    <MCircleProgressBar :value=&quot;progress(o)&quot; :size=&quot;36&quot; variant=&quot;circle&quot; :color=&quot;STATUS[o.status].ring&quot; />
  </template>

  <MListItem v-for=&quot;t in o.tasks&quot; :title=&quot;t.label&quot; trailing=&quot;checkbox&quot; v-model:trailing-value=&quot;t.done&quot; />
</MExpansionPanel>`"
    >
      <ExpansionPanelWorkOrders />
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
