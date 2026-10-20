<script setup lang="ts">
/*
 * Recipes example (Simmer): a cooking app built only with m3ui-vue, showing off Material You's
 * content color. Every recipe carries a seed color; its card wears a scheme built from it, and
 * opening it recolors the whole app until you go back.
 * - views/TodayView.vue      greeting, search, moods, hero carousel, shelves and the grid
 * - views/RecipeView.vue     a recipe: morphing hero, facts in shapes, servings, method
 * - views/CookMode.vue       full-screen steps with timers
 * - views/SavedView.vue / GroceriesView.vue   the other two tabs
 * - useScheme.ts             schemes from seed colors (generateScheme), scoped to an element
 * - useRecipes.ts            navigation, saved, servings, groceries and timers
 * - data.ts / art.ts         the recipes and their SVG illustrations
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MIconButton, MLoadingIndicator, MNavigationRail, MShortNavigationBar, MTooltip, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import type { NavRailItem, ShortNavBarItem } from '@m3ui-vue/m3ui-vue'
import { byId, recipes } from './data'
import { preload, ready, useScheme } from './useScheme'
import { useRecipes } from './useRecipes'
import TopBar from './components/TopBar.vue'
import TodayView from './views/TodayView.vue'
import RecipeView from './views/RecipeView.vue'
import SavedView from './views/SavedView.vue'
import GroceriesView from './views/GroceriesView.vue'
import CookMode from './views/CookMode.vue'

const { screen, tab, go, back, canBack, openGroceries, cooking } = useRecipes()

const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact')

const view = computed(() => {
  const s = screen.value
  if (s.name === 'recipe') return { is: RecipeView, props: { id: s.id }, key: `recipe-${s.id}` }
  return { is: { today: TodayView, saved: SavedView, groceries: GroceriesView }[s.name], props: {}, key: s.name }
})

const items = computed<(ShortNavBarItem & NavRailItem)[]>(() => [
  { value: 'today', label: 'Today', icon: 'restaurant_menu' },
  { value: 'saved', label: 'Saved', icon: 'favorite' },
  { value: 'groceries', label: 'Groceries', icon: 'shopping_basket', badge: openGroceries.value || undefined },
])
const current = computed({
  get: () => tab.value,
  set: (v: string | number) => go({ name: v as 'today' | 'saved' | 'groceries' }),
})

// ── Content color for the whole app ────────────────────────────────────────────────────────
// While a recipe (or its cook mode) is open, its scheme goes on <html> itself, so teleported
// pieces (toasts, the bottom sheet, tooltips) wear it too. Nothing is persisted: leaving the
// recipe, or the example, puts the reader's own palette back.
const activeSeed = computed(() => {
  const id = cooking.value ?? (screen.value.name === 'recipe' ? screen.value.id : null)
  return id ? byId(id)?.seed : undefined
})
const activeStyle = useScheme(activeSeed)
let applied: string[] = []
function apply(style: Record<string, string> | undefined) {
  const root = document.documentElement.style
  applied.forEach((k) => root.removeProperty(k))
  applied = []
  if (!style) return
  for (const [k, v] of Object.entries(style)) {
    if (!k.startsWith('--')) continue
    root.setProperty(k, v)
    applied.push(k)
  }
}
watch(activeStyle, apply, { immediate: true })

// Each recipe's scheme is built up front, so the cards come in already colored.
const seeds = recipes.map((r) => r.seed)
preload(seeds)
const loaded = computed(() => ready(seeds))

// Fraunces, a soft, slightly wonky display serif, for the big headings. Loaded here because
// fonts are the app's business, not the library's.
const FONT_ID = 'simmer-font'
onMounted(() => {
  if (document.getElementById(FONT_ID)) return
  const link = document.createElement('link')
  link.id = FONT_ID
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..800,0..100,0..1&display=swap'
  document.head.appendChild(link)
})
onBeforeUnmount(() => {
  apply(undefined)
  cooking.value = null
})

const scroller = ref<HTMLElement>()
const toTop = () => scroller.value?.scrollTo({ top: 0 })
</script>

<template>
  <div class="sim-root flex h-dvh overflow-hidden bg-surface text-on-surface">
    <MNavigationRail v-if="wide" v-model="current" :items="items" alignment="center" class="shrink-0" />

    <div class="flex min-w-0 flex-1 flex-col">
      <TopBar>
        <template v-if="canBack" #leading>
          <div class="flex items-center gap-1">
            <MTooltip text="Back" placement="bottom"><MIconButton icon="arrow_back" label="Back" @click="back" /></MTooltip>
            <span class="sim-display text-title-large font-semibold text-on-surface">Simmer</span>
          </div>
        </template>
      </TopBar>

      <div ref="scroller" class="min-h-0 flex-1 overflow-y-auto">
        <div v-if="!loaded" class="grid h-full place-items-center">
          <MLoadingIndicator :size="64" contained />
        </div>
        <Transition v-else name="sim-page" mode="out-in" @after-leave="toTop">
          <component :is="view.is" :key="view.key" v-bind="view.props" />
        </Transition>
      </div>

      <MShortNavigationBar v-if="!wide" v-model="current" :items="items" class="shrink-0" />
    </div>

    <CookMode />
  </div>
</template>

<style scoped>
.sim-page-enter-active,
.sim-page-leave-active {
  transition: opacity 200ms ease, transform 300ms cubic-bezier(0.2, 0, 0, 1);
}
.sim-page-enter-from {
  opacity: 0;
  transform: scale(0.97) translateY(12px);
}
.sim-page-leave-to {
  opacity: 0;
  transform: scale(1.01);
}
</style>

<style>
.sim-display {
  font-family: 'Fraunces', Georgia, serif;
  font-optical-sizing: auto;
  font-variation-settings: 'SOFT' 100, 'WONK' 1;
}
.sim-fill.material-symbols-outlined,
.sim-fill .material-symbols-outlined {
  font-variation-settings: 'FILL' 1;
}
.sim-root,
.sim-cook {
  /* The recipe's colors arrive through variables; let the big surfaces ease into them. */
  transition: background-color 500ms ease, color 500ms ease;
}
.sim-underline {
  text-decoration: underline wavy;
  text-decoration-thickness: 3px;
  text-underline-offset: 10px;
}

