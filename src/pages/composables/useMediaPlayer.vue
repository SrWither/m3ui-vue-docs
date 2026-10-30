<script setup lang="ts">
import { ref } from 'vue'
import { MIconButton, MSeekBar } from '@m3ui-vue/m3ui-vue'
import { useMediaPlayer } from '@m3ui-vue/m3ui-vue/media'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'
import { tracks } from '@/components/demos/mediaSamples'

// A player UI of your own over an <audio>
const audio = ref<HTMLAudioElement>()
const track = tracks[1]!
const player = useMediaPlayer({ media: audio, metadata: { title: track.title, artist: track.artist, artwork: [track.artwork] } })

// A clock: something that isn't a file but plays like one
const clock = useMediaPlayer({ duration: 20, loop: true })
const bars = (t: number) => Array.from({ length: 24 }, (_, i) => 20 + 70 * Math.abs(Math.sin(t * 2 + i * 0.45)))

const types: TypeDef[] = [
  {
    name: 'useMediaPlayer(options)',
    fields: [
      { name: 'media', type: 'MaybeRefOrGetter<HTMLMediaElement | null>', description: 'The <audio> or <video> to drive (it may come and go). Without one the player runs its own clock over duration' },
      { name: 'duration', type: 'MaybeRefOrGetter<number>', description: 'The length in seconds, for the clock' },
      { name: 'metadata', type: 'MaybeRefOrGetter<MediaPlayerMetadata | null>', description: 'Title, artist, album and artwork for the lock screen and media notification while this player plays. Without it the Media Session is left alone' },
      { name: 'onPrevious / onNext', type: '() => void', description: 'The previous / next buttons (and the lock screen\'s); without them there are none' },
      { name: 'hasPrevious / hasNext', type: 'MaybeRefOrGetter<boolean>', description: 'Whether there is a previous / next item right now. Default: the handler was given' },
      { name: 'seekStep', type: 'number', description: 'Seconds skip() and the lock screen\'s seek buttons move by default. Default 10' },
      { name: 'loop', type: 'MaybeRefOrGetter<boolean>', description: 'The clock starts over at the end (with a media element, set its loop)' },
    ],
  },
  {
    name: 'useMediaPlayer() returns',
    description: 'All reactive. playing, currentTime, rate, volume and muted are writable: writing them acts on the media',
    fields: [
      { name: 'playing', type: 'Ref<boolean>', description: 'Playing or paused; writing it plays or pauses' },
      { name: 'currentTime', type: 'Ref<number>', description: 'Position in seconds; writing it seeks' },
      { name: 'duration', type: 'Ref<number>', description: 'Length: 0 until known, Infinity for a live stream' },
      { name: 'buffered', type: 'Ref<[number, number][]>', description: 'Loaded time ranges (for MSeekBar\'s buffered)' },
      { name: 'rate / volume / muted', type: 'Ref', description: 'Speed, volume (0 to 1) and mute; writable' },
      { name: 'waiting', type: 'Ref<boolean>', description: 'Stalled for data. Writable for the clock, to simulate buffering (it stops advancing)' },
      { name: 'ended / live / error / blocked', type: 'Ref', description: 'Reached the end; a live stream; the media error; the browser refused to start playing (autoplay with sound)' },
      { name: 'hasPrevious / hasNext', type: 'Ref<boolean>', description: 'Whether there is a previous / next item' },
      { name: 'play / pause / toggle / stop', type: '() => …', description: 'play() after the end starts over; stop() pauses and goes back to the start' },
      { name: 'seek(time) / skip(seconds?)', type: '…', description: 'Seek to a time, or by an offset (seekStep by default; negative goes back)' },
      { name: 'previous / next', type: '() => void', description: 'Call onPrevious / onNext' },
      { name: 'attach(el)', type: '(el | null | undefined) => void', description: 'Drive this element instead (null: the clock; undefined: back to media). MVideoPlayer and MAudioPlayer call it when given a player' },
      { name: 'media', type: 'Ref<HTMLMediaElement | null>', description: 'The element being driven' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useMediaPlayer</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The state and controls of something that plays: an audio or video element, or a clock of its own for anything
      else (a canvas, a shader, generated audio) that should play, pause, seek and change speed like one. Everything
      is reactive, and writing <code>playing</code>, <code>currentTime</code>, <code>rate</code>,
      <code>volume</code> or <code>muted</code> acts on the media. With <code>metadata</code> it takes the lock
      screen's and the notification's media controls while it plays. MVideoPlayer and MAudioPlayer are built on it;
      create one outside a page and pass it to their <code>player</code> prop to keep settings across pages, or
      build a player of your own. Available from the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/media</code> entry point.
    </p>

    <ComponentDemo
      title="Your Own Player"
      description="An <audio> element, an MSeekBar and two buttons. Play it on a phone and lock the screen: the controls are there."
      :code="`<audio ref=&quot;audio&quot; :src=&quot;track.src&quot; />
<MIconButton :icon=&quot;player.playing.value ? 'pause' : 'play_arrow'&quot; variant=&quot;filled&quot; @click=&quot;player.toggle()&quot; />
<MSeekBar
  v-model=&quot;player.currentTime.value&quot;
  :duration=&quot;player.duration.value&quot;
  :buffered=&quot;player.buffered.value&quot;
  :playing=&quot;player.playing.value&quot;
  variant=&quot;wavy&quot;
/>
<MIconButton icon=&quot;forward_10&quot; @click=&quot;player.skip()&quot; />`"
      :script="`import { ref } from 'vue'
import { useMediaPlayer } from '@m3ui-vue/m3ui-vue/media'

const audio = ref<HTMLAudioElement>()
const player = useMediaPlayer({
  media: audio,
  metadata: { title: 'Windswept', artist: 'Kevin MacLeod', artwork: [cover] },
})`"
    >
      <div class="mx-auto flex w-full max-w-md items-center gap-3">
        <audio ref="audio" :src="track.src" preload="metadata" />
        <MIconButton :icon="player.playing.value ? 'pause' : 'play_arrow'" :label="player.playing.value ? 'Pause' : 'Play'" variant="filled" icon-filled @click="player.toggle()" />
        <MSeekBar
          v-model="player.currentTime.value"
          :duration="player.duration.value"
          :buffered="player.buffered.value"
          :playing="player.playing.value"
          variant="wavy"
          size="sm"
          class="flex-1"
        />
        <MIconButton icon="forward_10" label="Forward 10 seconds" @click="player.skip()" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="A Clock"
      description="Without media, the player keeps its own time over duration: here, bars drawn from it, looping every 20 seconds. Try the speed."
      :code="`<MIconButton :icon=&quot;clock.playing.value ? 'pause' : 'play_arrow'&quot; @click=&quot;clock.toggle()&quot; />
<MIconButton icon=&quot;speed&quot; @click=&quot;clock.rate.value = clock.rate.value === 1 ? 2 : 1&quot; />
<svg viewBox=&quot;0 0 240 100&quot;>
  <rect v-for=&quot;(h, i) in bars(clock.currentTime.value)&quot; :key=&quot;i&quot; :x=&quot;i * 10&quot; :y=&quot;100 - h&quot; width=&quot;6&quot; :height=&quot;h&quot; class=&quot;fill-primary&quot; />
</svg>`"
      :script="`const clock = useMediaPlayer({ duration: 20, loop: true })
const bars = (t: number) => Array.from({ length: 24 }, (_, i) => 20 + 70 * Math.abs(Math.sin(t * 2 + i * 0.45)))`"
    >
      <div class="mx-auto flex w-full max-w-md flex-col gap-3">
        <svg viewBox="0 0 240 100" class="h-28 w-full rounded-lg bg-surface-container-high">
          <rect v-for="(h, i) in bars(clock.currentTime.value)" :key="i" :x="i * 10 + 2" :y="100 - h" width="6" :height="h" rx="3" class="fill-primary" />
        </svg>
        <div class="flex items-center gap-2">
          <MIconButton :icon="clock.playing.value ? 'pause' : 'play_arrow'" :label="clock.playing.value ? 'Pause' : 'Play'" variant="filled" icon-filled @click="clock.toggle()" />
          <MIconButton icon="speed" label="Speed" :checked="clock.rate.value === 2" @update:checked="clock.rate.value = clock.rate.value === 1 ? 2 : 1" />
          <span class="flex-1 text-right text-body-medium tabular-nums text-on-surface-variant">{{ clock.currentTime.value.toFixed(1) }}s · {{ clock.rate.value }}×</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <ComponentPager current="useMediaPlayer" />
  </div>
</template>
