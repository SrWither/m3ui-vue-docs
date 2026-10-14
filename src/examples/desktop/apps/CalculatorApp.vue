<script lang="ts">
// Module-level state: survives the window being minimized (its content unmounts while hidden).
import { ref } from 'vue'

const display = ref('0')
const stored = ref<number | null>(null)
const op = ref<string | null>(null)
const fresh = ref(true)
const history = ref('')
</script>

<script setup lang="ts">
const keys = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
]

const calc = (a: number, b: number, o: string) =>
  o === '+' ? a + b : o === '−' ? a - b : o === '×' ? a * b : o === '÷' ? (b === 0 ? NaN : a / b) : b
const show = (n: number) => (Number.isFinite(n) ? String(Number(n.toPrecision(12))) : 'Error')

function press(k: string) {
  if (/\d/.test(k)) {
    display.value = fresh.value || display.value === '0' ? k : display.value + k
    fresh.value = false
  } else if (k === '.') {
    if (fresh.value) display.value = '0.'
    else if (!display.value.includes('.')) display.value += '.'
    fresh.value = false
  } else if (k === 'C') {
    display.value = '0'
    stored.value = op.value = null
    history.value = ''
    fresh.value = true
  } else if (k === '⌫') {
    display.value = display.value.length > 1 ? display.value.slice(0, -1) : '0'
  } else if (k === '±') {
    display.value = show(-Number(display.value))
  } else if (k === '%') {
    display.value = show(Number(display.value) / 100)
  } else if (k === '=') {
    if (op.value === null || stored.value === null) return
    history.value = `${show(stored.value)} ${op.value} ${display.value} =`
    display.value = show(calc(stored.value, Number(display.value), op.value))
    stored.value = op.value = null
    fresh.value = true
  } else {
    // An operator: chain with the pending one first.
    const value = Number(display.value)
    stored.value = op.value && !fresh.value && stored.value !== null ? calc(stored.value, value, op.value) : value
    op.value = k
    history.value = `${show(stored.value)} ${k}`
    display.value = show(stored.value)
    fresh.value = true
  }
}

const keyMap: Record<string, string> = { '/': '÷', '*': '×', '-': '−', '+': '+', Enter: '=', '=': '=', Backspace: '⌫', Escape: 'C', '.': '.', ',': '.', '%': '%' }
function onKey(e: KeyboardEvent) {
  const k = /^\d$/.test(e.key) ? e.key : keyMap[e.key]
  if (!k) return
  e.preventDefault()
  press(k)
}

function tone(k: string) {
  if (k === '=') return 'bg-primary text-on-primary'
  if ('÷×−+'.includes(k)) return 'bg-secondary-container text-on-secondary-container'
  if ('C±%⌫'.includes(k)) return 'bg-tertiary-container text-on-tertiary-container'
  return 'bg-surface-container-highest text-on-surface'
}
</script>

<template>
  <div class="flex h-full flex-col gap-3 p-3 outline-none" tabindex="0" aria-label="Calculator, type to use the keyboard" @keydown="onKey">
    <div class="flex flex-col items-end justify-end rounded-2xl bg-surface-container-low px-4 py-3" style="min-height: 92px">
      <span class="h-5 text-body-medium text-on-surface-variant">{{ history }}</span>
      <span class="w-full truncate text-right text-display-small tabular-nums text-on-surface">{{ display }}</span>
    </div>
    <div class="grid flex-1 grid-cols-4 gap-2">
      <template v-for="row in keys" :key="row.join()">
        <button
          v-for="k in row"
          :key="k"
          type="button"
          class="cursor-pointer rounded-2xl text-title-large transition-[filter,border-radius] duration-150 hover:brightness-95 active:rounded-lg"
          :class="tone(k)"
          @click="press(k)"
        >
          {{ k }}
        </button>
      </template>
    </div>
  </div>
</template>