/* Cards: the dish spins a little toward you on hover and squashes when pressed. */
.sim-card-art {
  transition: transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sim-card:hover .sim-card-art {
  transform: rotate(-8deg) scale(1.03);
}
.sim-card:active .sim-card-art {
  transform: rotate(-4deg) scale(0.96);
}
.sim-card {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sim-card:active {
  transform: scale(0.98);
}
.sim-card:focus-visible {
  outline: 3px solid var(--color-secondary);
  outline-offset: 3px;
}

.sim-hero {
  transition: transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sim-hero:active {
  transform: scale(0.95);
}
.sim-spin {
  animation: sim-spin 40s linear infinite;
}
@keyframes sim-spin {
  to {
    transform: rotate(1turn);
  }
}

.sim-fact {
  position: relative;
  display: grid;
  width: 5.5rem;
  height: 5.5rem;
  place-content: center;
  justify-items: center;
  line-height: 1.1;
}

/* Grocery rows: one segmented group per aisle, rounder at both ends. */
.sim-row {
  border-radius: 4px;
}
.sim-row:first-child {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.sim-row:last-child {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

/* Cook mode */
.sim-cook-shape {
  width: 120vmin;
  height: 120vmin;
  right: -35vmin;
  bottom: -35vmin;
}
.sim-dot {
  transition: flex-grow 450ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease;
}
.sim-cook-enter-active,
.sim-cook-leave-active {
  transition: opacity 250ms ease, transform 400ms cubic-bezier(0.2, 0, 0, 1);
}
.sim-cook-enter-from,
.sim-cook-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}
.sim-step-next-enter-active,
.sim-step-next-leave-active,
.sim-step-prev-enter-active,
.sim-step-prev-leave-active {
  transition: opacity 180ms ease, transform 280ms cubic-bezier(0.2, 0, 0, 1);
}
.sim-step-next-enter-from,
.sim-step-prev-leave-to {
  opacity: 0;
  transform: translateX(48px);
}
.sim-step-next-leave-to,
.sim-step-prev-enter-from {
  opacity: 0;
  transform: translateX(-48px);
}

@media (prefers-reduced-motion: reduce) {
  .sim-spin {
    animation: none;
  }
  .sim-card-art,
  .sim-card,
  .sim-hero,
  .sim-dot,
  .sim-root,
  .sim-cook {
    transition: none;
  }
}
</style>
