<script setup lang="ts">
/* A cover card for albums, playlists and artists, with a play button that rises in on hover. */
import { MIcon } from '@m3ui-vue/m3ui-vue'

defineProps<{ image: string; title: string; subtitle?: string; round?: boolean; playing?: boolean }>()
defineEmits<{ open: []; play: [] }>()
</script>

<template>
  <div
    role="link"
    tabindex="0"
    class="group w-40 shrink-0 cursor-pointer snap-start rounded-xl p-2 outline-none transition-colors hover:bg-on-surface/8 focus-visible:ring-2 focus-visible:ring-secondary sm:w-44"
    @click="$emit('open')"
    @keydown.enter.self="$emit('open')"
  >
    <div class="relative mb-2">
      <img :src="image" alt="" class="aspect-square w-full object-cover shadow-elevation-1" :class="round ? 'rounded-full' : 'rounded-lg'" />
      <button
        type="button"
        :aria-label="playing ? `Pause ${title}` : `Play ${title}`"
        class="m3m-fill absolute right-2 bottom-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-elevation-3 transition-[opacity,translate] duration-200 hover:scale-105 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        :class="playing ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'"
        @click.stop="$emit('play')"
      >
        <MIcon :name="playing ? 'pause' : 'play_arrow'" :size="28" />
      </button>
    </div>
    <p class="truncate text-title-small text-on-surface" :class="{ 'text-center': round }">{{ title }}</p>
    <p v-if="subtitle" class="line-clamp-2 text-body-small text-on-surface-variant" :class="{ 'text-center': round }">{{ subtitle }}</p>
  </div>
</template>
