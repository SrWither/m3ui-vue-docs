<script setup lang="ts">
/* Stories along the top of the feed: a ring around the ones you haven't seen. */
import { MAvatar } from '@m3ui-vue/m3ui-vue'
import { person, stories } from '../data'
import { usePlaza } from '../usePlaza'

const { seenStories, storyViewer } = usePlaza()
</script>

<template>
  <div class="flex gap-3 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
    <button
      v-for="(s, i) in stories"
      :key="s.handle"
      type="button"
      class="flex w-16 shrink-0 cursor-pointer flex-col items-center gap-1"
      :aria-label="`${person(s.handle).name}'s story`"
      @click="storyViewer = { open: true, index: i }"
    >
      <span class="rounded-full p-[3px]" :class="seenStories.has(s.handle) ? 'bg-outline-variant' : 'bg-linear-to-tr from-tertiary via-primary to-secondary'">
        <span class="block rounded-full bg-surface p-[2px]"><MAvatar :name="person(s.handle).name" :size="54" /></span>
      </span>
      <span class="w-full truncate text-center text-label-small text-on-surface-variant">{{ s.handle }}</span>
    </button>
  </div>
</template>
