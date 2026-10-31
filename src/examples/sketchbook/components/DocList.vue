<script setup lang="ts">
/* The documents, newest first, each with a thumbnail drawn from its items by toDrawSvg (no canvas needed). */
import { computed } from 'vue'
import { MButton, MIcon, MIconButton, MMenu, MMenuItem, MTooltip } from '@m3ui-vue/m3ui-vue'
import { toDrawSvg } from '@m3ui-vue/m3ui-vue/draw'
import { PAGE, PAPER, useNotebooks, type Doc } from '../useNotebooks'

const emit = defineEmits<{ picked: [] }>()
const n = useNotebooks()
const thumbs = computed(() =>
  new Map(n.sorted.value.map((d) => [d.id, `data:image/svg+xml;utf8,${encodeURIComponent(toDrawSvg(d.items, {
    page: d.mode === 'pages' ? 0 : undefined,
    box: d.mode === 'pages' ? { x: 0, y: 0, ...PAGE } : undefined,
    background: PAPER,
    padding: 24,
  }))}`])),
)
const when = (t: number) => {
  const m = Math.round((Date.now() - t) / 60_000)
  return m < 1 ? 'Just now' : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' }).format(t)
}
function pick(d: Doc) {
  n.currentId.value = d.id
  emit('picked')
}
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <div class="flex gap-2">
      <MButton variant="tonal" icon="dashboard" class="flex-1" @click="n.create('infinite'); emit('picked')">Board</MButton>
      <MButton variant="tonal" icon="menu_book" class="flex-1" @click="n.create('pages'); emit('picked')">Notebook</MButton>
    </div>
    <div
      v-for="d in n.sorted.value"
      :key="d.id"
      class="flex items-center gap-1 rounded-xl pr-1 transition-colors"
      :class="d.id === n.currentId.value ? 'bg-secondary-container text-on-secondary-container' : 'hover:bg-on-surface/8'"
    >
      <button type="button" class="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-secondary" @click="pick(d)">
        <img :src="d.image ?? thumbs.get(d.id)" alt="" class="h-16 shrink-0 rounded-md bg-white shadow-elevation-1" :style="{ objectFit: d.image ? 'cover' : 'contain' }" :class="d.mode === 'infinite' ? 'w-16' : 'w-12'" />
        <span class="min-w-0 flex-1">
          <span class="block truncate text-title-small">{{ d.title }}</span>
          <span class="flex items-center gap-1 text-body-small opacity-80">
            <MIcon :name="d.mode === 'pages' ? 'menu_book' : 'dashboard'" :size="14" />
            {{ d.mode === 'pages' ? `${d.pages} page${d.pages > 1 ? 's' : ''}` : 'Board' }} · {{ when(d.updated) }}
          </span>
        </span>
      </button>
      <MMenu align="right">
        <template #trigger>
          <MTooltip text="More" placement="left"><MIconButton icon="more_vert" label="More" size="xs" /></MTooltip>
        </template>
        <MMenuItem icon="delete" :disabled="n.docs.value.length < 2" @click="n.remove(d.id)">Delete</MMenuItem>
      </MMenu>
    </div>
    <MButton variant="text" icon="restart_alt" size="xs" class="self-start" @click="n.restoreSamples()">Bring back the samples</MButton>
  </div>
</template>
