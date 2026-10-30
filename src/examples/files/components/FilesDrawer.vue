<script setup lang="ts">
/*
 * Sections in MNavigationDrawer (inline on wide screens, modal on phones), the New button (upload or a new
 * folder) on top and the storage meter below.
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MButton, MIcon, MIconButton, MMenu, MMenuItem, MNavigationDrawer, MProgressBar } from '@m3ui-vue/m3ui-vue'
import type { DrawerSection } from '@m3ui-vue/m3ui-vue'
import { formatSize, useFiles, type Section } from '../useFiles'

const open = defineModel<boolean>({ required: true })
const props = defineProps<{ wide: boolean }>()
const emit = defineEmits<{ 'new-folder': [] }>()
const f = useFiles()
const router = useRouter()

const trashCount = computed(() => f.items.value.filter((i) => i.trashed).length)
const sections = computed<DrawerSection[]>(() => [
  {
    items: [
      { value: 'files', label: 'My files', icon: 'folder' },
      { value: 'recent', label: 'Recent', icon: 'schedule' },
      { value: 'starred', label: 'Starred', icon: 'star' },
      { value: 'shared', label: 'Shared with me', icon: 'group' },
      { value: 'trash', label: 'Trash', icon: 'delete', badge: trashCount.value || undefined },
    ],
  },
])

function go(s: string | number) {
  f.goSection(s as Section)
  if (!props.wide) open.value = false
}

const input = ref<HTMLInputElement>()
function pick(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files?.length) f.upload(files)
  ;(e.target as HTMLInputElement).value = ''
  if (!props.wide) open.value = false
}
function folder() {
  if (!props.wide) open.value = false
  emit('new-folder')
}

const percent = computed(() => (f.used.value / f.quota) * 100)
</script>

<template>
  <MNavigationDrawer
    v-model="open"
    :sections="sections"
    :selected="f.query.value ? undefined : f.section.value"
    :modal="!wide"
    width="16rem"
    @select="go"
  >
    <template #header>
      <div class="flex flex-col gap-3 px-4 pt-3 pb-2">
        <div v-if="!wide" class="flex items-center gap-2">
          <span class="flex size-9 items-center justify-center rounded-xl bg-primary text-on-primary"><MIcon name="folder_open" :size="22" filled /></span>
          <span class="flex-1 text-title-large font-medium">Folio</span>
          <MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" />
        </div>
        <input ref="input" type="file" multiple accept="application/pdf,image/*,video/*,audio/*" class="hidden" @change="pick" />
        <MMenu>
          <template #trigger>
            <MButton icon="add" variant="tonal" size="md" class="self-start shadow-elevation-1">New</MButton>
          </template>
          <MMenuItem icon="upload_file" @click="input?.click()">Upload files</MMenuItem>
          <MMenuItem icon="create_new_folder" @click="folder">New folder</MMenuItem>
        </MMenu>
      </div>
    </template>

    <div class="mt-2 flex flex-col gap-2 px-6 pb-6">
      <span class="flex items-center gap-2 text-label-large text-on-surface-variant"><MIcon name="cloud" :size="20" />Storage</span>
      <MProgressBar :value="percent" />
      <span class="text-body-small text-on-surface-variant">{{ formatSize(f.used.value) }} of {{ formatSize(f.quota) }} used</span>
    </div>
  </MNavigationDrawer>
</template>
