<script setup lang="ts">
/* "Save to…": a checkbox per playlist and a new one by name. A bottom sheet on phones, a dialog on wide screens. */
import { computed, ref, watch } from 'vue'
import { MBottomSheet, MButton, MCheckbox, MDialog, MTextField } from '@m3ui-vue/m3ui-vue'
import { useFlick } from '../useFlick'

const props = defineProps<{ wide: boolean }>()
const { saving, playlists, inPlaylist, toggleInPlaylist, createPlaylist } = useFlick()
const open = computed({
  get: () => !!saving.value,
  set: (v: boolean) => !v && (saving.value = null),
})
const naming = ref(false)
const name = ref('')
watch(saving, () => {
  naming.value = false
  name.value = ''
})
function create() {
  if (!name.value.trim() || !saving.value) return
  createPlaylist(name.value.trim(), saving.value)
  saving.value = null
}
</script>

<template>
  <component :is="props.wide ? MDialog : MBottomSheet" v-model="open" title="Save video to…" v-bind="props.wide ? { maxWidth: '360px' } : {}">
    <div class="flex flex-col py-1">
      <MCheckbox
        v-for="p in playlists"
        :key="p.id"
        :model-value="!!saving && inPlaylist(p.id, saving)"
        :label="p.name"
        @update:model-value="saving && toggleInPlaylist(p.id, saving)"
      />
    </div>
    <div class="mt-3 pb-2">
      <form v-if="naming" class="flex flex-col gap-3" @submit.prevent="create">
        <MTextField v-model="name" label="Playlist name" autocomplete="off" />
        <div class="flex justify-end gap-2">
          <MButton variant="text" @click="naming = false">Cancel</MButton>
          <MButton type="submit" :disabled="!name.trim()">Create</MButton>
        </div>
      </form>
      <MButton v-else variant="text" icon="add" class="-ml-3" @click="naming = true">New playlist</MButton>
    </div>
  </component>
</template>
