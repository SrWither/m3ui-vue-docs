<script setup lang="ts">
/* Any emoji as a sticker layer, placed in the middle of the view. */
import { MDialog, MEmojiSelector } from '@m3ui-vue/m3ui-vue'
import { usePhoto } from '../usePhoto'

const { dialogs, addSticker } = usePhoto()
function pick(e: string) {
  addSticker(e)
  dialogs.sticker = false
}
</script>

<template>
  <MDialog v-model="dialogs.sticker" title="Add a sticker" max-width="420px">
    <MEmojiSelector height="300px" @select="pick" />
  </MDialog>
</template>
