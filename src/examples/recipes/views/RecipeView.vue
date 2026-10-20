<script setup lang="ts">
/*
 * A recipe. The whole app wears the dish's colors while it's open (RecipesExample wraps itself in
 * the recipe's scheme). The dish morphs into another shape when tapped, the facts sit in shapes
 * too, ingredients scale with the servings and tick off, and steps with a wait offer a timer.
 */
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { MButton, MChip, MCheckbox, MFab, MIconButton, MList, MListItem, MShape, type ShapeName } from '@m3ui-vue/m3ui-vue'
import { byId, formatQty, recipes } from '../data'
import { dishArt } from '../art'
import { useRecipes } from '../useRecipes'
import RecipeCard from '../components/RecipeCard.vue'

const props = defineProps<{ id: string }>()
const recipe = computed(() => byId(props.id)!)
const { isSaved, toggleSaved, servings, servingsOf, factorOf, addToGroceries, startCooking, cookStep } = useRecipes()

const heroShapes: ShapeName[] = ['Cookie12Sided', 'Flower', 'SoftBurst', 'Clover8Leaf', 'Sunny', 'Puffy', 'Circle', 'Cookie7Sided']
const heroShape = ref(0)
const morph = () => (heroShape.value = (heroShape.value + 1) % heroShapes.length)

const stepShapes: ShapeName[] = ['Cookie4Sided', 'Sunny', 'Pentagon', 'Clover4Leaf', 'Gem', 'Cookie6Sided']

const people = computed({
  get: () => servingsOf(recipe.value),
  set: (v: number) => (servings[recipe.value.id] = Math.min(12, Math.max(1, v))),
})
const qty = (i: number) => {
  const ing = recipe.value.ingredients[i]!
  return [formatQty(ing.qty, factorOf(recipe.value)), ing.unit].filter(Boolean).join(' ')
}
const have = reactive(new Set<number>())
const toggleHave = (i: number) => (have.has(i) ? have.delete(i) : have.add(i))

function cookFrom(step: number) {
  startCooking(recipe.value.id)
  cookStep.value = step
}

