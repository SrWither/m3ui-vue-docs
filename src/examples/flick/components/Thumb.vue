<script setup lang="ts">
/*
 * A video's thumbnail with its length and how much of it you've watched. Resting the mouse on it
 * plays a muted preview: a live MShader over the image, running from the thumbnail's frame. Only
 * the hovered card has one, so the page never holds more than one extra WebGL context.
 */
import { computed, onBeforeUnmount, ref } from 'vue'
import { MShader } from '@m3ui-vue/m3ui-vue'
import { fmt, thumbOf, type Video } from '../data'
import { rgb, sceneCode, type SceneUniforms } from '../shaders'
import { useFlick } from '../useFlick'

const props = defineProps<{ video: Video; preview?: boolean }>()
const { resume } = useFlick()
const watchedPct = computed(() => Math.min(100, ((resume.get(props.video.id) ?? 0) / props.video.duration) * 100))

const live = ref(false)
const t = ref(0)
let timer: number | undefined
let raf = 0
function enter(e: PointerEvent) {
  if (!props.preview || e.pointerType !== 'mouse') return
  timer = window.setTimeout(() => {
    live.value = true
    t.value = Math.min(props.video.duration / 3, 40)
    let last = performance.now()
    const step = (now: number) => {
      t.value += (now - last) / 1000
      last = now
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }, 500)
}
function leave() {
  clearTimeout(timer)
  cancelAnimationFrame(raf)
  live.value = false
}
onBeforeUnmount(leave)

const uniforms = computed<SceneUniforms>(() => {
  const v = props.video
  return { uTime: t.value, uA: rgb(v.colors[0]), uB: rgb(v.colors[1]), uC: rgb(v.colors[2]), uSeed: v.seed }
})
</script>

<template>
  <div
    class="relative overflow-hidden rounded-xl bg-surface-container-highest"
    :class="video.short ? 'aspect-[9/16]' : 'aspect-video'"
    @pointerenter="enter"
    @pointerleave="leave"
  >
    <img :src="thumbOf(video)" alt="" class="absolute inset-0 h-full w-full object-cover" draggable="false" />
    <MShader v-if="live" :code="sceneCode(video.scene)" :uniforms="uniforms" class="absolute inset-0">
      <template #loading><span /></template>
    </MShader>
    <span v-if="!video.short" class="absolute right-1.5 bottom-1.5 rounded-md bg-black/75 px-1 text-label-medium text-white tabular-nums">
      {{ live ? fmt(t) : fmt(video.duration) }}
    </span>
    <div v-if="watchedPct > 0 && !video.short" class="absolute inset-x-0 bottom-0 h-1 bg-white/40">
      <div class="h-full bg-primary" :style="{ width: `${watchedPct}%` }" />
    </div>
  </div>
</template>
