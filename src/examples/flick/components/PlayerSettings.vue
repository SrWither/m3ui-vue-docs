<script setup lang="ts">
/* The player's gear menu: autoplay, playback speed and quality (submenus that push in, so they work on touch). */
import { computed, ref } from 'vue'
import { MIconButton, MMenu, MMenuItem } from '@m3ui-vue/m3ui-vue'
import { useFlick, type Quality } from '../useFlick'

defineProps<{ qualityLabel: string; buttonClass: string; size?: 'xs' | 'sm' }>()
const { speed, quality, autoplay } = useFlick()
const qualities: Quality[] = ['auto', 1080, 720, 480, 360, 144]
const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]

const menu = ref<InstanceType<typeof MMenu>>()
defineExpose({ open: computed(() => !!menu.value?.open) })
</script>

<template>
  <MMenu ref="menu" submenu-mode="push" align="right">
    <template #trigger>
      <MIconButton icon="settings" label="Settings" :size="size" :class="buttonClass" />
    </template>
    <MMenuItem v-model:checked="autoplay" icon="autoplay">Autoplay</MMenuItem>
    <MMenuItem icon="slow_motion_video">
      Playback speed · {{ speed === 1 ? 'Normal' : `${speed}×` }}
      <template #children>
        <MMenuItem v-for="s in speeds" :key="s" :selected="speed === s" @click="speed = s">{{ s === 1 ? 'Normal' : `${s}×` }}</MMenuItem>
      </template>
    </MMenuItem>
    <MMenuItem icon="tune">
      Quality · {{ qualityLabel }}
      <template #children>
        <MMenuItem v-for="q in qualities" :key="q" :selected="quality === q" @click="quality = q">{{ q === 'auto' ? 'Auto' : `${q}p` }}</MMenuItem>
      </template>
    </MMenuItem>
  </MMenu>
</template>
