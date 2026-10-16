<script setup lang="ts">
/*
 * A destination: a large top app bar that hands over to a small one when you scroll, a photo
 * gallery carousel, quick facts, things to do and the way into planning a trip.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MButton, MCarousel, MChip, MIcon, MIconButton, MList, MListItem, MTooltip, MTopAppBar, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { destination, photo } from '../data'
import { useTravel } from '../useTravel'

const props = defineProps<{ id: string }>()
const router = useRouter()
const { back, go, isSaved, toggleSaved } = useTravel()
const { widthClass } = useWindowSizeClass()
const compact = computed(() => widthClass.value === 'compact')

const d = computed(() => destination(props.id))
const gallery = computed(() =>
  Array.from({ length: 6 }, (_, i) => ({ src: photo(d.value, i, 900, 1000), alt: `${d.value.name}, view ${i + 1}` })),
)
const saved = computed(() => isSaved(d.value.id))
const openSource = () => window.open(exampleSource('travel'), '_blank', 'noopener')

// The small bar slides in once the large title has scrolled away.
const collapsed = ref(false)
let scroller: Element | null = null
const onScroll = () => (collapsed.value = (scroller?.scrollTop ?? 0) > 110)
onMounted(() => {
  scroller = document.querySelector('[data-travel-scroll]')
  scroller?.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => scroller?.removeEventListener('scroll', onScroll))

const facts = computed(() => [
  { icon: 'thermostat', label: 'Weather', value: `${d.value.high}° / ${d.value.low}°`, note: 'In the best months' },
  { icon: 'calendar_month', label: 'Best time', value: d.value.bestMonths.join(', '), note: 'Fewer crowds, better weather' },
  { icon: 'flight', label: 'Flight', value: `${d.value.flightHours} h`, note: `To ${d.value.airport}` },
  { icon: 'payments', label: 'Trips from', value: `$${d.value.priceFrom}`, note: 'Per person, with flights' },
])
</script>

<template>
  <div class="pb-28">
    <!-- Small bar, shown after scrolling -->
    <div class="sticky top-0 z-30 h-0">
      <MTopAppBar
        variant="small"
        :title="d.name"
        navigation-icon="arrow_back"
        navigation-label="Back"
        elevated
        class="transition-[opacity,transform] duration-200"
        :class="collapsed ? 'opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'"
        :inert="!collapsed"
        @navigation="back"
      >
        <template #actions>
          <MIconButton :icon="saved ? 'favorite' : 'favorite_border'" :label="saved ? 'Remove from Saved' : 'Save'" :class="{ 'dw-fill text-primary': saved }" @click="toggleSaved(d.id)" />
        </template>
      </MTopAppBar>
    </div>

    <MTopAppBar variant="large" :title="d.name" navigation-icon="arrow_back" navigation-label="Back" @navigation="back">
      <template #actions>
        <MTooltip :text="saved ? 'Remove from Saved' : 'Save'" placement="bottom">
          <MIconButton :icon="saved ? 'favorite' : 'favorite_border'" :label="saved ? 'Remove from Saved' : 'Save'" :class="{ 'dw-fill text-primary': saved }" @click="toggleSaved(d.id)" />
        </MTooltip>
        <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
        <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
      </template>
    </MTopAppBar>

    <div class="mx-auto max-w-5xl">
      <p class="-mt-4 mb-4 flex flex-wrap items-center gap-x-2 px-4 text-body-large text-on-surface-variant">
        <span>{{ d.country }}</span>
        <span>·</span>
        <span class="flex items-center gap-1 text-on-surface"><MIcon name="star" :size="18" class="dw-fill text-primary" />{{ d.rating }}</span>
        <span>({{ d.reviews.toLocaleString('en-US') }} reviews)</span>
      </p>

      <MCarousel :items="gallery" :item-size="compact ? 220 : 300" :height="compact ? '260px' : '340px'" :content-padding="16" :label="`Photos of ${d.name}`" />

      <div class="flex flex-wrap gap-2 px-4 pt-5">
        <MChip v-for="t in d.tags" :key="t" icon="sell">{{ t }}</MChip>
      </div>

      <p class="max-w-2xl px-4 pt-4 text-body-large text-on-surface">{{ d.blurb }}</p>

      <div class="grid grid-cols-2 gap-3 px-4 pt-6 lg:grid-cols-4">
        <div v-for="f in facts" :key="f.label" class="rounded-2xl bg-surface-container p-4">
          <MIcon :name="f.icon" :size="22" class="text-primary" />
          <p class="mt-2 text-label-large text-on-surface-variant">{{ f.label }}</p>
          <p class="text-title-medium text-on-surface">{{ f.value }}</p>
          <p class="text-body-small text-on-surface-variant">{{ f.note }}</p>
        </div>
      </div>

      <h2 class="px-4 pt-8 pb-2 text-title-large text-on-surface">Things to do</h2>
      <MList>
        <MListItem
          v-for="e in d.experiences"
          :key="e.id"
          :title="e.title"
          :subtitle="`${e.duration} h · from $${e.price} per person`"
          :icon="e.icon"
          leading="icon-container"
          icon-container-color="secondary"
        />
      </MList>

      <div class="flex flex-wrap gap-3 px-4 pt-6">
        <MButton icon="edit_calendar" size="md" @click="go({ name: 'plan', destinationId: d.id })">Plan a trip to {{ d.name }}</MButton>
        <MButton variant="tonal" icon="auto_stories" size="md" @click="go({ name: 'explore' })">Keep exploring</MButton>
      </div>
    </div>
  </div>
</template>
