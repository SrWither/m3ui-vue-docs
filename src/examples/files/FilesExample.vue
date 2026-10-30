<script setup lang="ts">
/*
 * Files example (Folio): a cloud drive built only with m3ui-vue. Folders, recent, starred, shared and trash;
 * grid or list; selection with Ctrl/Shift, a right-click menu, drag files in to upload them; and every file
 * opens for real: PDFs in MPdfViewer with highlights, notes and drawings saved with the file, videos in
 * MVideoPlayer, music in MAudioPlayer, photos in MLightbox.
 * - components/TopBar.vue         logo, search, theme, docs and source
 * - components/FilesDrawer.vue    sections, New (upload / folder), storage
 * - components/Toolbar.vue        breadcrumbs or the selection's actions, filters, layout, sort, details
 * - components/FileBrowser.vue    the grid or list, selection, menus, drop to upload
 * - components/DetailsPanel.vue   the selected item, a PDF's annotations
 * - components/Viewer.vue         a file opened full screen
 * - useFiles.ts / data.ts         the drive's state and actions, and what's in it to begin with
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MLightbox, MSideSheet, useWindowSizeClass } from '@m3ui-vue/m3ui-vue'
import type { LightboxItem } from '@m3ui-vue/m3ui-vue'
import { useFiles } from './useFiles'
import type { Item } from './data'
import TopBar from './components/TopBar.vue'
import FilesDrawer from './components/FilesDrawer.vue'
import Toolbar from './components/Toolbar.vue'
import FileBrowser from './components/FileBrowser.vue'
import DetailsPanel from './components/DetailsPanel.vue'
import Viewer from './components/Viewer.vue'
import NameDialog from './components/NameDialog.vue'

const f = useFiles()
const { widthClass } = useWindowSizeClass()
const wide = computed(() => widthClass.value !== 'compact' && widthClass.value !== 'medium')
const drawerOpen = ref(wide.value)
watch(wide, (w) => (drawerOpen.value = w))

// Naming: a new folder or a rename
const naming = ref(false)
const nameDialog = ref<{ title: string; action: string; initial: string; submit: (name: string) => void }>({ title: '', action: '', initial: '', submit: () => {} })
function newFolder() {
  nameDialog.value = { title: 'New folder', action: 'Create', initial: 'Untitled folder', submit: (n) => f.newFolder(n) }
  naming.value = true
}
function rename(i: Item) {
  nameDialog.value = { title: 'Rename', action: 'Rename', initial: i.name, submit: (n) => f.rename(i, n) }
  naming.value = true
}

// Photos open in the lightbox
const lightboxOpen = computed({
  get: () => !!f.lightbox.value,
  set: (v) => { if (!v) f.lightbox.value = null },
})
const lightboxItems = computed<LightboxItem[]>(() => (f.lightbox.value?.ids ?? []).map((id) => {
  const i = f.byId(id)!
  return { src: i.src!, alt: i.name, caption: i.name }
}))
const lightboxIndex = computed({
  get: () => f.lightbox.value?.index ?? 0,
  set: (index) => { if (f.lightbox.value) f.lightbox.value = { ...f.lightbox.value, index } },
})

// Shortcuts: / searches, Ctrl+A selects all, Escape clears the selection
const topBar = ref<InstanceType<typeof TopBar>>()
function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  if (f.viewing.value || f.lightbox.value || naming.value || t.closest('input, textarea, [contenteditable]')) return
  if (e.key === '/') {
    e.preventDefault()
    topBar.value?.focus()
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
    e.preventDefault()
    f.selected.value = new Set(f.listed.value.map((i) => i.id))
  } else if (e.key === 'Escape' && f.selected.value.size) f.clearSelection()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const detailsOpen = computed({ get: () => f.detailsOpen.value, set: (v) => (f.detailsOpen.value = v) })
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden text-on-surface" :class="wide ? 'bg-surface-container' : 'bg-surface'">
    <TopBar ref="topBar" :wide="wide" @menu="drawerOpen = true" />
    <div class="flex min-h-0 flex-1">
      <FilesDrawer v-model="drawerOpen" :wide="wide" @new-folder="newFolder" />

      <main class="flex min-w-0 flex-1 flex-col bg-surface" :class="{ 'mr-2 mb-2 overflow-hidden rounded-2xl': wide }">
        <div class="shrink-0 px-3 pt-3 sm:px-5">
          <Toolbar :wide="wide" />
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto px-3 pt-2 pb-24 sm:px-5" @click.self="f.clearSelection()">
          <FileBrowser :wide="wide" @rename="rename" />
        </div>
      </main>

      <aside v-if="wide && f.detailsOpen.value" class="mr-2 mb-2 w-80 shrink-0 overflow-hidden rounded-2xl bg-surface">
        <DetailsPanel @close="f.detailsOpen.value = false" />
      </aside>
    </div>

    <MSideSheet v-if="!wide" v-model="detailsOpen">
      <DetailsPanel @close="f.detailsOpen.value = false" />
    </MSideSheet>

    <Viewer v-if="f.viewing.value" :key="f.viewing.value" :id="f.viewing.value" :wide="wide" />
    <MLightbox v-model="lightboxOpen" v-model:index="lightboxIndex" :items="lightboxItems" show-thumbnails />
    <NameDialog v-model="naming" :title="nameDialog.title" :action="nameDialog.action" :initial="nameDialog.initial" @submit="nameDialog.submit" />
  </div>
</template>
