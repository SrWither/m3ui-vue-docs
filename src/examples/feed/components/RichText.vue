<script setup lang="ts">
/* A post's text with #hashtags and @mentions as links. */
import { computed } from 'vue'
import { people } from '../data'
import { usePlaza } from '../usePlaza'

const props = defineProps<{ text: string }>()
const { go } = usePlaza()
const parts = computed(() => props.text.split(/([#@][\w]+)/g).filter(Boolean))
const isPerson = (p: string) => p.startsWith('@') && people.some((x) => x.handle === p.slice(1))
</script>

<template>
  <p class="text-body-large whitespace-pre-line text-on-surface [overflow-wrap:anywhere]">
    <template v-for="(p, i) in parts" :key="i">
      <button v-if="p.startsWith('#')" type="button" class="cursor-pointer text-primary hover:underline" @click.stop="go({ name: 'explore', q: p })">{{ p }}</button>
      <button v-else-if="isPerson(p)" type="button" class="cursor-pointer text-primary hover:underline" @click.stop="go({ name: 'profile', handle: p.slice(1) })">{{ p }}</button>
      <template v-else>{{ p }}</template>
    </template>
  </p>
</template>
