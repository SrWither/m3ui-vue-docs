<script setup lang="ts">
/* RGB histogram of what's on screen, redrawn after every render. */
import { onMounted, ref, watch } from 'vue'
import { usePhoto } from '../usePhoto'

const { histo } = usePhoto()
const el = ref<HTMLCanvasElement>()

function draw() {
  const c = el.value, h = histo.value
  if (!c || !h) return
  const W = (c.width = 256), H = (c.height = 80)
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, W, H)
  ctx.globalCompositeOperation = 'screen'
  const channels: [Uint32Array, string][] = [[h.r, 'rgb(240 70 70 / 0.75)'], [h.g, 'rgb(70 200 90 / 0.75)'], [h.b, 'rgb(70 120 250 / 0.75)']]
  for (const [bins, color] of channels) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, H)
    for (let i = 0; i < 256; i++) ctx.lineTo(i, H - Math.min(1, Math.sqrt(bins[i]! / h.max)) * (H - 2))
    ctx.lineTo(255, H)
    ctx.closePath()
    ctx.fill()
  }
}
watch(histo, draw)
onMounted(draw)
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-[#1b1b1f]">
    <canvas ref="el" class="block h-20 w-full" aria-label="Histogram" role="img" />
  </div>
</template>
