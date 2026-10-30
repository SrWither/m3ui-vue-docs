<script setup lang="ts">
import { computed, ref } from 'vue'
import { MButton, MMenuItem } from '@m3ui-vue/m3ui-vue'
import { MVideoPlayer, type HlsModule } from '@m3ui-vue/m3ui-vue/media'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'
import { bunnyChapters, films, hlsStream, sintelTracks } from '@/components/demos/mediaSamples'

const [bunny, sintel] = films as [typeof films[0], typeof films[0], typeof films[0]]

// Playlist
const index = ref(0)
const film = computed(() => films[index.value]!)
const playing = ref(false)

// HLS: hls.js straight from a CDN, so the docs don't depend on it (an app would `import('hls.js')`)
const loadHls = () => import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/+esm') as Promise<HlsModule>

// #media: a scene drawn from the player's time
const orbit = (t: number, i: number) => {
  const a = t * (0.6 + i * 0.25) + i * 2.1
  return { cx: 160 + Math.cos(a) * (40 + i * 22), cy: 90 + Math.sin(a) * (24 + i * 13) }
}

// Up next, in the #end slot
const upNextIndex = computed(() => (endIndex.value + 1) % films.length)
const endIndex = ref(1)
const endFilm = computed(() => films[endIndex.value]!)
const loopAll = ref(false)

const videoProps: PropDef[] = [
  { name: 'src', type: 'string', description: 'Video URL' },
  { name: 'sources', type: 'VideoSource[]', description: 'Several formats of the video ({ src, type? }); the browser plays the first it can' },
  { name: 'poster', type: 'string', description: 'Image shown before playing' },
  { name: 'tracks', type: 'VideoTrack[]', description: 'Subtitle tracks (WebVTT): a CC button, a submenu in settings and the C key' },
  { name: 'chapters', type: 'SeekBarChapter[]', description: 'Chapters, drawn on the seek bar with their titles in its preview' },
  { name: 'title', type: 'string', description: 'Shown at the top in full screen, and on the lock screen while playing' },
  { name: 'duration', type: 'number', description: 'Length in seconds, for #media content (with a video it comes from the file)' },
  { name: 'player', type: 'MediaPlayer', description: 'Drive this player (from useMediaPlayer()) instead of one of its own, e.g. one kept outside the page. Read once' },
  { name: 'playing', type: 'boolean', description: 'Playing (v-model:playing)' },
  { name: 'currentTime', type: 'number', description: 'Position in seconds (v-model:current-time)' },
  { name: 'rate', type: 'number', description: 'Playback speed (v-model:rate)' },
  { name: 'volume', type: 'number', description: 'Volume, 0 to 1 (v-model:volume)' },
  { name: 'muted', type: 'boolean', description: 'Muted (v-model:muted)' },
  { name: 'autoplay', type: 'boolean', default: 'false', description: 'Starts playing when mounted; muted if the browser blocks sound before a user gesture' },
  { name: 'loop', type: 'boolean', default: 'false', description: 'Starts over at the end' },
  { name: 'controls', type: 'boolean', default: 'true', description: 'Shows the controls. Off: just the video and its gestures' },
  { name: 'hasPrevious', type: 'boolean', default: 'false', description: 'Adds previous and next buttons (emits previous); with only one of the two, the other shows disabled' },
  { name: 'hasNext', type: 'boolean', default: 'false', description: 'Adds previous and next buttons (emits next); with only one of the two, the other shows disabled' },
  { name: 'seekStep', type: 'number', default: '10', description: 'Seconds the skip buttons, J/L and double taps move' },
  { name: 'speeds', type: 'number[]', default: '[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]', description: 'Speeds offered in the settings menu' },
  { name: 'aspectRatio', type: 'string', default: "'16/9'", description: "Box ratio, as CSS aspect-ratio; 'auto' follows the video" },
  { name: 'fit', type: "'contain' | 'cover'", default: "'contain'", description: 'How the video fills the box' },
  { name: 'hideDelay', type: 'number', default: '3000', description: 'Milliseconds without activity before the controls hide while playing' },
  { name: 'color', type: 'string', default: "'primary'", description: 'Played part of the seek bar: an M3 role or any CSS color' },
  { name: 'crossorigin', type: "'anonymous' | 'use-credentials'", description: "The video's CORS mode. Subtitles from another origin need 'anonymous' (and a video host that allows it)" },
  { name: 'hls', type: '() => Promise<HlsModule>', description: "Loads hls.js for .m3u8 where the browser can't play HLS: () => import('hls.js'). Adds a quality menu" },
]

const videoEvents: EventDef[] = [
  { name: 'update:playing / currentTime / rate / volume / muted', payload: '…', description: 'The v-models' },
  { name: 'previous', payload: '—', description: 'The previous button (or the lock screen\'s) was pressed' },
  { name: 'next', payload: '—', description: 'The next button (or the lock screen\'s) was pressed' },
  { name: 'ended', payload: '—', description: 'The video reached its end' },
  { name: 'error', payload: 'MediaError | null', description: 'The video failed to load or play' },
  { name: 'fullscreen', payload: 'boolean', description: 'Full screen was entered (true) or left (false)' },
]

