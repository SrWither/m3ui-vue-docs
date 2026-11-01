<script setup lang="ts">
/*
 * The selected part's settings (label, width, inputs, select bits, addressing, color, value), a ROM's or RAM's
 * words as an editable hex grid (a RAM shows and edits what it holds right now), or what the selected wire carries.
 */
import { computed, ref, watch } from 'vue'
import { MButton, MIcon, MIconButton, MMenu, MMenuItem, MNumberField, MSegmentedButton, MSelect, MSwitch, MTextField, useToast } from '@m3ui-vue/m3ui-vue'
import { colorModes, type ColorMode } from '../devices'
import { cellsOf, maxAddressBits, parseMemoryFile, setCells, toBinary, toLogisim, type Cells } from '../memory'
import { getCircuit } from '../library'
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import { disassemble, partByKind, type Params, type ShiftMode } from '../parts'
import { format } from '../logic'
import { useCircuit } from '../useCircuit'
import { canTurn } from '../geometry'
import type { PartNode } from '../sim'

const props = defineProps<{ node?: PartNode; edge?: FlowEdge }>()
const emit = defineEmits<{ remove: []; rotate: [back: boolean]; straighten: [id: string] }>()
const c = useCircuit()
const toast = useToast()

const def = computed(() => (props.node ? partByKind.get(props.node.data!.kind)! : undefined))
const params = computed<Params>(() => ({ ...def.value?.params, ...props.node?.data?.params }))
const has = (k: keyof Params) => !!def.value?.edit?.includes(k)
const patch = (p: Partial<Params>) => c.patchPart(props.node!.id, { params: p })

const SCREEN_SIZES = [8, 16, 24, 32, 48, 64, 96, 128, 160, 192, 224, 240, 256]
const TTY_COLS = [16, 20, 24, 32, 40, 64, 80]
const TTY_ROWS = [2, 4, 6, 8, 12, 16, 24]
const sizeOptions = (list: number[]) => list.map((n) => ({ value: n, label: String(n) }))
const byteMode = computed(() => props.node?.data?.kind === 'ram' && params.value.addressing === 'byte')
const widthOptions = computed(() => {
  const list = byteMode.value ? [8, 16, 32] : props.node?.data?.kind === 'split' || props.node?.data?.kind === 'merge' ? [2, 3, 4, 6, 8, 12, 16, 24, 32] : [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 24, 32]
  return list.map((n) => ({ value: n, label: `${n} bit${n > 1 ? 's' : ''}` }))
})
function setWidth(n: number) {
  const p: Partial<Params> = { width: n }
  // A splitter's parts must divide its width
  if (has('parts') && n % (params.value.parts ?? 2)) p.parts = n
  patch(p)
}
const partOptions = computed(() => {
  const n = params.value.width ?? 8
  return Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0 && d > 1).map((d) => ({ value: d, label: `${d} × ${n / d} bit${n / d > 1 ? 's' : ''}` }))
})
const isMem = computed(() => props.node?.data?.kind === 'ram' || props.node?.data?.kind === 'rom')
// As many words as fit 16 MiB (8-bit words: 24 address bits)
const count = (n: number) => (n >= 20 ? `${2 ** (n - 20)} Mi` : n >= 10 ? `${2 ** (n - 10)} Ki` : String(2 ** n))
const selectOptions = computed(() => {
  const most = isMem.value ? maxAddressBits(byteMode.value ? 8 : params.value.width ?? 8) : 4
  return Array.from({ length: most }, (_, i) => i + 1).map((n) => ({ value: n, label: isMem.value ? `${n} bits · ${count(n)} ${byteMode.value ? 'bytes' : 'words'}` : `${n} bit${n > 1 ? 's' : ''} · ${2 ** n} ways` }))
})
function setMemWidth(n: number) {
  // A wider word may not fit as many
  const most = maxAddressBits(byteMode.value ? 8 : n)
  patch({ width: n, ...((params.value.select ?? 4) > most && { select: most }) })
}
const toOptions = computed(() => {
  if (props.node?.data?.kind === 'bitsel') {
    const n = params.value.width ?? 8
    return Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0 && d < n).map((d) => ({ value: d, label: `${d} bit${d > 1 ? 's' : ''} · ${n / d} groups` }))
  }
  return [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 24, 32].map((n) => ({ value: n, label: `${n} bit${n > 1 ? 's' : ''}` }))
})
const SHIFTS: { value: ShiftMode; label: string }[] = [
  { value: 'shl', label: 'Left (0s in)' },
  { value: 'shr', label: 'Right (0s in)' },
  { value: 'sar', label: 'Right, keeping the sign' },
  { value: 'rol', label: 'Rotate left' },
  { value: 'ror', label: 'Rotate right' },
]
const subName = computed(() => (props.node?.data?.kind === 'sub' ? getCircuit(params.value.circuit)?.name ?? 'Missing circuit' : ''))
function setAddressing(a: 'word' | 'byte') {
  const w = params.value.width ?? 8
  patch({ addressing: a, ...(a === 'byte' && ![8, 16, 32].includes(w) && { width: w > 16 ? 32 : w > 8 ? 16 : 8 }) })
}

