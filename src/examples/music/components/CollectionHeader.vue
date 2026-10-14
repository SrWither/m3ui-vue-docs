<script setup lang="ts">
/*
 * The top of an album, playlist or Liked Songs: the cover, blurred into the background, with
 * the title and details beside it (stacked on phones).
 */
defineProps<{ image: string; kind: string; title: string; round?: boolean }>()
</script>

<template>
  <header class="relative overflow-hidden">
    <img :src="image" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full scale-150 object-cover opacity-45 blur-3xl" />
    <div class="absolute inset-0 bg-linear-to-b from-transparent to-surface-container-low" />
    <div class="relative flex flex-col items-center gap-4 px-4 pt-6 pb-4 sm:flex-row sm:items-end sm:gap-6 sm:px-6 sm:pt-10">
      <img
        :src="image"
        alt=""
        class="h-48 w-48 shrink-0 object-cover shadow-elevation-4 sm:h-52 sm:w-52"
        :class="round ? 'rounded-full' : 'rounded-xl'"
      />
      <div class="min-w-0 self-stretch text-center sm:self-auto sm:text-left">
        <p class="text-label-large text-on-surface">{{ kind }}</p>
        <h1 class="my-1 line-clamp-2 text-headline-large font-bold text-on-surface sm:text-display-small">{{ title }}</h1>
        <div class="text-body-medium text-on-surface-variant">
          <slot />
        </div>
      </div>
    </div>
  </header>
</template>
