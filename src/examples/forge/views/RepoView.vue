<script setup lang="ts">
/* A repository: its header (star, fork, watch) and tabs, which never move, and the tab's content. */
import { computed, ref } from 'vue'
import { MButton, MIcon, MMenu, MMenuItem, MTabs, useToast } from '@m3ui-vue/m3ui-vue'
import type { Repo } from '../repos'
import { useForge, type Tab } from '../useForge'
import CodeTab from './CodeTab.vue'
import IssuesTab from './IssuesTab.vue'
import PullsTab from './PullsTab.vue'
import ActionsTab from './ActionsTab.vue'

const props = defineProps<{ repo: Repo; tab: Tab; path?: string; issue?: number; pull?: number; run?: string; newIssue?: boolean; wide: boolean }>()
const { data, openRepo, starred, toggleStar, stars } = useForge()
const toast = useToast()

const d = computed(() => data(props.repo.id))
const openCount = (list: Array<{ state: string }>) => list.filter((x) => x.state === 'open').length
const running = computed(() => d.value.runs.some((r) => r.status === 'running' || r.status === 'queued'))
const tabs = computed(() => [
  { value: 'code', label: 'Code', icon: 'code' },
  { value: 'issues', label: `Issues ${openCount(d.value.issues) || ''}`.trim(), icon: 'adjust' },
  { value: 'pulls', label: `Pull requests ${openCount(d.value.pulls) || ''}`.trim(), icon: 'call_split' },
  { value: 'actions', label: 'Actions', icon: running.value ? 'progress_activity' : 'play_circle' },
])
const tab = computed({ get: () => props.tab, set: (t) => openRepo(props.repo.id, t as Tab) })
const isStarred = computed(() => starred.value.includes(props.repo.id))
const watching = ref<'all' | 'participating' | 'ignore'>('participating')
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="shrink-0 px-3 pt-3 sm:px-6 sm:pt-4">
      <div class="flex flex-wrap items-center gap-2">
        <MIcon name="book" :size="22" class="text-on-surface-variant" />
        <h1 class="text-title-large text-on-surface">
          <button type="button" class="cursor-pointer text-primary hover:underline" @click="openRepo(repo.id)">{{ repo.name }}</button>
        </h1>
        <span class="rounded-full border border-outline-variant px-2 text-label-small text-on-surface-variant">Public</span>
        <span class="flex-1" />
        <MMenu align="right">
          <template #trigger>
            <MButton variant="outlined" size="xs" :icon="watching === 'ignore' ? 'visibility_off' : 'visibility'">{{ watching === 'all' ? 'Watching' : watching === 'ignore' ? 'Ignoring' : 'Watch' }}</MButton>
          </template>
          <MMenuItem :icon="watching === 'participating' ? 'check' : 'notifications_none'" @click="watching = 'participating'">Participating and @mentions</MMenuItem>
          <MMenuItem :icon="watching === 'all' ? 'check' : 'notifications_active'" @click="watching = 'all'">All activity</MMenuItem>
          <MMenuItem :icon="watching === 'ignore' ? 'check' : 'notifications_off'" @click="watching = 'ignore'">Ignore</MMenuItem>
        </MMenu>
        <MButton variant="outlined" size="xs" icon="fork_right" class="hidden sm:inline-flex" @click="toast.info('Forking isn’t part of this demo', { icon: 'fork_right' })">Fork {{ repo.forks }}</MButton>
        <MButton :variant="isStarred ? 'tonal' : 'outlined'" size="xs" :icon="isStarred ? 'star' : 'star_outline'" :class="{ 'm3f-fill': isStarred }" @click="toggleStar(repo.id)">
          {{ isStarred ? 'Starred' : 'Star' }} {{ stars(repo) }}
        </MButton>
      </div>
      <!-- The divider spans the whole width; the tabs keep a compact width on wide screens. MTabs
           brings its own 1px divider: it overlaps ours (-mb-px) so the line is 2px all the way. -->
      <div class="mt-2 border-b-2 border-outline-variant">
        <MTabs v-model="tab" :tabs="tabs" :scrollable="!wide" class="-mb-px" :class="{ 'max-w-2xl': wide }" />
      </div>
    </header>

    <div class="min-h-0 flex-1" :class="tab === 'code' ? '' : 'overflow-y-auto'">
      <CodeTab v-if="tab === 'code'" :repo="repo" :path="path" :wide="wide" />
      <IssuesTab v-else-if="tab === 'issues'" :repo="repo" :issue="issue" :new-issue="newIssue" :wide="wide" />
      <PullsTab v-else-if="tab === 'pulls'" :repo="repo" :pull="pull" :wide="wide" />
      <ActionsTab v-else :repo="repo" :run="run" :wide="wide" />
    </div>
  </div>
</template>
