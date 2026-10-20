<script setup lang="ts">
/*
 * The grocery list: everything you added from recipes, merged and grouped by aisle. Tick items
 * off, swipe one away to remove it (with undo), and clear what you've bought. The dots next to an
 * item are the recipes it's for, each in its own color.
 */
import { computed } from 'vue'
import { MButton, MCheckbox, MEmptyState, MIcon, MProgressBar, MSwipeToDismiss, useToast } from '@m3ui-vue/m3ui-vue'
import type { Aisle } from '../data'
import { byId } from '../data'
import { schemeStyle } from '../useScheme'
import { useRecipes, type Grocery } from '../useRecipes'

const { groceries, groceryLabel, go } = useRecipes()
const toast = useToast()

const aisles: { id: Aisle; icon: string }[] = [
  { id: 'Produce', icon: 'nutrition' },
  { id: 'Dairy & eggs', icon: 'egg' },
  { id: 'Bakery', icon: 'bakery_dining' },
  { id: 'Pantry', icon: 'kitchen' },
  { id: 'Spices', icon: 'grain' },
]
const groups = computed(() =>
  aisles.map((a) => ({ ...a, items: groceries.value.filter((g) => g.aisle === a.id) })).filter((a) => a.items.length),
)
const done = computed(() => groceries.value.filter((g) => g.done).length)

function remove(g: Grocery) {
  const index = groceries.value.indexOf(g)
  groceries.value = groceries.value.filter((x) => x !== g)
  toast.show(`Removed ${g.name}`, 'info', {
    action: { label: 'Undo', onClick: () => groceries.value.splice(index, 0, g) },
  })
}
function clearDone() {
  const before = groceries.value
  groceries.value = before.filter((g) => !g.done)
  toast.show(`Cleared ${before.length - groceries.value.length} items`, 'info', {
    action: { label: 'Undo', onClick: () => (groceries.value = before) },
  })
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-2 pb-10 sm:px-6">
    <div class="flex flex-col gap-3">
      <h1 class="sim-display text-display-small font-semibold tracking-tight text-on-surface">Groceries</h1>
      <template v-if="groceries.length">
        <div class="flex items-center gap-3">
          <MProgressBar :value="(done / groceries.length) * 100" variant="wavy" color="tertiary" class="flex-1" />
          <span class="text-label-large text-on-surface-variant tabular-nums">{{ done }}/{{ groceries.length }}</span>
        </div>
        <div>
          <MButton variant="tonal" size="sm" icon="remove_done" :disabled="!done" @click="clearDone">Clear checked</MButton>
        </div>
      </template>
    </div>

    <div v-if="!groceries.length" class="flex flex-col items-center gap-4 py-10">
      <MEmptyState icon="shopping_basket" title="Your list is empty" description="Open a recipe and tap Add to list. Ingredients from several recipes are merged here." />
      <MButton variant="tonal" icon="restaurant_menu" @click="go({ name: 'today' })">Browse recipes</MButton>
    </div>

    <section v-for="group in groups" :key="group.id" class="flex flex-col gap-2">
      <h2 class="flex items-center gap-2 px-1 text-title-medium text-primary">
        <MIcon :name="group.icon" :size="20" /> {{ group.id }}
      </h2>
      <ul class="flex flex-col gap-0.5">
        <li v-for="g in group.items" :key="g.key" class="sim-row overflow-hidden">
          <MSwipeToDismiss @dismiss="remove(g)">
            <template #background="{ direction }">
              <!-- Only while swiping: at rest the row covers it, and nothing should show through -->
              <div v-if="direction !== 'settled'" class="flex h-full flex-1 items-center bg-error-container px-6 text-on-error-container" :class="direction === 'end-to-start' ? 'justify-end' : 'justify-start'">
                <MIcon name="delete" />
              </div>
            </template>
            <button
              class="flex min-h-14 w-full items-center gap-3 bg-surface-container px-3 py-2 text-left transition-colors hover:bg-surface-container-high"
              @click="g.done = !g.done"
            >
              <MCheckbox :model-value="g.done" class="pointer-events-none shrink-0" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-body-large transition-colors" :class="g.done ? 'text-on-surface-variant line-through' : 'text-on-surface'">{{ g.name }}</span>
                <span class="flex items-center gap-1 pt-0.5">
                  <span
                    v-for="id in g.from"
                    :key="id"
                    :style="schemeStyle(byId(id)!.seed)"
                    :title="byId(id)?.title"
                    class="h-2.5 w-2.5 rounded-full bg-primary"
                  />
                  <span class="truncate pl-1 text-label-small text-on-surface-variant">{{ g.from.map((id) => byId(id)?.title).join(', ') }}</span>
                </span>
              </span>
              <span class="shrink-0 text-label-large text-on-surface-variant">{{ groceryLabel(g) }}</span>
            </button>
          </MSwipeToDismiss>
        </li>
      </ul>
    </section>
  </div>
</template>
