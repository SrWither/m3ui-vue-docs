<script setup lang="ts">
import { ref } from 'vue'
import { MNavigationSuite, MFab, MCard, MIcon, MSegmentedButton, MChip, MAvatar, MListItem, MIconButton } from '@m3ui-vue/m3ui-vue'
import type { NavigationSuiteItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import AdaptiveFrame from '@/components/demos/AdaptiveFrame.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const suiteProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number', description: 'Selected destination (v-model)' },
  { name: 'items', type: 'NavigationSuiteItem[]', description: 'Destinations, the same shape MNavigationRail and MShortNavigationBar take' },
  { name: 'layout', type: "'auto' | 'bar' | 'bar-medium' | 'rail' | 'rail-expanded' | 'none'", default: "'auto'", description: "'auto' picks by the component's own size: compact width → short bar, compact height (a phone in landscape) → short bar with icons beside labels, anything else → rail. Any other value forces that navigation; 'none' hides it" },
]

const suiteEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string | number', description: 'Emitted when a destination is picked (v-model)' },
]

const suiteSlots: SlotDef[] = [
  { name: 'default', scope: '{ layout }', description: 'The app content. It scrolls on its own and keeps its state when the navigation swaps. layout is the navigation in use' },
  { name: 'fab', description: 'Primary action, e.g. an MFab: in the rail\'s header, or floating at the bottom end above the bar' },
]

const suiteTypes: TypeDef[] = [
  {
    name: 'NavigationSuiteItem',
    fields: [
      { name: 'value', type: 'string | number', required: true, description: 'Unique identifier, used in modelValue' },
      { name: 'label', type: 'string', required: true, description: 'Destination name' },
      { name: 'icon', type: 'string', required: true, description: 'Material Symbol' },
      { name: 'badge', type: 'number', description: 'Count badge on the icon' },
      { name: 'badgeDot', type: 'boolean', description: 'Small dot badge on the icon' },
      { name: 'disabled', type: 'boolean', description: 'Disables the destination (rail only)' },
      { name: 'to', type: 'string | RouteLocationRaw', description: 'Makes the item a real link (middle-click, open in a new tab): a RouterLink when vue-router is installed, a plain <a href> otherwise. Clicking still updates v-model' },
    ],
  },
]

const items: NavigationSuiteItem[] = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'explore', label: 'Explore', icon: 'explore' },
  { value: 'saved', label: 'Saved', icon: 'bookmark', badge: 3 },
  { value: 'profile', label: 'Profile', icon: 'person' },
]
const current = ref<string | number>('home')
const cards = Array.from({ length: 8 }, (_, i) => ({
  title: ['Weekend in Lisbon', 'Mountain cabins', 'City food tour', 'Coastal road trip', 'Museum pass', 'Night market', 'Lake kayaking', 'Rooftop concerts'][i]!,
  icon: ['flight', 'cabin', 'restaurant', 'directions_car', 'museum', 'storefront', 'kayaking', 'music_note'][i]!,
}))

const exploreTags = ['Beaches', 'Hiking', 'Food', 'Museums', 'Nightlife', 'Family']
const exploreTag = ref('Hiking')
const saved = ref([
  { title: 'Weekend in Lisbon', subtitle: '3 nights · from $420', icon: 'flight' },
  { title: 'Lake kayaking', subtitle: 'Half day · $65', icon: 'kayaking' },
  { title: 'Night market', subtitle: 'Fridays · free', icon: 'storefront' },
])

const forced = ref<string | number | (string | number)[]>('rail-expanded')
const forcedOptions = [
  { value: 'bar', label: 'bar' },
  { value: 'bar-medium', label: 'bar-medium' },
  { value: 'rail', label: 'rail' },
  { value: 'rail-expanded', label: 'rail-expanded' },
]
const current2 = ref<string | number>('explore')

// Links: real docs routes, so clicking one navigates
const linkItems: NavigationSuiteItem[] = [
  { value: 'suite', label: 'Suite', icon: 'responsive_layout', to: '/components/layout/mnavigationsuite' },
  { value: 'list', label: 'List-detail', icon: 'view_list', to: '/components/layout/mlistdetail' },
  { value: 'pane', label: 'Supporting', icon: 'view_column_2', to: '/components/layout/msupportingpane' },
  { value: 'sizes', label: 'Sizes', icon: 'devices', to: '/components/layout/usewindowsizeclass' },
]
const current3 = ref<string | number>('suite')
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MNavigationSuite</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      One navigation that adapts to the space, after Material 3's <code>NavigationSuiteScaffold</code>: a short
      navigation bar at the bottom on phones, the same bar with icons beside labels on a phone in landscape,
      and a navigation rail on the side from tablets up. Give it your destinations and your content; it picks
      MShortNavigationBar or MNavigationRail by its own size (see useWindowSizeClass) and swaps them without
      remounting the content. It has no default size, so give it the app's height, e.g. <code>class="h-dvh"</code>.
    </p>

    <ComponentDemo
      title="Adaptive navigation"
      description="A travel app with four screens. Switch the frame between Phone, Tablet and Desktop (or drag its corner): the bottom bar becomes a rail, the FAB moves into the rail's header, and the screen you're on (its selected chip, removed items) stays as it was."
      :code="`<MNavigationSuite v-model=&quot;current&quot; :items=&quot;items&quot; class=&quot;h-dvh&quot;>
  <main class=&quot;p-4&quot;>
    <!-- your page -->
  </main>
  <template #fab>
    <MFab icon=&quot;edit&quot; />
  </template>
