<script setup lang="ts">
/*
 * The selected part's settings (label, width, inputs, select bits, addressing, color, value), a ROM's or RAM's
 * words as an editable hex grid (a RAM shows and edits what it holds right now), or what the selected wire carries.
 */
import { computed } from 'vue'
import { MButton, MIcon, MNumberField, MSegmentedButton, MSelect, MSwitch, MTextField } from '@m3ui-vue/m3ui-vue'
import { colorModes, type ColorMode } from '../devices'
import type { FlowEdge } from '@m3ui-vue/m3ui-vue/flow'
import { disassemble, partByKind, type Params } from '../parts'
import { format } from '../logic'
import { useCircuit } from '../useCircuit'
import type { PartNode } from '../sim'

const props = defineProps<{ node?: PartNode; edge?: FlowEdge }>()
const emit = defineEmits<{ remove: [] }>()
const c = useCircuit()

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
const selectOptions = computed(() => {
  const mem = props.node?.data?.kind === 'ram' || props.node?.data?.kind === 'rom'
  return Array.from({ length: mem ? 8 : 4 }, (_, i) => i + 1).map((n) => ({ value: n, label: mem ? `${n} bits · ${2 ** n} ${byteMode.value ? 'bytes' : 'words'}` : `${n} bit${n > 1 ? 's' : ''} · ${2 ** n} ways` }))
})
function setAddressing(a: 'word' | 'byte') {
  const w = params.value.width ?? 8
  patch({ addressing: a, ...(a === 'byte' && ![8, 16, 32].includes(w) && { width: w > 16 ? 32 : w > 8 ? 16 : 8 }) })
}

// ── Memory words ────────────────────────────────────────────────────────────────────────────────────────
const isRam = computed(() => props.node?.data?.kind === 'ram')
const size = computed(() => 2 ** (params.value.select ?? 4))
const cellWidth = computed(() => (byteMode.value ? 8 : params.value.width ?? 8))
const digits = computed(() => Math.ceil(cellWidth.value / 4))
const words = computed<number[]>(() => {
  c.version.value
  const live = isRam.value ? (c.sim.state.get(props.node!.id)?.mem as number[] | undefined) : undefined
  return Array.from({ length: size.value }, (_, i) => live?.[i] ?? params.value.contents?.[i] ?? 0)
})
// Where the address input points right now
const current = computed(() => {
  c.version.value
  const a = props.node ? c.sim.inputsOf(props.node.id)[0] : undefined
  return a && a.k === a.m ? a.v : -1
})
function setWord(i: number, text: string) {
  const v = parseInt(text, 16)
  if (Number.isNaN(v)) return
  const value = (v & (2 ** cellWidth.value - 1)) >>> 0
  const contents = [...words.value]
  contents[i] = value
  // A RAM's edit changes what it holds now and what it starts with after a reset
  if (isRam.value) c.poke(props.node!.id, (st) => (st.mem[i] = value))
  patch({ contents })
}
function clearWords() {
  if (isRam.value) c.poke(props.node!.id, (st) => st.mem.fill(0))
  patch({ contents: [] })
}

const wire = computed(() => {
  c.version.value
  if (!props.edge) return null
  const s = c.sim.edgeSignal(props.edge)
  const { from, to } = c.sim.widthsOf(props.edge)
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
      <MSegmentedButton
        v-if="has('addressing')"
        :model-value="params.addressing ?? 'word'"
        :options="[{ value: 'word', label: 'Word' }, { value: 'byte', label: 'Byte addressing' }]"
        @update:model-value="setAddressing($event as 'word' | 'byte')"
      />
      <MSelect v-if="has('select')" :model-value="params.select" :options="selectOptions" :label="isRam || node.data!.kind === 'rom' ? 'Address' : 'Select'" variant="outlined" @update:model-value="patch({ select: $event as number })" />
      <MSelect v-if="has('width')" :model-value="params.width" :options="widthOptions" :label="isRam || node.data!.kind === 'rom' ? 'Data width' : 'Width'" variant="outlined" @update:model-value="setWidth($event as number)" />
      <MSelect
        v-if="has('inputs')"
        :model-value="params.inputs"
        :options="[2, 3, 4, 5, 6, 7, 8].map((n) => ({ value: n, label: `${n} inputs` }))"
        label="Inputs"
        variant="outlined"
        @update:model-value="patch({ inputs: $event as number })"
      />
      <MSelect v-if="has('parts')" :model-value="params.parts" :options="partOptions" label="Parts" variant="outlined" @update:model-value="patch({ parts: $event as number })" />
      <MNumberField v-if="has('value')" :model-value="params.value ?? 0" label="Value" variant="outlined" :min="0" :max="2 ** (params.width ?? 1) - 1" @update:model-value="patch({ value: $event ?? 0 })" />
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
        <div class="mb-2 flex items-center">
          <h3 class="flex-1 text-title-small">{{ isRam ? 'Contents (live)' : 'Contents' }}</h3>
          <MButton variant="text" size="xs" icon="clear_all" @click="clearWords">Clear</MButton>
        </div>
        <div class="max-h-80 overflow-y-auto rounded-md border border-outline-variant p-1 font-mono text-label-medium">
          <div
            v-for="(word, i) in words"
            :key="i"
            class="flex items-center gap-2 rounded-xs px-1"
            :class="i === current && 'bg-secondary-container text-on-secondary-container'"
          >
            <span class="w-7 text-right text-on-surface-variant">{{ i.toString(16).toUpperCase().padStart(2, '0') }}</span>
            <input
              :value="word.toString(16).toUpperCase().padStart(digits, '0')"
              :maxlength="digits"
              spellcheck="false"
              class="w-[calc(var(--d)*1ch+12px)] rounded-xs bg-transparent px-1 py-0.5 uppercase outline-none focus:bg-surface-container-highest focus:ring-1 focus:ring-primary"
              :style="{ '--d': digits }"
              :aria-label="`Word ${i}`"
              @change="setWord(i, ($event.target as HTMLInputElement).value)"
            />
            <span v-if="params.asm" class="text-on-surface-variant">{{ disassemble(word) }}</span>
          </div>
        </div>
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
      <MButton variant="tonal" color="error" icon="delete" @click="emit('remove')">Delete wire</MButton>
    </template>
  </div>
</template>
