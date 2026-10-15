<script setup lang="ts">
/*
 * The Code tab's content: a folder (latest commit, file list, README rendered with MMarkdown)
 * or a file (MCodeEditor, a Preview/Code switch for Markdown). Files can be edited and
 * committed to main, or proposed as a pull request from a new branch.
 */
import { computed, ref, watch } from 'vue'
import { MAvatar, MBreadcrumbs, MButton, MChip, MCopyButton, MDialog, MIcon, MIconButton, MMenu, MMenuItem, MRadioGroup, MSegmentedButton, MSkeleton, MTextField, MTooltip, useToast } from '@m3ui-vue/m3ui-vue'
import type { BreadcrumbItem } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import { MMarkdown } from '@m3ui-vue/m3ui-vue/markdown'
import { fileIcon, isDir, langInfo, listDir, type Repo } from '../repos'
import { user } from '../data'
import { useForge } from '../useForge'
import { ago } from '../time'

const props = defineProps<{ repo: Repo; path?: string; wide: boolean }>()
const { openRepo, readFile, lastCommitFor, commitEdit, data, finderOpen, edits, stars } = useForge()
const toast = useToast()

const path = computed(() => props.path ?? '')
const dir = computed(() => !path.value || isDir(props.repo, path.value))
const file = computed(() => (dir.value ? null : props.repo.files.find((f) => f.path === path.value) ?? null))
const entries = computed(() => (dir.value ? listDir(props.repo, path.value) : []))
const open = (p: string) => openRepo(props.repo.id, 'code', { path: p || undefined })

const crumbs = computed<BreadcrumbItem[]>(() => [{ label: props.repo.name }, ...path.value.split('/').filter(Boolean).map((label) => ({ label }))])
const onCrumb = (_: BreadcrumbItem, i: number) => open(path.value.split('/').slice(0, i).join('/'))

// The file (or the folder's README), loaded on demand; re-read after a commit changes it.
const text = ref<string | null>(null)
const readmePath = computed(() => {
  const md = entries.value.find((e) => !e.children && /readme\.md$/i.test(e.label))
  return md ? String(md.id) : null
})
const readme = ref<string | null>(null)
watch(
  [() => props.repo.id, path, () => file.value && edits[`${props.repo.id}:${file.value.path}`]],
  async () => {
    const want = path.value
    text.value = null
    readme.value = null
    if (file.value) {
      const t = await readFile(props.repo, file.value.path)
      if (want === path.value) text.value = t
    } else if (readmePath.value) {
      const t = await readFile(props.repo, readmePath.value)
      if (want === path.value) readme.value = t
    }
  },
  { immediate: true },
)
watch(path, () => {
  editing.value = false
  view.value = 'preview'
})

const lines = computed(() => text.value?.split('\n').length ?? 0)
const size = computed(() => {
  const b = new Blob([text.value ?? '']).size
  return b > 1024 ? `${(b / 1024).toFixed(1)} KB` : `${b} Bytes`
})
const view = ref<'preview' | 'code'>('preview')
const markdown = computed(() => file.value?.lang === 'markdown')
const viewOptions = [{ value: 'preview', label: 'Preview' }, { value: 'code', label: 'Code' }]
const latest = computed(() => data(props.repo.id).commits[0]!)
const fileCommit = computed(() => (file.value ? lastCommitFor(props.repo, file.value.path) : latest.value))
const commitCount = computed(() => data(props.repo.id).commits.length)

// Editing and committing.
const editing = ref(false)
const draft = ref('')
const committing = ref(false)
const message = ref('')
const target = ref<'main' | 'pull'>('main')
function startEdit() {
  draft.value = text.value ?? ''
  editing.value = true
  view.value = 'code'
}
function askCommit() {
  if (draft.value === text.value) return toast.info('No changes to commit', { icon: 'info' })
  message.value = `Update ${file.value!.name}`
  target.value = 'main'
  committing.value = true
}
function commit() {
  const pr = commitEdit(props.repo, file.value!.path, text.value ?? '', draft.value, message.value.trim() || `Update ${file.value!.name}`, target.value === 'pull')
  committing.value = false
  editing.value = false
  if (pr) openRepo(props.repo.id, 'pulls', { pull: pr })
}

const cloneUrl = computed(() => `https://forge.m3ui.dev/m3ui/${props.repo.name}.git`)
const notInDemo = (what: string) => toast.info(`${what} isn’t part of this demo`, { icon: 'info' })
</script>

