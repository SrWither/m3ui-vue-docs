<script setup lang="ts">
/* One file's diff, split into hunks, with old/new line numbers and +/- lines colored. */
import { ref, watch } from 'vue'
import { MIcon, MIconButton, MSkeleton } from '@m3ui-vue/m3ui-vue'
import type { Change } from '../data'
import type { Repo } from '../repos'
import { useForge } from '../useForge'
import { diff, type Hunk } from '../diff'

const props = defineProps<{ repo: Repo; change: Change }>()
const { changeTexts } = useForge()

const result = ref<{ hunks: Hunk[]; added: number; removed: number } | null>(null)
const collapsed = ref(false)
watch(
  () => props.change,
  async (c) => {
    result.value = null
    const { before, after } = await changeTexts(props.repo, c)
    result.value = diff(before, after)
  },
  { immediate: true },
)
</script>

<template>
  <section class="overflow-hidden rounded-xl border border-outline-variant">
    <header class="flex items-center gap-2 border-b border-outline-variant bg-surface-container-low px-2 py-1.5">
      <MIconButton :icon="collapsed ? 'chevron_right' : 'expand_more'" :label="collapsed ? 'Expand' : 'Collapse'" size="xs" @click="collapsed = !collapsed" />
      <span v-if="result" class="text-label-medium"><span class="text-success">+{{ result.added }}</span> <span class="text-error">−{{ result.removed }}</span></span>
      <code class="min-w-0 truncate text-body-small text-on-surface">{{ change.path }}</code>
    </header>
    <template v-if="!collapsed">
      <MSkeleton v-if="!result" variant="text" :lines="6" class="p-4" />
      <p v-else-if="!result.hunks.length" class="flex items-center gap-2 p-4 text-body-medium text-on-surface-variant"><MIcon name="info" :size="18" />No changes</p>
      <div v-else class="overflow-x-auto font-mono text-[12.5px] leading-5">
        <template v-for="(h, hi) in result.hunks" :key="hi">
          <div class="bg-primary-container/40 px-3 py-1 text-on-surface-variant">{{ h.header }}</div>
          <div
            v-for="(l, li) in h.lines"
            :key="li"
            class="grid min-w-max grid-cols-[3rem_3rem_1.25rem_1fr]"
            :class="l.type === '+' ? 'bg-success-container/60' : l.type === '-' ? 'bg-error-container/60' : ''"
          >
            <span class="pr-2 text-right text-on-surface-variant/70 select-none">{{ l.old ?? '' }}</span>
            <span class="pr-2 text-right text-on-surface-variant/70 select-none">{{ l.new ?? '' }}</span>
            <span class="text-center select-none" :class="l.type === '+' ? 'text-success' : l.type === '-' ? 'text-error' : 'text-on-surface-variant'">{{ l.type }}</span>
            <span class="pr-4 whitespace-pre text-on-surface">{{ l.text }}</span>
          </div>
        </template>
      </div>
    </template>
  </section>
</template>
