<script setup lang="ts">
/*
 * Folders and labels in MNavigationDrawer: inline on wide screens (collapsing to a rail from
 * the menu button), modal on phones. Compose sits on top.
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { MFab, MIcon, MIconButton, MNavigationDrawer } from '@m3ui-vue/m3ui-vue'
import type { DrawerSection } from '@m3ui-vue/m3ui-vue'
import { labels } from '../data'
import { boxes, useMail, type View } from '../useMail'

const open = defineModel<boolean>({ required: true })
const props = defineProps<{ wide: boolean; collapsed: boolean }>()
const { view, counts, go, compose, searching } = useMail()
const router = useRouter()

const sections = computed<DrawerSection[]>(() => [
  {
    items: boxes.map((b) => ({
      value: b.id,
      label: b.label,
      icon: b.icon,
      badge: (b.id === 'inbox' || b.id === 'spam' ? counts.value[b.id] : b.id === 'drafts' || b.id === 'scheduled' ? counts.value[b.id] : 0) || undefined,
    })),
  },
  { title: 'Labels', items: labels.map((l) => ({ value: `label:${l.id}`, label: l.name, icon: 'label' })) },
])

function newMail() {
  if (!props.wide) open.value = false
  compose()
}
</script>

<template>
  <MNavigationDrawer
    v-model="open"
    :sections="sections"
    :selected="searching ? undefined : view"
    :modal="!wide"
    :collapsed="wide && collapsed"
    width="17rem"
    @select="go($event as View)"
  >
    <template #header>
      <div class="flex items-center gap-2 px-4 pt-4 pb-2" :class="{ 'justify-center px-2': wide && collapsed }">
        <template v-if="!wide">
          <span class="m3x-fill flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary">
            <MIcon name="mail" :size="22" />
          </span>
          <span class="flex-1 text-title-large font-medium text-on-surface">Postbox</span>
          <MIconButton icon="menu_book" label="Back to the docs" @click="router.push('/examples')" />
        </template>
        <MFab v-else-if="collapsed" icon="edit" color="primary" size="small" @click="newMail" />
        <MFab v-else icon="edit" label="Compose" color="primary" @click="newMail" />
      </div>
    </template>
  </MNavigationDrawer>
</template>