<template>
  <div>
    <!-- Branch, path, and the clone menu -->
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <MMenu align="left">
        <template #trigger>
          <MButton variant="tonal" icon="account_tree" size="xs">main</MButton>
        </template>
        <p class="px-4 pt-2 pb-1 text-label-medium text-on-surface-variant">Switch branches</p>
        <MMenuItem icon="check">main</MMenuItem>
        <MMenuItem v-for="p in data(repo.id).pulls.filter((x) => x.state === 'open')" :key="p.branch" icon="call_split" @click="openRepo(repo.id, 'pulls', { pull: p.number })">{{ p.branch }}</MMenuItem>
      </MMenu>
      <MBreadcrumbs :items="crumbs" class="min-w-0 flex-1" @select="onCrumb" />
      <template v-if="dir">
        <MButton v-if="!wide" variant="outlined" icon="search" size="xs" @click="finderOpen = true">Go to file</MButton>
        <MMenu align="right">
          <template #trigger>
            <MButton icon="code" size="xs">Code</MButton>
          </template>
          <div class="w-80 px-4 py-3" @click.stop>
            <p class="mb-2 text-title-small text-on-surface">Clone with HTTPS</p>
            <div class="flex items-center gap-1 rounded-lg border border-outline-variant bg-surface-container-low pl-3">
              <code class="min-w-0 flex-1 truncate text-body-small text-on-surface">{{ cloneUrl }}</code>
              <MCopyButton :value="cloneUrl" size="xs" label="Copy URL" />
            </div>
          </div>
          <MMenuItem icon="folder_zip" @click="notInDemo('Downloading a ZIP')">Download ZIP</MMenuItem>
        </MMenu>
      </template>
    </div>

    <!-- A folder (the root also gets the About card: beside the files on wide screens, above them on phones) -->
    <div v-if="dir" :class="{ 'grid gap-6 xl:grid-cols-[minmax(0,1fr)_17rem]': !path }">
      <aside v-if="!path" class="flex flex-col gap-3 xl:order-last">
        <h2 class="text-title-medium text-on-surface">About</h2>
        <p class="text-body-medium text-on-surface-variant">{{ repo.description }}</p>
        <div class="flex flex-wrap gap-1.5">
          <MChip v-for="t in repo.topics" :key="t" tone="primary">{{ t }}</MChip>
        </div>
        <ul class="flex flex-col gap-1.5 text-body-medium text-on-surface-variant">
          <li class="flex items-center gap-2"><MIcon name="link" :size="18" /><a :href="`/examples/${repo.id}`" class="text-primary hover:underline">m3ui.dev/examples/{{ repo.id }}</a></li>
          <li class="flex items-center gap-2"><MIcon name="star" :size="18" />{{ stars(repo) }} stars</li>
          <li class="flex items-center gap-2"><MIcon name="fork_right" :size="18" />{{ repo.forks }} forks</li>
        </ul>
        <div class="border-t border-outline-variant pt-3">
          <h3 class="mb-2 text-title-small text-on-surface">Languages</h3>
          <div class="mb-2 flex h-2 overflow-hidden rounded-full">
            <span v-for="l in repo.languages" :key="l.lang" :style="{ width: `${l.share * 100}%`, backgroundColor: langInfo[l.lang].color }" />
          </div>
          <div class="flex flex-wrap gap-x-4 gap-y-1 text-label-medium text-on-surface-variant">
            <span v-for="l in repo.languages" :key="l.lang" class="flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: langInfo[l.lang].color }" /><span class="text-on-surface">{{ langInfo[l.lang].label }}</span> {{ Math.round(l.share * 100) }}%</span>
          </div>
        </div>
      </aside>
      <div class="min-w-0">
      <div class="overflow-hidden rounded-xl border border-outline-variant">
        <div class="flex items-center gap-2 bg-surface-container-low px-3 py-2.5">
          <MAvatar :name="user(latest.author).name" :size="24" />
          <span class="text-label-large text-on-surface">{{ latest.author }}</span>
          <span class="min-w-0 flex-1 truncate text-body-medium text-on-surface-variant">{{ latest.message }}</span>
          <code class="hidden text-label-small text-on-surface-variant sm:inline">{{ latest.sha.slice(0, 7) }}</code>
          <span class="hidden text-label-small text-on-surface-variant sm:inline">· {{ ago(latest.date) }}</span>
          <span class="flex items-center gap-1 pl-2 text-label-medium text-on-surface"><MIcon name="history" :size="18" />{{ commitCount }}<span class="hidden sm:inline"> commits</span></span>
        </div>
        <ul>
          <li v-if="path" class="border-t border-outline-variant">
            <button type="button" class="flex h-10 w-full cursor-pointer items-center gap-3 px-3 text-left text-body-medium text-on-surface hover:bg-on-surface/8" @click="open(path.split('/').slice(0, -1).join('/'))">
              <MIcon name="folder_open" :size="20" class="text-primary" />..
            </button>
          </li>
          <li v-for="e in entries" :key="e.id" class="border-t border-outline-variant">
            <button type="button" class="grid h-10 w-full cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-3 px-3 text-left hover:bg-on-surface/8 sm:grid-cols-[1.25rem_minmax(0,14rem)_minmax(0,1fr)_auto]" @click="open(String(e.id))">
              <MIcon :name="e.children ? 'folder' : fileIcon(e.label)" :size="20" :class="e.children ? 'm3f-fill text-primary' : 'text-on-surface-variant'" />
              <span class="truncate text-body-medium text-on-surface hover:underline">{{ e.label }}</span>
              <span class="hidden truncate text-body-medium text-on-surface-variant sm:block">{{ lastCommitFor(repo, String(e.id)).message }}</span>
              <span class="text-label-small text-on-surface-variant">{{ ago(lastCommitFor(repo, String(e.id)).date) }}</span>
            </button>
          </li>
        </ul>
      </div>

      <section v-if="readmePath" class="mt-4 overflow-hidden rounded-xl border border-outline-variant">
        <header class="flex items-center gap-2 border-b border-outline-variant px-4 py-2.5">
          <MIcon name="menu_book" :size="18" class="text-on-surface-variant" />
          <span class="flex-1 text-title-small text-on-surface">README</span>
          <MTooltip text="Edit README"><MIconButton icon="edit" label="Edit README" size="xs" @click="open(readmePath)" /></MTooltip>
        </header>
        <div class="m3f-md px-4 py-4 sm:px-8 sm:py-6">
          <MMarkdown v-if="readme !== null" :source="readme" />
          <MSkeleton v-else variant="text" :lines="8" />
        </div>
      </section>
      </div>
    </div>

    <!-- A file -->
    <template v-else-if="file">
      <div class="mb-3 flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2">
        <MAvatar :name="user(fileCommit.author).name" :size="24" />
        <span class="text-label-large text-on-surface">{{ fileCommit.author }}</span>
        <span class="min-w-0 flex-1 truncate text-body-medium text-on-surface-variant">{{ fileCommit.message }}</span>
        <span class="text-label-small text-on-surface-variant">{{ ago(fileCommit.date) }}</span>
      </div>

      <MSkeleton v-if="text === null" variant="rounded" height="16rem" />

      <!-- Markdown preview: rendered in our own card -->
      <div v-else-if="markdown && view === 'preview' && !editing" class="overflow-hidden rounded-lg border border-outline-variant">
        <header class="flex flex-wrap items-center gap-2 border-b border-outline-variant bg-surface-container px-3 py-1.5">
          <MSegmentedButton v-model="view" :options="viewOptions" density="compact" />
          <span class="text-label-medium text-on-surface-variant">{{ lines }} lines · {{ size }}</span>
          <span class="flex-1" />
          <MTooltip text="Edit this file"><MIconButton icon="edit" label="Edit this file" size="xs" @click="startEdit" /></MTooltip>
        </header>
        <div class="m3f-md px-4 py-4 sm:px-8 sm:py-6">
          <MMarkdown :source="text" />
        </div>
      </div>

      <!-- Code: MCodeEditor with its own header (language, copy); our controls go in its actions slot -->
      <MCodeEditor
        v-else
        :key="editing ? 'edit' : 'view'"
        :model-value="editing ? draft : text"
        :language="markdown ? 'plain' : file.lang"
        :readonly="!editing"
        :min-height="editing ? '24rem' : '12rem'"
        max-height="none"
        :wrap="false"
        @update:model-value="draft = $event"
      >
        <template #actions>
          <MSegmentedButton v-if="markdown && !editing" v-model="view" :options="viewOptions" density="compact" />
          <span class="hidden text-label-medium text-on-surface-variant sm:inline">{{ lines }} lines · {{ size }}</span>
          <template v-if="editing">
            <MButton variant="text" size="xs" @click="editing = false">Cancel</MButton>
            <MButton icon="commit" size="xs" @click="askCommit">Commit changes…</MButton>
          </template>
          <MTooltip v-else text="Edit this file"><MIconButton icon="edit" label="Edit this file" size="xs" @click="startEdit" /></MTooltip>
        </template>
      </MCodeEditor>
    </template>

    <MDialog v-model="committing" title="Commit changes" max-width="max-w-md">
      <div class="flex flex-col gap-4 pt-1">
        <MTextField v-model="message" label="Commit message" />
        <MRadioGroup
          v-model="target"
          :options="[
            { value: 'main', label: 'Commit directly to the main branch' },
            { value: 'pull', label: 'Create a new branch and start a pull request' },
          ]"
        />
      </div>
      <template #actions>
        <MButton variant="text" @click="committing = false">Cancel</MButton>
        <MButton @click="commit">{{ target === 'pull' ? 'Propose changes' : 'Commit changes' }}</MButton>
      </template>
    </MDialog>
  </div>
</template>
