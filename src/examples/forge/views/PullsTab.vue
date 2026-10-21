<script setup lang="ts">
/* Pull requests: the list, or one with its Conversation, Files changed and Checks, and the merge box. */
import { computed, ref, watch } from 'vue'
import { MButton, MIcon, MSplitButton, MTabs } from '@m3ui-vue/m3ui-vue'
import type { SplitButtonItem } from '@m3ui-vue/m3ui-vue'
import type { Repo } from '../repos'
import { useForge } from '../useForge'
import { ago, duration } from '../time'
import { runSeconds } from '../data'
import CommentBox from '../components/CommentBox.vue'
import DiffView from '../components/DiffView.vue'
import ItemList from '../components/ItemList.vue'
import ItemSidebar from '../components/ItemSidebar.vue'
import ItemTimeline from '../components/ItemTimeline.vue'
import StateIcon from '../components/StateIcon.vue'

const props = defineProps<{ repo: Repo; pull?: number; wide: boolean }>()
const { data, openRepo, comment, setState, merge, rerun } = useForge()

const pulls = computed(() => data(props.repo.id).pulls)
const pr = computed(() => (props.pull ? pulls.value.find((p) => p.number === props.pull) : undefined))
const open = (n?: number) => openRepo(props.repo.id, 'pulls', n ? { pull: n } : {})

const tab = ref<'conversation' | 'files' | 'checks'>('conversation')
watch(() => props.pull, () => (tab.value = 'conversation'))
const tabs = computed(() => [
  { value: 'conversation', label: 'Conversation', icon: 'forum' },
  { value: 'files', label: `Files (${pr.value?.changes.length ?? 0})`, icon: 'difference' },
  { value: 'checks', label: 'Checks', icon: 'checklist' },
])

// The run for this branch's latest commit.
const run = computed(() => data(props.repo.id).runs.find((r) => r.branch === pr.value?.branch) ?? null)

const reply = ref('')
function send(close = false) {
  if (reply.value.trim()) comment(pr.value!, reply.value.trim())
  if (close) setState(pr.value!, pr.value!.state === 'open' ? 'closed' : 'open')
  reply.value = ''
}

const mergeItems = computed<SplitButtonItem[]>(() => [
  { label: 'Squash and merge', icon: 'compress', onClick: () => merge(props.repo, pr.value!, 'squash') },
  { label: 'Rebase and merge', icon: 'low_priority', onClick: () => merge(props.repo, pr.value!, 'rebase') },
])
function rerunChecks() {
  const r = data(props.repo.id).runs.find((x) => x.branch === pr.value!.branch)
  if (r) rerun(props.repo, r)
  else {
    pr.value!.checks = 'pending'
    setTimeout(() => (pr.value!.checks = 'success'), 6000)
  }
}
</script>

