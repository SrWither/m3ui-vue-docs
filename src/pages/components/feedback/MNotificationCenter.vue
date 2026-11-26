<script setup lang="ts">
import { computed, ref } from 'vue'
import { MButton, MCard, MIconButton, MNotificationCenter } from '@m3ui-vue/m3ui-vue'
import type { InboxNotification } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const now = Date.now()
const min = 60e3
const inbox = ref<InboxNotification[]>([
  { id: 1, title: 'New order #1042', body: 'Ana López ordered 3 items, $86.40', time: now - 4 * min, icon: 'shopping_bag', color: 'primary' },
  { id: 2, title: 'Bruno mentioned you', body: '“@you can you check the new icons before Friday?”', time: now - 38 * min, icon: 'alternate_email', color: 'tertiary' },
  { id: 3, title: 'Payment failed', body: 'The card ending in 4242 was declined. Update it to keep your plan.', time: now - 3 * 60 * min, icon: 'credit_card_off', color: 'error' },
  { id: 4, title: 'Backup finished', body: '2.4 GB, 0 errors', time: now - 20 * 60 * min, read: true, icon: 'cloud_done', color: 'success' },
  { id: 5, title: 'Weekly report is ready', time: now - 30 * 60 * min, icon: 'insights' },
  { id: 6, title: 'Carla joined the team', time: now - 4 * 24 * 60 * min, read: true, icon: 'person_add', color: 'secondary' },
])
const open = ref(true)
const unread = computed(() => inbox.value.filter((n) => !n.read).length)
const opened = ref('')
let next = 100
const SAMPLES = [
  { title: 'New review ★★★★★', body: '“Fast delivery and great support.”', icon: 'star', color: 'tertiary' as const },
  { title: 'Stock running low', body: 'Only 3 left of “Linen shirt, M”.', icon: 'inventory_2', color: 'error' as const },
  { title: 'Diego commented', body: '“Looks good to me, merging.”', icon: 'chat', color: 'primary' as const },
]
function simulate() {
  const s = SAMPLES[next % SAMPLES.length]!
  inbox.value = [{ id: next++, time: Date.now(), ...s }, ...inbox.value]
}

const centerProps: PropDef[] = [
  { name: 'modelValue', type: 'InboxNotification[]', description: '{ id, title, body?, time (Date | ISO | ms), read?, icon?, avatar?, color? } (v-model): reading and dismissing change it.' },
  { name: 'title', type: 'string', description: 'The header\'s title; the locale\'s "Notifications" by default, empty hides the header.' },
  { name: 'filter', type: 'boolean', default: 'true', description: 'The All / Unread filter.' },
  { name: 'dismissible', type: 'boolean', default: 'true', description: 'Swipe sideways, the dismiss button or Delete removes one.' },
  { name: 'maxHeight', type: 'string', description: 'Limit the list\'s height, scrolling inside (the day headers stick).' },
]
const centerEvents: EventDef[] = [
  { name: 'open', payload: 'InboxNotification', description: 'Clicked (or Enter): it\'s marked read too.' },
  { name: 'dismiss', payload: 'InboxNotification', description: 'Dismissed.' },
  { name: 'update:modelValue', payload: 'InboxNotification[]', description: 'The list changed.' },
]
const centerSlots: SlotDef[] = [
  { name: 'item', scope: '{ item }', description: 'One notification\'s content.' },
  { name: 'empty', description: 'What shows with nothing to list.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MNotificationCenter</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An inbox: notifications grouped by day with relative times, unread ones marked, an All / Unread filter, Mark all
      as read, and a swipe (or a button, or Delete) to dismiss. The list is the v-model. It sits wherever you put it: a
      menu under a bell, a side sheet, a page. For passing toasts there's
      <RouterLink to="/composables/usenotification" class="text-primary underline">useNotification()</RouterLink>.
    </p>

    <ComponentDemo
      title="Under a bell"
      description="The bell shows how many are unread. Open one, swipe one sideways (or hover for its buttons), filter to unread, or simulate a new one arriving."
      :code="`<MIconButton icon=&quot;notifications&quot; label=&quot;Notifications&quot; @click=&quot;open = !open&quot; />
<MNotificationCenter v-if=&quot;open&quot; v-model=&quot;inbox&quot; max-height=&quot;420px&quot; @open=&quot;(n) => router.push(n.link)&quot; />`"
      :script="`import { MNotificationCenter } from '@m3ui-vue/m3ui-vue'

const inbox = ref([
  { id: 1, title: 'New order #1042', body: 'Ana López ordered 3 items', time: Date.now() - 4 * 60e3, icon: 'shopping_bag', color: 'primary' },
  { id: 4, title: 'Backup finished', time: '2026-11-25T14:00:00Z', read: true, icon: 'cloud_done', color: 'success' },
  // …
])`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="relative">
            <MIconButton icon="notifications" label="Notifications" variant="tonal" @click="open = !open" />
            <span v-if="unread" class="pointer-events-none absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-error px-1 text-label-small text-on-error">{{ unread }}</span>
          </span>
          <span class="flex-1" />
          <MButton variant="text" icon="add_alert" @click="simulate">Simulate a new one</MButton>
        </div>
        <MCard v-if="open" variant="elevated" class="overflow-hidden">
          <MNotificationCenter v-model="inbox" max-height="420px" @open="(n: InboxNotification) => (opened = n.title)" />
        </MCard>
        <p class="text-body-small text-on-surface-variant">{{ opened ? `Opened: ${opened}` : 'Nothing opened yet' }}</p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="centerProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="centerEvents" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="centerSlots" />

    <ComponentPager current="MNotificationCenter" />
  </div>
</template>
