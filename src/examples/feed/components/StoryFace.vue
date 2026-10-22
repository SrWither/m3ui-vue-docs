<script setup lang="ts">
/* One person's story as a cube face: the photo, its progress bars and who posted it. */
import { MAvatar, MProgressBar } from '@m3ui-vue/m3ui-vue'
import { person, type Story } from '../data'

defineProps<{ story: Story; frame: number; progress: number }>()
defineEmits<{ profile: [] }>()
</script>

<template>
  <div class="absolute inset-0 overflow-hidden bg-neutral-900">
    <img :src="story.frames[frame]!.src" :alt="story.frames[frame]!.alt" class="absolute inset-0 h-full w-full object-cover" draggable="false" />
    <div class="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/60 to-transparent" />
    <div class="absolute inset-x-0 top-0 p-3">
      <div class="flex gap-1">
        <MProgressBar
          v-for="(_, i) in story.frames"
          :key="i"
          :value="i < frame ? 100 : i === frame ? progress : 0"
          :thickness="3"
          color="#fff"
          track-color="rgb(255 255 255 / 0.35)"
          class="flex-1"
        />
      </div>
      <button type="button" class="relative z-10 mt-3 flex cursor-pointer items-center gap-2 text-white" @click.stop="$emit('profile')">
        <MAvatar :name="person(story.handle).name" :size="32" />
        <span class="text-title-small">{{ story.handle }}</span>
      </button>
    </div>
  </div>
</template>