<template>
  <div class="mx-auto max-w-6xl p-3 sm:p-6">
    <template v-if="pr">
      <div class="mb-2">
        <h2 class="text-headline-small text-on-surface">{{ pr.title }} <span class="text-on-surface-variant">#{{ pr.number }}</span></h2>
        <div class="mt-2 flex flex-wrap items-center gap-2 text-body-medium text-on-surface-variant">
          <StateIcon :state="pr.state" pull pill />
          <span>
            <strong class="text-on-surface">{{ pr.author }}</strong> wants to merge 1 commit into
            <code class="rounded-sm bg-primary-container px-1.5 text-on-primary-container">main</code> from
            <code class="rounded-sm bg-primary-container px-1.5 text-on-primary-container">{{ pr.branch }}</code>
          </span>
        </div>
      </div>
      <MTabs v-model="tab" :tabs="tabs" scrollable class="mb-4 border-b border-outline-variant" />

      <div v-if="tab === 'conversation'" class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div class="min-w-0">
          <ItemTimeline :entries="pr.timeline" :author="pr.author" />

          <!-- Merge box -->
          <section v-if="pr.state === 'open'" class="mb-6 ml-0 overflow-hidden rounded-xl border sm:ml-13" :class="pr.checks === 'failure' ? 'border-error/60' : 'border-success/60'">
            <div class="flex items-start gap-3 border-b border-outline-variant p-4">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" :class="pr.checks === 'success' ? 'bg-success text-on-success' : pr.checks === 'failure' ? 'bg-error text-on-error' : 'bg-tertiary-container text-on-tertiary-container'">
                <MIcon :name="pr.checks === 'success' ? 'check' : pr.checks === 'failure' ? 'close' : 'pending'" :size="22" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-title-small text-on-surface">{{ pr.checks === 'success' ? 'All checks have passed' : pr.checks === 'failure' ? 'Some checks were not successful' : 'Checks are running' }}</p>
                <p class="text-body-small text-on-surface-variant">{{ pr.checks === 'failure' ? '1 failing check' : pr.checks === 'success' ? '3 successful checks' : 'This usually takes a few seconds' }}</p>
              </div>
              <MButton v-if="pr.checks === 'failure'" variant="outlined" size="xs" icon="replay" @click="rerunChecks">Re-run</MButton>
            </div>
            <div class="flex flex-wrap items-center gap-3 p-4">
              <MSplitButton label="Merge pull request" icon="merge" :items="mergeItems" :disabled="pr.checks === 'pending'" @click="merge(repo, pr, 'merge')" />
              <span class="text-body-small text-on-surface-variant">{{ pr.checks === 'failure' ? 'You can still merge, at your own risk.' : 'This branch has no conflicts with main.' }}</span>
            </div>
          </section>

          <CommentBox v-model="reply" avatar>
            <template #actions>
              <MButton v-if="pr.state !== 'merged'" variant="outlined" @click="send(true)">{{ pr.state === 'open' ? 'Close pull request' : 'Reopen pull request' }}</MButton>
              <MButton :disabled="!reply.trim()" @click="send()">Comment</MButton>
            </template>
          </CommentBox>
        </div>
        <ItemSidebar :item="pr" :class="{ 'order-first': !wide }" />
      </div>

      <div v-else-if="tab === 'files'" class="flex flex-col gap-4">
        <DiffView v-for="c in pr.changes" :key="c.path" :repo="repo" :change="c" />
      </div>

      <div v-else class="overflow-hidden rounded-xl border border-outline-variant">
        <div v-for="name in ['check', 'test', 'build']" :key="name" class="flex items-center gap-3 border-b border-outline-variant px-4 py-3 last:border-b-0">
          <MIcon
            :name="pr.checks === 'pending' ? 'progress_activity' : pr.checks === 'failure' && name !== 'check' ? (name === 'test' ? 'cancel' : 'block') : 'check_circle'"
            :size="20"
            :filled="pr.checks !== 'pending' && !(pr.checks === 'failure' && name !== 'check')"
            :class="[pr.checks === 'pending' ? 'animate-spin text-tertiary' : pr.checks === 'failure' && name !== 'check' ? 'text-error' : 'text-success']"
          />
          <span class="flex-1 text-body-medium text-on-surface">CI / {{ name }} <span class="text-on-surface-variant">({{ pr.branch }})</span></span>
          <button v-if="run" type="button" class="cursor-pointer text-label-large text-primary hover:underline" @click="openRepo(repo.id, 'actions', { run: run.id })">Details</button>
          <span v-if="run" class="text-label-small text-on-surface-variant">{{ duration(runSeconds(run)) }}</span>
        </div>
      </div>
    </template>

    <ItemList v-else :items="pulls" pull @open="open">
      <template #actions>
        <MButton icon="add" @click="openRepo(repo.id, 'code')">New pull request</MButton>
      </template>
    </ItemList>
    <p v-if="!pr" class="mt-3 text-body-small text-on-surface-variant">
      To open a pull request, edit a file in the Code tab and choose “Create a new branch and start a pull request”. Last activity {{ ago(pulls[0]?.created ?? Date.now()) }}.
    </p>
  </div>
</template>
