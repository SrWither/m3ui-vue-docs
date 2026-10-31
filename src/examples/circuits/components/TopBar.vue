<script setup lang="ts">
/* Logo, the circuit to start from, the clock (play, step, speed, reset), saving and opening, theme, docs and source. */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MIcon, MIconButton, MMenu, MMenuDivider, MMenuItem, MSelect, MTooltip, useTheme } from '@m3ui-vue/m3ui-vue'
import { exampleSource } from '@/examples/registry'
import { presets } from '../presets'
import { useCircuit } from '../useCircuit'

defineProps<{ wide: boolean; canInspect: boolean }>()
const emit = defineEmits<{ save: []; open: [file: File]; palette: []; inspect: [] }>()
const c = useCircuit()
const router = useRouter()
const { theme, cycle } = useTheme()
const themeIcon = computed(() => ({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' })[theme.value])
const openSource = () => window.open(exampleSource('circuits'), '_blank', 'noopener')

const preset = computed({
  get: () => c.presetId.value,
  set: (id: string) => c.load(presets.find((p) => p.id === id)!),
})
const speeds = [0.5, 1, 2, 5, 10, 20, 50, 250, 1e3, 5e3, 2e4, 1e5, 1e6, 1e7, Infinity]
const hzLabel = (hz: number) => (hz === Infinity ? 'Max' : hz >= 1e6 ? `${+(hz / 1e6).toFixed(2)} MHz` : hz >= 1e3 ? `${+(hz / 1e3).toFixed(1)} kHz` : `${+hz.toFixed(hz < 10 ? 1 : 0)} Hz`)
// Below what was asked: the circuit can't keep up (shown while it runs, after its first second)
const behind = computed(() => c.playing.value && c.actualHz.value > 0 && (c.hz.value === Infinity || c.actualHz.value < c.hz.value * 0.9))
const fileInput = ref<HTMLInputElement>()
function picked(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) emit('open', f)
  ;(e.target as HTMLInputElement).value = ''
}
</script>

<template>
  <header class="flex min-h-16 shrink-0 flex-wrap items-center gap-x-1 gap-y-2 px-2 py-2 sm:px-4">
    <span class="mr-1 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary"><MIcon name="memory" :size="22" /></span>
    <span v-if="wide" class="mr-3 text-title-large font-medium">Bitloom</span>
    <MSelect v-model="preset" :options="presets.map((p) => ({ value: p.id, label: p.name }))" label="Circuit" placeholder="Your circuit" variant="outlined" class="w-56" />
    <div class="ml-2 flex items-center rounded-full bg-surface-container-high px-1">
      <MTooltip :text="c.playing.value ? 'Pause the clock' : 'Run the clock'" placement="bottom">
        <MIconButton :icon="c.playing.value ? 'pause' : 'play_arrow'" :variant="c.playing.value ? 'filled' : 'standard'" :label="c.playing.value ? 'Pause' : 'Play'" @click="c.playing.value = !c.playing.value" />
      </MTooltip>
      <MTooltip text="One clock cycle (rise and fall)" placement="bottom"><MIconButton icon="skip_next" label="Step one cycle" @click="c.cycle()" /></MTooltip>
      <MTooltip text="Half a cycle" placement="bottom"><MIconButton icon="keyboard_tab" label="Step half a cycle" @click="c.step()" /></MTooltip>
      <MTooltip text="Reset registers and memory" placement="bottom"><MIconButton icon="restart_alt" label="Reset" @click="c.reset()" /></MTooltip>
      <MMenu>
        <template #trigger>
          <button type="button" class="h-10 rounded-full px-3 font-mono text-label-large text-on-surface-variant hover:bg-on-surface/8" aria-label="Clock speed">{{ hzLabel(c.hz.value) }}</button>
        </template>
        <MMenuItem v-for="s in speeds" :key="s" :selected="c.hz.value === s" @click="c.hz.value = s">{{ s === Infinity ? 'Max (as fast as it goes)' : hzLabel(s) }}</MMenuItem>
      </MMenu>
      <span v-if="wide" class="px-2 font-mono text-label-medium text-on-surface-variant">
        {{ Math.floor(c.ticks.value / 2) }} cycles<template v-if="behind"> · <span class="text-tertiary">{{ hzLabel(c.actualHz.value) }} real</span></template>
      </span>
    </div>
    <span class="flex-1" />
    <MTooltip v-if="!wide" text="Parts" placement="bottom"><MIconButton icon="add_circle" label="Parts" @click="emit('palette')" /></MTooltip>
    <MTooltip v-if="!wide && canInspect" text="Settings of the selection" placement="bottom"><MIconButton icon="tune" label="Settings of the selection" @click="emit('inspect')" /></MTooltip>
    <MMenu align="right">
      <template #trigger>
        <MTooltip text="Save and open" placement="bottom"><MIconButton icon="folder_open" label="Save and open" /></MTooltip>
      </template>
      <MMenuItem icon="download" @click="emit('save')">Save as JSON</MMenuItem>
      <MMenuDivider />
      <MMenuItem icon="upload_file" @click="fileInput?.click()">Open a JSON circuit…</MMenuItem>
    </MMenu>
    <input ref="fileInput" type="file" accept=".json,application/json" class="hidden" @change="picked" />
    <MTooltip :text="`Theme: ${theme}`" placement="bottom"><MIconButton :icon="themeIcon" :label="`Theme: ${theme}`" @click="cycle" /></MTooltip>
    <MTooltip text="Back to the docs" placement="bottom"><MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" /></MTooltip>
    <MTooltip text="View source on GitHub" placement="bottom"><MIconButton icon="code" label="View source on GitHub" @click="openSource" /></MTooltip>
  </header>
</template>
