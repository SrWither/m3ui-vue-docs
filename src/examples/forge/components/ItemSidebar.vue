<script setup lang="ts">
/* Assignees and labels of an issue or pull request, editable with MMultiSelect. */
import { computed } from 'vue'
import { MAvatar, MMultiSelect } from '@m3ui-vue/m3ui-vue'
import { labels, user, users, type Issue, type PullRequest } from '../data'
import { useForge } from '../useForge'
import LabelChip from './LabelChip.vue'

const props = defineProps<{ item: Issue | PullRequest }>()
const { setLabels, setAssignees } = useForge()

const labelOptions = labels.map((l) => ({ label: l.name, value: l.id }))
const userOptions = users.map((u) => ({ label: `${u.login} · ${u.name}`, value: u.login }))
const chosenLabels = computed({ get: () => props.item.labels, set: (v) => setLabels(props.item, v as string[]) })
const chosenUsers = computed({ get: () => props.item.assignees, set: (v) => setAssignees(props.item, v as string[]) })
const participants = computed(() => [...new Set(props.item.timeline.map((e) => (e.kind === 'comment' ? e.author : e.actor)))])
</script>

<template>
  <aside class="flex flex-col gap-5">
    <section>
      <MMultiSelect v-model="chosenUsers" :options="userOptions" label="Assignees" variant="outlined" :max-chips="2" />
      <div v-if="item.assignees.length" class="mt-2 flex flex-wrap gap-2">
        <span v-for="a in item.assignees" :key="a" class="flex items-center gap-1.5 text-body-medium text-on-surface"><MAvatar :name="user(a).name" :size="20" />{{ a }}</span>
      </div>
      <p v-else class="mt-1 text-body-small text-on-surface-variant">No one assigned</p>
    </section>
    <section>
      <MMultiSelect v-model="chosenLabels" :options="labelOptions" label="Labels" variant="outlined" :max-chips="2" />
      <div v-if="item.labels.length" class="mt-2 flex flex-wrap gap-1">
        <LabelChip v-for="l in item.labels" :key="l" :id="l" />
      </div>
      <p v-else class="mt-1 text-body-small text-on-surface-variant">None yet</p>
    </section>
    <section>
      <h3 class="mb-2 text-label-large text-on-surface-variant">{{ participants.length }} participant{{ participants.length > 1 ? 's' : '' }}</h3>
      <div class="flex flex-wrap gap-1">
        <MAvatar v-for="p in participants" :key="p" :name="user(p).name" :size="28" :title="p" />
      </div>
    </section>
  </aside>
</template>
