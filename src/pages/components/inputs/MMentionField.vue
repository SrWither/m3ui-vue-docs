<script setup lang="ts">
import { ref } from 'vue'
import { MButton, MCard, MIconButton, MMentionField } from '@m3ui-vue/m3ui-vue'
import type { MentionItem, MentionRef, MentionSource } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const people: MentionItem[] = [
  { id: 'ana', label: 'Ana López', description: 'Design' },
  { id: 'bruno', label: 'Bruno Díaz', description: 'Backend' },
  { id: 'carla', label: 'Carla Ruiz', description: 'Mobile' },
  { id: 'diego', label: 'Diego Peña', description: 'QA' },
  { id: 'mariana', label: 'Mariana Paz', description: 'Product' },
]
const tags: MentionItem[] = ['bug', 'design', 'release', 'urgent', 'docs'].map((t) => ({ id: t, label: t, icon: 'tag' }))

// First demo: a comment box
const comment = ref('')
const commentMentions = ref<MentionRef[]>([])
const sources: MentionSource[] = [{ trigger: '@', items: people }, { trigger: '#', items: tags }]

// Second demo: a chat composer whose @ asks a (pretend) server
const directory: MentionItem[] = [...people, { id: 'eva', label: 'Eva Morales', description: 'Support' }, { id: 'fede', label: 'Federico Sosa', description: 'Sales' }]
const fold = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
async function searchPeople(query: string, signal: AbortSignal) {
  await new Promise((r, reject) => {
    const t = setTimeout(r, 450)
    signal.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('aborted', 'AbortError')) })
  })
  return directory.filter((p) => fold(p.label).includes(fold(query)))
}
const chatSources: MentionSource[] = [{ trigger: '@', search: searchPeople }]
const draft = ref('')
const draftMentions = ref<MentionRef[]>([])
const composer = ref<{ insert: (text: string) => void }>()
const messages = ref<{ text: string; mentions: MentionRef[] }[]>([
  { text: 'Morning! @Ana López can you check the new icons?', mentions: [{ trigger: '@', id: 'ana', label: 'Ana López' }] },
])
function send() {
  if (!draft.value.trim()) return
  messages.value.push({ text: draft.value.trim(), mentions: draftMentions.value })
  draft.value = ''
  draftMentions.value = []
}
/** A message split into plain text and its mentions, to highlight them */
function parts(m: { text: string; mentions: MentionRef[] }) {
  const tokens = [...new Set(m.mentions.map((x) => `${x.trigger}${x.label}`))]
  if (!tokens.length) return [{ text: m.text, mention: false }]
  const re = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`)
  return m.text.split(re).filter(Boolean).map((text) => ({ text, mention: tokens.includes(text) }))
}

const fieldProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'The text (v-model), plain.' },
  { name: 'mentions', type: 'MentionRef[]', default: '[]', description: 'The picked items still in the text (v-model:mentions): { trigger, id, label }. One whose text is edited away drops out.' },
  { name: 'sources', type: 'MentionSource[]', description: "Trigger characters and where they look: { trigger: '@', items?: MentionItem[], search?: (query, signal) => Promise<MentionItem[]>, limit?: 8 }. Items are filtered here (case and accents ignored, those starting with the query first); search is debounced and aborted when replaced. Required." },
  { name: 'label', type: 'string', description: 'Field label. Required.' },
  { name: 'multiline', type: 'boolean', default: 'true', description: 'A textarea; false for one line.' },
  { name: 'rows / autoGrow / maxRows', type: 'number / boolean / number', default: '3 / true / —', description: 'As on MTextField.' },
  { name: 'debounce', type: 'number', default: '200', description: 'The delay before a search, in ms.' },
  { name: 'variant / leadingIcon / hint / error (boolean | string) / errorLabel / required / disabled', type: '…', description: 'As on MTextField.' },
  { name: 'rules / validateOn / name', type: '…', description: 'Validation, as on MTextField (see MForm).' },
]
const fieldEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string', description: 'The text changed.' },
  { name: 'update:mentions', payload: 'MentionRef[]', description: 'The picked items still in the text changed.' },
  { name: 'mention', payload: '(item: MentionItem, trigger: string)', description: 'An item was picked.' },
]
const fieldSlots: SlotDef[] = [
  { name: 'item', scope: '{ item, source, active }', description: 'One entry of the list instead of the default (avatar, image or icon; label; description).' },
]
const keys = [
  ['@ or # at the start of a word', 'Opens the list for that trigger, filtered as you type; a space or a click elsewhere closes it.'],
  ['↑ ↓', 'Move through the list.'],
  ['Enter or Tab', 'Pick (Shift+Enter still breaks the line).'],
  ['Escape', 'Close the list (only it, inside a dialog).'],
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MMentionField</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A text field with @mentions and #tags: a trigger character at the start of a word opens a list at the caret,
      from items you pass or from a search of yours. Picking writes the trigger and the label into the text, which stays
      plain; the picked items, with their ids, are a second v-model. Built on
      <RouterLink to="/components/inputs/mtextfield" class="text-primary underline">MTextField</RouterLink>, multi-line by default.
    </p>

    <div class="mb-8 overflow-x-auto rounded-xl border border-outline-variant">
      <table class="w-full text-left text-body-medium">
        <tbody>
          <tr v-for="[k, what] in keys" :key="k" class="border-b border-outline-variant last:border-b-0">
            <td class="whitespace-nowrap px-4 py-2 font-medium text-on-surface">{{ k }}</td>
            <td class="px-4 py-2 text-on-surface-variant">{{ what }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ComponentDemo
      title="People and tags"
      description="A comment box: @ lists people (initials when there's no photo), # lists tags (an icon). Below, the two v-models."
      :code="`<MMentionField v-model=&quot;comment&quot; v-model:mentions=&quot;mentions&quot; :sources=&quot;sources&quot; label=&quot;Comment&quot; />`"
      :script="`import { MMentionField } from '@m3ui-vue/m3ui-vue'

const sources = [
  { trigger: '@', items: [{ id: 'ana', label: 'Ana López', description: 'Design' }, /* … */] },
  { trigger: '#', items: [{ id: 'bug', label: 'bug', icon: 'tag' }, /* … */] },
]
const comment = ref('')
const mentions = ref([])`"
    >
      <div class="flex w-full max-w-xl flex-col gap-3">
        <MMentionField v-model="comment" v-model:mentions="commentMentions" :sources="sources" label="Comment" hint="Try @ana or #bug" />
        <pre class="overflow-auto rounded-xl bg-surface-container-high p-3 font-mono text-body-small text-on-surface-variant">text: {{ JSON.stringify(comment) }}
mentions: {{ JSON.stringify(commentMentions) }}</pre>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="A chat composer, asking a server"
      description="@ looks people up through search (a pretend server, half a second away: the list says Loading meanwhile). The @ button inserts a trigger at the caret with insert(). Sent messages highlight their mentions from the mentions v-model."
      :code="`<MMentionField
  ref=&quot;composer&quot;
  v-model=&quot;draft&quot;
  v-model:mentions=&quot;draftMentions&quot;
  :sources=&quot;[{ trigger: '@', search: searchPeople }]&quot;
  label=&quot;Message&quot;
  :rows=&quot;1&quot;
  :max-rows=&quot;5&quot;
  class=&quot;flex-1&quot;
  @keydown.enter.exact=&quot;onEnter&quot;
/>
<MIconButton icon=&quot;alternate_email&quot; label=&quot;Mention someone&quot; @click=&quot;composer.insert('@')&quot; />
<MIconButton icon=&quot;send&quot; label=&quot;Send&quot; variant=&quot;filled&quot; @click=&quot;send&quot; />`"
      :script="`// Enter sends, unless it just picked from the list (that Enter comes already prevented)
function onEnter(e) {
  if (e.defaultPrevented) return
  e.preventDefault()
  send()
}

// Your API: the text after @ in, people out; signal aborts a search the user replaced
async function searchPeople(query, signal) {
  const res = await fetch(\`/api/people?q=\${encodeURIComponent(query)}\`, { signal })
  return (await res.json()).map((p) => ({ id: p.id, label: p.name, description: p.team, avatar: p.photo }))
}`"
    >
      <MCard variant="outlined" class="flex w-full max-w-xl flex-col gap-3 p-4">
        <div class="flex max-h-56 flex-col gap-2 overflow-y-auto">
          <p v-for="(m, i) in messages" :key="i" class="self-start rounded-2xl rounded-bl-sm bg-surface-container-high px-3 py-2 text-body-medium">
            <template v-for="(p, j) in parts(m)" :key="j">
              <span v-if="p.mention" class="font-medium text-primary">{{ p.text }}</span>
              <template v-else>{{ p.text }}</template>
            </template>
          </p>
        </div>
        <div class="flex items-end gap-1">
          <MMentionField
            ref="composer"
            v-model="draft"
            v-model:mentions="draftMentions"
            :sources="chatSources"
            label="Message"
            :rows="1"
            :max-rows="5"
            class="min-w-0 flex-1"
            @keydown.enter.exact="(e: KeyboardEvent) => { if (!e.defaultPrevented) { e.preventDefault(); send() } }"
          />
          <MIconButton icon="alternate_email" label="Mention someone" class="mb-2" @click="composer?.insert('@')" />
          <MIconButton icon="send" label="Send" variant="filled" class="mb-2" @click="send" />
        </div>
        <MButton v-if="messages.length > 1" variant="text" size="sm" class="self-start" @click="messages.splice(1)">Clear the chat</MButton>
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fieldProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="fieldEvents" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="fieldSlots" />
    <p class="mt-4 text-body-medium text-on-surface-variant">
      A template ref exposes <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">focus()</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">insert(text)</code> (at the caret; a trigger opens its list).
    </p>

    <ComponentPager current="MMentionField" />
  </div>
</template>
