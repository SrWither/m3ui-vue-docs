<script setup lang="ts">
/*
 * Frequency bars from the synth's analyser, drawn on a canvas in the theme's primary color.
 * Plain rAF + canvas: nothing reactive changes per frame.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { engine } from '../engine'
import { useMusic } from '../useMusic'

const canvas = ref<HTMLCanvasElement>()
const { playing } = useMusic()
let raf = 0
const data = new Uint8Array(engine.bins)
const heights = new Float32Array(32)

function frame() {
  raf = requestAnimationFrame(frame)
  const c = canvas.value
  if (!c) return
  const dpr = window.devicePixelRatio || 1
  const w = c.clientWidth
  const h = c.clientHeight
  if (c.width !== w * dpr) {
    c.width = w * dpr
    c.height = h * dpr
  }
  const g = c.getContext('2d')!
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, w, h)
  const live = playing.value && engine.levels(data)
  const n = heights.length
  const gap = 4
  const bw = (w - gap * (n - 1)) / n
  g.fillStyle = getComputedStyle(c).color
  for (let i = 0; i < n; i++) {
    // The low bins carry most of the energy: spread the bars over the lower ~70% of the spectrum.
    const target = live ? data[Math.floor((i / n) * data.length * 0.7)]! / 255 : 0
    heights[i] = target > heights[i]! ? target : heights[i]! * 0.9
    const bh = Math.max(3, heights[i]! * h)
    g.globalAlpha = 0.35 + heights[i]! * 0.65
    g.beginPath()
    g.roundRect(i * (bw + gap), h - bh, bw, bh, Math.min(bw / 2, 4))
    g.fill()
  }
}

onMounted(() => {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) frame()
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <canvas ref="canvas" class="block h-12 w-full text-primary" aria-hidden="true" />
</template>
