<script setup lang="ts">
import { computed, ref } from 'vue'
import { MTransferList, MIcon, MButton, MChip } from '@m3ui-vue/m3ui-vue'
import type { TransferItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const transferProps: PropDef[] = [
  { name: 'modelValue', type: '(string | number)[]', description: 'Values in the target (right or bottom) pane (v-model)' },
  { name: 'items', type: 'TransferItem[]', description: 'Full list of items, see the type below' },
  { name: 'sourceTitle', type: 'string', description: 'Source pane title (defaults to the locale string)' },
  { name: 'targetTitle', type: 'string', description: 'Target pane title (defaults to the locale string)' },
  { name: 'filterable', type: 'boolean', default: 'false', description: 'Show a search field in each pane. It matches the label and the description' },
  { name: 'searchPlaceholder', type: 'string', description: 'Search field placeholder (defaults to the locale string)' },
  { name: 'emptyText', type: 'string', description: 'Text when a pane is empty (defaults to the locale string)' },
  { name: 'listHeight', type: 'string', default: "'280px'", description: 'Height of each pane\'s scroll area, any CSS length' },
  { name: 'moveAllRightLabel', type: 'string', description: 'Aria label for the move-all-right button (defaults to the locale string)' },
  { name: 'moveRightLabel', type: 'string', description: 'Aria label for the move-selected-right button (defaults to the locale string)' },
  { name: 'moveLeftLabel', type: 'string', description: 'Aria label for the move-selected-left button (defaults to the locale string)' },
  { name: 'moveAllLeftLabel', type: 'string', description: 'Aria label for the move-all-left button (defaults to the locale string)' },
]

const transferEvents: EventDef[] = [
  { name: 'update:modelValue', payload: '(string | number)[]', description: 'Emitted whenever items move between panes (v-model)' },
]

const transferSlots: SlotDef[] = [
  { name: 'source-empty', description: 'Custom content when the source pane is empty' },
  { name: 'target-empty', description: 'Custom content when the target pane is empty' },
]

const transferTypes: TypeDef[] = [
  {
    name: 'TransferItem',
    fields: [
      { name: 'value', type: 'string | number', required: true, description: 'Unique identifier, used in modelValue' },
      { name: 'label', type: 'string', required: true, description: 'Display text' },
      { name: 'icon', type: 'string', description: 'Material Symbol shown in a round container before the label' },
      { name: 'description', type: 'string', description: 'Second line under the label (an email, a role, a short note). Also matched by search' },
    ],
  },
]

// Basic
const frameworks: TransferItem[] = [
  { value: 'vue', label: 'Vue', icon: 'code' },
  { value: 'react', label: 'React', icon: 'code' },
  { value: 'angular', label: 'Angular', icon: 'code' },
  { value: 'svelte', label: 'Svelte', icon: 'code' },
  { value: 'solid', label: 'Solid', icon: 'code' },
  { value: 'ember', label: 'Ember', icon: 'code' },
]
const chosenFrameworks = ref<(string | number)[]>(['vue'])

// Team members
const people: TransferItem[] = [
  { value: 'ana', label: 'Ana Torres', description: 'Product designer', icon: 'palette' },
  { value: 'luis', label: 'Luis Gómez', description: 'Frontend engineer', icon: 'code' },
  { value: 'marta', label: 'Marta Ruiz', description: 'Backend engineer', icon: 'dns' },
  { value: 'diego', label: 'Diego Pérez', description: 'QA engineer', icon: 'bug_report' },
  { value: 'sofia', label: 'Sofía Lima', description: 'Product manager', icon: 'assignment' },
  { value: 'pablo', label: 'Pablo Ortiz', description: 'Data analyst', icon: 'monitoring' },
  { value: 'carla', label: 'Carla Vidal', description: 'Mobile engineer', icon: 'smartphone' },
]
const team = ref<(string | number)[]>(['ana', 'luis'])
const teamNames = computed(() => people.filter((p) => team.value.includes(p.value)).map((p) => p.label.split(' ')[0]))
const savedTeam = ref<string | null>(null)
function saveTeam() {
  savedTeam.value = new Date().toLocaleTimeString()
}

// Permissions
const permissions: TransferItem[] = [
  { value: 'orders.read', label: 'View orders', description: 'orders.read', icon: 'receipt_long' },
  { value: 'orders.write', label: 'Edit orders', description: 'orders.write', icon: 'edit_note' },
  { value: 'refunds', label: 'Issue refunds', description: 'payments.refund', icon: 'currency_exchange' },
  { value: 'customers', label: 'View customers', description: 'customers.read', icon: 'group' },
  { value: 'products', label: 'Manage products', description: 'catalog.write', icon: 'inventory_2' },
  { value: 'reports', label: 'Export reports', description: 'reports.export', icon: 'download' },
  { value: 'settings', label: 'Store settings', description: 'settings.write', icon: 'settings' },
]
const granted = ref<(string | number)[]>(['orders.read', 'customers'])

// Countries (filterable)
const countryNames = [
  'Argentina', 'Australia', 'Brazil', 'Canada', 'Chile', 'Colombia', 'France', 'Germany', 'India', 'Italy',
  'Japan', 'Mexico', 'Netherlands', 'Peru', 'Portugal', 'South Korea', 'Spain', 'Sweden', 'United Kingdom', 'United States', 'Uruguay',
]
const countries: TransferItem[] = countryNames.map((name) => ({ value: name, label: name, icon: 'public' }))
const shipsTo = ref<(string | number)[]>(['Mexico', 'Spain'])

// Custom empty states
const integrations: TransferItem[] = [
  { value: 'slack', label: 'Slack', description: 'Post alerts to a channel', icon: 'forum' },
  { value: 'github', label: 'GitHub', description: 'Link commits and issues', icon: 'commit' },
  { value: 'drive', label: 'Google Drive', description: 'Attach files from Drive', icon: 'add_to_drive' },
]
const enabledIntegrations = ref<(string | number)[]>([])
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTransferList</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Move items between two panes, with select-all, optional search and v-model on the values in the target
      pane. Check rows and use the arrows, or double-click a row (or press Enter on its checkbox) to send it
      straight across. When the component is narrow, the panes stack and the arrows point up and down.
    </p>

    <ComponentDemo
      title="Transfer list"
      description="Check items and move them with the arrows. The header checkbox selects every item in the pane (or what the search left), and shows how many are checked."
      :code="`<MTransferList v-model=&quot;chosen&quot; :items=&quot;frameworks&quot; />`"
      :script="`const frameworks = [
  { value: 'vue', label: 'Vue', icon: 'code' },
  { value: 'react', label: 'React', icon: 'code' },
  // ...
]
const chosen = ref(['vue'])`"
    >
      <MTransferList v-model="chosenFrameworks" :items="frameworks" class="w-full" />
    </ComponentDemo>

    <ComponentDemo
      title="Build a team"
      description="description adds a second line to each row. Here the transfer list sits in a small form, with a summary of who's in and a save button."
      :code="`<MTransferList
  v-model=&quot;team&quot;
  :items=&quot;people&quot;
  source-title=&quot;People&quot;
  target-title=&quot;Team&quot;
