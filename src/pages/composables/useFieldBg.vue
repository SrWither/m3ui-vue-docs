<script setup lang="ts">
import { ref } from 'vue'
import { MCard, MTextField, useFieldBg } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const surfaces = [
  { cls: 'bg-surface', label: 'surface' },
  { cls: 'bg-surface-container-high', label: 'surface-container-high' },
  { cls: 'bg-secondary-container', label: 'secondary-container' },
]
const values = ref(['', '', ''])

// One custom field per surface, each with its own useFieldBg call.
const fieldA = ref<HTMLElement | null>(null)
const fieldB = ref<HTMLElement | null>(null)
const fieldC = ref<HTMLElement | null>(null)
useFieldBg(fieldA, () => undefined)
useFieldBg(fieldB, () => undefined)
useFieldBg(fieldC, () => undefined)
const customFields = [fieldA, fieldB, fieldC]

const types: TypeDef[] = [
  {
    name: 'useFieldBg(containerEl, fieldBgProp)',
    description: 'Finds the background behind containerEl on mount and sets it as --field-bg on that element',
    fields: [
      { name: 'containerEl', type: 'Ref<HTMLElement | null>', required: true, description: 'The field\'s outer element; it receives the --field-bg inline style' },
      { name: 'fieldBgProp', type: '() => string | undefined', required: true, description: 'Getter for an explicit color (e.g. your own fieldBg prop); when it returns a value, detection is skipped' },
    ],
  },
  {
    name: 'Returns',
    fields: [
      { name: 'resolvedFieldBg', type: 'ComputedRef<string>', description: 'The color in use: the explicit one, else the detected one (var(--color-surface) until mounted)' },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">useFieldBg</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      An outlined field's floating label sits on the border, with a patch of background behind it that has to match
      whatever the field is placed on. This finds that background, so the label cuts cleanly through the outline on
      any surface. The library's outlined fields use it; reach for it when you build a field of your own.
    </p>

    <ComponentDemo
      title="Built-in fields"
      description="MTextField, MSelect, the pickers and the other outlined fields detect it by themselves. Focus each one: the label's patch matches the card behind it."
      :code="`<div class=&quot;bg-secondary-container p-4&quot;>
  <MTextField v-model=&quot;name&quot; label=&quot;Name&quot; variant=&quot;outlined&quot; />
</div>

<!-- or give the color yourself -->
<MTextField v-model=&quot;name&quot; label=&quot;Name&quot; variant=&quot;outlined&quot; field-bg=&quot;#fdf6e3&quot; />`"
    >
      <div class="grid w-full gap-3 sm:grid-cols-3">
        <div v-for="(s, i) in surfaces" :key="s.cls" :class="s.cls" class="rounded-xl border border-outline-variant p-4">
          <p class="mb-3 text-label-medium text-on-surface-variant">{{ s.label }}</p>
          <MTextField v-model="values[i]" label="Name" variant="outlined" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="A field of your own"
      description="Give it the field's container; use var(--field-bg) as the label's background."
      :code="`<div ref=&quot;field&quot; class=&quot;relative rounded-sm border border-outline px-4 py-3&quot;>
  <span class=&quot;absolute -top-2.5 left-3 bg-[var(--field-bg)] px-1 text-label-small text-primary&quot;>
    Notes
  </span>
  <textarea class=&quot;w-full bg-transparent outline-none&quot; />
</div>`"
      :script="`import { ref } from 'vue'
import { useFieldBg } from '@m3ui-vue/m3ui-vue'

const props = defineProps<{ fieldBg?: string }>()
const field = ref<HTMLElement | null>(null)

const { resolvedFieldBg } = useFieldBg(field, () => props.fieldBg)`"
    >
      <div class="grid w-full gap-3 sm:grid-cols-3">
        <div v-for="(s, i) in surfaces" :key="s.cls" :class="s.cls" class="rounded-xl border border-outline-variant p-4">
          <div :ref="(el) => { customFields[i]!.value = el as HTMLElement | null }" class="relative mt-2 rounded-sm border border-outline px-4 py-3">
            <span class="absolute -top-2.5 left-3 bg-[var(--field-bg)] px-1 text-label-small text-primary">Notes</span>
            <textarea rows="2" class="w-full resize-none bg-transparent text-body-large text-on-surface outline-none" />
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">API</h3>
    <TypesTable :types="types" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Details</p>
      <ul class="list-inside list-disc space-y-1 text-body-medium text-on-surface-variant">
        <li>It walks up from the container's parent. A theme utility class (<code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">bg-surface-container-high</code>, <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">bg-primary-container</code>, …) is picked up as its CSS variable, so the patch changes color together with the theme</li>
        <li>Any other element with a non-transparent background is used as its computed color; if nothing is found before <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">&lt;body&gt;</code>, it's <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">var(--color-surface)</code></li>
        <li>It looks again when the <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">class</code> or <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">style</code> of <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">&lt;html&gt;</code> changes (dark mode, palette); a background that changes further down isn't noticed, so pass the color explicitly in that case</li>
      </ul>
    </MCard>

    <ComponentPager current="useFieldBg" />
  </div>
</template>
