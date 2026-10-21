<script setup lang="ts">
/*
 * A recipe card in the recipe's own colors. `card` is the grid tile; `shape` is just the dish cut
 * into an expressive shape with the name under it, for the shelves.
 */
import { MIcon, MScheme, MShape, type ShapeName } from '@m3ui-vue/m3ui-vue'
import type { Recipe } from '../data'
import { dishArt } from '../art'
import { useRecipes } from '../useRecipes'

withDefaults(defineProps<{ recipe: Recipe; variant?: 'card' | 'shape'; shape?: ShapeName }>(), { variant: 'card', shape: 'Cookie12Sided' })
const { go, isSaved } = useRecipes()
</script>

<template>
  <MScheme
    v-if="variant === 'card'"
    as="button"
    :seed="recipe.seed"
    variant="content"
    class="sim-card group flex flex-col gap-3 rounded-[28px] bg-primary-container p-3 pb-4 text-left text-on-primary-container"
    @click="go({ name: 'recipe', id: recipe.id })"
  >
    <div class="relative aspect-square w-full">
      <MShape :shape="shape" class="sim-card-art h-full w-full">
        <img :src="dishArt(recipe)" alt="" class="h-full w-full object-cover" />
      </MShape>
      <span v-if="isSaved(recipe.id)" class="absolute top-1 right-1 grid h-9 w-9 place-items-center rounded-full bg-primary text-on-primary">
        <MIcon name="favorite" :size="18" filled />
      </span>
    </div>
    <div class="px-2">
      <p class="sim-display text-title-large leading-tight font-semibold">{{ recipe.title }}</p>
      <p class="mt-1 flex items-center gap-1 text-label-large opacity-80">
        <MIcon name="schedule" :size="16" /> {{ recipe.minutes }} min · {{ recipe.cuisine }}
      </p>
    </div>
  </MScheme>

  <button v-else class="sim-card group flex w-36 shrink-0 flex-col items-center gap-2 text-center sm:w-40" @click="go({ name: 'recipe', id: recipe.id })">
    <MScheme :seed="recipe.seed" variant="content" class="relative aspect-square w-full">
      <MShape :shape="shape" class="absolute inset-0 scale-105 text-primary" />
      <MShape :shape="shape" class="sim-card-art h-full w-full">
        <img :src="dishArt(recipe)" alt="" class="h-full w-full object-cover" />
      </MShape>
    </MScheme>
    <span class="text-title-small text-on-surface">{{ recipe.title }}</span>
    <span class="-mt-1.5 text-label-medium text-on-surface-variant">{{ recipe.minutes }} min</span>
  </button>
</template>
