<script setup lang="ts">
/*
 * The video player. The picture is the video's shader in MShader, fed the player's position as
 * `uTime`, so play, pause, seek and speed all really change it; "quality" is MShader's
 * pixelRatio, so 144p really is blocky. Controls hide after a moment of playing. With a mouse a
 * click plays/pauses and a double click goes full screen; on touch a tap shows the controls and
 * a double tap on either side skips 10 seconds. Full screen puts the player over the page (fixed)
 * and asks the browser for full screen on the whole document, so menus and sheets, which are
 * teleported to <body>, still show over it.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MAspectRatio, MIcon, MIconButton, MLoadingIndicator, MShader, MSlider } from '@m3ui-vue/m3ui-vue'
import { fmt, thumbOf, videoById } from '../data'
import { rgb, sceneCode, type SceneUniforms } from '../shaders'
import { useFlick } from '../useFlick'
import SeekBar from './SeekBar.vue'
import PlayerSettings from './PlayerSettings.vue'

const props = defineProps<{ wide?: boolean; /** The id of the video autoplay goes to. */ next?: string }>()
const emit = defineEmits<{ minimize: [] }>()
const f = useFlick()
const { video, playing, position, ended, buffering, volume, muted, quality, theater, autoplay } = f

const uniforms = computed<SceneUniforms>(() => {
  const v = video.value!
  return { uTime: position.value, uA: rgb(v.colors[0]), uB: rgb(v.colors[1]), uC: rgb(v.colors[2]), uSeed: v.seed }
})

// Quality = how many device pixels per CSS pixel the shader renders at, from the box's height.
const root = ref<HTMLElement>()
const boxHeight = ref(360)
let ro: ResizeObserver | undefined
const pixelRatio = computed(() => (quality.value === 'auto' ? undefined : Math.min(2, quality.value / Math.max(1, boxHeight.value))))
const qualityLabel = computed(() => {
  if (quality.value !== 'auto') return `${quality.value}p`
  const lines = boxHeight.value * Math.min(window.devicePixelRatio || 1, 2)
  return `Auto (${[1080, 720, 480, 360].find((q) => lines >= q * 0.9) ?? 144}p)`
})

// Paused, the shader only needs to redraw when the frame changes (a seek).
const still = ref(true)
let stillTimer: number | undefined
watch(position, () => {
  if (playing.value) return
  still.value = false
  clearTimeout(stillTimer)
  stillTimer = window.setTimeout(() => (still.value = true), 200)
})

// --- Controls visibility --------------------------------------------------------------------------

const shown = ref(true)
let hideTimer: number | undefined
function poke() {
  shown.value = true
  clearTimeout(hideTimer)
  hideTimer = window.setTimeout(() => {
    if (playing.value && !menuOpen.value) shown.value = false
  }, 2600)
}
watch(playing, (on) => (on ? poke() : (shown.value = true)))
const settings = ref<InstanceType<typeof PlayerSettings>>()
const menuOpen = computed(() => !!settings.value?.open)

// Big icon flash in the middle, for what you can't see happen: a click on the picture, a double
// tap or a shortcut. The buttons don't flash; their own icon already changes.
const flash = ref<{ icon: string; text?: string; side?: 'left' | 'right'; n: number } | null>(null)
let flashTimer: number | undefined
function show(icon: string, text?: string, side?: 'left' | 'right') {
  flash.value = { icon, text, side, n: (flash.value?.n ?? 0) + 1 }
  clearTimeout(flashTimer)
  flashTimer = window.setTimeout(() => (flash.value = null), 600)
}
function toggle(flashIt = false) {
  f.toggle()
  if (flashIt) show(playing.value ? 'play_arrow' : 'pause')
}
function skip(s: number, flashIt = false) {
  f.skip(s)
  if (flashIt) show(s > 0 ? 'fast_forward' : 'fast_rewind', `${Math.abs(s)} seconds`, s > 0 ? 'right' : 'left')
}

// --- Taps and clicks on the picture ---------------------------------------------------------------