/>`"
      :script="`const people = [
  { value: 'ana', label: 'Ana Torres', description: 'Product designer', icon: 'palette' },
  { value: 'luis', label: 'Luis Gómez', description: 'Frontend engineer', icon: 'code' },
  // ...
]
const team = ref(['ana', 'luis'])`"
    >
      <div class="flex w-full flex-col gap-4">
        <MTransferList v-model="team" :items="people" source-title="People" target-title="Team" />
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-body-medium text-on-surface-variant">
            {{ team.length ? `${teamNames.join(', ')} (${team.length})` : 'No one on the team yet' }}
          </span>
          <span v-if="savedTeam" class="text-label-medium text-on-surface-variant">Saved at {{ savedTeam }}</span>
          <MButton icon="save" class="ml-auto" :disabled="!team.length" @click="saveTeam">Save team</MButton>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Role permissions"
      description="A permission editor: the icon and the permission key as the description make long lists easy to scan."
      :code="`<MTransferList
  v-model=&quot;granted&quot;
  :items=&quot;permissions&quot;
  source-title=&quot;Available&quot;
  target-title=&quot;Granted to Support&quot;
/>`"
      :script="`const permissions = [
  { value: 'orders.read', label: 'View orders', description: 'orders.read', icon: 'receipt_long' },
  { value: 'refunds', label: 'Issue refunds', description: 'payments.refund', icon: 'currency_exchange' },
  // ...
]`"
    >
      <div class="flex w-full flex-col gap-3">
        <div class="flex flex-wrap gap-2">
          <MChip icon="shield_person" tone="primary">Support role</MChip>
          <MChip>{{ granted.length }} of {{ permissions.length }} permissions</MChip>
        </div>
        <MTransferList v-model="granted" :items="permissions" source-title="Available" target-title="Granted to Support" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Search"
      description="filterable adds a search field to each pane. Select-all and move-all act on the search results, so 'u' then the double arrow moves every match at once."
      :code="`<MTransferList
  v-model=&quot;shipsTo&quot;
  :items=&quot;countries&quot;
  filterable
  source-title=&quot;Countries&quot;
  target-title=&quot;Ships to&quot;
  search-placeholder=&quot;Search countries&quot;
  list-height=&quot;320px&quot;
/>`"
    >
      <MTransferList
        v-model="shipsTo"
        :items="countries"
        filterable
        source-title="Countries"
        target-title="Ships to"
        search-placeholder="Search countries"
        list-height="320px"
        class="w-full"
      />
    </ComponentDemo>

    <ComponentDemo
      title="Custom empty states"
      description="The source-empty and target-empty slots replace the default icon and text, e.g. to explain what to do next."
      :code="`<MTransferList v-model=&quot;enabled&quot; :items=&quot;integrations&quot; target-title=&quot;Enabled&quot;>
  <template #target-empty>
    <MIcon name=&quot;extension&quot; :size=&quot;36&quot; class=&quot;text-primary&quot; />
    <p class=&quot;text-title-small&quot;>No integrations yet</p>
    <p class=&quot;text-body-small text-on-surface-variant&quot;>Double-click one on the left to enable it.</p>
  </template>
  <template #source-empty>
    <MIcon name=&quot;celebration&quot; :size=&quot;36&quot; class=&quot;text-tertiary&quot; />
    <p class=&quot;text-title-small&quot;>All integrations enabled</p>
  </template>
</MTransferList>`"
    >
      <MTransferList v-model="enabledIntegrations" :items="integrations" target-title="Enabled" list-height="240px" class="w-full">
        <template #target-empty>
          <MIcon name="extension" :size="36" class="text-primary" />
          <p class="text-title-small text-on-surface">No integrations yet</p>
          <p class="text-body-small text-on-surface-variant">Double-click one on the left to enable it.</p>
        </template>
        <template #source-empty>
          <MIcon name="celebration" :size="36" class="text-tertiary" />
          <p class="text-title-small text-on-surface">All integrations enabled</p>
        </template>
      </MTransferList>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="transferProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="transferEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="transferSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="transferTypes" />

    <ComponentPager current="MTransferList" />
  </div>
</template>
