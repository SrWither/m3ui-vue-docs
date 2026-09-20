<script setup lang="ts">
import { ref } from 'vue'
import { MButtonGroup, MIcon } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const buttonGroupProps: PropDef[] = [
  { name: 'modelValue', type: 'unknown', description: 'Selected value(s) — any type (v-model)' },
  { name: 'options', type: 'ButtonGroupOption[]', description: 'See the type below' },
  { name: 'variant', type: "'standard' | 'connected'", default: "'standard'", description: 'Standard (separated) or connected (joined)' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Button size' },
  { name: 'multiSelect', type: 'boolean', default: 'false', description: 'Allow multiple selections' },
  { name: 'selectionRequired', type: 'boolean', default: 'false', description: 'At least one must be selected' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary'", default: "'primary'", description: 'Selected button color' },
]

const buttonGroupEvents = [
  { name: 'update:modelValue', payload: 'unknown', description: 'Emitted on selection change — powers v-model' },
]

const buttonGroupTypes: TypeDef[] = [
  {
    name: 'ButtonGroupOption',
    fields: [
      { name: 'value', type: 'unknown', required: true, description: 'Any type — deep equality via JSON.stringify' },
      { name: 'label', type: 'string', description: 'Button text' },
      { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
      { name: 'disabled', type: 'boolean', description: 'Disables the option' },
    ],
  },
]

const bgSingle = ref<string | null>('left')
const bgMulti = ref<string[]>(['bold', 'italic'])

const bgOptions = [
  { value: 'left', label: 'Left', icon: 'format_align_left' },
  { value: 'center', label: 'Center', icon: 'format_align_center' },
  { value: 'right', label: 'Right', icon: 'format_align_right' },
  { value: 'justify', label: 'Justify', icon: 'format_align_justify' },
]

const bgFormatOptions = [
  { value: 'bold', icon: 'format_bold' },
  { value: 'italic', icon: 'format_italic' },
  { value: 'underline', icon: 'format_underlined' },
  { value: 'strike', icon: 'strikethrough_s' },
]

const viewMode = ref<string | null>('grid')
const sortBy = ref<string | null>('name')
const fileFilters = ref<string[]>(['images'])

const selectedPriority = ref<Record<string, unknown> | null>({ level: 'medium', color: '#f59e0b' })
const priorityOptions = [
  { value: { level: 'low', color: '#22c55e' }, label: 'Low', icon: 'arrow_downward' },
  { value: { level: 'medium', color: '#f59e0b' }, label: 'Medium', icon: 'remove' },
  { value: { level: 'high', color: '#ef4444' }, label: 'High', icon: 'arrow_upward' },
  { value: { level: 'critical', color: '#dc2626' }, label: 'Critical', icon: 'priority_high' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MButtonGroup</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A set of buttons that share selection state — standard (separated) or connected (joined into one pill),
      single or multi select, any value type.
    </p>

    <ComponentDemo
      title="Variants"
      description="Standard (separated with gaps) and connected (joined, replaces segmented button). Shape morphs on selection."
      :code="`<MButtonGroup v-model=&quot;val&quot; :options=&quot;options&quot; variant=&quot;standard&quot; />
<MButtonGroup v-model=&quot;val&quot; :options=&quot;options&quot; variant=&quot;connected&quot; />`"
    >
      <div class="flex flex-col gap-4">
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Standard</p>
          <MButtonGroup v-model="bgSingle" :options="bgOptions" variant="standard" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Connected</p>
          <MButtonGroup v-model="bgSingle" :options="bgOptions" variant="connected" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Multi Select"
      description="Allow multiple selections. With selection-required, at least one must remain selected."
      :code="`<MButtonGroup v-model=&quot;val&quot; :options=&quot;options&quot; :multi-select=&quot;true&quot; />`"
    >
      <div class="flex flex-col gap-4">
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Multi select (standard)</p>
          <MButtonGroup v-model="bgMulti" :options="bgFormatOptions" :multi-select="true" variant="standard" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Multi select (connected, selection required)</p>
          <MButtonGroup v-model="bgMulti" :options="bgFormatOptions" :multi-select="true" :selection-required="true" variant="connected" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="All five sizes, shown in connected variant."
      :code="`<MButtonGroup v-model=&quot;val&quot; :options=&quot;options&quot; size=&quot;xs&quot; variant=&quot;connected&quot; />`"
    >
      <div class="flex flex-col gap-3">
        <div v-for="sz in (['xs', 'sm', 'md', 'lg', 'xl'] as const)" :key="sz" class="flex items-center gap-4">
          <span class="w-8 text-label-medium text-on-surface-variant">{{ sz }}</span>
          <MButtonGroup v-model="bgSingle" :options="bgOptions" :size="sz" variant="connected" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors"
      description="Primary, secondary, and tertiary."
      :code="`<MButtonGroup v-model=&quot;val&quot; :options=&quot;options&quot; color=&quot;primary&quot; />`"
    >
      <div class="flex flex-wrap gap-4">
        <MButtonGroup v-model="bgSingle" :options="bgOptions" color="primary" variant="connected" />
        <MButtonGroup v-model="bgSingle" :options="bgOptions" color="secondary" variant="connected" />
        <MButtonGroup v-model="bgSingle" :options="bgOptions" color="tertiary" variant="connected" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Object Values"
      description="Values can be any type — objects, arrays, etc. Comparison uses deep equality (JSON.stringify)."
      :code="`<script setup>
const selected = ref({ level: 'medium', color: '#f59e0b' })
const options = [
  { value: { level: 'low', color: '#22c55e' }, label: 'Low' },
  { value: { level: 'medium', color: '#f59e0b' }, label: 'Medium' },
  { value: { level: 'high', color: '#ef4444' }, label: 'High' },
]
</script>

<MButtonGroup v-model=&quot;selected&quot; :options=&quot;options&quot; variant=&quot;connected&quot; />`"
    >
      <div class="flex flex-col gap-3">
        <MButtonGroup v-model="selectedPriority" :options="priorityOptions" variant="connected" :selection-required="true" />
        <div class="flex items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-3">
          <span
            v-if="selectedPriority"
            class="h-3 w-3 rounded-full"
            :style="{ backgroundColor: (selectedPriority as any).color }"
          />
          <span class="text-body-medium text-on-surface">
            Priority: <strong>{{ (selectedPriority as any)?.level ?? 'none' }}</strong>
          </span>
          <span class="text-body-small text-on-surface-variant">
            (value is an object: {{ JSON.stringify(selectedPriority) }})
          </span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Practical Example"
      description="A file manager toolbar using button groups for view mode, sort order, and file type filters — driven entirely by v-model."
      :code="`<script setup>
const viewMode = ref('grid')
const sortBy = ref('name')
const fileFilters = ref(['images'])
</script>

<template>
  <MButtonGroup v-model=&quot;viewMode&quot; :options=&quot;viewOptions&quot; variant=&quot;connected&quot; :selection-required=&quot;true&quot; />
  <MButtonGroup v-model=&quot;sortBy&quot; :options=&quot;sortOptions&quot; variant=&quot;connected&quot; :selection-required=&quot;true&quot; />
  <MButtonGroup v-model=&quot;fileFilters&quot; :options=&quot;filterOptions&quot; :multi-select=&quot;true&quot; />
</template>`"
    >
      <div class="w-full rounded-xl bg-surface-container p-5">
        <div class="mb-5 flex flex-wrap items-center gap-4">
          <div class="flex flex-col gap-1.5">
            <span class="text-label-small text-on-surface-variant">View</span>
            <MButtonGroup
              v-model="viewMode"
              :options="[
                { value: 'list', icon: 'view_list' },
                { value: 'grid', icon: 'grid_view' },
                { value: 'columns', icon: 'view_column' },
              ]"
              variant="connected"
              :selection-required="true"
              size="xs"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-label-small text-on-surface-variant">Sort by</span>
            <MButtonGroup
              v-model="sortBy"
              :options="[
                { value: 'name', label: 'Name' },
                { value: 'date', label: 'Date' },
                { value: 'size', label: 'Size' },
                { value: 'type', label: 'Type' },
              ]"
              variant="connected"
              :selection-required="true"
              size="xs"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-label-small text-on-surface-variant">Show</span>
            <MButtonGroup
              v-model="fileFilters"
              :options="[
                { value: 'images', label: 'Images', icon: 'image' },
                { value: 'docs', label: 'Docs', icon: 'description' },
                { value: 'videos', label: 'Videos', icon: 'movie' },
              ]"
              :multi-select="true"
              size="xs"
            />
          </div>
        </div>

        <div class="rounded-lg bg-surface-container-lowest p-4">
          <div class="flex items-center gap-2 text-body-small text-on-surface-variant">
            <MIcon :name="viewMode === 'list' ? 'view_list' : viewMode === 'grid' ? 'grid_view' : 'view_column'" :size="16" />
            <span>{{ viewMode }} view</span>
            <span class="text-outline">·</span>
            <span>sorted by {{ sortBy }}</span>
            <span class="text-outline">·</span>
            <span>showing: {{ (fileFilters as string[]).join(', ') || 'all' }}</span>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="buttonGroupProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="buttonGroupEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="buttonGroupTypes" />

    <ComponentPager current="MButtonGroup" />
  </div>
</template>
