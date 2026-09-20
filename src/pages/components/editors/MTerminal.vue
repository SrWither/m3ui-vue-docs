<script setup lang="ts">
import { ref } from 'vue'
import { MCard } from '@m3ui-vue/m3ui-vue'
import { MTerminal } from '@m3ui-vue/m3ui-vue/terminal'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const terminalLines = ['$ npm install @m3ui-vue/m3ui-vue', 'added 42 packages in 3.2s', '$ echo "Ready!"', 'Ready!']

const interactiveTerminalRef = ref<InstanceType<typeof MTerminal>>()
const interactivePrompt = 'guest@m3ui-vue:~$ '
const interactiveWelcome = [
  'M3UI interactive terminal — try: help, echo <text>, date, whoami, clear',
  interactivePrompt,
]

function runTerminalCommand(input: string) {
  const term = interactiveTerminalRef.value
  if (!term) return
  const cmd = input.trim()

  if (cmd === 'clear') {
    term.clear()
  } else if (cmd === 'help') {
    term.writeln('Available commands: help, echo <text>, date, whoami, clear')
  } else if (cmd.startsWith('echo ')) {
    term.writeln(cmd.slice(5))
  } else if (cmd === 'date') {
    term.writeln(new Date().toString())
  } else if (cmd === 'whoami') {
    term.writeln('guest')
  } else if (cmd !== '') {
    term.writeln(`command not found: ${cmd}`)
  }

  term.write(interactivePrompt)
}

const terminalProps: PropDef[] = [
  { name: 'lines', type: 'string[]', default: '[]', description: 'Initial lines to display' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Disable input' },
  { name: 'title', type: 'string', default: "'Terminal'", description: 'Title bar text' },
  { name: 'minHeight', type: 'string', default: "'300px'", description: 'Minimum height' },
]

const terminalEvents: EventDef[] = [
  { name: 'input', payload: 'string', description: 'Emitted for every raw keystroke/data chunk xterm receives (not readonly)' },
  { name: 'line', payload: 'string', description: "Emitted with the buffered text once the user presses Enter — the usual event to handle a submitted command" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTerminal</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A terminal emulator built on xterm.js — pre-filled static output, or fully interactive keyboard input.
    </p>

    <MCard variant="outlined" class="mb-6 p-4">
      <div class="flex items-start gap-3">
        <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container text-label-small font-medium">!</span>
        <div>
          <p class="text-body-medium font-medium">Peer dependencies required</p>
          <p class="mt-1 text-body-medium text-on-surface-variant">
            MTerminal requires <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@xterm/xterm</code> and
            <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">@xterm/addon-fit</code> as peer dependencies.
            Install them with: <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">pnpm add @xterm/xterm @xterm/addon-fit</code>
          </p>
        </div>
      </div>
    </MCard>

    <ComponentDemo
      title="Terminal"
      description="Terminal emulator with pre-filled output lines."
      :code="`<MTerminal :lines=&quot;lines&quot; :readonly=&quot;true&quot; title=&quot;Installation&quot; />`"
      :script="`import { MTerminal } from '@m3ui-vue/m3ui-vue/terminal'

const lines = [
  '$ npm install @m3ui-vue/m3ui-vue',
  'added 42 packages in 3.2s',
  '$ echo &quot;Ready!&quot;',
  'Ready!',
]`"
    >
      <div class="w-full">
        <MTerminal :lines="terminalLines" :readonly="true" title="Installation" min-height="200px" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Interactive Terminal"
      description="Terminal that accepts real keyboard input — click inside and try typing a command. Uses a template ref to call the instance methods below (write/writeln/clear) from the line event handler."
      :code="`<MTerminal
  ref=&quot;terminalRef&quot;
  :lines=&quot;welcomeLines&quot;
  :readonly=&quot;false&quot;
  title=&quot;Interactive&quot;
  @line=&quot;onLine&quot;
/>`"
      :script="`import { ref } from 'vue'
import { MTerminal } from '@m3ui-vue/m3ui-vue/terminal'

const terminalRef = ref<InstanceType<typeof MTerminal>>()
const prompt = 'guest@m3ui-vue:~$ '
const welcomeLines = [
  'M3UI interactive terminal — try: help, echo &lt;text&gt;, date, whoami, clear',
  prompt,
]

function onLine(input: string) {
  const term = terminalRef.value
  if (!term) return
  const cmd = input.trim()

  if (cmd === 'clear') {
    term.clear()
  } else if (cmd === 'help') {
    term.writeln('Available commands: help, echo &lt;text&gt;, date, whoami, clear')
  } else if (cmd.startsWith('echo ')) {
    term.writeln(cmd.slice(5))
  } else if (cmd === 'date') {
    term.writeln(new Date().toString())
  } else if (cmd === 'whoami') {
    term.writeln('guest')
  } else if (cmd !== '') {
    term.writeln(\`command not found: \${cmd}\`)
  }

  term.write(prompt)
}`"
    >
      <div class="w-full">
        <MTerminal
          ref="interactiveTerminalRef"
          :lines="interactiveWelcome"
          :readonly="false"
          title="Interactive"
          min-height="240px"
          @line="runTerminalCommand"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="terminalProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="terminalEvents" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Instance methods (via template ref)</p>
      <p class="mb-3 text-body-medium text-on-surface-variant">
        MTerminal exposes a handful of imperative methods for driving output from the outside — used above to
        answer typed commands.
      </p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>write(text: string): void    // write raw text at the cursor, no trailing newline
writeln(text: string): void  // write text followed by a newline
clear(): void                // clear the scrollback and screen
focus(): void                // focus the underlying xterm instance</code></pre>
    </MCard>

    <ComponentPager current="MTerminal" />
  </div>
</template>
