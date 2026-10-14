<script lang="ts">
// Module-level state: survives the window being minimized (its content unmounts while hidden).
import { ref } from 'vue'

interface Entry { name: string; icon: string; meta: string; children?: Entry[]; opens?: string }

const tree: Entry[] = [
  { name: 'Documents', icon: 'folder', meta: '4 items', children: [
    { name: 'Roadmap Q4.pdf', icon: 'picture_as_pdf', meta: '2.4 MB' },
    { name: 'Budget.xlsx', icon: 'table_chart', meta: '86 KB' },
    { name: 'Meeting notes', icon: 'sticky_note_2', meta: 'Opens in Notes', opens: 'notes' },
    { name: 'Contracts', icon: 'folder', meta: '2 items', children: [
      { name: 'Client A.pdf', icon: 'picture_as_pdf', meta: '640 KB' },
      { name: 'Client B.pdf', icon: 'picture_as_pdf', meta: '712 KB' },
    ] },
  ] },
  { name: 'Pictures', icon: 'folder', meta: '3 items', children: [
    { name: 'Lisbon.jpg', icon: 'image', meta: '3.1 MB' },
    { name: 'Team offsite.jpg', icon: 'image', meta: '2.7 MB' },
    { name: 'Logo.svg', icon: 'image', meta: '18 KB' },
  ] },
  { name: 'Music', icon: 'folder', meta: '2 items', children: [
    { name: 'Midnight City.mp3', icon: 'music_note', meta: 'Opens in Music', opens: 'music' },
    { name: 'Digital Love.mp3', icon: 'music_note', meta: 'Opens in Music', opens: 'music' },
  ] },
  { name: 'Projects', icon: 'folder', meta: '2 items', children: [
    { name: 'm3ui-vue', icon: 'folder_special', meta: 'Vue component library', children: [] },
    { name: 'Sprint board', icon: 'view_kanban', meta: 'Opens in Tasks', opens: 'tasks' },
  ] },
  { name: 'Readme.txt', icon: 'description', meta: '1 KB' },
]

const path = ref<Entry[]>([])
const view = ref<'grid' | 'list'>('grid')
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { MBreadcrumbs, MIcon, MSegmentedButton } from '@m3ui-vue/m3ui-vue'
import type { BreadcrumbItem } from '@m3ui-vue/m3ui-vue'
import { useDesktop } from '../useDesktop'

const { open } = useDesktop()

const places = tree.filter((e) => e.children)
const items = computed(() => path.value.at(-1)?.children ?? tree)
const crumbs = computed<BreadcrumbItem[]>(() => [
  { label: 'Home', icon: 'home' },
  ...path.value.map((e) => ({ label: e.name })),
])

function enter(e: Entry) {
  if (e.opens) return open(e.opens)
  if (e.children) path.value = [...path.value, e]
}
function goTo(_: BreadcrumbItem, index: number) {
  path.value = path.value.slice(0, index)
}
</script>

<template>
  <div class="flex h-full">
    <!-- Places -->
    <aside class="hidden w-40 shrink-0 flex-col gap-0.5 border-r border-outline-variant/60 p-2 sm:flex">
      <button
        type="button"
        class="flex items-center gap-2 rounded-full px-3 py-2 text-left text-label-large"
        :class="!path.length ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-on-surface/8'"
        @click="path = []"
      >
        <MIcon name="home" :size="20" /> Home
      </button>
      <button
        v-for="p in places"
        :key="p.name"
        type="button"
        class="flex items-center gap-2 rounded-full px-3 py-2 text-left text-label-large"
        :class="path[0] === p ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-on-surface/8'"
        @click="path = [p]"
      >
        <MIcon :name="p.name === 'Pictures' ? 'image' : p.name === 'Music' ? 'music_note' : p.name === 'Projects' ? 'code' : 'description'" :size="20" />
        {{ p.name }}
      </button>
    </aside>

    <section class="flex min-w-0 flex-1 flex-col">
      <div class="flex items-center gap-2 border-b border-outline-variant/60 px-3 py-1.5">
        <MBreadcrumbs :items="crumbs" class="min-w-0 flex-1" @select="goTo" />
        <MSegmentedButton
          v-model="view"
          :options="[{ value: 'grid', label: '', icon: 'grid_view' }, { value: 'list', label: '', icon: 'list' }]"
          class="shrink-0"
        />
      </div>

      <div class="min-h-0 flex-1 overflow-auto p-2">
        <p v-if="!items.length" class="py-10 text-center text-body-medium text-on-surface-variant">This folder is empty</p>
        <div v-else-if="view === 'grid'" class="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-1">
          <button
            v-for="e in items"
            :key="e.name"
            type="button"
            class="flex flex-col items-center gap-1 rounded-xl p-2 text-center hover:bg-on-surface/8"
            :title="e.meta"
            @dblclick="enter(e)"
            @keydown.enter="enter(e)"
            @pointerup="$event.pointerType === 'touch' && enter(e)"
          >
            <MIcon :name="e.icon" :size="40" :class="e.children ? 'text-primary' : 'text-on-surface-variant'" />
            <span class="line-clamp-2 text-label-medium text-on-surface">{{ e.name }}</span>
          </button>
        </div>
        <div v-else class="flex flex-col">
          <button
            v-for="e in items"
            :key="e.name"
            type="button"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-on-surface/8"
            @dblclick="enter(e)"
            @keydown.enter="enter(e)"
            @pointerup="$event.pointerType === 'touch' && enter(e)"
          >
            <MIcon :name="e.icon" :size="22" :class="e.children ? 'text-primary' : 'text-on-surface-variant'" />
            <span class="flex-1 truncate text-body-medium text-on-surface">{{ e.name }}</span>
            <span class="text-label-small text-on-surface-variant">{{ e.meta }}</span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
