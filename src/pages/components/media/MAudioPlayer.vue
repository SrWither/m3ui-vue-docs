<script setup lang="ts">
import { computed, ref } from 'vue'
import { MIconButton } from '@m3ui-vue/m3ui-vue'
import { MAudioPlayer } from '@m3ui-vue/m3ui-vue/media'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'
import { tracks } from '@/components/demos/mediaSamples'

// A queue with shuffle and repeat
function useQueue() {
  const order = ref(tracks.map((_, i) => i))
  const pos = ref(0)
  const shuffle = ref(false)
  const repeat = ref<'off' | 'all' | 'one'>('off')
  const playing = ref(false)
  const track = computed(() => tracks[order.value[pos.value]!]!)
  const hasNext = computed(() => repeat.value === 'all' || pos.value < order.value.length - 1)
  function next() {
    pos.value = (pos.value + 1) % order.value.length
  }
  function previous() {
    pos.value = Math.max(0, pos.value - 1)
  }
  function onEnded() {
    if (hasNext.value) next()
  }
  function setShuffle(on: boolean) {
    const current = order.value[pos.value]!
    const rest = tracks.map((_, i) => i).filter((i) => i !== current)
    if (on) rest.sort(() => Math.random() - 0.5)
    order.value = on ? [current, ...rest] : tracks.map((_, i) => i)
    pos.value = order.value.indexOf(current)
    shuffle.value = on
  }
  return { pos, shuffle, repeat, playing, track, hasNext, next, previous, onEnded, setShuffle }
}

const full = useQueue()
const mini = useQueue()
const liked = ref(new Set<string>())
const toggleLike = (title: string) => (liked.value.has(title) ? liked.value.delete(title) : liked.value.add(title))
const lastClick = ref('')

const audioProps: PropDef[] = [
  { name: 'variant', type: "'mini' | 'standard'", default: "'standard'", description: "mini: Media3's MiniController, a compact card. standard: a full player bar" },
  { name: 'src', type: 'string', description: 'Audio URL' },
  { name: 'sources', type: 'VideoSource[]', description: 'Several formats ({ src, type? }); the browser plays the first it can' },
  { name: 'title', type: 'string', description: 'Track title (also on the lock screen)' },
  { name: 'artist', type: 'string', description: 'Artist (also on the lock screen)' },
  { name: 'album', type: 'string', description: 'Album, for the lock screen' },
  { name: 'artwork', type: 'string', description: 'Cover image URL' },
  { name: 'duration', type: 'number', description: 'Length in seconds, for a clock without src (with a file it comes from the file)' },
  { name: 'player', type: 'MediaPlayer', description: 'Drive this player (from useMediaPlayer()) instead of one of its own. Read once' },
  { name: 'playing', type: 'boolean', description: 'Playing (v-model:playing)' },
  { name: 'currentTime', type: 'number', description: 'Position in seconds (v-model:current-time)' },
  { name: 'rate', type: 'number', description: 'Playback speed (v-model:rate)' },
  { name: 'volume', type: 'number', description: 'Volume, 0 to 1 (v-model:volume)' },
  { name: 'muted', type: 'boolean', description: 'Muted (v-model:muted)' },
  { name: 'shuffle', type: 'boolean', description: 'Shuffle (v-model:shuffle); unset hides the button' },
  { name: 'repeat', type: "'off' | 'all' | 'one'", description: "Repeat mode (v-model:repeat); unset hides the button. 'one' loops the track" },
  { name: 'autoplay', type: 'boolean', default: 'false', description: 'Starts playing when mounted (browsers block it with sound before a user gesture)' },
  { name: 'hasPrevious', type: 'boolean', default: 'false', description: 'There is a previous track: enables the previous button (emits previous). Without it the button stays, disabled' },
  { name: 'hasNext', type: 'boolean', default: 'false', description: 'There is a next track: enables the next button (emits next). Without it the button stays, disabled' },
  { name: 'speeds', type: 'number[]', description: 'Speeds offered in a speed menu (standard); unset hides it' },
  { name: 'seekBar', type: "'slider' | 'line' | 'wavy'", default: "'slider'", description: "The seek bar's look (standard)" },
  { name: 'color', type: 'string', default: "'primary'", description: 'Played part and play button: an M3 role or any CSS color' },
]

const audioEvents: EventDef[] = [
  { name: 'update:playing / currentTime / rate / volume / muted / shuffle / repeat', payload: '…', description: 'The v-models' },
  { name: 'previous', payload: '—', description: 'The previous button (or the lock screen\'s) was pressed' },
  { name: 'next', payload: '—', description: 'The next button (or the lock screen\'s) was pressed' },
  { name: 'ended', payload: '—', description: 'The track reached its end (not with repeat one)' },
  { name: 'error', payload: 'MediaError | null', description: 'The audio failed to load or play' },
  { name: 'click', payload: 'MouseEvent', description: 'The mini player was clicked outside its buttons (open your full player)' },
]

