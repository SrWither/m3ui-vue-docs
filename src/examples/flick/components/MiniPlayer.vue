<script setup lang="ts">
/*
 * The video keeps playing while you browse: a bar above the navigation on phones, a small
 * floating player in the corner on wide screens. Swipe it sideways (MSwipeToDismiss) or press
 * × to close it; tap it to go back to the video's page.
 */
import { computed } from 'vue'
import { MIcon, MIconButton, MShader, MSwipeToDismiss } from '@m3ui-vue/m3ui-vue'
import { channelById, thumbOf } from '../data'
import { rgb, sceneCode, type SceneUniforms } from '../shaders'
import { useFlick } from '../useFlick'

defineProps<{ wide: boolean }>()
const { video, playing, position, toggle, stop, go } = useFlick()
const channel = computed(() => (video.value ? channelById.get(video.value.channelId)! : null))
const progress = computed(() => (video.value ? (position.value / video.value.duration) * 100 : 0))
const uniforms = computed<SceneUniforms>(() => {
  const v = video.value!
  return { uTime: position.value, uA: rgb(v.colors[0]), uB: rgb(v.colors[1]), uC: rgb(v.colors[2]), uSeed: v.seed }
})
const open = () => video.value && go({ name: 'watch', id: video.value.id })
</script>

<template>
  <div v-if="video && channel" :class="wide ? 'fixed right-4 bottom-4 z-30 w-[360px]' : 'px-2 pb-1'">
    <MSwipeToDismiss :class="wide ? 'rounded-2xl shadow-elevation-3' : 'rounded-xl shadow-elevation-2'" @dismiss="stop">
      <template #background="{ progress: p }">
        <div class="flex h-full items-center justify-center bg-surface-container text-on-surface-variant" :style="{ opacity: p }">
          <MIcon name="close" />
        </div>
      </template>

      <div class="relative bg-surface-container-highest" :class="wide ? '' : 'flex items-center'">
        <button
          type="button"
          class="relative shrink-0 cursor-pointer overflow-hidden bg-black"
          :class="wide ? 'block aspect-video w-full' : 'aspect-video w-28'"
          aria-label="Open the video"
          @click="open"
        >
          <MShader :key="video.id" :code="sceneCode(video.scene)" :uniforms="uniforms" :paused="!playing" class="pointer-events-none h-full w-full">
            <template #loading><img :src="thumbOf(video)" alt="" class="h-full w-full object-cover" /></template>
            <template #fallback><img :src="thumbOf(video)" alt="" class="h-full w-full object-cover" /></template>
          </MShader>
        </button>
        <div class="flex min-w-0 flex-1 items-center gap-1 py-1.5 pr-1 pl-3">
          <button type="button" class="min-w-0 flex-1 cursor-pointer text-left" @click="open">
            <span class="block truncate text-body-large text-on-surface">{{ video.title }}</span>
            <span class="block truncate text-body-small text-on-surface-variant">{{ channel.name }}</span>
          </button>
          <MIconButton :icon="playing ? 'pause' : 'play_arrow'" :label="playing ? 'Pause' : 'Play'" class="flk-fill" @click="toggle" />
          <MIconButton icon="close" label="Close player" @click="stop" />
        </div>
        <div class="absolute inset-x-0 bottom-0 h-0.5 bg-on-surface/15">
          <div class="h-full bg-primary" :style="{ width: `${progress}%` }" />
        </div>
      </div>
    </MSwipeToDismiss>
  </div>
</template>
