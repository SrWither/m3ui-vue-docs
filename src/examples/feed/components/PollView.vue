<script setup lang="ts">
/* A poll: options to pick, then the results as bars that grow, with your choice checked. */
import { computed } from 'vue'
import { MIcon } from '@m3ui-vue/m3ui-vue'
import { compact } from '../data'
import { usePlaza } from '../usePlaza'

const props = defineProps<{ id: string }>()
const { post, votes, vote } = usePlaza()
const poll = computed(() => post(props.id).poll!)
const chosen = computed(() => votes.get(props.id))
const total = computed(() => poll.value.options.reduce((s, o) => s + o.votes, 0))
const done = computed(() => chosen.value !== undefined || poll.value.ends < Date.now())
const pct = (v: number) => (total.value ? Math.round((v / total.value) * 100) : 0)
const left = computed(() => {
  const h = Math.round((poll.value.ends - Date.now()) / 3_600_000)
  return h <= 0 ? 'Final results' : h >= 24 ? `${Math.round(h / 24)} days left` : `${h} hours left`
})
const top = computed(() => Math.max(...poll.value.options.map((o) => o.votes)))
</script>

<template>
  <div class="mt-3 flex flex-col gap-2" @click.stop>
    <template v-if="!done">
      <button
        v-for="(o, i) in poll.options"
        :key="o.label"
        type="button"
        class="h-10 cursor-pointer rounded-full border border-primary px-4 text-label-large text-primary transition-colors hover:bg-primary/8"
        @click="vote(id, i)"
      >
        {{ o.label }}
      </button>
    </template>
    <template v-else>
      <div v-for="(o, i) in poll.options" :key="o.label" class="relative flex h-10 items-center overflow-hidden rounded-lg px-3">
        <span class="m3p-bar absolute inset-y-0 left-0 rounded-lg" :class="o.votes === top ? 'bg-primary-container' : 'bg-surface-container-highest'" :style="{ width: `${pct(o.votes)}%` }" />
        <span class="relative flex flex-1 items-center gap-1.5 text-body-medium text-on-surface" :class="{ 'font-bold': o.votes === top }">
          {{ o.label }}<MIcon v-if="chosen === i" name="check_circle" :size="18" class="text-primary" />
        </span>
        <span class="relative text-body-medium text-on-surface" :class="{ 'font-bold': o.votes === top }">{{ pct(o.votes) }}%</span>
      </div>
    </template>
    <p class="text-body-small text-on-surface-variant">{{ compact(total) }} votes · {{ left }}</p>
  </div>
</template>

<style scoped>
.m3p-bar {
  animation: m3p-grow 600ms cubic-bezier(0.2, 0, 0, 1);
  transform-origin: left;
}
@keyframes m3p-grow {
  from { transform: scaleX(0); }
}
@media (prefers-reduced-motion: reduce) {
  .m3p-bar { animation: none; }
}
</style>
