<script setup lang="ts">
import { MAbsolute, MRelative, MBox, MText, MBadge, MIconButton, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const positionProps: PropDef[] = [
  { name: 'placement', type: "'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'", description: 'Preset corner/edge placement' },
  { name: 'offset', type: 'string | number', default: '0', description: 'Distance from edges when using placement (applies to both axes)' },
  { name: 'offsetX', type: 'string | number', description: 'Horizontal offset — overrides offset for the X axis' },
  { name: 'offsetY', type: 'string | number', description: 'Vertical offset — overrides offset for the Y axis' },
  { name: 'top', type: 'string | number', description: 'Top offset (number = px). Defaults to 8px when neither placement nor any of top/right/bottom/left is set' },
  { name: 'right', type: 'string | number', description: 'Right offset' },
  { name: 'bottom', type: 'string | number', description: 'Bottom offset' },
  { name: 'left', type: 'string | number', description: 'Left offset. Defaults to 8px when neither placement nor any of top/right/bottom/left is set' },
  { name: 'inset', type: 'boolean', default: 'false', description: 'Set all sides to 0' },
  { name: 'zIndex', type: 'number', description: 'Z-index value' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAbsolute</h1>
    <p class="mb-6 text-body-large text-on-surface-variant">
      Declarative absolute positioning without Tailwind classes. Supports manual offsets, placement shortcuts, and per-axis control. Pair it with <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">MRelative</code> as the positioning parent.
    </p>

    <ComponentDemo
      title="Manual Offsets"
      description="Use top, right, bottom, left props for precise positioning."
      :code="`<template>
  <MRelative>
    <MBox surface=&quot;container&quot; padding=&quot;lg&quot; rounded=&quot;lg&quot; class=&quot;h-40&quot;>
      Base content
    </MBox>
    <MAbsolute :top=&quot;8&quot; :right=&quot;8&quot;>
      <MBadge :count=&quot;3&quot;>
        <MIconButton icon=&quot;notifications&quot; variant=&quot;tonal&quot; />
      </MBadge>
    </MAbsolute>
    <MAbsolute :bottom=&quot;8&quot; :left=&quot;8&quot;>
      <MChip tone=&quot;primary&quot;>Overlay chip</MChip>
    </MAbsolute>
  </MRelative>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MRelative>
          <MBox surface="container" padding="lg" rounded="lg" class="h-40">
            <MText variant="body-medium" color="on-surface-variant">Base content area</MText>
          </MBox>
          <MAbsolute :top="8" :right="8">
            <MBadge :count="3">
              <MIconButton icon="notifications" variant="tonal" label="Notifications" />
            </MBadge>
          </MAbsolute>
          <MAbsolute :bottom="12" :left="12">
            <MButton size="small" variant="tonal" label="Action" />
          </MAbsolute>
        </MRelative>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Inset Overlay"
      description="Use inset to fill the entire parent."
      :code="`<template>
  <MRelative>
    <img src=&quot;...&quot; class=&quot;h-40 w-full rounded-lg object-cover&quot; />
    <MAbsolute :inset=&quot;true&quot; class=&quot;flex items-end rounded-lg bg-gradient-to-t from-black/60 to-transparent p-4&quot;>
      <MText variant=&quot;title-medium&quot; color=&quot;inherit&quot; class=&quot;text-white&quot;>Image title</MText>
    </MAbsolute>
  </MRelative>
</template>`"
    >
      <div class="w-full max-w-sm">
        <MRelative>
          <div class="h-40 w-full rounded-lg bg-linear-to-br from-primary to-tertiary" />
          <MAbsolute :inset="true" class="flex items-end rounded-lg bg-linear-to-t from-black/60 to-transparent p-4">
            <MText variant="title-medium" class="text-white">Overlay Title</MText>
          </MAbsolute>
        </MRelative>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Placement Shortcuts"
      description="Use placement to position in corners, edges, or center without manual offsets."
      :code="`<template>
  <MRelative class=&quot;h-48&quot;>
    <MAbsolute placement=&quot;top-left&quot; :offset=&quot;8&quot;>TL</MAbsolute>
    <MAbsolute placement=&quot;top-right&quot; :offset=&quot;8&quot;>TR</MAbsolute>
    <MAbsolute placement=&quot;center&quot;>Center</MAbsolute>
    <MAbsolute placement=&quot;bottom-left&quot; :offset=&quot;8&quot;>BL</MAbsolute>
    <MAbsolute placement=&quot;bottom-right&quot; :offset=&quot;8&quot;>BR</MAbsolute>
  </MRelative>
</template>`"
    >
      <div class="w-full max-w-md">
        <MRelative>
          <MBox surface="container" padding="lg" rounded="lg" class="h-48" />
          <MAbsolute v-for="p in (['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const)" :key="p" :placement="p" :offset="8">
            <MBox surface="primary-container" padding="xs" rounded="md">
              <MText variant="label-small">{{ p }}</MText>
            </MBox>
          </MAbsolute>
        </MRelative>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Separate X / Y Offsets"
      description="Use offsetX and offsetY to set different distances per axis. They override the general offset prop."
      :code="`<MRelative class=&quot;h-48&quot;>
  <MAbsolute placement=&quot;top-right&quot; :offset-x=&quot;16&quot; :offset-y=&quot;8&quot;>
    Close to top, further from right
  </MAbsolute>
  <MAbsolute placement=&quot;bottom-right&quot; :offset-x=&quot;24&quot; :offset-y=&quot;96&quot;>
    Large Y offset (e.g. above a bottom nav)
  </MAbsolute>
</MRelative>`"
    >
      <div class="w-full max-w-md">
        <MRelative>
          <MBox surface="container" padding="lg" rounded="lg" class="h-48" />
          <MAbsolute placement="top-right" :offset-x="16" :offset-y="8">
            <MBox surface="primary-container" padding="xs" rounded="md">
              <MText variant="label-small">offsetX: 16, offsetY: 8</MText>
            </MBox>
          </MAbsolute>
          <MAbsolute placement="bottom-left" :offset-x="12" :offset-y="32">
            <MBox surface="secondary-container" padding="xs" rounded="md">
              <MText variant="label-small">offsetX: 12, offsetY: 32</MText>
            </MBox>
          </MAbsolute>
          <MAbsolute placement="bottom-right" :offset-x="24" :offset-y="48">
            <MBox surface="tertiary-container" padding="xs" rounded="md">
              <MText variant="label-small">offsetX: 24, offsetY: 48</MText>
            </MBox>
          </MAbsolute>
        </MRelative>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="positionProps" />

    <ComponentPager current="MAbsolute" />
  </div>
</template>
