<script setup lang="ts">
/*
 * Saved recipes, newest first, as cards in their own colors.
 */
import { computed } from 'vue'
import { MButton, MEmptyState, type ShapeName } from '@m3ui-vue/m3ui-vue'
import { byId } from '../data'
import { useRecipes } from '../useRecipes'
import RecipeCard from '../components/RecipeCard.vue'

const { saved, go } = useRecipes()
const list = computed(() => saved.value.map(byId).filter((r) => !!r))
const shapes: ShapeName[] = ['Clover8Leaf', 'Cookie12Sided', 'Arch', 'Sunny', 'Puffy', 'Circle']
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-2 pb-10 sm:px-6">
    <div>
      <h1 class="sim-display text-display-small font-semibold tracking-tight text-on-surface">Saved</h1>
      <p class="text-body-large text-on-surface-variant">{{ list.length ? `${list.length} dishes you want to make again` : 'Nothing saved yet' }}</p>
    </div>
    <div v-if="list.length" class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      <RecipeCard v-for="(r, i) in list" :key="r.id" :recipe="r" :shape="shapes[i % shapes.length]" />
    </div>
    <div v-else class="flex flex-col items-center gap-4 py-10">
      <MEmptyState icon="favorite" title="Tap the heart on a recipe" description="Saved dishes land here, ready for the next time you're hungry." />
      <MButton variant="tonal" icon="restaurant_menu" @click="go({ name: 'today' })">Find something</MButton>
    </div>
  </div>
</template>
