<script setup lang="ts">
/*
 * An issue's or pull request's conversation on MTimeline: comments as cards (Markdown via
 * MMarkdown) and events (labeled, closed, merged…) as small entries in between.
 */
import { computed } from 'vue'
import { MAvatar, MTimeline } from '@m3ui-vue/m3ui-vue'
import type { TimelineItem } from '@m3ui-vue/m3ui-vue'
import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'
import { labelById, user, type TimelineEntry } from '../data'
import { ago } from '../time'
import LabelChip from './LabelChip.vue'

const props = defineProps<{ entries: TimelineEntry[]; author: string }>()

const look: Record<string, { icon: string; color: TimelineItem['color']; verb: (d?: string) => string }> = {
  labeled: { icon: 'sell', color: 'secondary', verb: () => 'added labels' },
  closed: { icon: 'check_circle', color: 'tertiary', verb: () => 'closed this' },
  reopened: { icon: 'adjust', color: 'success', verb: () => 'reopened this' },
  assigned: { icon: 'person_add', color: 'secondary', verb: (d) => `assigned ${d?.split(',').map((l) => `@${l}`).join(', ')}` },
  merged: { icon: 'merge', color: 'tertiary', verb: (d) => d ?? 'merged this' },
  committed: { icon: 'commit', color: 'secondary', verb: (d) => `added a commit: ${d}` },
  'opened-pr': { icon: 'call_split', color: 'success', verb: (d) => `opened ${d}` },
}

// Each item carries its entry: MTimeline is generic, so the #item slot gets it typed
const items = computed<(TimelineItem & { entry: TimelineEntry })[]>(() =>
  props.entries.map((e) =>
    e.kind === 'comment'
      ? { key: e.id, entry: e, title: `${user(e.author).name} commented`, date: ago(e.date), icon: 'chat_bubble', color: 'primary' }
      : { key: e.id, entry: e, title: `${user(e.actor).name} ${look[e.action]!.verb(e.detail)}`, date: ago(e.date), icon: look[e.action]!.icon, color: look[e.action]!.color },
  ),
)
</script>

<template>
  <MTimeline :items="items" dense>
    <template #item="{ item: { entry: e } }">
      <article v-if="e.kind === 'comment'" class="overflow-hidden rounded-xl border border-outline-variant bg-surface">
        <header class="flex items-center gap-2 border-b border-outline-variant bg-surface-container-low px-3 py-2">
          <MAvatar :name="user(e.author).name" :size="24" />
          <span class="min-w-0 truncate text-label-large text-on-surface">{{ e.author }}</span>
          <span v-if="e.author === author" class="ml-auto rounded-full border border-outline-variant px-2 text-label-small text-on-surface-variant">Author</span>
        </header>
        <div class="m3f-md px-4 py-3 text-body-medium">
          <MMarkdown :source="e.body" />
        </div>
      </article>
      <div v-else-if="e.action === 'labeled' && e.detail" class="flex flex-wrap gap-1">
        <LabelChip v-for="l in e.detail.split(',').filter((x) => labelById(x))" :key="l" :id="l" />
      </div>
    </template>
  </MTimeline>
</template>
