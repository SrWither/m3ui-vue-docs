<script setup lang="ts">
// Shown in the detail pane when both panes fit and no chat is open yet.
import { MIcon, MShape } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
</script>

<template>
  <section class="my-3 mr-3 flex h-[calc(100%-1.5rem)] flex-col items-center justify-center gap-4 rounded-3xl bg-surface-container-low p-8 text-center">
    <div class="relative h-28 w-28">
      <MShape shape="Cookie9Sided" class="h-28 w-28 text-primary-container" />
      <div class="absolute inset-0 flex items-center justify-center">
        <MIcon name="forum" :size="48" class="text-on-primary-container" />
      </div>
    </div>
    <div>
      <h2 class="text-headline-small text-on-surface">Pick a chat</h2>
      <p class="mt-1 max-w-sm text-body-medium text-on-surface-variant">
        Messages, photos and voice notes, with replies that type back. Everything is simulated in the browser.
      </p>
    </div>
    <a :href="exampleSource('chat')" target="_blank" rel="noopener" class="flex items-center gap-1 text-label-large text-primary">
      <MIcon name="code" :size="18" /> View the source
    </a>
  </section>
</template>