// ── Memory words ────────────────────────────────────────────────────────────────────────────────────────
// Shown a page at a time (a memory can hold millions), following the address input unless you go elsewhere
const isRam = computed(() => props.node?.data?.kind === 'ram')
const size = computed(() => 2 ** (params.value.select ?? 4))
const cellWidth = computed(() => (byteMode.value ? 8 : params.value.width ?? 8))
const digits = computed(() => Math.ceil(cellWidth.value / 4))
const addrDigits = computed(() => Math.max(2, Math.ceil((params.value.select ?? 4) / 4)))
/** The words the memory starts with (its image) */
const image = (): Cells => cellsOf(params.value.image, size.value, cellWidth.value)
/** What it holds now: a RAM's live words, a ROM's image */
const live = (): Cells => (isRam.value ? (c.sim.state.get(c.prefix.value + props.node!.id)?.mem as Cells | undefined) : undefined) ?? image()
const perRow = computed(() => (params.value.asm ? 1 : digits.value <= 2 ? 8 : digits.value <= 4 ? 4 : 2))
const ROWS = 32
const perPage = computed(() => perRow.value * ROWS)
const pages = computed(() => Math.max(1, Math.ceil(size.value / perPage.value)))
const page = ref(0)
const follow = ref(true)
const rows = computed(() => {
  c.version.value
  if (!isMem.value) return []
  const cells = live()
  const first = page.value * perPage.value
  return Array.from({ length: Math.min(ROWS, Math.ceil((size.value - first) / perRow.value)) }, (_, r) => {
    const at = first + r * perRow.value
    return { at, words: Array.from({ length: Math.min(perRow.value, size.value - at) }, (_, j) => cells[at + j] ?? 0) }
  })
})
// Where the address input points right now
const current = computed(() => {
  c.version.value
  const a = props.node ? c.sim.inputsOf(c.prefix.value + props.node.id)[0] : undefined
  return a && a.k === a.m ? a.v : -1
})
watch([current, follow, perPage], () => {
  if (follow.value && current.value >= 0) page.value = Math.floor(current.value / perPage.value)
}, { immediate: true })
function goPage(n: number) {
  follow.value = false
  page.value = Math.min(pages.value - 1, Math.max(0, n))
}
function goTo(text: string) {
  const v = parseInt(text.replace(/^0x/i, ''), 16)
  if (!Number.isNaN(v)) goPage(Math.floor(v / perPage.value))
}
const hex = (v: number, d: number) => v.toString(16).toUpperCase().padStart(d, '0')
function setWord(i: number, text: string) {
  const v = parseInt(text, 16)
  if (Number.isNaN(v)) return
  const value = (v & (2 ** cellWidth.value - 1)) >>> 0
  // An edit changes what it holds now and what it starts with after a reset
  image()[i] = value
  c.poke(c.prefix.value + props.node!.id, { index: [isRam.value ? 'mem' : 'cells', i, value] })
}
function clearWords() {
  image().fill(0)
  c.poke(c.prefix.value + props.node!.id, { fill: [isRam.value ? 'mem' : 'cells', 0] })
}