const audioSlots: SlotDef[] = [
  { name: 'artwork', description: 'Replaces the artwork. Props: { player }' },
  { name: 'actions', description: 'Extra buttons (a like, a queue button). Props: { player }' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAudioPlayer</h1>
    <p class="mb-4 text-body-large text-on-surface-variant">
      An audio player in two sizes: <code>mini</code>, a port of Media3's MiniController (artwork, title, previous,
      play and next on an elevated card with a thin progress line), and <code>standard</code>, a full player with
      the seek bar, shuffle, repeat, speed and volume. It plays a file in a hidden audio element and takes the lock
      screen's media controls while it plays; the queue stays yours. Available from the
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">/media</code> entry point.
    </p>
    <p class="mb-8 text-body-small text-on-surface-variant">
      Music by Kevin MacLeod (incompetech.com), CC BY 3.0, played from Wikimedia Commons.
    </p>

    <ComponentDemo
      title="Standard"
      description="A queue of your own: shuffle and repeat show once bound; previous and next stay in place, disabled when there's none. The #actions slot here holds a like button."
      :code="`<MAudioPlayer
  v-model:playing=&quot;playing&quot;
  v-model:shuffle=&quot;shuffle&quot;
  v-model:repeat=&quot;repeat&quot;
  :src=&quot;track.src&quot;
  :title=&quot;track.title&quot;
  :artist=&quot;track.artist&quot;
  :artwork=&quot;track.artwork&quot;
  :has-previous=&quot;pos > 0&quot;
  :has-next=&quot;hasNext&quot;
  :speeds=&quot;[0.75, 1, 1.25, 1.5]&quot;
  seek-bar=&quot;wavy&quot;
  @previous=&quot;previous&quot;
  @next=&quot;next&quot;
  @ended=&quot;onEnded&quot;
>
  <template #actions>
    <MIconButton icon=&quot;favorite&quot; label=&quot;Like&quot; :checked=&quot;liked&quot; @update:checked=&quot;liked = $event&quot; />
  </template>
</MAudioPlayer>`"
      :script="`import { MAudioPlayer } from '@m3ui-vue/m3ui-vue/media'`"
    >
      <MAudioPlayer
        v-model:playing="full.playing.value"
        :shuffle="full.shuffle.value"
        v-model:repeat="full.repeat.value"
        :src="full.track.value.src"
        :title="full.track.value.title"
        :artist="full.track.value.artist"
        :artwork="full.track.value.artwork"
        :has-previous="full.pos.value > 0"
        :has-next="full.hasNext.value"
        :speeds="[0.75, 1, 1.25, 1.5]"
        seek-bar="wavy"
        class="mx-auto w-full max-w-md"
        @update:shuffle="full.setShuffle"
        @previous="full.previous"
        @next="full.next"
        @ended="full.onEnded"
      >
        <template #actions>
          <MIconButton icon="favorite" label="Like" :checked="liked.has(full.track.value.title)" @update:checked="toggleLike(full.track.value.title)" />
        </template>
      </MAudioPlayer>
    </ComponentDemo>

    <ComponentDemo
      title="Mini"
      description="Media3's MiniController: a click outside its buttons emits click, to open your full player."
      :code="`<MAudioPlayer
  variant=&quot;mini&quot;
  :src=&quot;track.src&quot;
  :title=&quot;track.title&quot;
  :artist=&quot;track.artist&quot;
  :artwork=&quot;track.artwork&quot;
  :has-previous=&quot;pos > 0&quot;
  :has-next=&quot;hasNext&quot;
  @previous=&quot;previous&quot;
  @next=&quot;next&quot;
  @click=&quot;openNowPlaying&quot;
/>`"
    >
      <div class="mx-auto flex w-full max-w-md flex-col gap-3">
        <MAudioPlayer
          v-model:playing="mini.playing.value"
          variant="mini"
          :src="mini.track.value.src"
          :title="mini.track.value.title"
          :artist="mini.track.value.artist"
          :artwork="mini.track.value.artwork"
          :has-previous="mini.pos.value > 0"
          :has-next="mini.hasNext.value"
          @previous="mini.previous"
          @next="mini.next"
          @ended="mini.onEnded"
          @click="lastClick = `Open ${mini.track.value.title}`"
        />
        <p class="text-center text-body-small text-on-surface-variant">{{ lastClick || 'Click the card' }}</p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="audioProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="audioEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="audioSlots" />

    <ComponentPager current="MAudioPlayer" />
  </div>
</template>
