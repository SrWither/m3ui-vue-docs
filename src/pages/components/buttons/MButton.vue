<script setup lang="ts">
import { MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const buttonProps: PropDef[] = [
  { name: 'variant', type: "'filled' | 'tonal' | 'outlined' | 'text' | 'elevated'", default: "'filled'", description: 'Visual style of the button' },
  { name: 'color', type: "'primary' | 'error' | CSS color", default: "'primary'", description: 'Semantic color or any CSS color string' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'HTML button type' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner and disables the button' },
  { name: 'icon', type: 'string', description: 'Material Symbol icon name shown before the label' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: "M3's 5-tier expressive button sizing (xs: 32px, sm: 40px, md: 56px, lg: 96px, xl: 136px) — lg/xl are meant for hero-style prominent buttons, not everyday UI" },
  { name: 'shape', type: "'rounded' | 'squared'", default: "'rounded'", description: 'Button shape — rounded (pill, always) or squared (corner radius scales with size: 12px xs/sm, 16px md, 28px lg/xl)' },
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MButton</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The standard M3 button — five variants, five expressive size tiers, and either color.
    </p>

    <ComponentDemo
      title="Variants"
      description="Five button variants following the M3 specification."
      :code="`<template>
  <MButton variant=&quot;filled&quot;>Filled</MButton>
  <MButton variant=&quot;tonal&quot;>Tonal</MButton>
  <MButton variant=&quot;elevated&quot;>Elevated</MButton>
  <MButton variant=&quot;outlined&quot;>Outlined</MButton>
  <MButton variant=&quot;text&quot;>Text</MButton>
</template>`"
    >
      <MButton variant="filled">Filled</MButton>
      <MButton variant="tonal">Tonal</MButton>
      <MButton variant="elevated">Elevated</MButton>
      <MButton variant="outlined">Outlined</MButton>
      <MButton variant="text">Text</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="With Icons"
      description="Buttons with a leading Material Symbol icon."
      :code="`<template>
  <MButton icon=&quot;add&quot;>Create</MButton>
  <MButton variant=&quot;tonal&quot; icon=&quot;edit&quot;>Edit</MButton>
  <MButton variant=&quot;outlined&quot; icon=&quot;delete&quot;>Delete</MButton>
</template>`"
    >
      <MButton icon="add">Create</MButton>
      <MButton variant="tonal" icon="edit">Edit</MButton>
      <MButton variant="outlined" icon="delete">Delete</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="Error Color"
      description="Use color='error' for destructive actions."
      :code="`<template>
  <MButton color=&quot;error&quot;>Delete</MButton>
  <MButton color=&quot;error&quot; variant=&quot;tonal&quot;>Remove</MButton>
  <MButton color=&quot;error&quot; variant=&quot;outlined&quot;>Cancel</MButton>
  <MButton color=&quot;error&quot; variant=&quot;text&quot;>Discard</MButton>
</template>`"
    >
      <MButton color="error">Delete</MButton>
      <MButton color="error" variant="tonal">Remove</MButton>
      <MButton color="error" variant="outlined">Cancel</MButton>
      <MButton color="error" variant="text">Discard</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Colors"
      description="Pass any CSS color string to override the button's primary color."
      :code="`<template>
  <MButton color=&quot;#e91e63&quot;>Pink</MButton>
  <MButton color=&quot;#ff9800&quot; variant=&quot;tonal&quot;>Orange</MButton>
  <MButton color=&quot;teal&quot; variant=&quot;elevated&quot;>Teal</MButton>
</template>`"
    >
      <MButton color="#e91e63">Pink</MButton>
      <MButton color="#ff9800" variant="tonal">Orange</MButton>
      <MButton color="teal" variant="elevated">Teal</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="States"
      description="Loading and disabled states."
      :code="`<template>
  <MButton :loading=&quot;true&quot;>Saving...</MButton>
  <MButton :disabled=&quot;true&quot;>Disabled</MButton>
  <MButton variant=&quot;outlined&quot; :disabled=&quot;true&quot;>Disabled</MButton>
</template>`"
    >
      <MButton :loading="true">Saving...</MButton>
      <MButton :disabled="true">Disabled</MButton>
      <MButton variant="outlined" :disabled="true">Disabled</MButton>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Five sizes following M3 spec. Default is sm (40px)."
      :code="`<MButton size=&quot;xs&quot;>Extra Small</MButton>
<MButton size=&quot;sm&quot;>Small</MButton>
<MButton size=&quot;md&quot;>Medium</MButton>
<MButton size=&quot;lg&quot;>Large</MButton>
<MButton size=&quot;xl&quot;>Extra Large</MButton>`"
    >
      <div class="flex flex-col items-start gap-3">
        <MButton size="xs" icon="add">Extra Small</MButton>
        <MButton size="sm" icon="add">Small</MButton>
        <MButton size="md" icon="add">Medium</MButton>
        <MButton size="lg" icon="add">Large</MButton>
        <MButton size="xl" icon="add">Extra Large</MButton>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Shape"
      description="Rounded (pill, default) or squared shape — the squared corner radius scales with size (12px xs/sm, 16px md, 28px lg/xl), matching each M3 size tier's own ContainerShapeSquare token."
      :code="`<MButton shape=&quot;rounded&quot;>Rounded</MButton>
<MButton shape=&quot;squared&quot;>Squared</MButton>`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MButton shape="rounded" icon="add">Rounded</MButton>
        <MButton shape="squared" icon="add">Squared</MButton>
        <MButton shape="rounded" variant="outlined" icon="edit">Rounded</MButton>
        <MButton shape="squared" variant="outlined" icon="edit">Squared</MButton>
        <MButton shape="rounded" variant="tonal" icon="star">Rounded</MButton>
        <MButton shape="squared" variant="tonal" icon="star">Squared</MButton>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="buttonProps" />

    <ComponentPager current="MButton" />
  </div>
</template>
