<script setup lang="ts">
// The desktop background, from the palette's own colors, so it follows palette and theme changes.
import { MShape } from '@m3ui-vue/m3ui-vue'
import { useDesktop } from '../useDesktop'

const { wallpaper } = useDesktop()
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <!-- Aurora: soft blobs of the three container colors -->
    <template v-if="wallpaper === 'aurora'">
      <div class="absolute inset-0 bg-surface-container-lowest" />
      <div class="absolute -top-1/4 -left-1/4 h-[80%] w-[70%] rounded-full bg-primary-container opacity-80 blur-3xl" />
      <div class="absolute top-1/4 -right-1/4 h-[80%] w-[60%] rounded-full bg-tertiary-container opacity-70 blur-3xl" />
      <div class="absolute -bottom-1/3 left-1/4 h-[70%] w-[60%] rounded-full bg-secondary-container opacity-70 blur-3xl" />
    </template>

    <!-- Shapes: M3 expressive shapes, big and slowly turning -->
    <template v-else-if="wallpaper === 'shapes'">
      <div class="absolute inset-0 bg-primary-container" />
      <MShape shape="Cookie9Sided" class="m3d-spin absolute -top-24 -right-24 h-[28rem] w-[28rem] text-primary/25" />
      <MShape shape="Flower" class="m3d-spin-rev absolute -bottom-32 -left-20 h-[32rem] w-[32rem] text-tertiary/25" />
      <MShape shape="Clover4Leaf" class="m3d-spin absolute top-1/3 left-1/2 h-56 w-56 text-secondary/25" />
    </template>

    <div v-else class="absolute inset-0 bg-surface-container" />
  </div>
</template>

<style scoped>
.m3d-spin {
  animation: m3d-spin 90s linear infinite;
}
.m3d-spin-rev {
  animation: m3d-spin 120s linear infinite reverse;
}
@keyframes m3d-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .m3d-spin,
  .m3d-spin-rev {
    animation: none;
  }
}
</style>
