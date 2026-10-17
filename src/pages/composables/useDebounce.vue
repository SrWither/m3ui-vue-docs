<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MTextField, useDebounce } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const query = ref('')
const log = ref<string[]>([])
const { debounced: search, cancel } = useDebounce((q: string) => {
  log.value = [`GET /api/search?q=${encodeURIComponent(q)}`, ...log.value].slice(0, 5)
}, 400)

function onInput(value: string) {
  query.value = value
  search(value)
}

const types: TypeDef[] = [
  {
    name: 'useDebounce(fn, ms)',
    description: 'Waits until calls stop for ms milliseconds, then calls fn once with the last arguments',
    fields: [
      { name: 'fn', type: '(...args: any[]) => void', required: true, description: 'The function to debounce' },
      { name: 'ms', type: 'number', required: true, description: 'Quiet time in milliseconds before fn runs' },
    ],
  },
  {
    name: 'Returns',
    fields: [
      { name: 'debounced', type: '(...args: any[]) => void', description: 'Call this instead of fn; each call restarts the wait' },
      { name: 'cancel', type: '() => void', description: 'Drops a pending call. Also runs by itself when the component unmounts' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useDebounce</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Runs a function only after calls to it stop for a moment: search as you type without a request per keystroke,
      save a draft after the user pauses. A pending call is dropped when the component unmounts.
    </p>

    <ComponentDemo
      title="Search as you type"
      description="Type quickly: one request goes out 400ms after you stop."
      :code="`<MTextField :model-value=&quot;query&quot; label=&quot;Search&quot; @update:model-value=&quot;onInput&quot; />`"
      :script="`import { ref } from 'vue'
import { useDebounce } from '@m3ui-vue/m3ui-vue'

const query = ref('')
const { debounced: search, cancel } = useDebounce((q: string) => {
  fetch(\`/api/search?q=\${encodeURIComponent(q)}\`)
}, 400)

function onInput(value: string) {
  query.value = value
  search(value)
}`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <MTextField :model-value="query" label="Search" leading-icon="search" @update:model-value="onInput" />
        <MCard variant="filled" class="min-h-24 p-3 font-mono text-body-small">
          <p v-if="!log.length" class="text-on-surface-variant">No requests yet</p>
          <p v-for="(line, i) in log" :key="i" :class="i === 0 ? 'text-on-surface' : 'text-on-surface-variant'">{{ line }}</p>
        </MCard>
        <MButton variant="text" class="self-start" @click="cancel">Cancel pending</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>Call it inside <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">setup</code>: it registers an unmount hook to cancel</li>
        <li>Trailing only: <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">fn</code> runs at the end of the pause, never on the first call</li>
        <li>For a text field alone, MTextField's own <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">debounce</code> prop and <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">@debounced</code> event do the same without this composable</li>
      </ul>
    </MCard>

    <ComponentPager current="useDebounce" />
  </div>
</template>
