<script setup lang="ts">
/* Actions: the CI runs, or one run with its jobs, each job's log (MTerminal) and the event payload (MJsonViewer). */
import { computed, ref, watch } from 'vue'
import { MAvatar, MButton, MChip, MExpansionPanel, MIcon, MJsonViewer } from '@m3ui-vue/m3ui-vue'
import type { Repo } from '../repos'
import { jobSeconds, runSeconds, user } from '../data'
import { useForge } from '../useForge'
import { ago, duration } from '../time'
import JobLog from '../components/JobLog.vue'
import RunStatus from '../components/RunStatus.vue'

const props = defineProps<{ repo: Repo; run?: string; wide: boolean }>()
const { data, openRepo, rerun } = useForge()

const runs = computed(() => data(props.repo.id).runs)
const current = computed(() => runs.value.find((r) => r.id === props.run))
const filter = ref<'all' | 'failure'>('all')
const shown = computed(() => runs.value.filter((r) => filter.value === 'all' || r.status === 'failure'))

const job = ref(0)
watch(() => props.run, () => (job.value = current.value?.status === 'failure' ? 1 : 0), { immediate: true })
const inProgress = computed(() => current.value?.status === 'running' || current.value?.status === 'queued')
// A job's status while its run is still going.
const jobStatus = (i: number) => (inProgress.value ? (current.value!.status === 'queued' ? 'queued' : 'running') : current.value!.jobs[i]!.status)

const payload = computed(() =>
  current.value && {
    ref: `refs/heads/${current.value.branch}`,
    before: '0'.repeat(7) + current.value.sha.slice(7, 40),
    after: current.value.sha,
    repository: { full_name: `m3ui/${props.repo.name}`, default_branch: 'main', private: false },
    pusher: { name: current.value.actor },
    head_commit: { id: current.value.sha, message: current.value.title, timestamp: new Date(current.value.started).toISOString() },
  },
)

function again() {
  const next = rerun(props.repo, current.value!)
  openRepo(props.repo.id, 'actions', { run: next.id })
}
</script>

<template>
  <div class="mx-auto max-w-6xl p-3 sm:p-6">
    <!-- One run -->
    <template v-if="current">
      <button type="button" class="mb-2 flex cursor-pointer items-center gap-1 text-label-large text-primary hover:underline" @click="openRepo(repo.id, 'actions')">
        <MIcon name="arrow_back" :size="18" />All workflow runs
      </button>
      <div class="mb-4 flex flex-wrap items-start gap-3">
        <RunStatus :status="current.status" :size="28" class="mt-1" />
        <div class="min-w-0 flex-1">
          <h2 class="text-headline-small text-on-surface">{{ current.title }}</h2>
          <p class="text-body-medium text-on-surface-variant">CI #{{ current.number }} · {{ current.event === 'push' ? 'Pushed' : 'Pull request' }} by {{ current.actor }} {{ ago(current.started) }}</p>
        </div>
        <MButton variant="outlined" icon="replay" :disabled="inProgress" @click="again">Re-run jobs</MButton>
      </div>

      <div class="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-outline-variant p-4 sm:grid-cols-4">
        <div><p class="text-label-medium text-on-surface-variant">Triggered via</p><p class="text-body-medium text-on-surface">{{ current.event }}</p></div>
        <div><p class="text-label-medium text-on-surface-variant">Status</p><p class="text-body-medium text-on-surface capitalize">{{ current.status }}</p></div>
        <div><p class="text-label-medium text-on-surface-variant">Duration</p><p class="text-body-medium text-on-surface">{{ inProgress ? '…' : duration(runSeconds(current)) }}</p></div>
        <div><p class="text-label-medium text-on-surface-variant">Commit</p><code class="text-body-medium text-on-surface">{{ current.sha.slice(0, 7) }}</code> <span class="text-body-small text-on-surface-variant">on {{ current.branch }}</span></div>
      </div>

      <div class="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <nav class="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Jobs">
          <button
            v-for="(j, i) in current.jobs"
            :key="j.name"
            type="button"
            class="flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-left text-body-medium lg:rounded-lg"
            :class="job === i ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface hover:bg-on-surface/8'"
            @click="job = i"
          >
            <RunStatus :status="jobStatus(i)" :size="18" />
            <span class="flex-1">{{ j.name }}</span>
            <span v-if="!inProgress && j.status !== 'skipped'" class="text-label-small text-on-surface-variant">{{ duration(jobSeconds(j)) }}</span>
          </button>
        </nav>
        <div class="min-w-0">
          <JobLog :key="`${current.id}-${job}`" :job="current.jobs[job]!" :live="inProgress" />
          <MExpansionPanel title="Event payload" icon="data_object" class="mt-4">
            <MJsonViewer :data="payload" root-name="event" :expand-depth="1" />
          </MExpansionPanel>
        </div>
      </div>
    </template>

    <!-- All runs -->
    <template v-else>
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <h2 class="flex-1 text-title-large text-on-surface">All workflow runs</h2>
        <MChip clickable :selected="filter === 'all'" @click="filter = 'all'">All</MChip>
        <MChip clickable :selected="filter === 'failure'" icon="cancel" @click="filter = 'failure'">Failed</MChip>
      </div>
      <ul class="overflow-hidden rounded-xl border border-outline-variant">
        <li v-for="r in shown" :key="r.id" class="border-b border-outline-variant last:border-b-0">
          <button type="button" class="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left hover:bg-on-surface/8" @click="openRepo(repo.id, 'actions', { run: r.id })">
            <RunStatus :status="r.status" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-title-small text-on-surface">{{ r.title }}</p>
              <p class="truncate text-body-small text-on-surface-variant">
                CI #{{ r.number }}: {{ r.event === 'push' ? 'Commit' : 'Pull request' }} <code>{{ r.sha.slice(0, 7) }}</code> by {{ r.actor }}
              </p>
            </div>
            <code class="hidden rounded-sm bg-primary-container px-1.5 text-label-small text-on-primary-container sm:inline">{{ r.branch }}</code>
            <div class="flex shrink-0 flex-col items-end text-label-small text-on-surface-variant">
              <span class="flex items-center gap-1"><MIcon name="calendar_today" :size="14" />{{ ago(r.started) }}</span>
              <span class="flex items-center gap-1"><MIcon name="timer" :size="14" />{{ r.status === 'running' || r.status === 'queued' ? 'In progress' : duration(runSeconds(r)) }}</span>
            </div>
            <MAvatar :name="user(r.actor).name" :size="24" class="hidden sm:inline-flex" />
          </button>
        </li>
      </ul>
    </template>
  </div>
</template>
