<script setup lang="ts">
/* The Code tab's layout: the file tree (MTree) in a resizable MSplitter on wide screens. */
import { computed } from 'vue'
import { MIcon, MSplitter, MTree } from '@m3ui-vue/m3ui-vue'
import type { Repo } from '../repos'
import { useForge } from '../useForge'
import CodeMain from './CodeMain.vue'

const props = defineProps<{ repo: Repo; path?: string; wide: boolean }>()
const { openRepo, finderOpen } = useForge()

// The tree starts with the current file's folders open.
const ancestors = computed(() => (props.path ?? '').split('/').slice(0, -1).map((_, i, parts) => parts.slice(0, i + 1).join('/')))
</script>

<template>
  <MSplitter v-if="wide" :initial-split="15" :min="15" :max="45" class="h-full">
    <template #first>
      <div class="flex h-full flex-col border-r border-outline-variant">
        <button
          type="button"
          class="mx-3 mt-3 mb-2 flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-outline-variant px-3 text-body-medium text-on-surface-variant hover:bg-on-surface/8"
          @click="finderOpen = true"
        >
          <MIcon name="search" :size="18" /><span class="flex-1 text-left">Go to file</span>
          <kbd class="rounded-sm border border-outline-variant px-1.5 text-label-small">t</kbd>
        </button>
        <div class="min-h-0 flex-1 overflow-y-auto px-1 pb-3">
          <MTree :key="repo.id" :nodes="repo.tree" :selected="path ?? null" :default-expanded="ancestors" @node-click="(n) => openRepo(repo.id, 'code', { path: String(n.id) })" />
        </div>
      </div>
    </template>
    <template #second>
      <div class="h-full overflow-y-auto">
        <CodeMain :repo="repo" :path="path" :wide="wide" class="p-4 lg:p-6" />
      </div>
    </template>
  </MSplitter>
  <div v-else class="h-full overflow-y-auto">
    <CodeMain :repo="repo" :path="path" :wide="wide" class="p-3" />
  </div>
</template>
