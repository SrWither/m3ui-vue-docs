<script setup lang="ts">
import { computed, ref } from 'vue'
import { MSearchField, MList, MListItem, MIconButton, MAvatar, MEmptyState } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const fieldProps: PropDef[] = [
  { name: 'modelValue', type: 'string', default: "''", description: 'The text (v-model)' },
  { name: 'placeholder', type: 'string', description: "Placeholder. Defaults to the locale's search" },
  { name: 'label', type: 'string', description: 'Accessible name when there is no visible label. Defaults to the placeholder' },
  { name: 'icon', type: 'string', default: "'search'", description: "Leading icon, a Material Symbol. Set to '' for none" },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'lg'", description: "Height: sm 40px (body-medium text), md 48px, lg 56px (M3's search bar)" },
  { name: 'clearable', type: 'boolean', default: 'true', description: "Shows a clear button while there's text" },
  { name: 'clearOnEscape', type: 'boolean', default: 'true', description: 'Escape empties the field (keeping the key from closing a dialog or menu around it); on an empty field it leaves it and lets the key through' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
]
const fieldEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string', description: 'The text, on every keystroke — powers v-model' },
  { name: 'search', payload: 'string', description: 'Enter was pressed, with the text' },
  { name: 'clear', description: 'The clear button (or Escape) emptied the field' },
]
const fieldSlots: SlotDef[] = [
  { name: '#leading', description: 'Replaces the search icon (an avatar, a menu or back button…)' },
  { name: '#trailing', description: 'Extra content after the clear button (a mic button, an avatar, a filter menu…)' },
]

const fruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Kiwi', 'Lemon', 'Mango', 'Orange', 'Peach', 'Pear', 'Plum', 'Raspberry', 'Strawberry']
const query = ref('')
const shown = computed(() => fruits.filter((f) => f.toLowerCase().includes(query.value.toLowerCase())))

const small = ref('')
const medium = ref('')
const large = ref('')
const custom = ref('')
const submitted = ref('')
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSearchField</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A pill-shaped search input that filters in place: a list, a table, a grid of products. Unlike MSearchBar, it
      never expands into a results view; it's just the field, in M3's search bar colors and shape.
    </p>

    <ComponentDemo
      title="Filter a list"
      description="v-model the text and filter whatever sits below it. The clear button shows while there's text; Escape clears it too, and once it's empty, Escape leaves the field and passes on (so a dialog or menu around it closes)."
      :code="`<MSearchField v-model=&quot;query&quot; placeholder=&quot;Search fruit&quot; />
<MList>
  <MListItem v-for=&quot;f in shown&quot; :key=&quot;f&quot; :title=&quot;f&quot; />
</MList>`"
      :script="`const query = ref('')
const shown = computed(() => fruits.filter((f) => f.toLowerCase().includes(query.value.toLowerCase())))`"
    >
      <div class="w-full max-w-sm">
        <MSearchField v-model="query" placeholder="Search fruit" />
        <div class="mt-2 h-64 overflow-y-auto">
          <MList v-if="shown.length">
            <MListItem v-for="f in shown" :key="f" :title="f" />
          </MList>
          <MEmptyState v-else icon="search_off" :title="`No fruit matches “${query}”`" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="lg is M3's 56px search bar; md (48px) and sm (40px, body-medium text) fit toolbars and dense headers."
      :code="`<MSearchField v-model=&quot;q&quot; size=&quot;sm&quot; placeholder=&quot;Small&quot; />
<MSearchField v-model=&quot;q&quot; size=&quot;md&quot; placeholder=&quot;Medium&quot; />
<MSearchField v-model=&quot;q&quot; placeholder=&quot;Large (default)&quot; />`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <MSearchField v-model="small" size="sm" placeholder="Small" />
        <MSearchField v-model="medium" size="md" placeholder="Medium" />
        <MSearchField v-model="large" placeholder="Large (default)" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Slots, colors and Enter"
      description="#leading and #trailing hold buttons or an avatar, like a phone app's search bar. Your classes win over the defaults (here a darker container), and @search fires on Enter."
      :code="`<MSearchField v-model=&quot;q&quot; placeholder=&quot;Search in mail&quot; class=&quot;bg-surface-container-highest&quot; @search=&quot;submitted = $event&quot;>
  <template #leading><MIconButton icon=&quot;menu&quot; label=&quot;Open menu&quot; /></template>
  <template #trailing><MAvatar name=&quot;Ana Torres&quot; :size=&quot;32&quot; /></template>
</MSearchField>`"
    >
      <div class="flex w-full max-w-md flex-col gap-3">
        <MSearchField v-model="custom" placeholder="Search in mail" class="bg-surface-container-highest" @search="submitted = $event">
          <template #leading><MIconButton icon="menu" label="Open menu" /></template>
          <template #trailing><MAvatar name="Ana Torres" :size="32" /></template>
        </MSearchField>
        <p class="text-body-medium text-on-surface-variant">{{ submitted ? `Searched for “${submitted}”` : 'Type and press Enter' }}</p>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="fieldProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="fieldEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="fieldSlots" />

    <p class="mt-4 text-body-small text-on-surface-variant">
      Your <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">class</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">style</code> go on the pill; every
      other attribute (<code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">name</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">autocomplete</code>, aria-*,
      listeners like @focus) goes on the input. A template ref exposes
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">focus()</code>,
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">blur()</code> and
      <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">inputEl</code>.
    </p>

    <ComponentPager current="MSearchField" />
  </div>
</template>
