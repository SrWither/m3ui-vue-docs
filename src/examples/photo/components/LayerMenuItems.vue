<script setup lang="ts">
/* A layer's actions, shared by its ⋮ menu, its right-click menu and the Layer menu. */
import { computed } from 'vue'
import { MMenuDivider, MMenuItem } from '@m3ui-vue/m3ui-vue'
import { blends, usePhoto } from '../usePhoto'

const props = defineProps<{ id: string }>()
const p = usePhoto()
const layer = computed(() => p.layerById(props.id))
const i = computed(() => p.doc.value.layers.findIndex((l) => l.id === props.id))
const canMerge = computed(() => p.doc.value.layers[i.value - 1]?.kind === 'paint')
</script>

<template>
  <template v-if="layer">
    <MMenuItem v-if="layer.kind === 'text'" icon="edit" @click="p.selectedId.value = id; p.dialogs.editText = true">Edit text</MMenuItem>
    <MMenuItem icon="drive_file_rename_outline" @click="p.renameId.value = id">Rename…</MMenuItem>
    <MMenuItem icon="content_copy" @click="p.duplicateLayer(id)">Duplicate</MMenuItem>
    <MMenuItem :icon="layer.visible ? 'visibility_off' : 'visibility'" @click="p.toggleVisible(id)">{{ layer.visible ? 'Hide' : 'Show' }}</MMenuItem>
    <MMenuDivider />
    <MMenuItem icon="flip_to_front" :disabled="i === p.doc.value.layers.length - 1" @click="p.moveLayer(id, 1)">Bring forward</MMenuItem>
    <MMenuItem icon="flip_to_back" :disabled="i === 0" @click="p.moveLayer(id, -1)">Send backward</MMenuItem>
    <MMenuItem icon="layers">
      Blend mode
      <template #children>
        <MMenuItem
          v-for="b in blends"
          :key="b.value"
          :icon="layer.blend === b.value ? 'radio_button_checked' : 'radio_button_unchecked'"
          keep-open
          @click="p.setBlend(id, b.value)"
        >{{ b.label }}</MMenuItem>
      </template>
    </MMenuItem>
    <MMenuItem icon="vertical_align_bottom" :disabled="!canMerge" @click="p.mergeDown(id)">Merge down</MMenuItem>
    <MMenuDivider />
    <MMenuItem icon="delete" danger shortcut="Del" @click="p.deleteLayer(id)">Delete</MMenuItem>
  </template>
</template>