// Phones: the extended FAB folds to its icon while you scroll down the page and unfolds on the
// way back up, as M3 extended FABs do.
const root = ref<HTMLElement>()
const fabExpanded = ref(true)
let scroller: HTMLElement | null = null
let lastTop = 0
function onScroll() {
  const top = scroller!.scrollTop
  if (Math.abs(top - lastTop) < 8) return
  fabExpanded.value = top < lastTop || top < 80
  lastTop = top
}
onMounted(() => {
  scroller = root.value?.closest<HTMLElement>('.overflow-y-auto') ?? null
  scroller?.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => scroller?.removeEventListener('scroll', onScroll))

const related = computed(() =>
  recipes.filter((r) => r.id !== recipe.value.id && r.moods.some((m) => recipe.value.moods.includes(m))).slice(0, 8),
)
const relatedShapes: ShapeName[] = ['Arch', 'Clover4Leaf', 'Cookie9Sided', 'Sunny', 'Gem', 'Flower', 'Pentagon', 'Puffy']
</script>

<template>
  <div ref="root" class="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-2 pb-28 sm:px-6">
    <section class="grid items-center gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10">
      <div class="relative mx-auto aspect-square w-full max-w-[26rem]">
        <MShape shape="SoftBoom" class="sim-spin absolute -inset-[6%] text-tertiary-container" />
        <button class="sim-hero relative h-full w-full" title="Tap to change the shape" @click="morph">
          <MShape :shape="heroShapes[heroShape]!" class="h-full w-full">
            <img :src="dishArt(recipe)" :alt="recipe.title" class="h-full w-full object-cover" />
          </MShape>
        </button>
      </div>

      <div class="flex flex-col gap-5">
        <div class="flex flex-wrap gap-2">
          <MChip tone="primary">{{ recipe.cuisine }}</MChip>
          <MChip v-for="m in recipe.moods" :key="m" tone="tertiary">{{ m }}</MChip>
        </div>
        <h1 class="sim-display text-display-small font-semibold tracking-tight text-on-surface md:text-display-medium">{{ recipe.title }}</h1>
        <p class="text-body-large text-on-surface-variant">{{ recipe.blurb }}</p>

        <div class="flex gap-3">
          <div class="sim-fact text-secondary-container">
            <MShape shape="Cookie9Sided" class="absolute inset-0" />
            <span class="sim-display relative text-headline-small font-semibold text-on-secondary-container">{{ recipe.minutes }}</span>
            <span class="relative text-label-small text-on-secondary-container">min</span>
          </div>
          <div class="sim-fact text-tertiary-container">
            <MShape shape="Sunny" class="absolute inset-0" />
            <span class="sim-display relative text-headline-small font-semibold text-on-tertiary-container">{{ recipe.kcal }}</span>
            <span class="relative text-label-small text-on-tertiary-container">kcal</span>
          </div>
          <div class="sim-fact text-primary-container">
            <MShape shape="Clover4Leaf" class="absolute inset-0" />
            <span class="sim-display relative text-title-medium font-semibold text-on-primary-container">{{ recipe.level }}</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <MButton size="md" icon="skillet" @click="startCooking(recipe.id)">Start cooking</MButton>
          <MIconButton
            :checked="isSaved(recipe.id)"
            icon="favorite"
            :label="isSaved(recipe.id) ? 'Remove from saved' : 'Save'"
            variant="tonal"
            size="md"
            @update:checked="(v: boolean) => toggleSaved(recipe.id, v)"
          />
          <MButton variant="tonal" size="md" icon="shopping_basket" @click="addToGroceries(recipe)">Add to list</MButton>
        </div>
      </div>
    </section>

    <div class="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <section class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <h2 class="sim-display flex-1 text-headline-small font-semibold text-on-surface">Ingredients</h2>
          <div class="flex items-center gap-1 rounded-full bg-surface-container-high p-1">
            <MIconButton icon="remove" label="Fewer servings" size="xs" :disabled="people <= 1" @click="people--" />
            <span class="min-w-20 text-center text-label-large text-on-surface tabular-nums">{{ people }} {{ people === 1 ? 'serving' : 'servings' }}</span>
            <MIconButton icon="add" label="More servings" size="xs" :disabled="people >= 12" @click="people++" />
          </div>
        </div>
        <MList segmented class="-mx-2">
          <MListItem
            v-for="(ing, i) in recipe.ingredients"
            :key="ing.name"
            clickable
            @click="toggleHave(i)"
          >
            <template #leading>
              <MCheckbox :model-value="have.has(i)" class="pointer-events-none shrink-0" />
            </template>
            <span class="text-body-large text-on-surface transition-opacity" :class="{ 'line-through opacity-55': have.has(i) }">{{ ing.name }}</span>
            <template #trailing>
              <span class="shrink-0 text-label-large text-on-surface-variant" :class="{ 'opacity-55': have.has(i) }">{{ qty(i) }}</span>
            </template>
          </MListItem>
        </MList>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="sim-display text-headline-small font-semibold text-on-surface">Method</h2>
        <ol class="flex flex-col gap-5">
          <li v-for="(step, i) in recipe.steps" :key="i" class="flex gap-4">
            <span class="relative grid h-12 w-12 shrink-0 place-items-center text-primary">
              <MShape :shape="stepShapes[i % stepShapes.length]!" class="absolute inset-0" />
              <span class="sim-display relative text-title-large font-semibold text-on-primary">{{ i + 1 }}</span>
            </span>
            <div class="flex flex-col items-start gap-2 pt-2.5">
              <p class="text-body-large text-on-surface">{{ step.text }}</p>
              <MChip v-if="step.timer" type="assist" icon="timer" @click="cookFrom(i)">{{ step.timer }} min timer</MChip>
            </div>
          </li>
        </ol>
      </section>
    </div>

    <section v-if="related.length" class="flex flex-col gap-4">
      <h2 class="sim-display text-headline-small font-semibold text-on-surface">More like this</h2>
      <div class="-mx-4 flex gap-4 overflow-x-auto px-4 pt-1 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6">
        <RecipeCard v-for="(r, i) in related" :key="r.id" :recipe="r" variant="shape" :shape="relatedShapes[i % relatedShapes.length]" />
      </div>
    </section>

    <div class="fixed right-4 bottom-24 z-10 md:hidden">
      <MFab icon="skillet" label="Start cooking" :expanded="fabExpanded" @click="startCooking(recipe.id)" />
    </div>
  </div>
</template>
