<script setup lang="ts">
import { ref } from 'vue'
import { MShape } from '@m3ui-vue/m3ui-vue'
import type { ShapeName } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const shapeProps: PropDef[] = [
  { name: 'shape', type: 'ShapeName', description: "One of M3's 35 expressive shapes — e.g. 'Cookie9Sided', 'Clover4Leaf', 'Gem', 'Sunny', 'Heart'" },
  { name: 'fill', type: 'string', default: "'currentColor'", description: 'Fill color used only when there is no default slot content (a decorative solid shape)' },
  { name: 'animate', type: 'boolean', default: 'true', description: 'Spring-morph into the new outline when shape changes — false snaps instantly instead' },
]

const cycle: ShapeName[] = ['Circle', 'Cookie9Sided', 'Gem', 'Clover4Leaf', 'Sunny', 'Heart']
const step = ref(0)

const rowShapes: ShapeName[] = ['Pentagon', 'Bun', 'Flower', 'Boom', 'Oval', 'Arrow']
const rowHover = ref<ShapeName | null>(null)
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
    <MShape :shape=&quot;cycle[step % cycle.length]&quot; class=&quot;h-16 w-16 bg-primary&quot; />
  </button>
</template>

<script setup>
const cycle = ['Circle', 'Cookie9Sided', 'Gem', 'Clover4Leaf', 'Sunny', 'Heart']
const step = ref(0)
<\/script>`"
    >
      <button type="button" class="cursor-pointer" @click="step++">
        <MShape :shape="cycle[step % cycle.length]" class="h-16 w-16 bg-primary" />
      </button>
    </ComponentDemo>

    <ComponentDemo
      title="Clip an Image"
      description="With a default slot, MShape clips whatever's inside it — fully responsive, not locked to a fixed pixel box."
      :code="`<MShape shape=&quot;Cookie9Sided&quot; class=&quot;h-16 w-16&quot;>
  <img src=&quot;/avatar.jpg&quot; class=&quot;h-full w-full object-cover&quot; />
</MShape>`"
    >
      <div class="flex items-center gap-4">
        <MShape shape="Cookie9Sided" class="h-16 w-16">
          <img src="https://picsum.photos/seed/m3ui/200" class="h-full w-full object-cover" />
        </MShape>
        <MShape shape="Gem" class="h-16 w-16 bg-linear-to-br from-primary to-tertiary" />
        <MShape shape="Clover4Leaf" class="h-16 w-16 bg-linear-to-br from-secondary to-tertiary" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="A Few More"
      description="A sample of the 35 available shapes — hover one."
      :code="`<MShape
  v-for=&quot;s in shapes&quot; :key=&quot;s&quot;
  :shape=&quot;hovered === s ? 'Circle' : s&quot;
  class=&quot;h-9 w-9 bg-on-surface-variant&quot;
  @mouseenter=&quot;hovered = s&quot; @mouseleave=&quot;hovered = null&quot;
/>`"
    >
      <div class="flex flex-wrap gap-3">
        <MShape
          v-for="s in rowShapes"
          :key="s"
          :shape="rowHover === s ? 'Circle' : s"
          class="h-9 w-9 cursor-pointer bg-on-surface-variant"
          @mouseenter="rowHover = s"
          @mouseleave="rowHover = null"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="shapeProps" />

    <ComponentPager current="MShape" />
  </div>
</template>
