<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MVideoPlayer', description: 'Media3\'s Material 3 video player: subtitles, chapters, gestures, keys, full screen, picture in picture and HLS.' },
  { name: 'MAudioPlayer', description: 'An audio player: Media3\'s mini controller, or a full bar with shuffle, repeat, speed and volume.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Media</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Players for video and audio, ported from Media3's Material 3 UI for Compose, with the lock screen's media
      controls, and useMediaPlayer for a player of your own. All from the /media entry point, with no dependencies
      (hls.js only if you stream HLS where the browser can't).
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/media/${c.name.toLowerCase()}`"
        class="no-underline"
      >
        <MCard clickable class="flex h-full flex-col gap-2 p-4">
          <div class="flex items-center gap-2">
            <MIcon :name="iconMap[c.name] ?? 'code'" :size="22" class="text-primary" />
            <span class="text-title-medium font-medium">{{ c.name }}</span>
          </div>
          <p class="text-body-small text-on-surface-variant">{{ c.description }}</p>
        </MCard>
      </router-link>
    </div>
  </div>
</template>
