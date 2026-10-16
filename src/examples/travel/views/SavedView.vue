<script setup lang="ts">
/* Saved destinations. */
import { computed } from 'vue'
import { MButton, MEmptyState, MIcon, MIconButton } from '@m3ui-vue/m3ui-vue'
import { destination, photo } from '../data'
import { useTravel } from '../useTravel'
import AppHeader from '../components/AppHeader.vue'

const { saved, toggleSaved, go } = useTravel()
const list = computed(() => saved.value.map(destination))
</script>

<template>
  <div class="pb-28">
    <AppHeader title="Saved" :subtitle="list.length ? `${list.length} ${list.length === 1 ? 'place' : 'places'}` : undefined" />
    <div class="mx-auto max-w-5xl px-4 pt-2">
      <TransitionGroup v-if="list.length" tag="div" name="dw-saved" class="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div v-for="d in list" :key="d.id" class="group relative overflow-hidden rounded-3xl">
          <button type="button" class="block w-full cursor-pointer" :aria-label="`${d.name}, ${d.country}`" @click="go({ name: 'destination', id: d.id })">
            <img :src="photo(d, 0, 600, 700)" :alt="d.name" class="block aspect-[6/7] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-left text-white">
              <span class="block text-title-medium">{{ d.name }}</span>
              <span class="flex items-center gap-1 text-body-small opacity-90"><MIcon name="star" :size="14" /> {{ d.rating }} · {{ d.country }}</span>
            </span>
          </button>
          <!-- MIconButton's root is position: relative, so the wrapper does the positioning -->
          <span class="absolute top-2 right-2">
            <MIconButton icon="favorite" label="Remove from Saved" variant="filled" size="sm" class="dw-fill" @click="toggleSaved(d.id)" />
          </span>
        </div>
      </TransitionGroup>

      <MEmptyState v-else icon="favorite" title="Nothing saved yet" description="Tap the heart on any destination to keep it here.">
        <template #actions>
          <MButton icon="travel_explore" @click="go({ name: 'explore' })">Explore destinations</MButton>
        </template>
      </MEmptyState>
    </div>
  </div>
</template>

<style scoped>
.dw-saved-move,
.dw-saved-enter-active,
.dw-saved-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.dw-saved-enter-from,
.dw-saved-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
