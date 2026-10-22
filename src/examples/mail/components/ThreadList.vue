<script setup lang="ts">
/*
 * The list pane: a search bar on phones, the folder's toolbar (or the selection's actions),
 * quick filters, and the conversations inside MPullToRefresh. Drafts and Scheduled list
 * drafts instead.
 */
import { computed, onBeforeUpdate, ref } from 'vue'
import { MAvatar, MCheckbox, MChip, MEmptyState, MFab, MIcon, MIconButton, MPullToRefresh, MSearchField, MTooltip } from '@m3ui-vue/m3ui-vue'
import { me } from '../data'
import { formatWhen, person, plain, shortDate, useMail } from '../useMail'
import ThreadRow from './ThreadRow.vue'
import LaterMenu from './LaterMenu.vue'
import LabelMenu from './LabelMenu.vue'

const props = defineProps<{ twoPane: boolean; wide: boolean }>()
const emit = defineEmits<{ menu: [] }>()

const {
  view, query, searching, list, selected, viewTitle, unreadOnly, withAttachments, counts,
  refreshing, refresh, archive, remove, markRead, snooze, spam, moveToInbox, thread, drafts, openDraft, discard, cancelSchedule, compose,
} = useMail()

const isDrafts = computed(() => !searching.value && (view.value === 'drafts' || view.value === 'scheduled'))
const draftList = computed(() =>
  drafts.value.filter((d) => (view.value === 'scheduled' ? d.sendAt : !d.sendAt)).sort((a, b) => (a.sendAt ?? -a.updated) - (b.sendAt ?? -b.updated)),
)

const all = computed(() => list.value.length > 0 && selected.value.length === list.value.length)
function toggleAll() {
  selected.value = all.value ? [] : list.value.map((t) => t.id)
}
const allRead = computed(() => selected.value.every((id) => !thread(id).unread))
const inTrash = computed(() => view.value === 'trash' && !searching.value)
const inSpam = computed(() => view.value === 'spam' && !searching.value)
const unarchivable = computed(() => view.value === 'archive' || inTrash.value || inSpam.value)

const empty = computed(() => {
  if (searching.value) return { icon: 'search_off', title: `No results for “${query.value}”`, description: 'Try other words, or check the filters.' }
  if (unreadOnly.value || withAttachments.value) return { icon: 'filter_alt_off', title: 'Nothing matches these filters', description: '' }
  return {
    inbox: { icon: 'celebration', title: 'You’re all caught up', description: 'No new mail. Pull down (or refresh) to check again.' },
    starred: { icon: 'star', title: 'No starred messages', description: 'Stars let you give messages a special status to make them easier to find.' },
    snoozed: { icon: 'schedule', title: 'Nothing snoozed', description: 'Snoozed conversations come back to your inbox when you want them.' },
    sent: { icon: 'send', title: 'No sent messages', description: '' },
    archive: { icon: 'archive', title: 'Nothing archived', description: 'Archive conversations to clear your inbox without deleting them.' },
    spam: { icon: 'verified_user', title: 'Hooray, no spam here!', description: '' },
    trash: { icon: 'delete', title: 'Trash is empty', description: '' },
  }[view.value as string] ?? { icon: 'label', title: 'No conversations with this label', description: '' }
})

// Leaving rows go `position: absolute` so the rest can slide up; pin each at the spot it had
// before the update, or a batch (archive 5 at once) would pile onto the first slot.
const rows = ref<{ $el: HTMLElement }>()
const tops = new Map<string, number>()
onBeforeUpdate(() => {
  tops.clear()
  rows.value?.$el.querySelectorAll<HTMLElement>('[data-thread]').forEach((el) => tops.set(el.dataset.thread!, el.offsetTop))
})
function pin(el: Element) {
  const e = el as HTMLElement
  e.style.top = `${tops.get(e.dataset.thread!) ?? e.offsetTop}px`
}

const draftTitle = (to: string[]) => (to.length ? to.map((e) => person(e).name).join(', ') : '(no recipients)')
</script>

