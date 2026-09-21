<script setup lang="ts">
import { ref } from 'vue'
import { MShape, MCenter, MText, shapeNames } from '@m3ui-vue/m3ui-vue'
import type { ShapeName } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const shapeProps: PropDef[] = [
  { name: 'shape', type: 'ShapeName', description: "One of M3's 35 expressive shapes — e.g. 'Cookie9Sided', 'Clover4Leaf', 'Gem', 'Sunny', 'Heart'. See the full grid below" },
  { name: 'fill', type: 'string', default: "'currentColor'", description: 'Fill color used only when there is no default slot content (a decorative solid shape)' },
  { name: 'animate', type: 'boolean', default: 'true', description: 'Spring-morph into the new outline when shape changes — false snaps instantly instead' },
]

const heroShape = ref<ShapeName>('Cookie9Sided')
const hovered = ref(false)
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MShape</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Clips its content — or renders a filled shape with no content — into one of Material 3's 35 real
      "expressive" shapes. Changing <code>shape</code> spring-morphs into the new outline instead of snapping.
    </p>

    <ComponentDemo
      title="Clip Content"
      description="With a default slot, MShape clips whatever's inside it — an image, a color swatch, anything — into the chosen shape. It's fully responsive: the clip scales with the element's actual rendered size, not a fixed pixel box."
      :code="`<template>
  <MShape shape=&quot;Cookie9Sided&quot; class=&quot;h-24 w-24&quot;>
    <img src=&quot;/avatar.jpg&quot; class=&quot;h-full w-full object-cover&quot; />
  </MShape>
  <MShape shape=&quot;Gem&quot; class=&quot;h-24 w-24 bg-linear-to-br from-primary to-tertiary&quot; />
</template>`"
    >
      <div class="flex flex-wrap items-center gap-6">
        <MShape shape="Cookie9Sided" class="h-24 w-24">
          <img src="https://picsum.photos/seed/m3ui/200" class="h-full w-full object-cover" />
        </MShape>
        <MShape shape="Gem" class="h-24 w-24 bg-linear-to-br from-primary to-tertiary" />
        <MShape shape="Clover4Leaf" class="h-24 w-24 bg-linear-to-br from-secondary to-tertiary" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Morph on Interaction"
      description="Changing shape spring-morphs the outline into the new one — real per-frame physics, not a CSS transition. Hover the shape below."
      :code="`<template>
  <MShape :shape=&quot;hovered ? 'Heart' : 'Circle'&quot; class=&quot;h-28 w-28 bg-primary&quot; @mouseenter=&quot;hovered = true&quot; @mouseleave=&quot;hovered = false&quot; />
</template>`"
    >
      <MShape
        :shape="hovered ? 'Heart' : 'Circle'"
        class="h-28 w-28 cursor-pointer bg-primary transition-colors"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      />
    </ComponentDemo>

    <ComponentDemo
      title="All 35 Shapes"
      description="The full MaterialShapes.kt catalog. Click any shape to preview it above."
      :code="`<MShape v-for=&quot;name in shapeNames&quot; :key=&quot;name&quot; :shape=&quot;name&quot; class=&quot;h-12 w-12 bg-primary&quot; />`"
    >
      <div class="w-full">
        <MCenter class="mb-6">
          <MShape :shape="heroShape" class="h-20 w-20 bg-primary" />
        </MCenter>
        <div class="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
          <button
            v-for="name in shapeNames"
            :key="name"
            type="button"
            class="flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-surface-container"
            @click="heroShape = name"
          >
            <MShape :shape="name" class="h-10 w-10 bg-on-surface-variant" />
            <MText variant="label-small" color="on-surface-variant" class="text-center leading-tight">{{ name }}</MText>
          </button>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="shapeProps" />

    <ComponentPager current="MShape" />
  </div>
</template>
