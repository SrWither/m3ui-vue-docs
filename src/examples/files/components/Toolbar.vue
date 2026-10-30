<script setup lang="ts">
/*
 * Above the files: where you are (breadcrumbs inside My files), or what's selected with its actions; type
 * filters; grid or list; sorting; and the details panel.
 */
import { computed } from 'vue'
import { MBreadcrumbs, MButton, MChip, MIconButton, MMenu, MMenuItem, MSegmentedButton, MTooltip } from '@m3ui-vue/m3ui-vue'
import type { BreadcrumbItem } from '@m3ui-vue/m3ui-vue'
import { KIND_ICON, useFiles, type SortKey } from '../useFiles'
import type { Kind } from '../data'

defineProps<{ wide: boolean }>()
const f = useFiles()

const TITLES = { files: 'My files', recent: 'Recent', starred: 'Starred', shared: 'Shared with me', trash: 'Trash' }
const crumbs = computed<BreadcrumbItem[]>(() => [
  { label: 'My files' },
  ...f.path.value.map((p) => ({ label: p.name })),
])
function onCrumb(_: BreadcrumbItem, i: number) {
  f.goFolder(i === 0 ? null : f.path.value[i - 1]!.id)
}

const sel = computed(() => f.selectedItems.value)
const inTrash = computed(() => f.section.value === 'trash')
const allStarred = computed(() => sel.value.every((i) => i.starred))

const KINDS: { kind: Kind; label: string }[] = [
  { kind: 'pdf', label: 'PDFs' },
  { kind: 'image', label: 'Photos' },
  { kind: 'video', label: 'Videos' },
  { kind: 'audio', label: 'Audio' },
]
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'modified', label: 'Last modified' },
  { key: 'size', label: 'Size' },
]
function setSort(key: SortKey) {
  f.sort.value = f.sort.value.key === key ? { key, desc: !f.sort.value.desc } : { key, desc: key !== 'name' }
}
const layout = computed({ get: () => f.layout.value, set: (v) => (f.layout.value = v) })
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex min-h-12 items-center gap-1">
      <!-- Selection -->
      <template v-if="sel.length">
        <MIconButton icon="close" label="Clear selection" @click="f.clearSelection()" />
        <span class="mr-2 text-title-medium">{{ sel.length }} selected</span>
        <template v-if="inTrash">
          <MTooltip text="Restore"><MIconButton icon="restore_from_trash" label="Restore" @click="f.restore(sel)" /></MTooltip>
          <MTooltip text="Delete forever"><MIconButton icon="delete_forever" label="Delete forever" @click="f.deleteForever(sel)" /></MTooltip>
        </template>
        <template v-else>
          <MTooltip v-if="sel.length === 1 && sel[0]!.kind !== 'folder'" text="Download"><MIconButton icon="download" label="Download" @click="f.download(sel[0]!)" /></MTooltip>
          <MTooltip :text="allStarred ? 'Remove from Starred' : 'Add to Starred'"><MIconButton :icon="allStarred ? 'star' : 'star_outline'" :label="allStarred ? 'Remove from Starred' : 'Add to Starred'" @click="f.toggleStar(sel)" /></MTooltip>
          <MTooltip text="Move to trash"><MIconButton icon="delete" label="Move to trash" @click="f.trash(sel)" /></MTooltip>
        </template>
      </template>

      <!-- Where you are -->
      <template v-else>
        <MBreadcrumbs v-if="f.section.value === 'files' && !f.query.value" :items="crumbs" class="min-w-0 text-title-large" @select="onCrumb" />
        <h1 v-else class="truncate px-1 text-title-large">{{ f.query.value ? `Results for "${f.query.value}"` : TITLES[f.section.value] }}</h1>
        <MButton v-if="inTrash && f.listed.value.length" variant="text" icon="delete_sweep" class="ml-2" @click="f.emptyTrash()">Empty trash</MButton>
      </template>

      <span class="flex-1" />
      <MSegmentedButton
        v-if="wide"
        v-model="layout"
        :options="[{ value: 'grid', label: 'Grid', icon: 'grid_view' }, { value: 'list', label: 'List', icon: 'view_list' }]"
        density="compact"
      />
      <MIconButton v-else :icon="layout === 'grid' ? 'view_list' : 'grid_view'" :label="layout === 'grid' ? 'List view' : 'Grid view'" @click="layout = layout === 'grid' ? 'list' : 'grid'" />
      <MMenu align="right">
        <template #trigger><MIconButton icon="sort" label="Sort" /></template>
        <MMenuItem
          v-for="s in SORTS"
          :key="s.key"
          :selected="f.sort.value.key === s.key"
          :icon="f.sort.value.key === s.key ? (f.sort.value.desc ? 'arrow_downward' : 'arrow_upward') : undefined"
          @click="setSort(s.key)"
        >{{ s.label }}</MMenuItem>
      </MMenu>
      <MIconButton icon="info" label="Details" :checked="f.detailsOpen.value" @update:checked="(v: boolean) => (f.detailsOpen.value = v)" />
    </div>

    <div v-if="!inTrash" class="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <MChip
        v-for="k in KINDS"
        :key="k.kind"
        type="filter"
        :icon="KIND_ICON[k.kind]"
        :selected="f.kindFilter.value === k.kind"
        clickable
        @click="f.kindFilter.value = f.kindFilter.value === k.kind ? null : k.kind"
      >{{ k.label }}</MChip>
    </div>
  </div>
</template>
