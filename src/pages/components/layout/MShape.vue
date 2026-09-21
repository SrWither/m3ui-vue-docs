<script setup lang="ts">
import { ref } from 'vue'
import { MShape, MSelect, MSwitch, MSlider, shapeNames } from '@m3ui-vue/m3ui-vue'
import type { ShapeName } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const shapeProps: PropDef[] = [
  { name: 'shape', type: 'ShapeName', description: "One of M3's 35 expressive shapes — e.g. 'Cookie9Sided', 'Clover4Leaf', 'Gem', 'Sunny', 'Heart'" },
  { name: 'fill', type: 'string', default: "'currentColor'", description: "SVG fill used only when there's no default slot content (a decorative solid shape) — not a background-color, so color it with a text-* class or the fill prop directly, not bg-*" },
  { name: 'animate', type: 'boolean', default: 'true', description: 'Spring-morph into the new outline when shape changes — false snaps instantly instead' },
  { name: 'speed', type: 'number', default: '1', description: "Multiplier on the morph spring's speed. Scales stiffness/damping together so the spring keeps the same character, just faster or slower" },
]

const cycle: ShapeName[] = ['Circle', 'Cookie9Sided', 'Gem', 'Clover4Leaf', 'Sunny', 'Heart']
const step = ref(0)

const playShape = ref<ShapeName>('Cookie9Sided')
const playAnimate = ref(true)
const playSpeed = ref(1)
const shapeOptions = shapeNames.map(s => ({ label: s, value: s }))
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MShape</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Clips its content — or renders a filled shape with no content — into one of Material 3's 35 real
      "expressive" shapes. Changing <code>shape</code> spring-morphs into the new outline instead of snapping.
    </p>

    <ComponentDemo
      title="Morph on Click"
      description="Real spring physics per frame, not a CSS transition — click the shape."
      :code="`<template>
  <button @click=&quot;step++&quot;>
    <MShape :shape=&quot;cycle[step % cycle.length]&quot; class=&quot;h-32 w-32 text-tertiary&quot; />
  </button>
</template>

<script setup>
const cycle = ['Circle', 'Cookie9Sided', 'Gem', 'Clover4Leaf', 'Sunny', 'Heart']
const step = ref(0)
<\/script>`"
    >
      <button type="button" class="cursor-pointer" @click="step++">
        <MShape :shape="cycle[step % cycle.length]" class="h-32 w-32 text-tertiary" />
      </button>
    </ComponentDemo>

    <ComponentDemo
      title="Clip Content"
      description="With a default slot, MShape clips whatever's inside it — an image, a gradient, anything — fully responsive, not locked to a fixed pixel box."
      :code="`<MShape shape=&quot;Cookie9Sided&quot; class=&quot;h-32 w-32&quot;>
  <img src=&quot;/avatar.jpg&quot; class=&quot;h-full w-full object-cover&quot; />
</MShape>
<MShape shape=&quot;Gem&quot; class=&quot;h-32 w-32&quot;>
  <div class=&quot;h-full w-full bg-linear-to-br from-tertiary to-primary&quot; />
</MShape>`"
    >
      <div class="flex flex-wrap items-center gap-6">
        <MShape shape="Cookie9Sided" class="h-32 w-32">
          <img src="https://picsum.photos/seed/m3ui/200" class="h-full w-full object-cover" />
        </MShape>
        <MShape shape="Gem" class="h-32 w-32">
          <div class="h-full w-full bg-linear-to-br from-tertiary to-primary" />
        </MShape>
        <MShape shape="Clover4Leaf" class="h-32 w-32">
          <div class="h-full w-full bg-linear-to-br from-secondary to-primary" />
        </MShape>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Playground"
      description="Pick a shape, tune the morph speed, and toggle animate to feel the spring for yourself."
      :code="`<template>
  <MShape :shape=&quot;shape&quot; :animate=&quot;animate&quot; :speed=&quot;speed&quot; class=&quot;h-20 w-20 text-primary&quot; />
  <MSelect v-model=&quot;shape&quot; :options=&quot;shapeOptions&quot; />
  <MSlider v-model=&quot;speed&quot; :min=&quot;0.25&quot; :max=&quot;2&quot; :step=&quot;0.25&quot; />
  <MSwitch v-model=&quot;animate&quot; label=&quot;Animate&quot; />
</template>`"
    >
      <div class="flex w-full flex-col items-center gap-6">
        <MShape :shape="playShape" :animate="playAnimate" :speed="playSpeed" class="h-20 w-20 text-primary" />
        <div class="flex w-64 flex-col items-center gap-5">
          <MSelect v-model="playShape" :options="shapeOptions" label="Shape" class="w-64" />
          <div class="w-full">
            <p class="mb-2 text-body-medium text-on-surface-variant">Speed: {{ playSpeed }}x</p>
            <MSlider v-model="playSpeed" :min="0.25" :max="2" :step="0.25" />
          </div>
          <MSwitch v-model="playAnimate" label="Animate" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="All 35 Shapes"
      description="The full MaterialShapes.kt catalog."
      :code="`<div class=&quot;bg-surface-container-highest&quot;>
  <MShape v-for=&quot;s in shapeNames&quot; :key=&quot;s&quot; :shape=&quot;s&quot; class=&quot;h-20 w-20 text-primary&quot; />
</div>`"
    >
      <div class="flex flex-wrap gap-4 rounded-2xl bg-surface-container-highest p-5">
        <MShape v-for="s in shapeNames" :key="s" :shape="s" class="h-20 w-20 text-primary" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="shapeProps" />

    <ComponentPager current="MShape" />
  </div>
</template>
