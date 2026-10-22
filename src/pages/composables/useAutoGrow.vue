<script setup lang="ts">
import { ref } from 'vue'
import { MCard, MIconButton, useAutoGrow } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const text = ref('')
const field = ref<HTMLTextAreaElement>()
const sent = ref<string[]>(['Hey! Try typing a long message here.'])
useAutoGrow(field, { maxRows: 5, value: text })

function send() {
  const value = text.value.trim()
  if (!value) return
  sent.value = [...sent.value, value]
  text.value = ''
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    send()
  }
}

const types: TypeDef[] = [
  {
    name: 'useAutoGrow(textarea, options?)',
    description: 'Grows a <textarea> with its text, between minRows and maxRows rows, scrolling past the last one',
    fields: [
      { name: 'textarea', type: 'MaybeRefOrGetter<HTMLTextAreaElement | null | undefined>', required: true, description: 'The textarea: a template ref works, and so does one that appears later (in a dialog)' },
      { name: 'options.minRows', type: 'MaybeRefOrGetter<number>', description: 'Fewest rows it shrinks to (default 1)' },
      { name: 'options.maxRows', type: 'MaybeRefOrGetter<number>', description: 'Most rows it grows to; past them it scrolls. Unset grows without limit' },
      { name: 'options.value', type: 'WatchSource', description: 'The text, when it changes without typing (cleared after sending, an emoji inserted): the height follows it. Typing is followed on its own' },
    ],
  },
  {
    name: 'Returns',
    fields: [
      { name: 'resize', type: '() => void', description: 'Measures again, for anything else that changes the text or its style' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useAutoGrow</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Makes your own <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">&lt;textarea&gt;</code> grow
      with its text: a chat composer, a comment box, a post editor. Rows are measured from the textarea's own line height,
      padding and border, so it works however you style it. For a labeled form field, MTextField's
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">autoGrow</code> does the same.
    </p>

    <ComponentDemo
      title="Chat composer"
      description="One line to start, up to five, then it scrolls. Enter sends (Shift+Enter breaks the line) and the field shrinks back once it's cleared."
      :code="`<div class=&quot;flex items-end rounded-3xl bg-surface-container-high px-1&quot;>
  <textarea
    ref=&quot;field&quot;
    v-model=&quot;text&quot;
    rows=&quot;1&quot;
    placeholder=&quot;Message&quot;
    class=&quot;min-w-0 flex-1 resize-none bg-transparent px-3 py-3 text-body-large outline-none&quot;
    @keydown=&quot;onKeydown&quot;
  />
  <MIconButton icon=&quot;send&quot; label=&quot;Send&quot; color=&quot;primary&quot; class=&quot;mb-1&quot; @click=&quot;send&quot; />
</div>`"
      :script="`import { ref } from 'vue'
import { useAutoGrow } from '@m3ui-vue/m3ui-vue'

const text = ref('')
const field = ref<HTMLTextAreaElement>()
useAutoGrow(field, { maxRows: 5, value: text })`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <div class="flex flex-col items-end gap-2">
          <p v-for="(m, i) in sent" :key="i" class="max-w-[80%] rounded-2xl bg-primary-container px-3 py-2 text-body-medium whitespace-pre-wrap text-on-primary-container">{{ m }}</p>
        </div>
        <div class="flex items-end rounded-3xl bg-surface-container-high px-1">
          <textarea
            ref="field"
            v-model="text"
            rows="1"
            placeholder="Message"
            aria-label="Message"
            class="min-w-0 flex-1 resize-none bg-transparent px-3 py-3 text-body-large text-on-surface outline-none placeholder:text-on-surface-variant"
            @keydown="onKeydown"
          />
          <MIconButton icon="send" label="Send" color="primary" class="mb-1" @click="send" />
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>It sets the textarea's height and overflow inline; leave its height to it (no h-* or max-h-* classes)</li>
        <li>Width changes rewrap the text, so it measures again when the textarea gets wider or narrower</li>
        <li>Call it inside <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">setup</code>: it lets go of the textarea when the component unmounts</li>
      </ul>
    </MCard>

    <ComponentPager current="useAutoGrow" />
  </div>
</template>
