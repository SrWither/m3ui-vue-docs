<script setup lang="ts">
/*
 * A job's log in MTerminal. While the run is in progress the lines arrive one by one; a finished
 * run prints them all at once.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MTerminal } from '@m3ui-vue/m3ui-vue/terminal'
import type { Job } from '../data'
import { duration } from '../time'

const props = defineProps<{ job: Job; live: boolean }>()
const term = ref<InstanceType<typeof MTerminal>>()

const lines = () => {
  const out: string[] = []
  props.job.steps.forEach((s, i) => {
    out.push(`\x1b[1m\x1b[36m▸ ${s.name}\x1b[0m \x1b[2m${duration(s.seconds)}\x1b[0m`)
    s.log.forEach((l) => out.push(`  ${l}`))
    if (i < props.job.steps.length - 1) out.push('')
  })
  if (props.job.status === 'skipped') return ['\x1b[2mThis job was skipped because a job it depends on failed.\x1b[0m']
  return out
}

let timer: number | undefined
onMounted(() => {
  // MTerminal sets up xterm asynchronously; give it a frame before writing.
  setTimeout(() => {
    const all = lines()
    if (!props.live) return all.forEach((l) => term.value?.writeln(l))
    let i = 0
    timer = window.setInterval(() => {
      if (i >= all.length) return clearInterval(timer)
      term.value?.writeln(all[i++]!)
    }, Math.max(40, 7000 / all.length))
  }, 150)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <MTerminal ref="term" readonly :title="`${job.name} · logs`" min-height="22rem" />
</template>
