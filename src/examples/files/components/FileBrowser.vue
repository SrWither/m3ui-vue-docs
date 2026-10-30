<script setup lang="ts">
/*
 * The files of the current view, as a grid of cards or a list. A click selects (Ctrl/⌘ adds, Shift a range), a
 * double click or Enter opens, right-click or ⋮ shows the actions. Dropping files from the desktop uploads them.
 */
import { computed, ref } from 'vue'
import { MContextMenu, MEmptyState, MIcon, MIconButton, MMenu } from '@m3ui-vue/m3ui-vue'
import { formatDate, formatSize, KIND_COLOR, KIND_ICON, KIND_LABEL, useFiles } from '../useFiles'
import type { Item } from '../data'
import Thumb from './Thumb.vue'
import ItemMenuItems from './ItemMenuItems.vue'

const props = defineProps<{ wide: boolean }>()
const emit = defineEmits<{ rename: [Item] }>()
const f = useFiles()

const folders = computed(() => f.listed.value.filter((i) => i.kind === 'folder'))
const files = computed(() => f.listed.value.filter((i) => i.kind !== 'folder'))

function onClick(e: MouseEvent, i: Item) {
  // On a phone a tap opens, like Drive's app; selecting goes through the checkboxes / long press
  if (!props.wide && !f.selected.value.size) return f.open(i)
  f.select(i.id, e.shiftKey ? 'range' : e.ctrlKey || e.metaKey || (!props.wide && f.selected.value.size) ? 'toggle' : 'only')
}
function onKey(e: KeyboardEvent, i: Item) {
  if (e.key === 'Enter') f.open(i)
  else if (e.key === ' ') {
    e.preventDefault()
    f.select(i.id, 'toggle')
  } else if (e.key === 'Delete') f.trash(f.selected.value.has(i.id) ? f.selectedItems.value : [i])
}

// One right-click menu for every item
const ctx = ref<InstanceType<typeof MContextMenu>>()
const ctxItem = ref<Item | null>(null)
function onContext(e: MouseEvent, i: Item) {
  e.preventDefault()
  if (!f.selected.value.has(i.id)) f.select(i.id)
  ctxItem.value = i
  ctx.value?.showAt(e.clientX, e.clientY)
}

// Long press selects on touch
let pressTimer: ReturnType<typeof setTimeout> | undefined
function onTouchStart(i: Item) {
  clearTimeout(pressTimer)
  pressTimer = setTimeout(() => f.select(i.id, 'toggle'), 450)
}
const cancelPress = () => clearTimeout(pressTimer)

// Dropped files upload here
const dropping = ref(false)
let depth = 0
function onDragEnter(e: DragEvent) {
  if (!e.dataTransfer?.types.includes('Files') || f.section.value === 'trash') return
  depth++
  dropping.value = true
}
function onDragLeave() {
  depth = Math.max(0, depth - 1)
  if (!depth) dropping.value = false
}
function onDrop(e: DragEvent) {
  depth = 0
  dropping.value = false
  if (e.dataTransfer?.files.length && f.section.value !== 'trash') f.upload(e.dataTransfer.files)
}

const empty = computed(() => {
  if (f.query.value) return { icon: 'search_off', title: 'No matching files', description: `Nothing named like "${f.query.value}".` }
  return {
    files: { icon: 'folder_open', title: 'This folder is empty', description: 'Drop files here, or use New to upload some.' },
    recent: { icon: 'schedule', title: 'Nothing recent', description: 'Files you open show up here.' },
    starred: { icon: 'star', title: 'No starred files', description: 'Star the files you come back to, to find them here.' },
    shared: { icon: 'group', title: 'Nothing shared', description: 'Files others share with you show up here.' },
    trash: { icon: 'delete', title: 'Trash is empty', description: 'Items in the trash are deleted for good after 30 days.' },
  }[f.section.value]
})
</script>

