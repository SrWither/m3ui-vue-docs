<script setup lang="ts">
/*
 * Shorts: a vertical full-screen MCarousel, one short per swipe (or wheel / arrow keys). Only the
 * short in view plays (a live MShader looping on its own clock); the others show their thumbnail.
 * Tap to pause. Comments open in a bottom sheet. On wide screens it's a phone-shaped column; on
 * phones it fills the screen edge to edge (the carousel masks items with --radius-xl, zeroed here).
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MAvatar, MBottomSheet, MButton, MCarousel, MIcon, MShader } from '@m3ui-vue/m3ui-vue'
import { channelById, compact, shorts, thumbOf, type Video } from '../data'
import { rgb, sceneCode, type SceneUniforms } from '../shaders'
import { useFlick } from '../useFlick'
import Comments from '../components/Comments.vue'

const props = defineProps<{ id?: string; wide: boolean }>()
const f = useFlick()
const { liked, disliked, subscriptions } = f

const index = ref(Math.max(0, shorts.findIndex((s) => s.id === props.id)))
const short = computed(() => shorts[index.value]!)

// The current short's own clock; it loops, like Shorts do.
const t = ref(0)
const paused = ref(false)
let raf = 0
let last = 0
function step(now: number) {
  if (!paused.value) t.value = (t.value + (now - last) / 1000) % short.value.duration
  last = now
  raf = requestAnimationFrame(step)
}
watch(index, () => {
  t.value = 0
  paused.value = false
})
onMounted(() => {
  f.playing.value = false
  last = performance.now()
  raf = requestAnimationFrame(step)
})
onBeforeUnmount(() => cancelAnimationFrame(raf))

const uniforms = computed<SceneUniforms>(() => {
  const v = short.value
  return { uTime: t.value, uA: rgb(v.colors[0]), uB: rgb(v.colors[1]), uC: rgb(v.colors[2]), uSeed: v.seed }
})

const commentsOpen = ref(false)
const channelOf = (v: Video) => channelById.get(v.channelId)!
const actions = computed(() => {
  const v = short.value
  return [
    { icon: 'thumb_up', label: compact(f.likeCount(v)), on: liked.has(v.id), aria: 'Like', run: () => f.rateVideo(v.id, 'like') },
    { icon: 'thumb_down', label: 'Dislike', on: disliked.has(v.id), aria: 'Dislike', run: () => f.rateVideo(v.id, 'dislike') },
    { icon: 'comment', label: compact(f.commentCount(v.id)), on: false, aria: 'Comments', run: () => (commentsOpen.value = true) },
    { icon: 'share', label: 'Share', on: false, aria: 'Share', run: () => (f.sharing.value = { id: v.id }) },
  ]
})
</script>

<template>
  <div class="flex h-full justify-center" :class="wide ? 'py-4' : 'bg-black'">
    <div class="relative h-full" :class="wide ? 'aspect-[9/16] max-w-full' : 'w-full'">
      <MCarousel
        v-model="index"
        :items="shorts"
        variant="full-screen"
        orientation="vertical"
        height="100%"
        :item-spacing="wide ? 16 : 0"
        label="Shorts"
        class="h-full"
        :style="wide ? undefined : { '--radius-xl': '0px' }"
      >
        <template #item="{ item, index: i }">
          <div class="relative h-full w-full overflow-hidden bg-black" :class="{ 'rounded-2xl': wide }">
            <MShader v-if="i === index" :key="item.id" :code="sceneCode(item.scene)" :uniforms="uniforms" :paused="paused" class="absolute inset-0">
              <template #loading><img :src="thumbOf(item)" alt="" class="h-full w-full object-cover" /></template>
              <template #fallback><img :src="thumbOf(item)" alt="" class="h-full w-full object-cover" /></template>
            </MShader>
            <img v-else :src="thumbOf(item)" alt="" class="absolute inset-0 h-full w-full object-cover" draggable="false" />

            <button type="button" class="absolute inset-0 cursor-pointer" :aria-label="paused ? 'Play' : 'Pause'" @click="paused = !paused" />
            <span v-if="paused && i === index" class="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span class="flex h-16 w-16 items-center justify-center rounded-full bg-black/45 text-white"><MIcon name="play_arrow" :size="40" class="flk-fill" /></span>
            </span>

            <!-- Who and what, at the bottom -->
            <div class="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4 pr-20 pt-16 text-white">
              <div class="pointer-events-auto flex items-center gap-2">
                <button type="button" class="flex cursor-pointer items-center gap-2" @click="f.go({ name: 'channel', id: item.channelId })">
                  <MAvatar :name="channelOf(item).name" :size="32" />
                  <span class="text-title-small">{{ channelOf(item).handle }}</span>
                </button>
                <MButton v-if="!subscriptions.has(item.channelId)" size="xs" color="#fff" class="text-black!" @click="f.toggleSubscribe(item.channelId)">Subscribe</MButton>
              </div>
              <p class="mt-2 text-body-medium">{{ item.title }}</p>
            </div>

            <!-- Actions down the right side -->
            <div class="absolute right-2 bottom-4 flex flex-col items-center gap-4 text-white">
              <button
                v-for="a in i === index ? actions : []"
                :key="a.icon"
                type="button"
                class="flex cursor-pointer flex-col items-center gap-1"
                :aria-label="a.aria"
                @click="a.run"
              >
                <span class="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm" :class="{ 'bg-white! text-black': a.on }">
                  <MIcon :name="a.icon" :class="{ 'flk-fill': a.on }" />
                </span>
                <span class="text-label-medium [text-shadow:0_1px_2px_#0008]">{{ a.label }}</span>
              </button>
            </div>

            <div v-if="i === index" class="absolute inset-x-0 bottom-0 h-0.5 bg-white/25">
              <div class="h-full bg-white" :style="{ width: `${(t / item.duration) * 100}%` }" />
            </div>
          </div>
        </template>
      </MCarousel>
    </div>

    <MBottomSheet v-model="commentsOpen" :title="`Comments · ${compact(f.commentCount(short.id))}`" partial>
      <Comments :video-id="short.id" :header="false" />
    </MBottomSheet>
  </div>
</template>
