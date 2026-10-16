<script setup lang="ts">
import { computed, ref } from 'vue'
import { MTransition, MIconButton, MIcon, MNavigationBar, MListItem, MList } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

// Shared axis: a settings screen with a detail page
const screens = ['Settings', 'Notifications', 'Sounds'] as const
const depth = ref(0)
const back = ref(false)
function goTo(next: number) {
  back.value = next < depth.value
  depth.value = next
}

// Fade through: navigation bar tabs
const tab = ref('home')
const tabs = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'library', label: 'Library', icon: 'library_music' },
]
const tabContent: Record<string, { icon: string; title: string; text: string }> = {
  home: { icon: 'wb_sunny', title: 'Good morning', text: 'Pick up where you left off.' },
  search: { icon: 'travel_explore', title: 'Search', text: 'Artists, songs and podcasts.' },
  library: { icon: 'queue_music', title: 'Your library', text: '42 playlists, 318 songs.' },
}
const current = computed(() => tabContent[tab.value]!)

const transitionProps: PropDef[] = [
  { name: 'type', type: "'shared-axis' | 'fade-through'", default: "'shared-axis'", description: 'shared-axis slides between views that have a forward/back relationship; fade-through fades between unrelated destinations' },
  { name: 'reverse', type: 'boolean', default: 'false', description: 'Shared axis: play the backward version (the new view comes from the start side, under the old one)' },
  { name: 'appear', type: 'boolean', default: 'false', description: 'Animate the first view too' },
]

const transitionSlots: SlotDef[] = [
  { name: 'default', description: 'The current view. Give it a key that changes with it (or use v-if / v-else); both views overlap while they animate' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTransition</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material 3's transitions between views. Shared axis slides the new view in from the side while the old one
      slides out, both fading, for forward and back navigation (pass reverse when going back). Fade through fades
      the old view out and the new one in with a slight zoom, for destinations that aren't related, like the tabs
      of a navigation bar. Wrap the view and change its key; it works around a RouterView's component too.
    </p>

    <ComponentDemo
      title="Shared Axis"
      description="Go deeper and back: forward slides in from the end, back from the start."
      :code="`<template>
  <MTransition :reverse=&quot;back&quot;>
    <section :key=&quot;depth&quot;>
      <!-- the screen for this depth -->
    </section>
  </MTransition>
</template>`"
      :script="`const depth = ref(0)
const back = ref(false)

function goTo(next: number) {
  back.value = next < depth.value
  depth.value = next
}`"
    >
      <div class="w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant bg-surface">
        <MTransition :reverse="back">
          <section :key="depth" class="bg-surface">
            <div class="flex h-14 items-center gap-1 px-1">
              <MIconButton v-if="depth > 0" icon="arrow_back" label="Back" @click="goTo(depth - 1)" />
              <span class="px-3 text-title-large">{{ screens[depth] }}</span>
            </div>
            <MList v-if="depth === 0">
              <MListItem title="Notifications" subtitle="Alerts and badges" icon="notifications" trailing-icon="chevron_right" clickable @click="goTo(1)" />
              <MListItem title="Display" subtitle="Brightness, dark theme" icon="brightness_6" />
              <MListItem title="Battery" subtitle="87%" icon="battery_5_bar" />
            </MList>
            <MList v-else-if="depth === 1">
              <MListItem title="Sounds" subtitle="Chime" icon="music_note" trailing-icon="chevron_right" clickable @click="goTo(2)" />
              <MListItem title="Lock screen" subtitle="Show all content" icon="lock" />
              <MListItem title="Do not disturb" subtitle="Off" icon="do_not_disturb_on" />
            </MList>
            <MList v-else>
              <MListItem title="Chime" icon="radio_button_checked" />
              <MListItem title="Pebble" icon="radio_button_unchecked" />
              <MListItem title="Ripple" icon="radio_button_unchecked" />
            </MList>
          </section>
        </MTransition>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Fade Through"
      description="Switch tabs: the old content fades out, the new one fades and zooms in."
      :code="`<template>
  <MTransition type=&quot;fade-through&quot;>
    <section :key=&quot;tab&quot;>
      <!-- the content of this tab -->
    </section>
  </MTransition>
  <MNavigationBar v-model=&quot;tab&quot; :items=&quot;tabs&quot; />
</template>`"
    >
      <div class="w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant bg-surface">
        <MTransition type="fade-through">
          <section :key="tab" class="flex h-56 flex-col items-center justify-center gap-2 bg-surface text-center">
            <MIcon :name="current.icon" :size="48" class="text-primary" />
            <p class="text-headline-small">{{ current.title }}</p>
            <p class="text-body-medium text-on-surface-variant">{{ current.text }}</p>
          </section>
        </MTransition>
        <MNavigationBar v-model="tab" :items="tabs" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="transitionProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="transitionSlots" />

    <ComponentPager current="MTransition" />
  </div>
</template>
