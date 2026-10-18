<script setup lang="ts">
/*
 * Share: the video's link (it really opens this example on that video, optionally at a time),
 * a copy button and a QR code for your phone.
 */
import { computed, ref, watch } from 'vue'
import { MCheckbox, MCopyButton, MDialog, useToast } from '@m3ui-vue/m3ui-vue'
import { MQRCode } from '@m3ui-vue/m3ui-vue/qrcode'
import { fmt, videoById } from '../data'
import { useFlick } from '../useFlick'

const { sharing } = useFlick()
const toast = useToast()
const open = computed({
  get: () => !!sharing.value,
  set: (v: boolean) => !v && (sharing.value = null),
})
const video = computed(() => (sharing.value ? videoById.get(sharing.value.id) : undefined))
const startAt = ref(false)
watch(sharing, (s) => (startAt.value = !!s?.at && s.at > 1))
const link = computed(() => {
  if (!sharing.value) return ''
  const t = startAt.value && sharing.value.at ? `&t=${Math.floor(sharing.value.at)}` : ''
  return `https://m3ui.dev/examples/flick?v=${sharing.value.id}${t}`
})
</script>

<template>
  <MDialog v-model="open" title="Share" max-width="420px">
    <div v-if="video" class="flex flex-col items-center gap-4">
      <MQRCode :value="link" :size="168" module-style="dots" />
      <div class="flex w-full items-center gap-1 rounded-xl border border-outline-variant py-1 pr-1 pl-3">
        <span class="min-w-0 flex-1 truncate text-body-medium text-on-surface">{{ link }}</span>
        <MCopyButton :value="link" label="Copy link" variant="tonal" @copied="toast.success('Link copied', { icon: 'link' })" />
      </div>
      <MCheckbox v-if="sharing?.at && sharing.at > 1" v-model="startAt" :label="`Start at ${fmt(sharing.at)}`" class="self-start" />
    </div>
  </MDialog>
</template>
