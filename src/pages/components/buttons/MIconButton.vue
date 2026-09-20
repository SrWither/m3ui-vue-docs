<script setup lang="ts">
import { MIconButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const iconButtonProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'label', type: 'string', description: 'Accessible label (aria-label and title)' },
  { name: 'variant', type: "'standard' | 'filled' | 'tonal' | 'outlined'", default: "'standard'", description: 'Visual style' },
  { name: 'shape', type: "'rounded' | 'squared'", default: "'rounded'", description: 'Button shape — rounded (pill, always) or squared (corner radius scales with size: 12px xs/sm, 16px md, 28px lg/xl)' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'sm'", description: "M3's 5-tier icon button sizing (xs:32, sm:40, md:56, lg:96, xl:136), or a custom pixel value" },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MIconButton</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A button that shows only an icon — four visual styles, the same 5-tier expressive sizing as MButton.
    </p>

    <ComponentDemo
      title="Variants"
      description="Four icon button styles."
      :code="`<template>
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;standard&quot; />
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;filled&quot; />
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;tonal&quot; />
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;outlined&quot; />
</template>`"
    >
      <MIconButton icon="settings" label="Settings" variant="standard" />
      <MIconButton icon="settings" label="Settings" variant="filled" />
      <MIconButton icon="settings" label="Settings" variant="tonal" />
      <MIconButton icon="settings" label="Settings" variant="outlined" />
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Five preset sizes or a custom pixel value."
      :code="`<MIconButton icon=&quot;favorite&quot; size=&quot;xs&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;sm&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;md&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;lg&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;xl&quot; variant=&quot;tonal&quot; />`"
    >
      <div class="flex flex-col items-start gap-3">
        <MIconButton icon="favorite" label="XS" size="xs" variant="tonal" />
        <MIconButton icon="favorite" label="SM" size="sm" variant="tonal" />
        <MIconButton icon="favorite" label="MD" size="md" variant="tonal" />
        <MIconButton icon="favorite" label="LG" size="lg" variant="tonal" />
        <MIconButton icon="favorite" label="XL" size="xl" variant="tonal" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Shape"
      description="Rounded (default) or squared."
      :code="`<MIconButton icon=&quot;settings&quot; shape=&quot;rounded&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;settings&quot; shape=&quot;squared&quot; variant=&quot;tonal&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MIconButton icon="settings" label="Rounded" shape="rounded" variant="filled" />
        <MIconButton icon="settings" label="Squared" shape="squared" variant="filled" />
        <MIconButton icon="settings" label="Rounded" shape="rounded" variant="tonal" />
        <MIconButton icon="settings" label="Squared" shape="squared" variant="tonal" />
        <MIconButton icon="settings" label="Rounded" shape="rounded" variant="outlined" />
        <MIconButton icon="settings" label="Squared" shape="squared" variant="outlined" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="iconButtonProps" />

    <ComponentPager current="MIconButton" />
  </div>
</template>
