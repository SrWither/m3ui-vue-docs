<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { MIconButton, MSeekBar } from '@m3ui-vue/m3ui-vue'
import type { SeekBarChapter } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const seekBarProps: PropDef[] = [
  { name: 'modelValue', type: 'number', description: 'Playback position in seconds (v-model)' },
  { name: 'duration', type: 'number', description: 'Media length in seconds; 0, NaN or Infinity (not loaded yet, a live stream) disables seeking' },
  { name: 'buffered', type: 'number | [number, number][]', description: 'How much is loaded: up to a time, or time ranges like a media element\'s buffered' },
  { name: 'chapters', type: 'SeekBarChapter[]', description: 'Chapter starts ({ start, title? }), drawn as gaps in the track; their titles show in the preview' },
  { name: 'playing', type: 'boolean', default: 'false', description: 'The media is playing: the bar moves on its own between updates, and the wavy line waves' },
  { name: 'playbackRate', type: 'number', default: '1', description: 'Playback speed, for that motion between updates' },
  { name: 'live', type: 'boolean', default: 'false', description: 'Updates the v-model continuously while dragging (the media follows the thumb), not only on release' },
  { name: 'variant', type: "'slider' | 'line' | 'wavy'", default: "'slider'", description: 'slider: the M3 slider (bar thumb with a gap around it). line: a plain line with a round thumb. wavy: the played part waves while playing' },
  { name: 'size', type: "'xs' | 'sm' | 'md'", default: "'md'", description: 'Track thickness: md (16px, the smallest MSlider), sm (8px) or xs (4px, over a video)' },
  { name: 'time', type: "'below' | 'sides' | 'none'", default: "'below'", description: 'Where the elapsed and total time go' },
  { name: 'remaining', type: 'boolean', default: 'false', description: 'The end label shows the remaining time (-1:23) instead of the total; clicking it switches (v-model:remaining)' },
  { name: 'format', type: '(seconds: number) => string', description: 'Formats a time. Default m:ss, or h:mm:ss for media an hour or longer' },
  { name: 'keyStep', type: 'number', default: '5', description: 'Seconds the arrow keys move; Page Up/Down move 10%' },
  { name: 'preview', type: 'boolean', default: 'true', description: 'Shows the time (and chapter) above the pointer while hovering or dragging' },
  { name: 'color', type: 'string', default: "'primary'", description: 'Played part and thumb: an M3 role or any CSS color' },
  { name: 'trackColor', type: 'string', description: 'Unplayed track: an M3 role or any CSS color. Default secondary-container' },
  { name: 'timeColor', type: 'string', description: 'The time labels\' color, as a CSS color (white over a video, say). Default on-surface-variant' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables seeking' },
  { name: 'label', type: 'string', description: 'Accessible name. Default the locale\'s seekBar' },
]

const seekBarEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'number', description: 'Emitted on a seek (and continuously while dragging with live) — powers v-model' },
  { name: 'seek', payload: 'number', description: 'Emitted once per seek: on release of a drag, a tap or click, or a key press' },
  { name: 'scrub-start', payload: 'number', description: 'Emitted when a drag starts' },
  { name: 'scrub', payload: 'number', description: 'Emitted while dragging, with the time under the pointer' },
  { name: 'update:remaining', payload: 'boolean', description: 'Emitted when the end label is clicked to switch between total and remaining time' },
]

const seekBarSlots: SlotDef[] = [
  { name: 'preview', description: 'Replaces the bubble above the pointer while hovering or dragging (a frame preview, say). Props: { time, formatted, chapter }' },
]

// A fake player: the position advances in 250ms steps, like a media element's timeupdate, and the seek bar
// fills in between on its own (playing)
function usePlayer(duration: number) {
  const p = reactive({ position: 0, playing: false, duration, buffered: 0 })
  const timer = window.setInterval(() => {
    p.buffered = Math.min(duration, Math.max(p.buffered, p.position) + 1.5)
    if (!p.playing) return
    p.position = Math.min(duration, p.position + 0.25)
    if (p.position >= duration) p.playing = false
  }, 250)
  onBeforeUnmount(() => clearInterval(timer))
  return p
}

const song = usePlayer(214)
const remaining = ref(false)

const sizes = reactive({ slider: [60, 60, 60], line: [90, 90, 90], wavy: [120, 120, 120] })

const wavy = usePlayer(187)

