<script setup lang="ts">
/* The little bouncing bars next to the song that's playing (frozen while paused). */
defineProps<{ paused?: boolean }>()
</script>

<template>
  <span class="inline-flex h-4 w-4 items-end justify-between" :class="{ 'm3m-paused': paused }" aria-hidden="true">
    <span v-for="i in 4" :key="i" class="m3m-bar w-[3px] rounded-full bg-primary" :style="{ animationDelay: `${-i * 0.23}s` }" />
  </span>
</template>

<style scoped>
.m3m-bar {
  height: 100%;
  transform-origin: bottom;
  animation: m3m-eq 0.9s ease-in-out infinite alternate;
}
.m3m-paused .m3m-bar {
  animation-play-state: paused;
}
@keyframes m3m-eq {
  0% { transform: scaleY(0.2); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(0.45); }
}
@media (prefers-reduced-motion: reduce) {
  .m3m-bar { animation: none; transform: scaleY(0.6); }
}
</style>
