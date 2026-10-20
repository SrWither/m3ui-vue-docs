<script setup lang="ts">
/*
 * Home: a greeting, search and mood chips, tonight's picks in a hero carousel, a shelf of quick
 * dishes cut into shapes, and every recipe as a card in its own colors.
 */
import { computed, ref } from 'vue'
import { MCarousel, MChip, MIcon, MTextField, type ShapeName } from '@m3ui-vue/m3ui-vue'
import { moods, recipes, type Mood, type Recipe } from '../data'
import { dishArt } from '../art'
import { useRecipes } from '../useRecipes'
import RecipeCard from '../components/RecipeCard.vue'
import Scheme from '../components/Scheme.vue'

const { go } = useRecipes()

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
const meal = hour < 11 ? 'breakfast' : hour < 16 ? 'lunch' : 'dinner'

const query = ref('')
const mood = ref<Mood | null>(null)
const filtering = computed(() => !!query.value.trim() || !!mood.value)
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  return recipes.filter(
    (r) =>
      (!mood.value || r.moods.includes(mood.value)) &&
      (!q || r.title.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q) || r.ingredients.some((i) => i.name.includes(q))),
  )
})

const picks = ['shakshuka', 'plum-galette', 'green-curry', 'blueberry-pancakes', 'mango-salad', 'miso-ramen'].map((id) => recipes.find((r) => r.id === id)!)
const pickItems = picks.map((r) => ({ src: dishArt(r), alt: r.title, recipe: r }))
const quick = recipes.filter((r) => r.minutes <= 20)
const sweet = recipes.filter((r) => r.moods.includes('sweet'))

const shelfShapes: ShapeName[] = ['Cookie9Sided', 'Clover4Leaf', 'Sunny', 'Arch', 'SoftBurst', 'Pentagon', 'Flower', 'Puffy', 'Gem', 'Cookie6Sided']
const cardShapes: ShapeName[] = ['Cookie12Sided', 'Clover8Leaf', 'Circle', 'Sunny', 'Arch', 'Puffy', 'SoftBoom', 'Square']
const open = (r: Recipe) => go({ name: 'recipe', id: r.id })
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-2 pb-10 sm:px-6">
    <section class="flex flex-col gap-5">
      <div>
        <p class="text-title-medium text-on-surface-variant">{{ greeting }}</p>
        <h1 class="sim-display text-display-small font-semibold tracking-tight text-on-surface sm:text-display-medium">
          What's for <span class="sim-underline text-primary">{{ meal }}</span>?
        </h1>
      </div>
      <MTextField v-model="query" label="Search dishes, cuisines, ingredients" leading-icon="search" clearable variant="outlined" class="max-w-xl" />
      <div class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        <MChip
          v-for="m in moods"
          :key="m.id"
          type="filter"
          :icon="m.icon"
          :selected="mood === m.id"
          class="shrink-0"
          @update:selected="mood = mood === m.id ? null : m.id"
        >{{ m.label }}</MChip>
      </div>
    </section>

    <div>
      <template v-if="filtering">
        <section class="flex flex-col gap-4">
          <h2 class="text-title-large text-on-surface">{{ results.length }} {{ results.length === 1 ? 'dish' : 'dishes' }}</h2>
          <div v-if="results.length" class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            <RecipeCard v-for="(r, i) in results" :key="r.id" :recipe="r" :shape="cardShapes[i % cardShapes.length]" />
          </div>
          <div v-else class="flex flex-col items-center gap-2 py-12 text-center text-on-surface-variant">
            <MIcon name="search_off" :size="40" />
            <p class="text-body-large">Nothing like that yet. Try another word or mood.</p>
          </div>
        </section>
      </template>

      <div v-else class="flex flex-col gap-10">
        <section class="flex flex-col gap-3">
          <h2 class="sim-display text-headline-small font-semibold text-on-surface">Tonight's picks</h2>
          <MCarousel :items="pickItems" variant="hero" height="340px" label="Tonight's picks" @item-click="(item) => open(item.recipe)">
            <template #item="{ item }">
              <Scheme :seed="item.recipe.seed" class="relative h-full w-full">
                <img :src="item.src" alt="" class="h-full w-full object-cover" />
                <div class="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-primary-container/92 p-4 text-on-primary-container backdrop-blur-sm">
                  <span class="text-label-large opacity-80">{{ item.recipe.cuisine }} · {{ item.recipe.minutes }} min</span>
                  <span class="sim-display line-clamp-1 text-headline-small font-semibold">{{ item.recipe.title }}</span>
                </div>
              </Scheme>
            </template>
          </MCarousel>
        </section>

        <section class="flex flex-col gap-4">
          <div class="flex items-baseline gap-3">
            <h2 class="sim-display text-headline-small font-semibold text-on-surface">Ready in 20</h2>
            <span class="text-body-medium text-on-surface-variant">for the nights you just can't</span>
          </div>
          <div class="-mx-4 flex gap-4 overflow-x-auto px-4 pt-1 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6">
            <RecipeCard v-for="(r, i) in quick" :key="r.id" :recipe="r" variant="shape" :shape="shelfShapes[i % shelfShapes.length]" />
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="sim-display text-headline-small font-semibold text-on-surface">Everything</h2>
          <div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            <RecipeCard v-for="(r, i) in recipes" :key="r.id" :recipe="r" :shape="cardShapes[i % cardShapes.length]" />
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <div class="flex items-baseline gap-3">
            <h2 class="sim-display text-headline-small font-semibold text-on-surface">Something sweet</h2>
            <span class="text-body-medium text-on-surface-variant">worth the wait</span>
          </div>
          <div class="-mx-4 flex gap-4 overflow-x-auto px-4 pt-1 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6">
            <RecipeCard v-for="(r, i) in sweet" :key="r.id" :recipe="r" variant="shape" :shape="shelfShapes[(i + 4) % shelfShapes.length]" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