let lastTap = 0
let tapTimer: number | undefined
function onSurfaceUp(e: PointerEvent) {
  if (e.button !== 0) return
  if (e.pointerType === 'mouse') {
    toggle(true)
    return
  }
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const now = performance.now()
  if (now - lastTap < 300 && (x < 0.35 || x > 0.65)) {
    clearTimeout(tapTimer)
    lastTap = now
    skip(x < 0.5 ? -10 : 10, true)
    return
  }
  lastTap = now
  clearTimeout(tapTimer)
  tapTimer = window.setTimeout(() => (shown.value ? (shown.value = false) : poke()), 260)
}

// --- Full screen ----------------------------------------------------------------------------------

const full = ref(false)
async function toggleFull() {
  if (full.value) {
    full.value = false
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => {})
    return
  }
  full.value = true
  await document.documentElement.requestFullscreen?.().catch(() => {})
  // Phones turn to landscape where the browser allows it.
  ;(screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock?.('landscape').catch(() => {})
}
function onFullscreenChange() {
  if (!document.fullscreenElement && full.value) full.value = false
}

const mode = computed(() => (full.value ? 'full' : theater.value && props.wide ? 'theater' : 'normal'))
/** The phone layout of the controls. */
const slim = computed(() => !props.wide && mode.value !== 'full')

// --- Volume ---------------------------------------------------------------------------------------

const volumeIcon = computed(() => (muted.value || volume.value === 0 ? 'volume_off' : volume.value < 50 ? 'volume_down' : 'volume_up'))
const vol = computed({
  get: () => (muted.value ? 0 : volume.value),
  set: (v: number) => {
    volume.value = v
    muted.value = v === 0
  },
})

// --- End screen: autoplay the next video after a countdown ---------------------------------------

const nextVideo = computed(() => (props.next ? videoById.get(props.next) : undefined))
const countdown = ref(0)
let countTimer: number | undefined
watch(ended, (on) => {
  clearInterval(countTimer)
  if (!on || !autoplay.value || !nextVideo.value) return
  countdown.value = 8
  countTimer = window.setInterval(() => {
    if (--countdown.value <= 0) playNext()
  }, 1000)
})
function cancelNext() {
  clearInterval(countTimer)
  countdown.value = 0
}
function playNext() {
  cancelNext()
  if (nextVideo.value) f.play(nextVideo.value.id)
}

// --- Keyboard (YouTube's shortcuts) ---------------------------------------------------------------

function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  if (e.ctrlKey || e.metaKey || e.altKey || t.closest('input, textarea, select, [contenteditable]')) return
  const onControl = t.closest('button, a, [role="slider"], [role="menuitem"]')
  const k = e.key.toLowerCase()
  const actions: Record<string, () => void> = {
    k: () => toggle(true),
    j: () => skip(-10, true),
    l: () => skip(10, true),
    arrowleft: () => skip(-5, true),
    arrowright: () => skip(5, true),
    f: toggleFull,
    m: () => (muted.value = !muted.value),
    t: () => (theater.value = !theater.value),
    i: () => emit('minimize'),
  }
  if (k === ' ' && !onControl) actions[k] = () => toggle(true)
  if (onControl && k.startsWith('arrow')) return
  if (/^[0-9]$/.test(k)) actions[k] = () => f.seek((video.value!.duration * Number(k)) / 10)
  const run = actions[k]
  if (!run) return
  e.preventDefault()
  run()
  poke()
}

onMounted(() => {
  ro = new ResizeObserver(([entry]) => (boxHeight.value = entry!.contentRect.height))
  ro.observe(root.value!)
  document.addEventListener('keydown', onKey)
  document.addEventListener('fullscreenchange', onFullscreenChange)
  poke()
})
onBeforeUnmount(() => {
  ro?.disconnect()
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
  ;[hideTimer, flashTimer, tapTimer, stillTimer].forEach(clearTimeout)
  clearInterval(countTimer)
})

const white = 'text-white! [&_.material-symbols-outlined]:drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]'
</script>

