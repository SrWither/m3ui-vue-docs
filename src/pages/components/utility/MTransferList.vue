<script setup lang="ts">
import { computed, ref } from 'vue'
import { MTransferList, MIcon, MButton, MChip, MAvatar, MIconButton } from '@m3ui-vue/m3ui-vue'
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
  { name: 'bare', type: 'boolean', default: 'false', description: 'The #item slot draws the whole row: no checkbox, padding, min height or background. Rows stay clickable, focusable (Space checks, Enter moves) and animated; style the checked state with the slot\'s checked' },
  { name: 'moveAllRightLabel', type: 'string', description: 'Aria label for the move-all-right button (defaults to the locale string)' },
  { name: 'moveRightLabel', type: 'string', description: 'Aria label for the move-selected-right button (defaults to the locale string)' },
  { name: 'moveLeftLabel', type: 'string', description: 'Aria label for the move-selected-left button (defaults to the locale string)' },
  { name: 'moveAllLeftLabel', type: 'string', description: 'Aria label for the move-all-left button (defaults to the locale string)' },
]

const transferEvents: EventDef[] = [
  { name: 'update:modelValue', payload: '(string | number)[]', description: 'Emitted whenever items move between panes (v-model)' },
]

const transferSlots: SlotDef[] = [
  { name: 'item', scope: '{ item, checked, side, toggle, move }', description: 'Custom row content. Without bare it replaces the icon and text and keeps the checkbox, highlight and hover; with bare it draws the whole row. side is \'source\' or \'target\', toggle() checks the row, move() sends it to the other pane. Buttons, links, fields and elements with data-transfer-action keep their own clicks' },
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
// Custom rows (#item)
const reviewers: (TransferItem & { email: string; team: string; online: boolean })[] = [
  { value: 'ana', label: 'Ana Torres', email: 'ana@acme.dev', team: 'Design', online: true },
  { value: 'luis', label: 'Luis Gómez', email: 'luis@acme.dev', team: 'Frontend', online: true },
  { value: 'marta', label: 'Marta Ruiz', email: 'marta@acme.dev', team: 'Backend', online: false },
  { value: 'diego', label: 'Diego Pérez', email: 'diego@acme.dev', team: 'QA', online: true },
  { value: 'sofia', label: 'Sofía Lima', email: 'sofia@acme.dev', team: 'Product', online: false },
]
const chosenReviewers = ref<(string | number)[]>(['luis'])

const customRowsCode = `<MTransferList v-model="reviewers" :items="people" source-title="Team" target-title="Reviewers">
  <template #item="{ item, checked }">
    <div class="flex items-center gap-3">
      <div class="relative">
        <MAvatar :name="item.label" />
        <span
          class="absolute right-0 bottom-0 h-3 w-3 rounded-full ring-2 ring-surface-container-low"
          :class="item.online ? 'bg-success' : 'bg-outline'"
        />
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-body-large">{{ item.label }}</p>
        <p class="truncate text-body-small text-on-surface-variant">{{ item.email }}</p>
      </div>
      <span class="rounded-full bg-tertiary-container px-2 py-0.5 text-label-small text-on-tertiary-container">
        {{ item.team }}
      </span>
    </div>
  </template>
</MTransferList>`

// Controls inside rows: quantities
const products: (TransferItem & { price: number })[] = [
  { value: 'espresso', label: 'Espresso', icon: 'coffee', price: 2.5 },
  { value: 'latte', label: 'Latte', icon: 'local_cafe', price: 3.8 },
  { value: 'croissant', label: 'Croissant', icon: 'bakery_dining', price: 2.2 },
  { value: 'bagel', label: 'Bagel', icon: 'breakfast_dining', price: 3 },
  { value: 'juice', label: 'Orange juice', icon: 'local_bar', price: 4.1 },
  { value: 'cookie', label: 'Cookie', icon: 'cookie', price: 1.6 },
]
const order = ref<(string | number)[]>(['latte', 'croissant'])
const qty = ref<Record<string, number>>({ latte: 2, croissant: 1 })
const qtyOf = (item: TransferItem) => qty.value[item.value as string] ?? 1
function setQty(item: TransferItem, n: number) {
  qty.value = { ...qty.value, [item.value as string]: Math.max(1, Math.min(9, n)) }
}
const orderTotal = computed(() =>
  products.filter((p) => order.value.includes(p.value)).reduce((sum, p) => sum + p.price * qtyOf(p), 0),
)
const money = (n: number) => `$${n.toFixed(2)}`

const controlsCode = `<MTransferList v-model="order" :items="products" source-title="Menu" target-title="Order">
  <template #item="{ item, side }">
    <div class="flex items-center gap-3">
      <MIcon :name="item.icon" class="text-on-surface-variant" />
      <div class="min-w-0 flex-1">
        <p class="truncate text-body-large">{{ item.label }}</p>
        <p class="text-body-small text-on-surface-variant">{{ money(item.price) }}</p>
      </div>
      <!-- Buttons keep their own clicks: they don't check or move the row -->
      <div v-if="side === 'target'" class="flex items-center gap-1">
        <MIconButton icon="remove" size="xs" variant="tonal" label="Less" @click="setQty(item, qty[item.value] - 1)" />
        <span class="w-5 text-center text-label-large tabular-nums">{{ qty[item.value] }}</span>
        <MIconButton icon="add" size="xs" variant="tonal" label="More" @click="setQty(item, qty[item.value] + 1)" />
      </div>
    </div>
  </template>
</MTransferList>`

// bare: cards
const widgets: (TransferItem & { color: string })[] = [
  { value: 'weather', label: 'Weather', description: 'Forecast for your city', icon: 'partly_cloudy_day', color: 'bg-primary-container text-on-primary-container' },
  { value: 'calendar', label: 'Calendar', description: 'Next three events', icon: 'calendar_month', color: 'bg-secondary-container text-on-secondary-container' },
  { value: 'steps', label: 'Steps', description: 'Today\'s activity ring', icon: 'directions_walk', color: 'bg-tertiary-container text-on-tertiary-container' },
  { value: 'music', label: 'Now playing', description: 'Controls for the current song', icon: 'music_note', color: 'bg-error-container text-on-error-container' },
  { value: 'notes', label: 'Notes', description: 'Pinned notes', icon: 'sticky_note_2', color: 'bg-success-container text-on-success-container' },
]
const homeWidgets = ref<(string | number)[]>(['weather', 'calendar'])

const bareCode = `<MTransferList v-model="home" :items="widgets" bare source-title="Widgets" target-title="Home screen">
  <template #item="{ item, checked, side, move }">
    <div
      class="flex items-center gap-3 rounded-md p-3 transition-colors"
      :class="checked ? 'bg-secondary-container ring-2 ring-secondary' : 'bg-surface-container-high hover:bg-surface-container-highest'"
    >
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg" :class="item.color">
        <MIcon :name="item.icon" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-title-small">{{ item.label }}</p>
        <p class="truncate text-body-small text-on-surface-variant">{{ item.description }}</p>
      </div>
      <MIconButton
        :icon="side === 'source' ? 'add' : 'close'"
        size="xs"
        :label="side === 'source' ? 'Add to home' : 'Remove'"
        @click="move"
      />
    </div>
  </template>
</MTransferList>`
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

    <ComponentDemo
      title="Custom rows"
      description="The item slot replaces the icon and text with your own content, here an avatar with a presence dot, an email and a team tag. The checkbox, the checked highlight and the hover stay, and the slot's item is your own object, extra fields (and their types) included."
      :code="customRowsCode"
    >
      <MTransferList v-model="chosenReviewers" :items="reviewers" source-title="Team" target-title="Reviewers" class="w-full">
        <template #item="{ item }">
          <div class="flex items-center gap-3">
            <div class="relative">
              <MAvatar :name="item.label" />
              <span
                class="absolute right-0 bottom-0 h-3 w-3 rounded-full ring-2 ring-surface-container-low"
                :class="item.online ? 'bg-success' : 'bg-outline'"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-body-large text-on-surface">{{ item.label }}</p>
              <p class="truncate text-body-small text-on-surface-variant">{{ item.email }}</p>
            </div>
            <span class="shrink-0 rounded-full bg-tertiary-container px-2 py-0.5 text-label-small text-on-tertiary-container">
              {{ item.team }}
            </span>
          </div>
        </template>
      </MTransferList>
    </ComponentDemo>

    <ComponentDemo
      title="Controls inside rows"
      description="side tells you which pane a row is in, so rows can change once they cross. Ordered items get a quantity stepper: buttons, links and fields inside a row keep their own clicks and don't check or move it (mark anything else with data-transfer-action)."
      :code="controlsCode"
    >
      <div class="flex w-full flex-col gap-3">
        <MTransferList v-model="order" :items="products" source-title="Menu" target-title="Order">
          <template #item="{ item, side }">
            <div class="flex items-center gap-3">
              <MIcon :name="item.icon!" class="shrink-0 text-on-surface-variant" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-body-large text-on-surface">{{ item.label }}</p>
                <p class="text-body-small text-on-surface-variant">
                  {{ side === 'target' && qtyOf(item) > 1 ? `${qtyOf(item)} × ${money(item.price)}` : money(item.price) }}
                </p>
              </div>
              <div v-if="side === 'target'" class="flex shrink-0 items-center gap-1">
                <MIconButton icon="remove" size="xs" variant="tonal" label="Less" :disabled="qtyOf(item) <= 1" @click="setQty(item, qtyOf(item) - 1)" />
                <span class="w-5 text-center text-label-large tabular-nums text-on-surface">{{ qtyOf(item) }}</span>
                <MIconButton icon="add" size="xs" variant="tonal" label="More" :disabled="qtyOf(item) >= 9" @click="setQty(item, qtyOf(item) + 1)" />
              </div>
            </div>
          </template>
        </MTransferList>
        <div class="flex items-center justify-end gap-3">
          <span class="text-body-medium text-on-surface-variant">Total</span>
          <span class="text-title-medium tabular-nums text-on-surface">{{ money(orderTotal) }}</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Fully custom rows"
      description="bare hands the whole row to the item slot: no checkbox, padding or background, so each item can be a card. Click a card to check it, or use its own button to send it across with move(). Rows stay focusable: Space checks and Enter moves."
      :code="bareCode"
    >
      <MTransferList v-model="homeWidgets" :items="widgets" bare source-title="Widgets" target-title="Home screen" list-height="320px" class="w-full">
        <template #item="{ item, checked, side, move }">
          <div
            class="flex items-center gap-3 rounded-md p-3 transition-colors duration-150"
            :class="checked ? 'bg-secondary-container ring-2 ring-secondary' : 'bg-surface-container-high hover:bg-surface-container-highest'"
          >
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg" :class="item.color">
              <MIcon :name="item.icon!" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-title-small text-on-surface">{{ item.label }}</p>
              <p class="truncate text-body-small text-on-surface-variant">{{ item.description }}</p>
            </div>
            <MIconButton
              :icon="side === 'source' ? 'add' : 'close'"
              size="xs"
              :label="side === 'source' ? 'Add to home' : 'Remove'"
              @click="move"
            />
          </div>
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
