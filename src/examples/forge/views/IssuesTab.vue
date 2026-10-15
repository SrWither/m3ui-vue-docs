<script setup lang="ts">
/* Issues: the list, one issue's conversation, or a new issue. */
import { computed, ref, watch } from 'vue'
import { MButton, MMultiSelect, MTextField } from '@m3ui-vue/m3ui-vue'
import { labels, users } from '../data'
import type { Repo } from '../repos'
import { useForge } from '../useForge'
import { ago } from '../time'
import CommentBox from '../components/CommentBox.vue'
import ItemList from '../components/ItemList.vue'
import ItemSidebar from '../components/ItemSidebar.vue'
import ItemTimeline from '../components/ItemTimeline.vue'
import StateIcon from '../components/StateIcon.vue'

const props = defineProps<{ repo: Repo; issue?: number; newIssue?: boolean; wide: boolean }>()
const { data, openRepo, createIssue, comment, setState } = useForge()

const issues = computed(() => data(props.repo.id).issues)
const current = computed(() => (props.issue ? issues.value.find((i) => i.number === props.issue) : undefined))
const open = (n?: number) => openRepo(props.repo.id, 'issues', n ? { issue: n } : {})

// Commenting.
const reply = ref('')
watch(() => props.issue, () => (reply.value = ''))
function send(close = false) {
  if (reply.value.trim()) comment(current.value!, reply.value.trim())
  if (close) setState(current.value!, current.value!.state === 'open' ? 'closed' : 'open')
  reply.value = ''
}

// New issue.
const title = ref('')
const body = ref('')
const newLabels = ref<string[]>([])
const newAssignees = ref<string[]>([])
watch(
  () => props.newIssue,
  (v) => {
    if (!v) return
    title.value = ''
    body.value = ''
    newLabels.value = []
    newAssignees.value = []
  },
  { immediate: true },
)
function submit() {
  if (!title.value.trim()) return
  const n = createIssue(props.repo, title.value.trim(), body.value.trim(), newLabels.value, newAssignees.value)
  open(n)
}
</script>

<template>
  <div class="mx-auto max-w-6xl p-3 sm:p-6">
    <!-- New issue -->
    <template v-if="newIssue">
      <h2 class="mb-4 text-headline-small text-on-surface">New issue</h2>
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div class="flex flex-col gap-3">
          <MTextField v-model="title" label="Title" variant="outlined" />
          <CommentBox v-model="body" placeholder="Describe the issue (Markdown supported)" :rows="10">
            <template #actions>
              <MButton variant="text" @click="open()">Cancel</MButton>
              <MButton :disabled="!title.trim()" @click="submit">Submit new issue</MButton>
            </template>
          </CommentBox>
        </div>
        <aside class="flex flex-col gap-4">
          <MMultiSelect v-model="newAssignees" :options="users.map((u) => ({ label: `${u.login} · ${u.name}`, value: u.login }))" label="Assignees" variant="outlined" :max-chips="2" />
          <MMultiSelect v-model="newLabels" :options="labels.map((l) => ({ label: l.name, value: l.id }))" label="Labels" variant="outlined" :max-chips="2" />
        </aside>
      </div>
    </template>

    <!-- One issue -->
    <template v-else-if="current">
      <div class="mb-4 border-b border-outline-variant pb-4">
        <div class="flex items-start gap-3">
          <h2 class="min-w-0 flex-1 text-headline-small text-on-surface">{{ current.title }} <span class="text-on-surface-variant">#{{ current.number }}</span></h2>
          <MButton variant="tonal" size="xs" class="hidden sm:inline-flex" @click="openRepo(repo.id, 'issues', { newIssue: true })">New issue</MButton>
        </div>
        <div class="mt-2 flex flex-wrap items-center gap-2 text-body-medium text-on-surface-variant">
          <StateIcon :state="current.state" pill />
          <span><strong class="text-on-surface">{{ current.author }}</strong> opened this issue {{ ago(current.created) }} · {{ current.timeline.filter((e) => e.kind === 'comment').length - 1 }} comments</span>
        </div>
      </div>
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div class="min-w-0">
          <ItemTimeline :entries="current.timeline" :author="current.author" />
          <CommentBox v-model="reply" avatar class="mt-2">
            <template #actions>
              <MButton variant="outlined" :icon="current.state === 'open' ? 'check_circle' : 'replay'" @click="send(true)">
                {{ current.state === 'open' ? (reply.trim() ? 'Close with comment' : 'Close issue') : 'Reopen issue' }}
              </MButton>
              <MButton :disabled="!reply.trim()" @click="send()">Comment</MButton>
            </template>
          </CommentBox>
        </div>
        <ItemSidebar :item="current" :class="{ 'order-first': !wide }" />
      </div>
    </template>

    <!-- The list -->
    <ItemList v-else :items="issues" @open="open">
      <template #actions>
        <MButton icon="add" @click="openRepo(repo.id, 'issues', { newIssue: true })">New issue</MButton>
      </template>
    </ItemList>
  </div>
</template>
