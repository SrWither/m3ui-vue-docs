<script setup lang="ts">
import { ref } from 'vue'
import { MTagInput } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const tags = ref<string[]>(['Vue', 'TypeScript'])
const tagsDebounce = ref<string[]>(['Vue'])
const tagsDebounceLog = ref('')
function onTagsDebounced(v: string[]) { tagsDebounceLog.value = `@debounced: [${v.join(', ')}]` }
const tagsMax = ref<string[]>(['Vue'])
const tagsRequired = ref<string[]>([])

const tagInputProps: PropDef[] = [
  { name: 'modelValue', type: 'string[]', description: 'Array of tags (v-model)' },
  { name: 'label', type: 'string', description: 'Floating label text' },
  { name: 'placeholder', type: 'string', description: 'Input placeholder' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Field style' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
  { name: 'error', type: 'boolean', description: 'Error state' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'hint', type: 'string', description: 'Helper text below field' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required — adds a red asterisk after the label' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the outlined border' },
  { name: 'maxTags', type: 'number', description: 'Max number of tags allowed' },
  { name: 'duplicates', type: 'boolean', default: 'false', description: 'Allow duplicate tags' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear-all button' },
  { name: 'debounce', type: 'number', default: '0', description: 'Delay (ms) before firing the @debounced event' },
]

const tagInputEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string[]', description: 'Emitted whenever a tag is added or removed — powers v-model' },
  { name: 'debounced', payload: 'string[]', description: 'Emitted debounce ms after the tag list stops changing (only when debounce > 0)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTagInput</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Type and press Enter or comma to add a free-form tag. Backspace on an empty input removes the last tag.
    </p>

    <ComponentDemo
      title="Tag Input"
      description="Type and press Enter or comma to add tags. Backspace removes the last tag."
      :code="`<MTagInput
  v-model=&quot;tags&quot;
  label=&quot;Skills&quot;
  leading-icon=&quot;sell&quot;
  placeholder=&quot;Add a skill...&quot;
/>`"
      :script="`const tags = ref(['Vue', 'TypeScript'])`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTagInput v-model="tags" label="Skills" leading-icon="sell" placeholder="Add a skill..." />
        <MTagInput v-model="tags" label="Skills (outlined)" leading-icon="sell" variant="outlined" :clearable="true" placeholder="Add a skill..." />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Max tags & Required"
      description="maxTags caps how many tags can be added; required adds an asterisk to the label."
      :code="`<MTagInput v-model=&quot;tags&quot; label=&quot;Up to 3&quot; :max-tags=&quot;3&quot; />
<MTagInput v-model=&quot;tags&quot; label=&quot;Required&quot; :required=&quot;true&quot; />`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTagInput v-model="tagsMax" label="Up to 3 tags" :max-tags="3" leading-icon="sell" hint="Tag input stops accepting new tags at 3" />
        <MTagInput v-model="tagsRequired" label="Required" :required="true" variant="outlined" leading-icon="sell" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Debounce"
      description="Debounce tag changes. Tags appear instantly but @debounced fires after the user stops adding/removing."
      :code='`<MTagInput
  v-model=&quot;tags&quot;
  label=&quot;Skills&quot;
  :debounce=&quot;500&quot;
  @debounced=&quot;saveTags&quot;
/>`'
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTagInput v-model="tagsDebounce" label="Skills (500ms)" leading-icon="sell" placeholder="Add a skill..." :debounce="500" @debounced="onTagsDebounced" />
        <div class="flex items-center">
          <p class="text-body-medium text-on-surface-variant">{{ tagsDebounceLog || 'Add/remove tags — @debounced fires after 500ms' }}</p>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="tagInputProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="tagInputEvents" />

    <ComponentPager current="MTagInput" />
  </div>
</template>
