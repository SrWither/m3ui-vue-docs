<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Palette Builder</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Pick your seed colors, preview every generated token, and apply the palette to this page in real time.
      Copy the CSS when you're happy and drop it into your project.
    </p>
    <PaletteBuilder />

    <h2 class="mb-2 mt-14 text-headline-small font-medium">Component Preview</h2>
    <p class="mb-6 text-body-large text-on-surface-variant">
      All components below react to the active palette in real time — including any custom preview from the builder above.
    </p>
    <PaletteShowcase />
  </div>
</template>

<script setup lang="ts">
import PaletteBuilder from '../components/PaletteBuilder.vue'
import PaletteShowcase from '../components/PaletteShowcase.vue'
</script>
