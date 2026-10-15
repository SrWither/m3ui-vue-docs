<script setup lang="ts">
/* The list of issues or pull requests: open/closed switch, search, label filter, rows. */
import { computed, ref } from 'vue'
import { MChip, MEmptyState, MIcon, MMultiSelect } from '@m3ui-vue/m3ui-vue'
import { labels, user, type Issue, type PullRequest } from '../data'
import { ago } from '../time'
import LabelChip from './LabelChip.vue'
import StateIcon from './StateIcon.vue'

const props = defineProps<{ items: Array<Issue | PullRequest>; pull?: boolean }>()
const emit = defineEmits<{ open: [number] }>()

const state = ref<'open' | 'closed'>('open')
const query = ref('')
const withLabels = ref<string[]>([])
const isOpen = (i: Issue | PullRequest) => i.state === 'open'
const counts = computed(() => ({ open: props.items.filter(isOpen).length, closed: props.items.filter((i) => !isOpen(i)).length }))
const shown = computed(() =>
  props.items.filter(
    (i) =>
      (state.value === 'open') === isOpen(i) &&
      (!query.value || `${i.title} #${i.number}`.toLowerCase().includes(query.value.toLowerCase())) &&
      withLabels.value.every((l) => i.labels.includes(l)),
  ),
)
const comments = (i: Issue | PullRequest) => i.timeline.filter((e) => e.kind === 'comment').length - 1
const labelOptions = labels.map((l) => ({ label: l.name, value: l.id }))
</script>

<template>
  <div>
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <label class="flex h-10 min-w-0 flex-1 basis-56 items-center gap-2 rounded-full bg-surface-container-high px-4 focus-within:ring-2 focus-within:ring-secondary">
        <MIcon name="search" :size="20" class="text-on-surface-variant" />
        <input v-model="query" type="search" :placeholder="pull ? 'Search pull requests' : 'Search issues'" class="min-w-0 flex-1 bg-transparent text-body-medium text-on-surface outline-none placeholder:text-on-surface-variant" />
      </label>
      <MMultiSelect v-model="withLabels" :options="labelOptions" label="Labels" variant="outlined" :max-chips="1" class="w-52" />
      <slot name="actions" />
    </div>

    <div class="overflow-hidden rounded-xl border border-outline-variant">
      <div class="flex gap-2 bg-surface-container-low px-3 py-2">
        <MChip clickable :selected="state === 'open'" :icon="pull ? 'call_split' : 'adjust'" @click="state = 'open'">{{ counts.open }} Open</MChip>
        <MChip clickable :selected="state === 'closed'" icon="check" @click="state = 'closed'">{{ counts.closed }} Closed</MChip>
      </div>
      <ul>
        <li v-for="i in shown" :key="i.number" class="border-t border-outline-variant">
          <button type="button" class="flex w-full cursor-pointer gap-3 px-3 py-3 text-left hover:bg-on-surface/8" @click="emit('open', i.number)">
            <StateIcon :state="i.state" :pull="pull" class="mt-0.5" />
            <div class="min-w-0 flex-1">
              <p class="text-title-small text-on-surface">
                {{ i.title }}
                <LabelChip v-for="l in i.labels" :key="l" :id="l" class="ml-1 align-[1px]" />
              </p>
              <p class="mt-0.5 text-body-small text-on-surface-variant">
                #{{ i.number }} {{ i.state === 'open' ? 'opened' : i.state }} {{ ago(i.created) }} by {{ i.author }}
                <template v-if="'checks' in i">
                  ·
                  <MIcon :name="i.checks === 'success' ? 'check' : i.checks === 'failure' ? 'close' : 'pending'" :size="14" class="align-[-2px]" :class="i.checks === 'success' ? 'text-success' : i.checks === 'failure' ? 'text-error' : 'text-tertiary'" />
                </template>
              </p>
            </div>
            <div class="flex shrink-0 items-start gap-3 text-body-small text-on-surface-variant">
              <span v-if="i.assignees.length" class="hidden sm:inline">{{ user(i.assignees[0]!).name.split(' ')[0] }}</span>
              <span v-if="comments(i) > 0" class="flex items-center gap-1"><MIcon name="chat_bubble" :size="16" />{{ comments(i) }}</span>
            </div>
          </button>
        </li>
      </ul>
      <MEmptyState
        v-if="!shown.length"
        :icon="pull ? 'call_split' : 'adjust'"
        :title="query || withLabels.length ? 'No results matched your search' : state === 'open' ? `No open ${pull ? 'pull requests' : 'issues'}` : `No closed ${pull ? 'pull requests' : 'issues'}`"
        compact
      />
    </div>
  </div>
</template>