const video = usePlayer(1265)
const chapters: SeekBarChapter[] = [
  { start: 0, title: 'Intro' },
  { start: 95, title: 'Setting up' },
  { start: 340, title: 'The first build' },
  { start: 720, title: 'Debugging' },
  { start: 1100, title: 'Wrap-up' },
]
const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
// A made-up frame for the preview: a hue per chapter
const frameHue = (t: number) => (chapters.filter((c) => c.start <= t).length * 67) % 360

const lastSeek = ref<string>('—')
const scrubbing = ref(false)
const plain = ref(30)
const liveStream = computed(() => Infinity)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSeekBar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A media seek bar: the playback position with what's buffered, chapters, the elapsed and total (or remaining)
      time, and a preview above the pointer. Dragging scrubs and seeks once on release, like Media3's
      <code>ProgressSlider</code>; a tap seeks to that point. It isn't an M3 spec component: its default look is the
      M3 slider (as <code>MSlider</code>'s smallest size), with thinner sizes and a line and a wavy style for players.
    </p>

    <ComponentDemo
      title="Music Player"
      description="The default: the M3 slider look with the time below. playing makes it advance on its own between position updates (here every 250ms, like timeupdate). Click the total time to show what's left."
      :code="`<script setup>
const audio = ref<HTMLAudioElement>()
const position = ref(0)
const duration = ref(0)
const playing = ref(false)
<\/script>

<template>
  <audio
    ref=&quot;audio&quot;
    src=&quot;/song.mp3&quot;
    @timeupdate=&quot;position = audio.currentTime&quot;
    @loadedmetadata=&quot;duration = audio.duration&quot;
    @play=&quot;playing = true&quot;
    @pause=&quot;playing = false&quot;
  />
  <MSeekBar
    v-model=&quot;position&quot;
    :duration=&quot;duration&quot;
    :playing=&quot;playing&quot;
    @seek=&quot;(t) => (audio.currentTime = t)&quot;
  />
</template>`"
    >
      <div class="mx-auto my-4 flex w-full max-w-md flex-col gap-5 rounded-3xl bg-surface-container px-6 pt-6 pb-4">
        <div class="flex items-center gap-4">
          <div class="size-14 shrink-0 rounded-xl bg-linear-to-br from-primary to-tertiary" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-title-medium text-on-surface">Neon Harbor</p>
            <p class="truncate text-body-medium text-on-surface-variant">The Night Shift</p>
          </div>
          <MIconButton :icon="song.playing ? 'pause' : 'play_arrow'" variant="filled" :label="song.playing ? 'Pause' : 'Play'" @click="song.playing = !song.playing" />
        </div>
        <MSeekBar v-model="song.position" v-model:remaining="remaining" :duration="song.duration" :playing="song.playing" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Variants and Sizes"
      description="slider is the M3 slider (md is MSlider's smallest size); line is a plain line with a round thumb that grows under the pointer; wavy waves the played part while playing. sm and xs are thinner, for compact players and video."
      :code="`<MSeekBar v-model=&quot;t&quot; :duration=&quot;240&quot; />
<MSeekBar v-model=&quot;t&quot; :duration=&quot;240&quot; size=&quot;sm&quot; />
<MSeekBar v-model=&quot;t&quot; :duration=&quot;240&quot; size=&quot;xs&quot; />
<MSeekBar v-model=&quot;t&quot; :duration=&quot;240&quot; variant=&quot;line&quot; />
<MSeekBar v-model=&quot;t&quot; :duration=&quot;240&quot; variant=&quot;wavy&quot; :playing=&quot;playing&quot; />`"
    >
      <div class="grid w-full gap-x-10 gap-y-10 py-4 md:grid-cols-3">
        <div v-for="variant in (['slider', 'line', 'wavy'] as const)" :key="variant" class="flex flex-col gap-6">
          <p class="text-label-large text-on-surface">{{ variant }}</p>
          <div v-for="(size, i) in (['md', 'sm', 'xs'] as const)" :key="size">
            <p class="mb-1 text-label-small text-on-surface-variant">{{ size }}</p>
            <MSeekBar v-model="sizes[variant][i]" :duration="240" :variant="variant" :size="size" :buffered="(sizes[variant][i] ?? 0) + 50" :playing="variant === 'wavy'" time="none" />
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Wavy"
      description="The played part waves while playing, as Android's media controls do, and flattens when paused or while you drag it."
      :code="`<MSeekBar v-model=&quot;position&quot; :duration=&quot;duration&quot; :playing=&quot;playing&quot; variant=&quot;wavy&quot; size=&quot;sm&quot; time=&quot;sides&quot; />`"
    >
      <div class="mx-auto my-6 flex w-full max-w-lg items-center gap-3">
        <MIconButton :icon="wavy.playing ? 'pause' : 'play_arrow'" :label="wavy.playing ? 'Pause' : 'Play'" @click="wavy.playing = !wavy.playing" />
        <MSeekBar v-model="wavy.position" :duration="wavy.duration" :playing="wavy.playing" variant="wavy" size="sm" time="sides" class="flex-1" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Video Player"
      description="A thin line over the video with what's buffered, chapters, live scrubbing (the video follows the thumb) and a frame preview in the preview slot. The time goes in the controls row instead (time='none')."
      :code="`<MSeekBar
  v-model=&quot;position&quot;
  :duration=&quot;duration&quot;
  :buffered=&quot;video.buffered&quot;
  :chapters=&quot;chapters&quot;
  :playing=&quot;playing&quot;
  variant=&quot;line&quot;
  size=&quot;xs&quot;
  time=&quot;none&quot;
  color=&quot;#ff0033&quot;
  track-color=&quot;rgb(255 255 255 / 0.3)&quot;
  live
>
  <template #preview=&quot;{ time, formatted, chapter }&quot;>
    <div class=&quot;w-40 overflow-hidden rounded-lg border-2 border-white&quot;>
      <img :src=&quot;frameAt(time)&quot; class=&quot;aspect-video w-full object-cover&quot; />
      <p class=&quot;text-center text-white&quot;>{{ chapter?.title }} · {{ formatted }}</p>
    </div>
  </template>
</MSeekBar>`"
    >
      <div class="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-black">
        <div class="relative aspect-video">
          <div
            class="absolute inset-0 transition-colors duration-500"
            :style="{ background: `radial-gradient(circle at 30% 40%, hsl(${frameHue(video.position)} 60% 45%), hsl(${frameHue(video.position) + 40} 50% 12%))` }"
          />
          <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-3 pt-16">
            <MSeekBar
              v-model="video.position"
              :duration="video.duration"
              :buffered="video.buffered"
              :chapters="chapters"
              :playing="video.playing"
              variant="line"
              size="xs"
              time="none"
              color="#ff0033"
              track-color="rgb(255 255 255 / 0.3)"
              live
            >
              <template #preview="{ time, formatted, chapter }">
                <div class="w-40 overflow-hidden rounded-lg border-2 border-white/90 bg-black shadow-elevation-3">
                  <div class="aspect-video w-full" :style="{ background: `radial-gradient(circle at 30% 40%, hsl(${frameHue(time)} 60% 45%), hsl(${frameHue(time) + 40} 50% 12%))` }" />
                  <p class="truncate px-2 py-1 text-center text-label-medium text-white">{{ chapter?.title }} · {{ formatted }}</p>
                </div>
              </template>
            </MSeekBar>
            <div class="flex items-center gap-1 pb-2 text-white">
              <MIconButton :icon="video.playing ? 'pause' : 'play_arrow'" :label="video.playing ? 'Pause' : 'Play'" class="text-white!" @click="video.playing = !video.playing" />
              <span class="text-label-large tabular-nums">{{ fmt(video.position) }} / {{ fmt(video.duration) }}</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Events"
      description="seek fires once per seek; scrub-start and scrub follow a drag, for things like pausing while scrubbing or loading frames. Keys: arrows move keyStep seconds, Page Up/Down 10%, Home/End to the ends."
      :code="`<MSeekBar
  v-model=&quot;position&quot;
  :duration=&quot;300&quot;
  time=&quot;sides&quot;
  @scrub-start=&quot;scrubbing = true&quot;
  @seek=&quot;(t) => { scrubbing = false; lastSeek = t }&quot;
/>`"
    >
      <div class="mx-auto my-6 flex w-full max-w-lg flex-col gap-3">
        <MSeekBar
          v-model="plain"
          :duration="300"
          time="sides"
          @scrub-start="scrubbing = true"
          @seek="(t: number) => { scrubbing = false; lastSeek = fmt(t) }"
        />
        <p class="text-body-medium text-on-surface-variant">
          {{ scrubbing ? 'Scrubbing…' : `Last seek: ${lastSeek}` }}
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="No Duration"
      description="Before the metadata loads, or for a live stream (duration Infinity), there's nothing to seek: the bar is inert and the total shows --:--."
      :code="`<MSeekBar :model-value=&quot;42&quot; :duration=&quot;Infinity&quot; />`"
    >
      <div class="mx-auto my-6 w-full max-w-md">
        <MSeekBar :model-value="42" :duration="liveStream" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="seekBarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="seekBarEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="seekBarSlots" />

    <ComponentPager current="MSeekBar" />
  </div>
</template>
