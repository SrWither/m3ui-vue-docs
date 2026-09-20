<script setup lang="ts">
import { MSpinner } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const spinnerProps: PropDef[] = [
  { name: 'size', type: 'number', default: '20', description: 'Size in px' },
  { name: 'wavy', type: 'boolean', default: 'false', description: 'M3 Expressive wavy animation style — the ring rotates while a wave travels along its stroke, instead of a plain spin' },
  { name: 'label', type: 'string', description: "Aria label for the spinner's status role — falls back to the locale string ('Loading') when omitted" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSpinner</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A small circular loading spinner — a standard ring, or the M3 Expressive wavy variant. For a larger,
      shape-morphing loading affordance, see MLoadingIndicator.
    </p>

    <ComponentDemo
      title="Spinners"
      description="Standard and wavy loading spinners in different sizes."
      :code="`<template>
  <MSpinner :size=&quot;20&quot; />
  <MSpinner :size=&quot;32&quot; />
  <MSpinner :size=&quot;32&quot; :wavy=&quot;true&quot; />
</template>`"
      :script="`import { MSpinner } from '@m3ui-vue/m3ui-vue'`"
    >
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <MSpinner :size="20" />
          <span class="text-label-small text-on-surface-variant">20px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MSpinner :size="32" />
          <span class="text-label-small text-on-surface-variant">32px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MSpinner :size="48" />
          <span class="text-label-small text-on-surface-variant">48px</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MSpinner :size="32" :wavy="true" />
          <span class="text-label-small text-on-surface-variant">wavy</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MSpinner :size="48" :wavy="true" />
          <span class="text-label-small text-on-surface-variant">wavy 48</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Inside a button"
      description="A common pattern — swap in a spinner sized to match the surrounding text while an action is pending. (MButton's own loading prop already does this for you — shown here for the raw building block.)"
      :code="`<button class=&quot;inline-flex items-center gap-2&quot; disabled>
  <MSpinner :size=&quot;16&quot; />
  Saving...
</button>`"
    >
      <button type="button" class="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-label-large text-on-primary opacity-70" disabled>
        <MSpinner :size="16" />
        Saving...
      </button>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="spinnerProps" />

    <ComponentPager current="MSpinner" />
  </div>
</template>
