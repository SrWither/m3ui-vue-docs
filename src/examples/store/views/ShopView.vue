<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MIcon, MSelect, MSimpleCarousel, MSupportingPane } from '@m3ui-vue/m3ui-vue'
import { useStore } from '../useStore'
import { banner } from '../art'
import ProductCard from '../components/ProductCard.vue'
import Filters from '../components/Filters.vue'

const { filters, activeFilters, visible, resetFilters } = useStore()
const filtersOpen = ref(false)

const hero = [
  { src: banner('#e9e1fb', '#fbe4d7', 'lamp', '#e8c35a'), alt: 'Arc desk lamp', label: 'New season', supportingText: 'Lamps and planters for brighter days' },
  { src: banner('#f6e3d3', '#f3efe0', 'mug', '#c8794f'), alt: 'Stoneware mug', label: 'Slow mornings', supportingText: 'Mugs and cups from $18' },
  { src: banner('#dcefe5', '#e3ecf6', 'speaker', '#e07a62'), alt: 'Pocket speaker', label: 'Up to 25% off', supportingText: 'Speakers and planters' },
  { src: banner('#e2e9f6', '#efe6f0', 'notebook', '#2f4a7a'), alt: 'Linen notebook', label: 'Desk refresh', supportingText: 'Notebooks and totes' },
]
const sorts = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <MSimpleCarousel :items="hero" layout="hero" height="280px" autoplay :interval="6000" />

    <!-- Filters beside the grid on wide screens; on phones in a bottom sheet behind a button -->
    <MSupportingPane v-model:open="filtersOpen" single-pane="sheet" sheet-title="Filters" supporting-width="260px">
      <template #main="{ twoPane }">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <h1 class="flex-1 text-headline-small text-on-surface">
            {{ filters.query ? `Results for “${filters.query}”` : 'All products' }}
          </h1>
          <MButton v-if="!twoPane" variant="tonal" icon="tune" @click="filtersOpen = true">
            Filters{{ activeFilters ? ` · ${activeFilters}` : '' }}
          </MButton>
          <MSelect v-model="filters.sort" :options="sorts" label="Sort by" class="w-52" />
        </div>

        <div v-if="visible.length" class="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
          <ProductCard v-for="p in visible" :key="p.id" :product="p" />
        </div>
        <div v-else class="flex flex-col items-center gap-3 py-16 text-center">
          <MIcon name="search_off" :size="48" class="text-on-surface-variant" />
          <p class="text-title-medium text-on-surface">Nothing matches these filters</p>
          <MButton variant="tonal" @click="resetFilters(); filters.query = ''">Clear search and filters</MButton>
        </div>
      </template>

      <template #supporting="{ twoPane }">
        <div :class="twoPane && 'rounded-3xl bg-surface-container-low p-5'">
          <h2 v-if="twoPane" class="mb-4 text-title-large text-on-surface">Filters</h2>
          <Filters />
        </div>
      </template>
    </MSupportingPane>
  </div>
</template>