<template>
  <div
    class="flk-player group/player overflow-hidden bg-black text-white select-none"
    :class="{
      'fixed inset-0 z-40': mode === 'full',
      relative: mode !== 'full',
      'h-[min(56.25vw,calc(100dvh-170px))]': mode === 'theater',
      'cursor-none': !shown && playing,
    }"
    @pointermove="poke"
  >
    <!-- The picture, letterboxed in full screen and theater mode -->
    <div :class="mode === 'normal' ? '' : 'absolute inset-0 flex items-center justify-center [container-type:size]'">
      <MAspectRatio ratio="16/9" :class="mode === 'normal' ? 'w-full' : 'w-[min(100cqw,calc(100cqh*16/9))]'">
        <div ref="root" class="h-full w-full">
          <MShader
            v-if="video"
            :key="`${video.id}-${quality}`"
            :code="sceneCode(video.scene)"
            :uniforms="uniforms"
            :paused="!playing && still"
            :pixel-ratio="pixelRatio"
            class="h-full w-full [image-rendering:pixelated]"
          >
            <template #loading><img :src="thumbOf(video)" alt="" class="h-full w-full object-cover" /></template>
            <template #fallback><img :src="thumbOf(video, position)" alt="" class="h-full w-full object-cover" /></template>
          </MShader>
        </div>
      </MAspectRatio>
    </div>

    <!-- Taps and clicks land here, under the controls -->
    <div class="absolute inset-0" @pointerup="onSurfaceUp" @dblclick="toggleFull" />

    <div v-if="buffering" class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <MLoadingIndicator :size="64" contained label="Buffering" />
    </div>

    <!-- Play/pause and skip flash -->
    <Transition name="flk-flash">
      <div
        v-if="flash"
        :key="flash.n"
        class="pointer-events-none absolute inset-y-0 flex items-center justify-center"
        :class="flash.side === 'left' ? 'left-0 w-2/5' : flash.side === 'right' ? 'right-0 w-2/5' : 'inset-x-0'"
      >
        <div class="flex flex-col items-center gap-1">
          <span class="flex h-16 w-16 items-center justify-center rounded-full bg-black/45"><MIcon :name="flash.icon" :size="36" class="flk-fill" /></span>
          <span v-if="flash.text" class="rounded-full bg-black/45 px-2 text-label-medium">{{ flash.text }}</span>
        </div>
      </div>
    </Transition>

    <!-- Controls. Phones get the apps' layout (gear on top, slim bottom row, seek bar on the edge)
         so they fit a 200px-tall player; wide screens and full screen get the desktop one. -->
    <Transition name="flk-fade">
      <div v-show="shown || !playing || ended" class="pointer-events-none absolute inset-0 flex flex-col justify-between">
        <div class="flex items-center gap-2 bg-linear-to-b from-black/60 to-transparent" :class="slim ? 'px-1 pt-1 pb-4' : 'px-3 pt-2 pb-8'">
          <MIconButton v-if="mode === 'full'" icon="arrow_back" label="Exit full screen" :class="white" class="pointer-events-auto" @click="toggleFull" />
          <p v-if="mode === 'full'" class="min-w-0 flex-1 truncate text-title-medium">{{ video?.title }}</p>
          <template v-if="slim">
            <MIconButton icon="keyboard_arrow_down" label="Miniplayer" size="xs" :class="white" class="pointer-events-auto" @click="emit('minimize')" />
            <span class="flex-1" />
            <PlayerSettings ref="settings" :quality-label="qualityLabel" :button-class="white" size="xs" class="pointer-events-auto" />
          </template>
        </div>

        <!-- Touch: big buttons in the middle -->
        <div v-if="!ended" class="flk-touch-controls pointer-events-none flex items-center justify-center" :class="slim ? 'gap-8' : 'gap-10'">
          <MIconButton icon="replay_10" label="Back 10 seconds" :size="slim ? 'sm' : 'md'" :class="white" class="pointer-events-auto bg-black/30!" @click="skip(-10)" />
          <MIconButton :icon="playing ? 'pause' : 'play_arrow'" :label="playing ? 'Pause' : 'Play'" :size="slim ? 'sm' : 'md'" :class="white" class="flk-fill pointer-events-auto bg-black/30!" @click="toggle()" />
          <MIconButton icon="forward_10" label="Forward 10 seconds" :size="slim ? 'sm' : 'md'" :class="white" class="pointer-events-auto bg-black/30!" @click="skip(10)" />
        </div>

        <div v-if="slim" class="pointer-events-auto bg-linear-to-t from-black/70 to-transparent pt-4">
          <div class="flex items-center px-3">
            <span class="flex-1 text-label-medium whitespace-nowrap tabular-nums">{{ fmt(position) }} / {{ fmt(video?.duration ?? 0) }}</span>
            <MIconButton icon="fullscreen" label="Full screen" size="xs" :class="white" @click="toggleFull" />
          </div>
          <SeekBar class="-mb-1 px-1" />
        </div>
        <div v-else class="pointer-events-auto bg-linear-to-t from-black/75 via-black/40 to-transparent px-3 pt-10 pb-1">
          <SeekBar class="px-1" />
          <div class="flex items-center gap-0.5">
            <MIconButton :icon="ended ? 'replay' : playing ? 'pause' : 'play_arrow'" :label="ended ? 'Replay' : playing ? 'Pause (k)' : 'Play (k)'" :class="white" class="flk-fill" @click="toggle()" />
            <MIconButton v-if="nextVideo" icon="skip_next" label="Next" :class="white" class="flk-fill" @click="playNext" />
            <div class="group/vol flex items-center">
              <MIconButton :icon="volumeIcon" :label="muted ? 'Unmute (m)' : 'Mute (m)'" :class="white" @click="muted = !muted" />
              <div class="hidden w-0 overflow-hidden transition-[width] duration-200 group-focus-within/vol:w-24 group-hover/vol:w-24 sm:block">
                <MSlider v-model="vol" :min="0" :max="100" size="xs" class="w-20 px-1" />
              </div>
            </div>
            <span class="ml-1 text-label-large whitespace-nowrap tabular-nums">{{ fmt(position) }} / {{ fmt(video?.duration ?? 0) }}</span>
            <span class="flex-1" />
            <PlayerSettings ref="settings" :quality-label="qualityLabel" :button-class="white" />
            <MIconButton v-if="mode !== 'full'" icon="picture_in_picture_alt" label="Miniplayer (i)" :class="white" @click="emit('minimize')" />
            <MIconButton v-if="wide && mode !== 'full'" :icon="theater ? 'fit_screen' : 'width_wide'" :label="theater ? 'Default view (t)' : 'Theater mode (t)'" :class="white" @click="theater = !theater" />
            <MIconButton :icon="mode === 'full' ? 'fullscreen_exit' : 'fullscreen'" :label="mode === 'full' ? 'Exit full screen (f)' : 'Full screen (f)'" :class="white" @click="toggleFull" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- End screen -->
    <div v-if="ended" class="absolute inset-0 flex items-center justify-center bg-black/60 p-4">
      <div v-if="countdown > 0 && nextVideo" class="flex w-full max-w-sm flex-col gap-3">
        <p class="text-label-large text-white/80">Up next in {{ countdown }}</p>
        <button type="button" class="flex cursor-pointer gap-3 rounded-xl text-left" @click="playNext">
          <img :src="thumbOf(nextVideo)" alt="" class="aspect-video w-36 shrink-0 rounded-lg object-cover" />
          <span class="line-clamp-3 text-title-small">{{ nextVideo.title }}</span>
        </button>
        <div class="flex gap-2">
          <button type="button" class="flex-1 cursor-pointer rounded-full bg-white/15 py-2 text-label-large hover:bg-white/25" @click="cancelNext">Cancel</button>
          <button type="button" class="flex-1 cursor-pointer rounded-full bg-white py-2 text-label-large text-black hover:bg-white/90" @click="playNext">Play now</button>
        </div>
      </div>
      <MIconButton v-else icon="replay" label="Replay" size="lg" :class="white" class="bg-black/40!" @click="toggle()" />
    </div>
  </div>
</template>

<style scoped>
/* The big middle buttons are for touch; a mouse clicks the picture itself. */
@media (hover: hover) and (pointer: fine) {
  .flk-touch-controls { visibility: hidden; }
}
.flk-fade-enter-active,
.flk-fade-leave-active { transition: opacity 200ms ease; }
.flk-fade-enter-from,
.flk-fade-leave-to { opacity: 0; }
.flk-flash-leave-active { transition: opacity 400ms ease, transform 400ms ease; }
.flk-flash-leave-to { opacity: 0; transform: scale(1.3); }
</style>
