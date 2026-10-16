<script setup lang="ts">
/*
 * The layer stack, top first: drag the grip to reorder, the eye to hide, right-click or ⋮ for
 * the rest. The photo is always at the bottom. Below the list, the selected layer's opacity,
 * blend mode and (for text) its content.
 */
import { computed } from 'vue'
import {
  MButton, MContextMenu, MDragDropList, MIcon, MIconButton, MMenu, MMenuItem, MSelect, MSlider, MTooltip,
} from '@m3ui-vue/m3ui-vue'
import { blends, fonts, usePhoto, type Blend, type Layer } from '../usePhoto'
import LayerMenuItems from './LayerMenuItems.vue'

defineProps<{ compact?: boolean }>()
const p = usePhoto()
const { doc, selectedId, selected, dialogs } = p

const items = computed({
  get: () => [...doc.value.layers].reverse().map((l) => ({ id: l.id })),
  set: (v) => p.setLayerOrder(v.map((x) => x.id as string)),
})
const layerOf = (id: string | number) => p.layerById(id as string)!
const textOf = (id: string | number) => {
  const l = layerOf(id)
  return l.kind === 'text' ? l : null
}
const iconOf = (l: Layer) => (l.kind === 'paint' ? 'brush' : l.sticker ? 'add_reaction' : 'title')

const opacity = computed({
  get: () => selected.value?.opacity ?? 100,
  set: (v: number) => { if (selected.value) { selected.value.opacity = v; p.commitSoon('Layer opacity', 'opacity') } },
})
const blend = computed({
  get: () => selected.value?.blend ?? 'source-over',
  set: (v: unknown) => selected.value && p.setBlend(selected.value.id, v as Blend),
})

</script>

<template>
  <div class="flex flex-col gap-3" :class="compact ? 'px-2 py-3' : 'p-4'">
    <div class="flex items-center gap-2 px-2">
      <h3 class="flex-1 text-title-small text-on-surface">Layers</h3>
      <MMenu>
        <template #trigger>
          <MButton variant="tonal" size="sm" icon="add">Add</MButton>
        </template>
        <MMenuItem icon="brush" shortcut="Shift+N" @click="p.addPaintLayer()">Paint layer</MMenuItem>
        <MMenuItem icon="title" @click="p.addText(); dialogs.editText = true">Text</MMenuItem>
        <MMenuItem icon="add_reaction" @click="dialogs.sticker = true">Sticker…</MMenuItem>
      </MMenu>
    </div>

    <div>
      <p v-if="!doc.layers.length" class="px-2 pb-2 text-body-medium text-on-surface-variant">Paint, text and stickers go on their own layers above the photo. Add one, or just start drawing.</p>
      <MDragDropList v-model="items" handle>
        <template #default="{ item }">
          <MContextMenu>
            <template #trigger>
              <div
                class="-my-2 -mr-2 flex cursor-pointer items-center gap-2 rounded-lg py-1 pr-1 pl-2"
                :class="selectedId === item.id ? 'bg-secondary-container text-on-secondary-container' : ''"
                @click="selectedId = item.id as string"
              >
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-container-highest"
                  :class="layerOf(item.id).visible ? '' : 'opacity-40'"
                >
                  <span
                    v-if="textOf(item.id) && !textOf(item.id)!.sticker"
                    class="truncate px-0.5 text-[15px] font-bold leading-none"
                    :style="{ fontFamily: fonts.find((f) => f.id === textOf(item.id)!.font)!.css }"
                  >Aa</span>
                  <span v-else-if="textOf(item.id)" class="text-[22px] leading-none">{{ textOf(item.id)!.text }}</span>
                  <MIcon v-else :name="iconOf(layerOf(item.id))" :size="20" class="text-on-surface-variant" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-body-medium">{{ layerOf(item.id).name }}</span>
                  <span class="block truncate text-body-small opacity-70">
                    {{ blends.find((b) => b.value === layerOf(item.id).blend)!.label }} · {{ layerOf(item.id).opacity }}%
                  </span>
                </span>
                <MTooltip :text="layerOf(item.id).visible ? 'Hide' : 'Show'">
                  <MIconButton
                    :icon="layerOf(item.id).visible ? 'visibility' : 'visibility_off'"
                    :label="layerOf(item.id).visible ? 'Hide layer' : 'Show layer'"
                    size="xs"
                    @click.stop="p.toggleVisible(item.id as string)"
                  />
                </MTooltip>
                <MMenu @click.stop>
                  <template #trigger>
                    <MIconButton icon="more_vert" label="Layer actions" size="xs" />
                  </template>
                  <LayerMenuItems :id="item.id as string" />
                </MMenu>
              </div>
            </template>
            <LayerMenuItems :id="item.id as string" />
          </MContextMenu>
        </template>
      </MDragDropList>

      <div class="flex items-center gap-2 rounded-lg py-2 pr-3 pl-12" :class="selectedId === null ? 'bg-secondary-container text-on-secondary-container' : ''" @click="selectedId = null">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-container-highest"><MIcon name="image" :size="20" class="text-on-surface-variant" /></span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-body-medium">Photo</span>
          <span class="block truncate text-body-small opacity-70">{{ doc.name }}</span>
        </span>
        <MIcon name="lock" :size="18" class="text-on-surface-variant" />
      </div>
    </div>

    <div v-if="selected" class="flex flex-col gap-3 rounded-xl bg-surface-container p-3">
      <div class="flex items-center gap-3">
        <span class="w-16 text-body-medium text-on-surface">Opacity</span>
        <MSlider v-model="opacity" :min="0" :max="100" show-tooltip class="flex-1" aria-label="Layer opacity" />
        <span class="w-10 text-right text-label-medium tabular-nums text-on-surface-variant">{{ opacity }}%</span>
      </div>
      <MSelect v-model="blend" :options="blends" label="Blend mode" variant="outlined" />
      <MButton v-if="selected.kind === 'text'" variant="tonal" size="sm" icon="edit" @click="dialogs.editText = true">Edit text</MButton>
    </div>

  </div>
</template>
