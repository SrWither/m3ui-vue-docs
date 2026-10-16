<script setup lang="ts">
/*
 * Travel example ("Driftway"): discovering places and planning trips, built only with m3ui-vue.
 * - MNavigationBar on phones, MNavigationRail (with an MFabMenu) on wider screens; MTour on first visit
 * - views/ExploreView      MSearchBar, stories, MCarousel hero / multi-browse rows / uncontained row
 * - views/DestinationView  large and small MTopAppBar, gallery MCarousel, facts, things to do
 * - views/PlanView         MSelect, MDateRangePickerModal, MNumberField, MTagInput
 * - views/TripView         boarding pass with MPinInput check-in, MScheduler itinerary, MConfirmDialog
 * - views/TripsView, SavedView
 * - components/StoryViewer full-screen vertical MCarousel stories
 * - useTravel.ts / data.ts / art.ts   state, destinations and trips, SVG scenes
 */
import { computed, onMounted } from 'vue'
import { MFabMenu, MNavigationBar, MNavigationRail, MTour, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import type { FabMenuItem, NavBarItem, TourStep } from '@m3ui-vue/m3ui-vue'
import { destinations, isoDate } from './data'
import { useTravel, type Tab } from './useTravel'
import ExploreView from './views/ExploreView.vue'
import DestinationView from './views/DestinationView.vue'
import PlanView from './views/PlanView.vue'
import TripView from './views/TripView.vue'
import TripsView from './views/TripsView.vue'
import SavedView from './views/SavedView.vue'
import StoryViewer from './components/StoryViewer.vue'

const { screen, go, tab, trips, saved, openStories, pendingScroll, tourOpen, maybeStartTour, tourDone } = useTravel()
const { widthClass } = useWindowSizeClass()
const compact = computed(() => widthClass.value === 'compact')

const upcoming = computed(() => {
  const today = isoDate(new Date())
  return trips.value.filter((t) => t.end >= today).length
})
const navItems = computed<NavBarItem[]>(() => [
  { value: 'explore', label: 'Explore', icon: 'travel_explore' },
  { value: 'saved', label: 'Saved', icon: 'favorite', badge: saved.value.length || undefined },
  { value: 'trips', label: 'Trips', icon: 'luggage', badge: upcoming.value || undefined },
])
const current = computed({
  get: () => tab.value,
  set: (v: string | number) => go({ name: v as Tab }),
})

const fabItems: FabMenuItem[] = [
  { icon: 'edit_calendar', label: 'Plan a trip', onClick: () => go({ name: 'plan' }) },
  { icon: 'casino', label: 'Surprise me', onClick: () => go({ name: 'destination', id: destinations[Math.floor(Math.random() * destinations.length)]!.id }) },
  { icon: 'auto_stories', label: 'Watch stories', onClick: () => openStories(0) },
]

const view = computed(() => {
  const s = screen.value
  if (s.name === 'destination') return { is: DestinationView, props: { id: s.id } }
  if (s.name === 'plan') return { is: PlanView, props: { destinationId: s.destinationId } }
  if (s.name === 'trip') return { is: TripView, props: { id: s.id } }
  if (s.name === 'trips') return { is: TripsView, props: {} }
  if (s.name === 'saved') return { is: SavedView, props: {} }
  return { is: ExploreView, props: {} }
})
const key = computed(() => JSON.stringify(screen.value))

// The next screen is in the DOM: put it where you left it (or at the top).
function restoreScroll() {
  document.querySelector('[data-travel-scroll]')?.scrollTo({ top: pendingScroll.value })
}

const tourSteps: TourStep[] = [
  { target: '#dw-search', title: 'Find a place', content: 'Search destinations by name, country or what you like doing.', placement: 'bottom' },
  { target: '#dw-stories', title: 'Stories', content: 'Tap a circle for full-screen stories. Swipe up and down to move between them.', placement: 'bottom' },
  { target: '#dw-featured', title: 'Browse by swiping', content: 'Every row is a carousel: drag it, use a trackpad, or focus it and use the arrow keys.', placement: 'bottom' },
  { target: '#dw-fab', title: 'Plan a trip', content: 'Start a new trip, jump somewhere random or watch the stories.', placement: compact.value ? 'top' : 'right' },
  { target: '#dw-nav', title: 'Your places and trips', content: 'Saved destinations and your trips, with their itineraries and boarding passes.', placement: compact.value ? 'top' : 'right' },
]
onMounted(() => setTimeout(() => screen.value.name === 'explore' && maybeStartTour(), 800))
</script>

<template>
  <div class="flex h-dvh bg-surface text-on-surface">
    <MNavigationRail v-if="!compact" id="dw-nav" v-model="current" :items="navItems" class="shrink-0">
      <template #fab>
        <MFabMenu id="dw-fab" icon="add" :items="fabItems" direction="down" align="start" color="tertiary" />
      </template>
    </MNavigationRail>

    <div class="flex min-w-0 flex-1 flex-col">
      <main data-travel-scroll class="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <Transition name="dw-page" mode="out-in" @enter="restoreScroll">
          <KeepAlive :max="2" include="ExploreView">
            <component :is="view.is" :key="key" v-bind="view.props" />
          </KeepAlive>
        </Transition>
      </main>
      <MNavigationBar v-if="compact" id="dw-nav" v-model="current" :items="navItems" class="shrink-0" />
    </div>

    <!-- MFab's root is position: relative, so the wrapper does the positioning -->
    <div v-if="compact" class="fixed right-4 bottom-24 z-30">
      <MFabMenu id="dw-fab" icon="add" :items="fabItems" color="tertiary" align="end" />
    </div>

    <StoryViewer />
    <MTour :model-value="tourOpen" :steps="tourSteps" finish-label="Let’s go" @finish="tourDone" @update:model-value="(v) => !v && tourDone()" />
  </div>
</template>

<style>
.dw-fill.material-symbols-outlined,
.dw-fill .material-symbols-outlined {
  font-variation-settings: 'FILL' 1;
}
.dw-page-enter-active,
.dw-page-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.dw-page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.dw-page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .dw-page-enter-active,
  .dw-page-leave-active {
    transition: none;
  }
}
</style>