<template>
  <div class="relative flex h-full flex-col bg-surface">
    <!-- Phones: the search bar opens the drawer and shows your avatar -->
    <div v-if="!wide" class="shrink-0 px-3 pt-3 pb-1">
      <MSearchField v-model="query" placeholder="Search in mail" class="pr-3">
        <template #leading><MIconButton icon="menu" label="Open menu" @click.prevent="emit('menu')" /></template>
        <template #trailing><MAvatar v-if="!query" :name="me.name" :size="32" /></template>
      </MSearchField>
    </div>

    <!-- Toolbar: the selection's actions, or the folder's name and refresh -->
    <div class="flex h-14 shrink-0 items-center gap-1" :class="wide ? 'pr-4 pl-3' : 'px-2'">
      <template v-if="selected.length">
        <MCheckbox :model-value="all" :indeterminate="!all" aria-label="Select all" @update:model-value="toggleAll" />
        <span class="mr-auto pl-1 text-title-small text-on-surface">{{ selected.length }}</span>
        <MTooltip v-if="!unarchivable" text="Archive"><MIconButton icon="archive" label="Archive" @click="archive([...selected], twoPane)" /></MTooltip>
        <MTooltip v-else text="Move to Inbox"><MIconButton icon="move_to_inbox" label="Move to Inbox" @click="moveToInbox([...selected], twoPane)" /></MTooltip>
        <MTooltip :text="inTrash ? 'Delete forever' : 'Delete'"><MIconButton :icon="inTrash ? 'delete_forever' : 'delete'" :label="inTrash ? 'Delete forever' : 'Delete'" @click="remove([...selected], twoPane)" /></MTooltip>
        <MTooltip :text="allRead ? 'Mark as unread' : 'Mark as read'"><MIconButton :icon="allRead ? 'mark_email_unread' : 'drafts'" :label="allRead ? 'Mark as unread' : 'Mark as read'" @click="markRead([...selected], !allRead)" /></MTooltip>
        <LaterMenu v-if="!inTrash && !inSpam" icon="schedule" label="Snooze" title="Snooze until…" @choose="snooze([...selected], $event, twoPane)" />
        <LabelMenu :ids="selected" />
        <MTooltip v-if="!inSpam" text="Report spam"><MIconButton icon="report" label="Report spam" class="hidden sm:inline-flex" @click="spam([...selected], twoPane)" /></MTooltip>
        <MTooltip text="Clear selection"><MIconButton icon="close" label="Clear selection" @click="selected = []" /></MTooltip>
      </template>
      <template v-else>
        <MCheckbox v-if="!isDrafts && list.length" :model-value="false" aria-label="Select all" @update:model-value="toggleAll" />
        <h2 class="min-w-0 flex-1 truncate pl-2 text-title-medium text-on-surface">
          {{ viewTitle }}
          <span v-if="view === 'inbox' && !searching && counts.inbox" class="text-body-medium text-on-surface-variant">· {{ counts.inbox }} unread</span>
        </h2>
        <span v-if="wide && !isDrafts && list.length" class="pr-2 text-body-small text-on-surface-variant">1–{{ list.length }} of {{ list.length }}</span>
        <MTooltip text="Refresh"><MIconButton icon="refresh" label="Refresh" :disabled="refreshing" @click="refresh" /></MTooltip>
      </template>
    </div>

    <div v-if="!isDrafts" class="flex shrink-0 gap-2 overflow-x-auto px-3 pb-2 [scrollbar-width:none]">
      <MChip clickable :selected="unreadOnly" :icon="unreadOnly ? 'check' : undefined" @click="unreadOnly = !unreadOnly">Unread</MChip>
      <MChip clickable :selected="withAttachments" :icon="withAttachments ? 'check' : undefined" @click="withAttachments = !withAttachments">Has attachment</MChip>
    </div>

    <MPullToRefresh :refreshing="refreshing" :disabled="isDrafts" class="min-h-0 flex-1" @refresh="refresh">
      <!-- Drafts and scheduled mail -->
      <template v-if="isDrafts">
        <div
          v-for="d in draftList"
          :key="d.id"
          role="button"
          tabindex="0"
          class="group flex cursor-pointer gap-3 px-4 py-3 outline-none hover:bg-surface-container-low focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
          @click="view === 'scheduled' ? cancelSchedule(d.id) : openDraft(d.id)"
          @keydown.enter.self="openDraft(d.id)"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-container text-on-error-container">
            <MIcon :name="d.sendAt ? 'schedule_send' : 'draft'" :size="22" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline gap-2">
              <span class="min-w-0 flex-1 truncate text-body-large text-on-surface"><span class="text-error">{{ d.sendAt ? 'Scheduled' : 'Draft' }}</span> · {{ draftTitle(d.to) }}</span>
              <span class="shrink-0 text-label-small text-on-surface-variant">{{ d.sendAt ? formatWhen(d.sendAt) : shortDate(d.updated) }}</span>
            </div>
            <p class="truncate text-body-medium text-on-surface">{{ d.subject || '(no subject)' }}</p>
            <p class="truncate text-body-medium text-on-surface-variant">{{ plain(d.html) || 'No content' }}</p>
          </div>
          <MTooltip :text="d.sendAt ? 'Cancel send' : 'Discard draft'">
            <MIconButton :icon="d.sendAt ? 'cancel_schedule_send' : 'delete'" :label="d.sendAt ? 'Cancel send' : 'Discard draft'" size="xs" class="self-center" @click.stop="d.sendAt ? cancelSchedule(d.id) : discard(d.id)" />
          </MTooltip>
        </div>
        <MEmptyState
          v-if="!draftList.length"
          :icon="view === 'scheduled' ? 'schedule_send' : 'draft'"
          :title="view === 'scheduled' ? 'Nothing scheduled' : 'No drafts'"
          :description="view === 'scheduled' ? 'Use the arrow next to Send to send an email later.' : 'Emails you close without sending are saved here.'"
        />
        <p v-if="view === 'scheduled' && draftList.length" class="px-4 py-3 text-body-small text-on-surface-variant">Open a scheduled email to cancel it and edit it again.</p>
      </template>

      <template v-else>
        <!-- Keyed by folder: switching folders swaps the list instead of animating every row out -->
        <TransitionGroup :key="searching ? 'search' : view" ref="rows" tag="div" name="m3x-row" class="relative" @before-leave="pin">
          <ThreadRow v-for="t in list" :key="t.id" :data-thread="t.id" :thread="t" :wide="wide" />
        </TransitionGroup>
        <MEmptyState v-if="!list.length" v-bind="empty" />
        <div v-if="!wide" class="h-24" />
      </template>
    </MPullToRefresh>

    <!-- Phones: compose from the bottom corner -->
    <div v-if="!wide" class="absolute right-4 bottom-4">
      <MFab icon="edit" label="Compose" color="primary" @click="compose()" />
    </div>
  </div>
</template>

<style scoped>
.m3x-row-move,
.m3x-row-enter-active,
.m3x-row-leave-active {
  transition: transform 250ms cubic-bezier(0.2, 0, 0, 1), opacity 200ms ease;
}
.m3x-row-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.m3x-row-leave-to {
  opacity: 0;
}
.m3x-row-leave-active {
  position: absolute;
  inset-inline: 0;
}
@media (prefers-reduced-motion: reduce) {
  .m3x-row-move,
  .m3x-row-enter-active,
  .m3x-row-leave-active {
    transition: none;
  }
}
</style>
