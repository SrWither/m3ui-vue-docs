<script lang="ts">
// Module-level state: the session survives the window being minimized.
import { ref } from 'vue'

interface Line { kind: 'in' | 'out' | 'err'; text: string }
const lines = ref<Line[]>([
  { kind: 'out', text: 'm3ui desktop terminal. Type "help" to see what it can do.' },
])
const historyList: string[] = []
</script>

<script setup lang="ts">
import { nextTick, onMounted, ref as vref } from 'vue'
import { useRouter } from 'vue-router'
import { palettes, useColorPalette, useTheme } from '@m3ui-vue/m3ui-vue'
import { useDesktop, type Wallpaper } from '../useDesktop'

const router = useRouter()
const desktop = useDesktop()
const { set: setPalette, palette } = useColorPalette()
const { theme } = useTheme()

const input = vref('')
const inputEl = vref<HTMLInputElement>()
const scroller = vref<HTMLElement>()
let historyIndex = -1

const print = (text: string, kind: Line['kind'] = 'out') => lines.value.push({ kind, text })

const commands: Record<string, { help: string; run: (args: string[]) => void }> = {
  help: {
    help: 'list the commands',
    run: () => Object.entries(commands).forEach(([name, c]) => print(`  ${name.padEnd(10)} ${c.help}`)),
  },
  apps: { help: 'list the apps', run: () => print(desktop.apps.map((a) => a.id).join('  ')) },
  open: {
    help: 'open <app>',
    run: ([id]) => (id && desktop.apps.some((a) => a.id === id) ? desktop.open(id) : print(`open: no app "${id ?? ''}"`, 'err')),
  },
  close: {
    help: 'close <app>',
    run: ([id]) => (id && desktop.running.value.includes(id) ? desktop.quit(id) : print(`close: "${id ?? ''}" isn't running`, 'err')),
  },
  ps: { help: 'running apps', run: () => print(desktop.running.value.join('  ') || '(none)') },
  theme: {
    help: 'theme [light|dark|system]',
    run: ([t]) => {
      if (!t) return print(theme.value)
      if (!['light', 'dark', 'system'].includes(t)) return print('theme: light, dark or system', 'err')
      theme.value = t as typeof theme.value
      print(`theme set to ${t}`)
    },
  },
  palette: {
    help: 'palette [name], see "palettes"',
    run: ([p]) => {
      if (!p) return print(palette.value)
      if (!palettes.some((x) => x.id === p)) return print(`palette: no palette "${p}"`, 'err')
      setPalette(p)
      print(`palette set to ${p}`)
    },
  },
  palettes: { help: 'list the palettes', run: () => print(palettes.map((p) => p.id).join('  ')) },
  wallpaper: {
    help: 'wallpaper [aurora|shapes|plain]',
    run: ([w]) => {
      if (!w) return print(desktop.wallpaper.value)
      if (!['aurora', 'shapes', 'plain'].includes(w)) return print('wallpaper: aurora, shapes or plain', 'err')
      desktop.wallpaper.value = w as Wallpaper
    },
  },
  echo: { help: 'echo <text>', run: (args) => print(args.join(' ')) },
  date: { help: 'current date and time', run: () => print(new Date().toString()) },
  whoami: { help: 'who you are', run: () => print('guest') },
  clear: { help: 'clear the screen', run: () => (lines.value = []) },
  docs: { help: 'back to the docs', run: () => router.push('/examples') },
}

async function submit() {
  const raw = input.value.trim()
  input.value = ''
  historyIndex = -1
  print(raw, 'in')
  if (raw) {
    historyList.unshift(raw)
    const [name, ...args] = raw.split(/\s+/)
    const cmd = commands[name!.toLowerCase()]
    if (cmd) cmd.run(args)
    else print(`${name}: command not found`, 'err')
  }
  await nextTick()
  scroller.value?.scrollTo({ top: scroller.value.scrollHeight })
}

function recall(step: number) {
  historyIndex = Math.max(-1, Math.min(historyList.length - 1, historyIndex + step))
  input.value = historyIndex < 0 ? '' : historyList[historyIndex]!
}

function complete() {
  const [name, arg] = input.value.split(/\s+/)
  const pool = arg === undefined ? Object.keys(commands) : name === 'palette' ? palettes.map((p) => p.id) : desktop.apps.map((a) => a.id)
  const word = arg ?? name ?? ''
  const match = pool.filter((c) => c.startsWith(word))
  if (match.length === 1) input.value = arg === undefined ? `${match[0]} ` : `${name} ${match[0]}`
  else if (match.length > 1) print(match.join('  '))
}

onMounted(() => {
  inputEl.value?.focus()
  scroller.value?.scrollTo({ top: scroller.value.scrollHeight })
})
</script>

<template>
  <div
    ref="scroller"
    class="h-full overflow-auto bg-inverse-surface p-3 font-mono text-body-small text-inverse-on-surface"
    @click="inputEl?.focus()"
  >
    <p
      v-for="(l, i) in lines"
      :key="i"
      class="whitespace-pre-wrap break-words"
      :class="l.kind === 'err' ? 'text-error-container' : l.kind === 'in' ? 'text-inverse-primary' : ''"
    >
      <template v-if="l.kind === 'in'">guest@m3ui:~$ </template>{{ l.text }}
    </p>
    <label class="flex">
      <span class="shrink-0 text-inverse-primary">guest@m3ui:~$&nbsp;</span>
      <input
        ref="inputEl"
        v-model="input"
        aria-label="Command"
        spellcheck="false"
        autocomplete="off"
        class="min-w-0 flex-1 bg-transparent text-inverse-on-surface caret-inverse-primary outline-none"
        @keydown.enter="submit"
        @keydown.up.prevent="recall(1)"
        @keydown.down.prevent="recall(-1)"
        @keydown.tab.prevent="complete"
      />
    </label>
  </div>
</template>