const videoSlots: SlotDef[] = [
  { name: 'media', description: 'Replaces the <video> (a canvas, a shader, a 3D scene) over a clock of duration seconds. Props: { time, playing, rate, duration }' },
  { name: 'top', description: 'Top controls (empty; the title in full screen). Props: { player, shown, fullscreen, compact }' },
  { name: 'center', description: 'Replaces the center controls. Same props' },
  { name: 'bottom', description: 'Replaces the bottom controls. Same props' },
  { name: 'settings', description: 'Extra MMenuItems at the end of the settings menu. Props: { player }' },
  { name: 'end', description: 'Shown over the video when it ends (an "up next", say). Props: { player, replay }' },
  { name: 'error', description: 'Replaces the error message. Props: { error }' },
]

const types: TypeDef[] = [
  {
    name: 'VideoTrack',
    fields: [
      { name: 'src', type: 'string', description: 'WebVTT file' },
      { name: 'srclang', type: 'string', description: 'Language code, e.g. es' },
      { name: 'label', type: 'string', description: 'Shown in the subtitles menu' },
      { name: 'default', type: 'boolean', description: 'Shown from the start' },
      { name: 'kind', type: "'subtitles' | 'captions'", description: 'Default subtitles' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MVideoPlayer</h1>
    <p class="mb-4 text-body-large text-on-surface-variant">
      A video player, ported from Media3's Material 3 player for Compose (androidx/media): controls on top, centered on
      the picture (previous, back, a large play that squares off while playing, forward, next) and at the bottom (the seek bar, volume, subtitles,
      settings, picture in picture and full screen), hidden while playing. On touch, a tap shows them, a double tap
      on either side skips (taps add up) and a long press plays at 2×. With a mouse, a click plays or pauses and a
      double click goes full screen. Keys: Space/K, J/L, arrows, F, M, C, 0–9, &lt; and &gt;. It takes the lock
      screen's media controls while it plays. Available from the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/media</code> entry point.
    </p>
    <p class="mb-8 text-body-small text-on-surface-variant">
      The films are Blender Foundation open movies (CC BY 3.0, blender.org), played from Wikimedia Commons.
    </p>

    <ComponentDemo
      title="Basic"
      description="A file, a poster and chapters on the seek bar. Hover the bar for the chapter titles."
      flush
      :code="`<MVideoPlayer
  :src=&quot;film.src&quot;
  :poster=&quot;film.poster&quot;
  title=&quot;Big Buck Bunny&quot;
  :chapters=&quot;[{ start: 0, title: 'Opening' }, { start: 75, title: 'Morning in the meadow' }, …]&quot;
  class=&quot;rounded-xl&quot;
/>`"
      :script="`import { MVideoPlayer } from '@m3ui-vue/m3ui-vue/media'`"
    >
      <div class="p-4 sm:p-6">
        <MVideoPlayer :src="bunny.src" :poster="bunny.poster" :title="bunny.title" :chapters="bunnyChapters" class="mx-auto max-w-3xl rounded-xl" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Subtitles"
      description="WebVTT tracks: the CC button (or C) turns them on and off, and the settings menu picks the language. Tracks from another site need crossorigin."
      flush
      :code="`<MVideoPlayer
  :src=&quot;sintel.src&quot;
  :poster=&quot;sintel.poster&quot;
  title=&quot;Sintel&quot;
  :tracks=&quot;[
    { src: '/subs/sintel-en.vtt', srclang: 'en', label: 'English', default: true },
    { src: '/subs/sintel-es.vtt', srclang: 'es', label: 'Español' },
  ]&quot;
  crossorigin=&quot;anonymous&quot;
  :current-time=&quot;105&quot;
/>`"
    >
      <div class="p-4 sm:p-6">
        <MVideoPlayer :src="sintel.src" :poster="sintel.poster" :title="sintel.title" :tracks="sintelTracks" crossorigin="anonymous" :current-time="105" class="mx-auto max-w-3xl rounded-xl" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="A Playlist"
      description="has-previous and has-next add the outer center buttons (and the lock screen's); the queue is yours. A new src keeps playing when bound with v-model:playing."
      flush
      :code="`<MVideoPlayer
  v-model:playing=&quot;playing&quot;
  :src=&quot;film.src&quot;
  :poster=&quot;film.poster&quot;
  :title=&quot;film.title&quot;
  :has-previous=&quot;index > 0&quot;
  :has-next=&quot;index < films.length - 1&quot;
  @previous=&quot;index--&quot;
  @next=&quot;index++&quot;
  @ended=&quot;index < films.length - 1 && index++&quot;
/>`"
      :script="`const index = ref(0)
const film = computed(() => films[index.value])
const playing = ref(false)`"
    >
      <div class="flex flex-col gap-3 p-4 sm:p-6">
        <MVideoPlayer
          v-model:playing="playing"
          :src="film.src"
          :poster="film.poster"
          :title="film.title"
          :has-previous="index > 0"
          :has-next="index < films.length - 1"
          class="mx-auto w-full max-w-3xl rounded-xl"
          @previous="index--"
          @next="index++"
          @ended="index < films.length - 1 && index++"
        />
        <p class="text-center text-body-medium text-on-surface-variant">{{ index + 1 }} / {{ films.length }} · {{ film.title }}</p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Up Next and Extra Settings"
      description="The #end slot covers the video when it ends; #settings adds items to the gear menu. Seek near the end to see it."
      flush
      :code="`<MVideoPlayer :src=&quot;film.src&quot; :poster=&quot;film.poster&quot; :loop=&quot;loopAll&quot; @ended=&quot;…&quot;>
  <template #settings>
    <MMenuItem v-model:checked=&quot;loopAll&quot; icon=&quot;repeat&quot;>Loop</MMenuItem>
  </template>
  <template #end=&quot;{ replay }&quot;>
    <div class=&quot;flex h-full flex-col items-center justify-center gap-3 bg-scrim/70 text-white&quot;>
      <p class=&quot;text-title-medium&quot;>Up next: {{ next.title }}</p>
      <div class=&quot;flex gap-2&quot;>
        <MButton variant=&quot;tonal&quot; icon=&quot;replay&quot; @click=&quot;replay&quot;>Replay</MButton>
        <MButton icon=&quot;skip_next&quot; @click=&quot;playNext&quot;>Play next</MButton>
      </div>
    </div>
  </template>
</MVideoPlayer>`"
    >
      <div class="p-4 sm:p-6">
        <MVideoPlayer :src="endFilm.src" :poster="endFilm.poster" :title="endFilm.title" :loop="loopAll" :current-time="endFilm.duration - 8" class="mx-auto max-w-3xl rounded-xl">
          <template #settings>
            <MMenuItem v-model:checked="loopAll" icon="repeat">Loop</MMenuItem>
          </template>
          <template #end="{ replay }">
            <div class="flex h-full flex-col items-center justify-center gap-3 bg-scrim/70 p-4 text-center text-white">
              <p class="text-title-medium">Up next: {{ films[upNextIndex]!.title }}</p>
              <div class="flex gap-2">
                <MButton variant="tonal" icon="replay" @click="replay">Replay</MButton>
                <MButton icon="skip_next" @click="endIndex = upNextIndex">Play next</MButton>
              </div>
            </div>
          </template>
        </MVideoPlayer>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Anything That Plays: #media"
      description="Without a file, the player runs a clock of duration seconds and passes its time to #media: a canvas, a shader or, here, an SVG. Play, pause, seek, speed and the gestures all work on it."
      flush
      :code="`<MVideoPlayer :duration=&quot;60&quot; title=&quot;Orbits&quot;>
  <template #media=&quot;{ time }&quot;>
    <svg viewBox=&quot;0 0 320 180&quot; class=&quot;h-full w-full bg-surface-container-highest&quot;>
      <circle v-for=&quot;i in 4&quot; :key=&quot;i&quot; v-bind=&quot;orbit(time, i)&quot; :r=&quot;14 - i * 2&quot; class=&quot;fill-primary&quot; />
    </svg>
  </template>
</MVideoPlayer>`"
      :script="`const orbit = (t: number, i: number) => {
  const a = t * (0.6 + i * 0.25) + i * 2.1
  return { cx: 160 + Math.cos(a) * (40 + i * 22), cy: 90 + Math.sin(a) * (24 + i * 13) }
}`"
    >
      <div class="p-4 sm:p-6">
        <MVideoPlayer :duration="60" title="Orbits" class="mx-auto max-w-3xl rounded-xl">
          <template #media="{ time }">
            <svg viewBox="0 0 320 180" class="h-full w-full bg-surface-container-highest">
              <circle v-for="i in 4" :key="i" v-bind="orbit(time, i)" :r="14 - i * 2" class="fill-primary" :fill-opacity="1 - i * 0.15" />
              <text x="12" y="168" class="fill-on-surface-variant text-[10px]">{{ time.toFixed(1) }}s</text>
            </svg>
          </template>
        </MVideoPlayer>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="HLS"
      description="An .m3u8 stream plays natively where the browser can (Safari, some Chrome versions); elsewhere the hls prop loads hls.js, which also adds a quality menu."
      flush
      :code="`<MVideoPlayer
  src=&quot;https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8&quot;
  :hls=&quot;() => import('hls.js')&quot;
/>`"
    >
      <div class="p-4 sm:p-6">
        <MVideoPlayer :src="hlsStream" :hls="loadHls" title="HLS test stream" class="mx-auto max-w-3xl rounded-xl" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="videoProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="videoEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="videoSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="types" />

    <ComponentPager current="MVideoPlayer" />
  </div>
</template>
