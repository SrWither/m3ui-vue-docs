<script setup lang="ts">
/* The actions on an item (or the selection it belongs to), shared by its ⋮ menu and its right-click menu. */
import { computed } from 'vue'
import { MMenuDivider, MMenuItem } from '@m3ui-vue/m3ui-vue'
import { useFiles } from '../useFiles'
import type { Item } from '../data'

const props = defineProps<{ item: Item }>()
const emit = defineEmits<{ rename: [Item] }>()
const f = useFiles()

// Acting on one item of a selection acts on the whole selection
const targets = computed(() => (f.selected.value.has(props.item.id) && f.selected.value.size > 1 ? f.selectedItems.value : [props.item]))
const many = computed(() => targets.value.length > 1)
const allStarred = computed(() => targets.value.every((i) => i.starred))
function details() {
  if (!f.selected.value.has(props.item.id)) f.select(props.item.id)
  f.detailsOpen.value = true
}
</script>

<template>
  <template v-if="item.trashed">
    <MMenuItem icon="restore_from_trash" @click="f.restore(targets)">Restore</MMenuItem>
    <MMenuItem icon="delete_forever" danger @click="f.deleteForever(targets)">Delete forever</MMenuItem>
  </template>
  <template v-else>
    <MMenuItem v-if="!many" icon="open_in_new" @click="f.open(item)">Open</MMenuItem>
    <MMenuItem v-if="!many && item.kind !== 'folder'" icon="download" @click="f.download(item)">Download</MMenuItem>
    <MMenuItem v-if="!many" icon="drive_file_rename_outline" @click="emit('rename', item)">Rename</MMenuItem>
    <MMenuItem :icon="allStarred ? 'star' : 'star_outline'" @click="f.toggleStar(targets)">{{ allStarred ? 'Remove from Starred' : 'Add to Starred' }}</MMenuItem>
    <MMenuItem icon="info" @click="details">Details</MMenuItem>
    <MMenuDivider />
    <MMenuItem icon="delete" @click="f.trash(targets)">{{ many ? `Move ${targets.length} items to trash` : 'Move to trash' }}</MMenuItem>
  </template>
</template>
