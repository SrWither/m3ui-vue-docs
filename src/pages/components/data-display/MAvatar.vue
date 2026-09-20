<script setup lang="ts">
import { MAvatar } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const avatarProps: PropDef[] = [
  { name: 'name', type: 'string', description: 'Full name — initials are extracted automatically (first + last). Takes priority over fallback' },
  { name: 'fallback', type: 'string', description: "Custom text shown when name is not provided (e.g. 'AJ'). Falls back to '?' if neither is set" },
  { name: 'size', type: 'number', default: '40', description: 'Avatar size in px — also scales the font size proportionally (40%)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAvatar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A circular initials avatar. There's no image-source prop — it always renders extracted initials
      or a fallback string, never a photo.
    </p>

    <ComponentDemo
      title="Avatars"
      description="Initials extracted from the name prop. Supports different sizes."
      :code="`<template>
  <MAvatar name=&quot;Alice Brown&quot; />
  <MAvatar name=&quot;Carlos Diaz&quot; :size=&quot;48&quot; />
  <MAvatar name=&quot;Eva&quot; :size=&quot;56&quot; />
  <MAvatar name=&quot;Gabriel Hernandez&quot; :size=&quot;64&quot; />
</template>`"
    >
      <MAvatar name="Alice Brown" />
      <MAvatar name="Carlos Diaz" :size="48" />
      <MAvatar name="Eva" :size="56" />
      <MAvatar name="Gabriel Hernandez" :size="64" />
    </ComponentDemo>

    <ComponentDemo
      title="Fallback"
      description="Use the fallback prop for custom initials when no name is available."
      :code="`<template>
  <MAvatar fallback=&quot;FM&quot; />
  <MAvatar fallback=&quot;AJ&quot; :size=&quot;48&quot; />
  <MAvatar :size=&quot;56&quot; />  &lt;!-- shows ? --&gt;
  <MAvatar name=&quot;Alice Brown&quot; fallback=&quot;XX&quot; :size=&quot;56&quot; />  &lt;!-- name wins --&gt;
</template>`"
    >
      <MAvatar fallback="FM" />
      <MAvatar fallback="AJ" :size="48" />
      <MAvatar :size="56" />
      <MAvatar name="Alice Brown" fallback="XX" :size="56" />
    </ComponentDemo>

    <ComponentDemo
      title="Avatar Stack"
      description="Overlap avatars with negative spacing for group displays."
      :code="`<template>
  <div class=&quot;flex -space-x-3&quot;>
    <MAvatar name=&quot;Alice Brown&quot; :size=&quot;44&quot; />
    <MAvatar name=&quot;Carlos Diaz&quot; :size=&quot;44&quot; />
    <MAvatar name=&quot;Eva Flores&quot; :size=&quot;44&quot; />
    <span class=&quot;...&quot;>+5</span>
  </div>
</template>`"
    >
      <div class="flex -space-x-3">
        <MAvatar name="Alice Brown" :size="44" />
        <MAvatar name="Carlos Diaz" :size="44" />
        <MAvatar name="Eva Flores" :size="44" />
        <MAvatar name="Gabriel H" :size="44" />
        <span class="flex h-11 w-11 items-center justify-center rounded-full border-2 border-surface bg-surface-container-high text-label-medium text-on-surface-variant">
          +5
        </span>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="avatarProps" />

    <ComponentPager current="MAvatar" />
  </div>
</template>