// ── Memory files ────────────────────────────────────────────────────────────────────────────────────────
const fileInput = ref<HTMLInputElement>()
async function loadFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  ;(e.target as HTMLInputElement).value = ''
  if (!file) return
  const { words, format: kind } = parseMemoryFile(new Uint8Array(await file.arrayBuffer()), cellWidth.value)
  const cells = setCells(params.value.image!, words, size.value, cellWidth.value)
  c.poke(c.prefix.value + props.node!.id, { assign: [isRam.value ? 'mem' : 'cells', cells] })
  follow.value = false
  page.value = 0
  const unit = byteMode.value ? 'bytes' : 'words'
  if (words.length > size.value) toast.warning(`${file.name} (${kind}) has ${words.length} ${unit}: only the first ${size.value} fit. Give the memory more address bits.`)
  else toast.success(`Loaded ${words.length} ${unit} from ${file.name} (${kind})`)
}
function download(kind: 'bin' | 'logisim') {
  const cells = live()
  const blob = kind === 'bin' ? new Blob([toBinary(cells)], { type: 'application/octet-stream' }) : new Blob([toLogisim(cells)], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${props.node!.data!.label || props.node!.data!.kind}.${kind === 'bin' ? 'bin' : 'txt'}`
  a.click()
  URL.revokeObjectURL(a.href)
}

const wire = computed(() => {
  c.version.value
  if (!props.edge) return null
  const s = c.sim.edgeSignal(props.edge, c.prefix.value)
  const { from, to } = c.sim.widthsOf(props.edge, c.prefix.value)
  const name = (id: string) => {
    const n = c.nodes.value.find((x) => x.id === id)
    return n?.data?.label || partByKind.get(n?.data?.kind ?? '')?.label || id
  }
  return { s, from, to, source: name(props.edge.source), target: name(props.edge.target) }
})
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <template v-if="node && def">
      <div class="flex items-center gap-3">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-container text-on-primary-container"><MIcon :name="def.icon" /></span>
        <div class="min-w-0">
          <div class="text-title-medium">{{ def.label }}</div>
          <div class="text-body-small text-on-surface-variant">{{ def.description }}</div>
        </div>
      </div>
      <MTextField :model-value="node.data!.label ?? ''" label="Label" variant="outlined" @update:model-value="c.patchPart(node.id, { label: String($event) })" />
      <div v-if="canTurn(node.data!) && !c.inspecting.value" class="flex items-center gap-2">
        <span class="flex-1 text-body-medium">Facing <b class="capitalize">{{ node.data!.facing ?? 'east' }}</b></span>
        <MIconButton icon="rotate_left" label="Turn left (Shift+R)" variant="tonal" size="sm" @click="emit('rotate', true)" />
        <MIconButton icon="rotate_right" label="Turn right (R)" variant="tonal" size="sm" @click="emit('rotate', false)" />
      </div>
      <MSegmentedButton
        v-if="has('addressing')"
        :model-value="params.addressing ?? 'word'"
        :options="[{ value: 'word', label: 'Word' }, { value: 'byte', label: 'Byte addressing' }]"
        @update:model-value="setAddressing($event as 'word' | 'byte')"
      />
      <MSelect v-if="has('select')" :model-value="params.select" :options="selectOptions" :label="isRam || node.data!.kind === 'rom' ? 'Address' : 'Select'" variant="outlined" @update:model-value="patch({ select: $event as number })" />
      <MSelect v-if="has('width')" :model-value="params.width" :options="widthOptions" :label="isMem ? 'Data width' : node.data!.kind === 'extender' ? 'Width in' : 'Width'" variant="outlined" @update:model-value="isMem ? setMemWidth($event as number) : setWidth($event as number)" />
      <MSelect v-if="has('to')" :model-value="params.to" :options="toOptions" :label="node.data!.kind === 'bitsel' ? 'Group' : 'Width out'" variant="outlined" @update:model-value="patch({ to: $event as number })" />
      <MSelect v-if="has('shift')" :model-value="params.shift" :options="SHIFTS" label="Shift" variant="outlined" @update:model-value="patch({ shift: $event as ShiftMode })" />
      <MSwitch v-if="has('signed')" :model-value="!!params.signed" :icon="false" :label="node.data!.kind === 'probe' ? 'Signed (two\'s complement)' : 'Copy the sign bit'" @update:model-value="patch({ signed: $event })" />
      <template v-if="node.data!.kind === 'sub'">
        <p class="text-body-medium">Places <b>{{ subName }}</b>. Its input pins are this part's inputs and its output pins the outputs, top to bottom; their labels name them.</p>
        <MButton variant="tonal" icon="open_in_new" @click="c.openCircuit(params.circuit!)">Open {{ subName }}</MButton>
      </template>
      <p v-if="node.data!.kind === 'point'" class="text-body-small text-on-surface-variant">A loose end or a junction of wires. While it's selected, drag it to move it (its wires follow); unselected, a drag from it draws a wire on from there.</p>
      <p v-if="node.data!.kind === 'tunnel'" class="text-body-small text-on-surface-variant">The label is the tunnel's name: every tunnel with the same name in this circuit is the same wire. Drive one of them, read from the others.</p>
      <p v-if="node.data!.kind === 'pin' || node.data!.kind === 'outpin'" class="text-body-small text-on-surface-variant">When this circuit is placed in another one as a subcircuit, this pin becomes one of its {{ node.data!.kind === 'pin' ? 'inputs' : 'outputs' }}, named by its label.</p>
      <MSelect
        v-if="has('inputs')"
        :model-value="params.inputs"
        :options="[2, 3, 4, 5, 6, 7, 8].map((n) => ({ value: n, label: `${n} inputs` }))"
        label="Inputs"
        variant="outlined"
        @update:model-value="patch({ inputs: $event as number })"
      />
      <MSelect v-if="has('parts')" :model-value="params.parts" :options="partOptions" label="Parts" variant="outlined" @update:model-value="patch({ parts: $event as number })" />
      <MNumberField v-if="has('freq')" :model-value="params.freq ?? 880" label="Pitch (Hz)" variant="outlined" :min="20" :max="20000" @update:model-value="patch({ freq: $event ?? 880 })" />
      <MSegmentedButton
        v-if="has('pitch')"
        :model-value="params.pitch ?? 'note'"
        :options="[{ value: 'note', label: 'MIDI note' }, { value: 'hz', label: 'Hz (16 bits)' }]"
        @update:model-value="patch({ pitch: $event as 'note' | 'hz' })"
      />
      <p v-if="has('pitch')" class="text-body-small text-on-surface-variant">
        vol 0–15 (unconnected: 15) · wave 0 square, 1 triangle, 2 sawtooth, 3 noise · duty 0 12.5%, 1 25%, 2 50% (unconnected), 3 75% · gate unconnected: sounds while the pitch isn't 0.
        {{ params.pitch === 'hz' ? '' : 'Note 60 is middle C, 69 is A 440 Hz.' }} Several synthesizers play together.
      </p>
      <MSelect
        v-if="has('rate')"
        :model-value="params.rate ?? 8000"
        :options="[4000, 8000, 11025, 16000, 22050, 44100].map((n) => ({ value: n, label: `${n} samples per second` }))"
        label="Sample rate"
        variant="outlined"
        @update:model-value="patch({ rate: $event as number })"
      />
      <MNumberField v-if="has('value') && node.data!.kind === 'piano'" :model-value="params.value ?? 60" label="Lowest key (MIDI note)" variant="outlined" :min="0" :max="103" @update:model-value="patch({ value: $event ?? 60 })" />
      <MNumberField v-else-if="has('value')" :model-value="params.value ?? 0" label="Value" variant="outlined" :min="0" :max="2 ** (params.width ?? 1) - 1" @update:model-value="patch({ value: $event ?? 0 })" />
      <MSegmentedButton
        v-if="has('color')"
        :model-value="params.color ?? 'primary'"
        :options="(['primary', 'secondary', 'tertiary', 'error'] as const).map((r) => ({ value: r, label: r[0]!.toUpperCase() + r.slice(1) }))"
        density="compact"
        @update:model-value="patch({ color: $event as Params['color'] })"
      />
      <template v-if="has('cols')">
        <div class="grid grid-cols-2 gap-3">
          <MSelect :model-value="params.cols" :options="sizeOptions(node.data!.kind === 'tty' ? TTY_COLS : SCREEN_SIZES)" :label="node.data!.kind === 'tty' ? 'Columns' : 'Width'" variant="outlined" @update:model-value="patch({ cols: $event as number })" />
          <MSelect :model-value="params.rows" :options="sizeOptions(node.data!.kind === 'tty' ? TTY_ROWS : SCREEN_SIZES)" :label="node.data!.kind === 'tty' ? 'Rows' : 'Height'" variant="outlined" @update:model-value="patch({ rows: $event as number })" />
        </div>
      </template>
      <MSelect v-if="has('mode')" :model-value="params.mode" :options="colorModes.map((m) => ({ value: m.value, label: m.label }))" label="Color" variant="outlined" @update:model-value="patch({ mode: $event as ColorMode })" />
      <MSelect
        v-if="has('pixel')"
        :model-value="params.pixel ?? 0"
        :options="[{ value: 0, label: 'Fit 256 px' }, ...[1, 2, 3, 4, 6, 8, 12, 16].map((n) => ({ value: n, label: `${n} px per pixel` }))]"
        label="Pixel size"
        variant="outlined"
        @update:model-value="patch({ pixel: $event as number })"
      />
      <MSwitch v-if="has('buffered')" :model-value="!!params.buffered" :icon="false" label="Double buffered (shows a frame on vsync)" @update:model-value="patch({ buffered: $event })" />
      <MSegmentedButton
        v-if="has('serial')"
        :model-value="params.serial ? 'serial' : 'parallel'"
        :options="[{ value: 'parallel', label: 'Byte' }, { value: 'serial', label: 'Shift register' }]"
        @update:model-value="patch({ serial: $event === 'serial' })"
      />
      <p v-if="has('serial')" class="text-body-small text-on-surface-variant">
        {{ params.serial
          ? 'Like the NES pad: while strobe is 1 it loads the buttons; each rising clk after that sends the next one on data (A, B, Select, Start, Up, Down, Left, Right), then 1s.'
          : 'All eight buttons at once: bit 0 A, 1 B, 2 Select, 3 Start, 4 Up, 5 Down, 6 Left, 7 Right.' }}
        Click it, then play with the arrows or WASD, X or K for A, Z or J for B, Shift for Select and Enter for Start.
      </p>
      <p v-if="byteMode" class="text-body-small text-on-surface-variant">
        Every address is one byte. The <b>size</b> input picks how many it reads or writes from there: 0 a byte, 1 two, 2 four
        (no wider than the data). Little-endian: the lowest address holds the lowest byte. Unconnected, it moves the full width.
      </p>

      <section v-if="has('contents')">
        <div class="mb-1 flex items-center gap-1">
          <h3 class="flex-1 text-title-small">{{ isRam ? 'Contents (live)' : 'Contents' }}</h3>
          <MButton variant="text" size="xs" icon="upload_file" @click="fileInput?.click()">Load</MButton>
          <MMenu align="right">
            <template #trigger><MIconButton icon="more_vert" label="More" size="xs" /></template>
            <MMenuItem icon="download" @click="download('bin')">Download as .bin</MMenuItem>
            <MMenuItem icon="description" @click="download('logisim')">Download for Logisim (v2.0 raw)</MMenuItem>
            <MMenuItem icon="clear_all" @click="clearWords">Clear</MMenuItem>
          </MMenu>
          <input ref="fileInput" type="file" class="hidden" @change="loadFile" />
        </div>
        <div v-if="pages > 1" class="mb-1 flex items-center gap-1">
          <MIconButton icon="chevron_left" label="Previous page" size="xs" :disabled="page === 0" @click="goPage(page - 1)" />
          <span class="font-mono text-label-medium text-on-surface-variant">{{ hex(page * perPage, addrDigits) }}</span>
          <MIconButton icon="chevron_right" label="Next page" size="xs" :disabled="page >= pages - 1" @click="goPage(page + 1)" />
          <input
            placeholder="Go to…"
            spellcheck="false"
            aria-label="Go to address (hex)"
            class="h-7 w-20 min-w-0 rounded-xs bg-surface-container-highest px-2 font-mono text-label-medium uppercase outline-none focus:ring-1 focus:ring-primary"
            @change="goTo(($event.target as HTMLInputElement).value)"
          />
          <span class="flex-1" />
          <MIconButton icon="my_location" label="Follow the address" size="xs" :variant="follow ? 'tonal' : 'standard'" @click="follow = !follow" />
        </div>
        <div class="max-h-96 overflow-y-auto rounded-md border border-outline-variant p-1 font-mono text-label-medium">
          <div v-for="row in rows" :key="row.at" class="flex items-center gap-1 px-1">
            <span class="mr-1 text-right text-on-surface-variant" :style="{ width: `${addrDigits}ch` }">{{ hex(row.at, addrDigits) }}</span>
            <template v-for="(word, j) in row.words" :key="row.at + j">
              <input
                :value="hex(word, digits)"
                :maxlength="digits"
                spellcheck="false"
                class="w-[calc(var(--d)*1ch+8px)] rounded-xs bg-transparent px-0.5 py-0.5 text-center uppercase outline-none focus:bg-surface-container-highest focus:ring-1 focus:ring-primary"
                :class="row.at + j === current && 'bg-secondary-container text-on-secondary-container'"
                :style="{ '--d': digits }"
                :aria-label="`Word ${hex(row.at + j, addrDigits)}`"
                @change="setWord(row.at + j, ($event.target as HTMLInputElement).value)"
              />
              <span v-if="params.asm" class="text-on-surface-variant">{{ disassemble(word) }}</span>
            </template>
          </div>
        </div>
        <p class="mt-2 text-body-small text-on-surface-variant">
          Load a raw binary (.bin, .rom; an .nes file without its header), Intel HEX or hex words (Logisim's v2.0 raw too). {{ byteMode ? 'Bytes' : 'Bytes are packed into words little-endian' }}.
        </p>
        <p v-if="params.asm" class="mt-2 text-body-small text-on-surface-variant">
          Tiny8: high nibble the opcode, low nibble its operand <i>a</i>. 0 OUT · 1 LDA a · 2 ADD a · 3 SUB a · 4 STA a · 5 LDI a · 6 JMP a · 7 JZ a.
        </p>
      </section>

      <MButton variant="tonal" color="error" icon="delete" @click="emit('remove')">Delete part</MButton>
    </template>

    <template v-else-if="edge && wire">
      <div class="text-title-medium">Wire</div>
      <div class="text-body-medium text-on-surface-variant">{{ wire.source }} → {{ wire.target }}</div>
      <div v-if="wire.s" class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md bg-surface-container-highest p-3 font-mono text-body-medium">
        <span class="text-on-surface-variant">width</span><span>{{ wire.from }} bit{{ wire.from! > 1 ? 's' : '' }}</span>
        <span class="text-on-surface-variant">hex</span><span>{{ format(wire.s) }}</span>
        <span class="text-on-surface-variant">dec</span><span>{{ format(wire.s, 'dec') }}</span>
        <span class="text-on-surface-variant">bin</span><span class="break-all">{{ format(wire.s, 'bin') }}</span>
      </div>
      <p v-else class="text-body-medium text-error">The ends don't match: {{ wire.from }} bits out, {{ wire.to }} bits in.</p>
      <p class="text-body-small text-on-surface-variant">Drag the grips on its segments to lay it out; drag a leg at either end to add a jog.</p>
      <MButton
        :variant="c.watches.value.includes(edge.id) ? 'filled' : 'tonal'"
        icon="timeline"
        @click="c.watchWire(edge.id)"
      >{{ c.watches.value.includes(edge.id) ? 'Watching it' : 'Watch over time' }}</MButton>
      <MButton v-if="edge.route" variant="tonal" icon="route" @click="emit('straighten', edge.id)">Route it automatically</MButton>
      <MButton variant="tonal" color="error" icon="delete" @click="emit('remove')">Delete wire</MButton>
    </template>
  </div>
</template>
