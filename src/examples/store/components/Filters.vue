<script setup lang="ts">
// Filters: in the side pane on wide screens, in a bottom sheet on phones (MSupportingPane).
import { MButton, MCheckbox, MChip, MSlider, MSwitch } from '@m3ui-vue/m3ui-vue'
import { useStore, categories, money } from '../useStore'

const { filters, activeFilters, resetFilters, visible } = useStore()

function toggleCategory(c: string, on: boolean) {
  const list = filters.value.categories
  filters.value.categories = on ? [...list, c] : list.filter((x) => x !== c)
}
const ratings = [
  { value: 0, label: 'Any' },
  { value: 4.5, label: '4.5+' },
  { value: 4.7, label: '4.7+' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <section>
      <h3 class="mb-2 text-title-small text-on-surface">Category</h3>
      <div class="flex flex-col gap-1">
        <MCheckbox
          v-for="c in categories"
          :key="c"
          :model-value="filters.categories.includes(c)"
          :label="c"
          @update:model-value="toggleCategory(c, $event)"
        />
      </div>
    </section>

    <section>
      <h3 class="mb-1 text-title-small text-on-surface">Price</h3>
      <p class="mb-2 text-body-small text-on-surface-variant">
        {{ money(filters.price[0]) }} – {{ filters.price[1] >= 100 ? `${money(100)}+` : money(filters.price[1]) }}
      </p>
      <MSlider v-model="filters.price" variant="range" size="xs" :min="0" :max="100" :step="5" aria-label="Price range" />
    </section>

    <section>
      <h3 class="mb-2 text-title-small text-on-surface">Rating</h3>
      <div class="flex flex-wrap gap-2">
        <MChip v-for="r in ratings" :key="r.value" :selected="filters.minRating === r.value" @click="filters.minRating = r.value">
          {{ r.label }}
        </MChip>
      </div>
    </section>

    <label class="flex items-center justify-between gap-4">
      <span class="text-body-large text-on-surface">In stock only</span>
      <MSwitch v-model="filters.inStock" />
    </label>

    <div class="flex items-center justify-between border-t border-outline-variant/60 pt-4">
      <span class="text-body-medium text-on-surface-variant">{{ visible.length }} products</span>
      <MButton variant="text" icon="restart_alt" :disabled="!activeFilters" @click="resetFilters">Reset</MButton>
    </div>
  </div>
</template>