</MNavigationSuite>`"
      :script="`const items = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'explore', label: 'Explore', icon: 'explore' },
  { value: 'saved', label: 'Saved', icon: 'bookmark', badge: 3 },
  { value: 'profile', label: 'Profile', icon: 'person' },
]
const current = ref('home')`"
    >
      <AdaptiveFrame height="520px" initial="phone">
        <MNavigationSuite v-model="current" :items="items" class="h-full">
          <template #default="{ layout }">
            <div class="p-4">
              <div class="mb-4 flex items-center gap-2">
                <p class="flex-1 text-headline-small capitalize text-on-surface">{{ current }}</p>
                <MChip icon="devices">{{ layout }}</MChip>
              </div>

              <div v-if="current === 'home'" class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
                <MCard v-for="c in cards" :key="c.title" variant="filled" class="flex flex-col gap-3 p-4">
                  <MIcon :name="c.icon" class="text-primary" />
                  <span class="text-title-small text-on-surface">{{ c.title }}</span>
                </MCard>
              </div>

              <div v-else-if="current === 'explore'">
                <div class="mb-4 flex flex-wrap gap-2">
                  <MChip v-for="t in exploreTags" :key="t" :selected="t === exploreTag" @click="exploreTag = t">{{ t }}</MChip>
                </div>
                <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                  <div v-for="n in 4" :key="n" class="overflow-hidden rounded-2xl bg-surface-container">
                    <div class="flex h-24 items-center justify-center bg-gradient-to-br from-tertiary-container to-primary-container">
                      <MIcon name="landscape" :size="36" class="text-on-tertiary-container" />
                    </div>
                    <div class="p-3">
                      <p class="text-title-small text-on-surface">{{ exploreTag }} spot #{{ n }}</p>
                      <p class="text-body-small text-on-surface-variant">{{ 2 + n }} km away · 4.{{ 9 - n }} ★</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="current === 'saved'" class="rounded-2xl bg-surface-container-low py-1">
                <MListItem v-for="item in saved" :key="item.title" :title="item.title" :subtitle="item.subtitle" :icon="item.icon">
                  <template #trailing>
                    <MIconButton icon="close" label="Remove" @click="saved.splice(saved.indexOf(item), 1)" />
                  </template>
                </MListItem>
                <p v-if="!saved.length" class="p-6 text-center text-body-medium text-on-surface-variant">Nothing saved yet</p>
              </div>

              <div v-else class="flex flex-col items-center gap-3 py-6 text-center">
                <MAvatar name="Alex Rivera" :size="80" />
                <p class="text-title-large text-on-surface">Alex Rivera</p>
                <p class="text-body-medium text-on-surface-variant">12 trips · 48 reviews</p>
              </div>
            </div>
          </template>
          <template #fab>
            <MFab icon="edit" size="small" color="tertiary" />
          </template>
        </MNavigationSuite>
      </AdaptiveFrame>
    </ComponentDemo>

    <ComponentDemo
      title="Forcing a navigation"
      description="layout overrides the automatic choice, for example an expanded rail with labels on large screens, or the landscape bar."
      :code="`<MNavigationSuite v-model=&quot;current&quot; :items=&quot;items&quot; layout=&quot;rail-expanded&quot; />`"
    >
      <div class="flex w-full min-w-0 flex-col gap-3">
        <MSegmentedButton v-model="forced" :options="forcedOptions" />
        <div class="h-80 w-full overflow-hidden rounded-xl border border-outline-variant">
          <MNavigationSuite v-model="current2" :items="items" :layout="(forced as any)" class="h-full">
            <div class="flex h-full items-center justify-center p-4">
              <p class="text-title-medium capitalize text-on-surface-variant">{{ current2 }}</p>
            </div>
          </MNavigationSuite>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Links and vue-router"
      description="Give items a to and they become real links: RouterLink with vue-router (as here: these go to the other adaptive layout pages), a plain <a href> without it. Middle-click opens them in a new tab. Bind :model-value to the current route (with item values matching route names) so the right item stays selected on reloads and back/forward."
      :code="`<MNavigationSuite :model-value=&quot;route.name&quot; :items=&quot;items&quot; class=&quot;h-dvh&quot;>
  <RouterView />
</MNavigationSuite>`"
      :script="`const route = useRoute()
const items = [
  { value: 'home', label: 'Home', icon: 'home', to: { name: 'home' } },
  { value: 'orders', label: 'Orders', icon: 'receipt_long', to: '/orders' },
  { value: 'settings', label: 'Settings', icon: 'settings', to: '/settings' },
]`"
    >
      <div class="h-64 w-full overflow-hidden rounded-xl border border-outline-variant">
        <MNavigationSuite v-model="current3" :items="linkItems" layout="rail" class="h-full">
          <div class="flex h-full items-center justify-center p-4 text-center">
            <p class="text-body-medium text-on-surface-variant">Each destination is a link to another docs page.</p>
          </div>
        </MNavigationSuite>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="suiteProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="suiteEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="suiteSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="suiteTypes" />

    <ComponentPager current="MNavigationSuite" />
  </div>
</template>