<template>
  <div
    class="relative min-h-full"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
    @click.self="f.clearSelection()"
  >
    <MEmptyState v-if="!f.listed.value.length" :icon="empty.icon" :title="empty.title" :description="empty.description" class="pt-16" />

    <!-- Grid -->
    <template v-else-if="f.layout.value === 'grid'">
      <section v-if="folders.length" class="mb-6">
        <h2 class="mb-3 px-1 text-title-small text-on-surface-variant">Folders</h2>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-3">
          <div
            v-for="i in folders"
            :key="i.id"
            role="button"
            tabindex="0"
            class="group flex h-14 cursor-pointer items-center gap-3 rounded-xl pr-1 pl-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary"
            :class="f.selected.value.has(i.id) ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container hover:bg-surface-container-high'"
            :aria-pressed="f.selected.value.has(i.id)"
            @click="onClick($event, i)"
            @dblclick="f.open(i)"
            @keydown="onKey($event, i)"
            @contextmenu="onContext($event, i)"
            @touchstart.passive="onTouchStart(i)"
            @touchend="cancelPress"
            @touchmove.passive="cancelPress"
          >
            <MIcon :name="i.shared ? 'folder_shared' : 'folder'" :size="24" filled :style="{ color: i.color }" />
            <span class="min-w-0 flex-1 truncate text-title-small">{{ i.name }}</span>
            <MMenu align="right">
              <template #trigger><MIconButton icon="more_vert" :label="`Actions for ${i.name}`" size="xs" @click.stop /></template>
              <ItemMenuItems :item="i" @rename="emit('rename', $event)" />
            </MMenu>
          </div>
        </div>
      </section>

      <section v-if="files.length">
        <h2 v-if="folders.length" class="mb-3 px-1 text-title-small text-on-surface-variant">Files</h2>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-3 max-sm:grid-cols-2">
          <div
            v-for="i in files"
            :key="i.id"
            role="button"
            tabindex="0"
            class="group flex cursor-pointer flex-col overflow-hidden rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary"
            :class="f.selected.value.has(i.id) ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container hover:bg-surface-container-high'"
            :aria-pressed="f.selected.value.has(i.id)"
            @click="onClick($event, i)"
            @dblclick="f.open(i)"
            @keydown="onKey($event, i)"
            @contextmenu="onContext($event, i)"
            @touchstart.passive="onTouchStart(i)"
            @touchend="cancelPress"
            @touchmove.passive="cancelPress"
          >
            <div class="flex h-12 items-center gap-2 pr-1 pl-3">
              <MIcon :name="KIND_ICON[i.kind]" :size="20" filled :style="{ color: KIND_COLOR[i.kind] }" />
              <span class="min-w-0 flex-1 truncate text-title-small">{{ i.name }}</span>
              <MMenu align="right">
                <template #trigger><MIconButton icon="more_vert" :label="`Actions for ${i.name}`" size="xs" @click.stop /></template>
                <ItemMenuItems :item="i" @rename="emit('rename', $event)" />
              </MMenu>
            </div>
            <Thumb :item="i" class="mx-2 aspect-[4/3] rounded-lg" />
            <div class="flex items-center gap-1.5 px-3 py-2 text-body-small text-on-surface-variant">
              <MIcon v-if="i.starred" name="star" :size="14" filled class="text-tertiary" />
              <MIcon v-if="i.annotations?.length" name="ink_highlighter" :size="14" />
              <span class="truncate">{{ i.owner === 'You' ? 'You' : i.owner }} · {{ formatDate(i.modified) }}</span>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- List -->
    <div v-else role="table" class="flex flex-col">
      <div v-if="wide" role="row" class="flex h-10 items-center gap-3 border-b border-outline-variant px-3 text-label-large text-on-surface-variant">
        <span class="w-10" />
        <span class="flex-1">Name</span>
        <span class="w-40">Owner</span>
        <span class="w-28">Modified</span>
        <span class="w-24 text-right">Size</span>
        <span class="w-8" />
      </div>
      <div
        v-for="i in f.listed.value"
        :key="i.id"
        role="row"
        tabindex="0"
        class="flex h-14 cursor-pointer items-center gap-3 rounded-lg px-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        :class="f.selected.value.has(i.id) ? 'bg-secondary-container text-on-secondary-container' : 'hover:bg-surface-container'"
        :aria-selected="f.selected.value.has(i.id)"
        @click="onClick($event, i)"
        @dblclick="f.open(i)"
        @keydown="onKey($event, i)"
        @contextmenu="onContext($event, i)"
        @touchstart.passive="onTouchStart(i)"
        @touchend="cancelPress"
        @touchmove.passive="cancelPress"
      >
        <span class="flex w-10 justify-center" @click.stop="f.select(i.id, 'toggle')">
          <MIcon v-if="f.selected.value.has(i.id)" name="check_circle" :size="24" filled class="text-primary" />
          <MIcon v-else :name="i.kind === 'folder' && i.shared ? 'folder_shared' : KIND_ICON[i.kind]" :size="24" filled :style="{ color: i.color ?? KIND_COLOR[i.kind] }" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="flex items-center gap-1.5">
            <span class="truncate text-body-large">{{ i.name }}</span>
            <MIcon v-if="i.starred" name="star" :size="16" filled class="shrink-0 text-tertiary" />
            <MIcon v-if="i.shared" name="group" :size="16" class="shrink-0 text-on-surface-variant" />
          </span>
          <span v-if="!wide" class="block truncate text-body-small text-on-surface-variant">
            {{ i.kind === 'folder' ? `${f.countIn(i.id)} items` : `${KIND_LABEL[i.kind]} · ${formatSize(i.size)}` }} · {{ formatDate(i.modified) }}
          </span>
        </span>
        <template v-if="wide">
          <span class="w-40 truncate text-body-medium text-on-surface-variant">{{ i.owner }}</span>
          <span class="w-28 text-body-medium text-on-surface-variant">{{ formatDate(i.modified) }}</span>
          <span class="w-24 text-right text-body-medium text-on-surface-variant tabular-nums">{{ i.kind === 'folder' ? `${f.countIn(i.id)} items` : formatSize(i.size) }}</span>
        </template>
        <MMenu align="right">
          <template #trigger><MIconButton icon="more_vert" :label="`Actions for ${i.name}`" size="xs" @click.stop /></template>
          <ItemMenuItems :item="i" @rename="emit('rename', $event)" />
        </MMenu>
      </div>
    </div>

    <MContextMenu ref="ctx">
      <ItemMenuItems v-if="ctxItem" :item="ctxItem" @rename="emit('rename', $event)" />
    </MContextMenu>

    <Transition name="fio-fade">
      <div v-if="dropping" class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-primary/8">
        <span class="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-label-large text-on-primary shadow-elevation-2">
          <MIcon name="upload" :size="20" />Drop to upload
        </span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fio-fade-enter-active,
.fio-fade-leave-active { transition: opacity 150ms ease; }
.fio-fade-enter-from,
.fio-fade-leave-to { opacity: 0; }
</style>
