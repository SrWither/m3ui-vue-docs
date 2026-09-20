<script setup lang="ts">
import { ref } from 'vue'
import { MTextField } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const textFilled = ref('')
const textOutlined = ref('')
const textPassword = ref('')
const textMultiline = ref('')
const textError = ref('bad value')
const textClearable = ref('Hello world')
const textDebounce = ref('')
const debounceLog = ref('')
function onDebounced(v: string) {
  debounceLog.value = `@debounced at ${new Date().toLocaleTimeString()}: "${v}"`
}
const textRequired = ref('')
const textTrailing = ref('Hello')

const textFieldProps: PropDef[] = [
  { name: 'modelValue', type: 'string | number', description: 'Bound value (v-model)' },
  { name: 'label', type: 'string', description: 'Field label' },
  { name: 'type', type: 'string', default: "'text'", description: 'HTML input type' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'error', type: 'boolean', description: 'Puts the field in error state (red border and label)' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown below the field (only visible when error is true)' },
  { name: 'hint', type: 'string', description: 'Hint text shown below the field' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required — adds a red asterisk after the label' },
  { name: 'multiline', type: 'boolean', default: 'false', description: 'Renders a textarea instead of an input' },
  { name: 'rows', type: 'number', default: '3', description: 'Textarea rows (when multiline)' },
  { name: 'autocomplete', type: 'string', description: 'Passed through to the native autocomplete attribute' },
  { name: 'leadingIcon', type: 'string', description: 'Material Symbol shown before the input' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear button when the field has a value' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background color used to cut the floating label out of the outlined border' },
  { name: 'debounce', type: 'number', default: '0', description: 'Delay (ms) before firing the @debounced event. v-model always updates immediately' },
]

const textFieldEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string', description: 'Emitted on every keystroke — powers v-model' },
  { name: 'debounced', payload: 'string', description: 'Emitted debounce ms after the user stops typing (only when debounce > 0)' },
]

const textFieldSlots: SlotDef[] = [
  { name: 'trailing', description: 'Custom trailing content (e.g. an icon button) — replaces the built-in clear button when present' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTextField</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The standard single- or multi-line text input, filled or outlined, with floating label.
    </p>

    <ComponentDemo
      title="Variants"
      description="Filled and outlined styles."
      :code="`<template>
  <MTextField v-model=&quot;value&quot; label=&quot;Filled&quot; />
  <MTextField v-model=&quot;value&quot; label=&quot;Outlined&quot; variant=&quot;outlined&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTextField v-model="textFilled" label="Filled" />
        <MTextField v-model="textOutlined" label="Outlined" variant="outlined" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Icons & Types"
      description="Leading icons and different input types."
      :code="`<template>
  <MTextField v-model=&quot;val&quot; label=&quot;Email&quot; type=&quot;email&quot; leading-icon=&quot;mail&quot; />
  <MTextField v-model=&quot;val&quot; label=&quot;Password&quot; type=&quot;password&quot; leading-icon=&quot;lock&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTextField v-model="textFilled" label="Email" type="email" leading-icon="mail" hint="We'll never share your email" />
        <MTextField v-model="textPassword" label="Password" type="password" leading-icon="lock" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="States"
      description="Error, disabled, required, and multiline."
      :code="`<template>
  <MTextField v-model=&quot;val&quot; label=&quot;Username&quot; :error=&quot;true&quot; error-label=&quot;Already taken&quot; />
  <MTextField v-model=&quot;val&quot; label=&quot;Disabled&quot; :disabled=&quot;true&quot; />
  <MTextField v-model=&quot;val&quot; label=&quot;Full name&quot; :required=&quot;true&quot; />
  <MTextField v-model=&quot;val&quot; label=&quot;Bio&quot; :multiline=&quot;true&quot; :rows=&quot;3&quot; />
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTextField v-model="textError" label="Username" :error="true" error-label="Already taken" />
        <MTextField model-value="Can't edit this" label="Disabled" :disabled="true" />
        <MTextField v-model="textRequired" label="Full name" :required="true" />
      </div>
      <div class="mt-4 grid w-full gap-4 sm:grid-cols-2">
        <MTextField v-model="textMultiline" label="Bio" :multiline="true" :rows="3" leading-icon="edit_note" />
        <MTextField v-model="textMultiline" label="Bio" :multiline="true" :rows="3" leading-icon="edit_note" variant="outlined" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Clearable"
      description="Add a clear button that appears when the field has a value."
      :code="`<MTextField v-model=&quot;text&quot; label=&quot;Search&quot; leading-icon=&quot;search&quot; :clearable=&quot;true&quot; />`"
      :script="`import { MTextField } from '@m3ui-vue/m3ui-vue'

const text = ref('Hello world')`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTextField v-model="textClearable" label="Search" leading-icon="search" :clearable="true" />
        <MTextField v-model="textClearable" label="Outlined" leading-icon="search" :clearable="true" variant="outlined" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Trailing Slot"
      description="The trailing slot replaces the built-in clear button with any custom content — e.g. a character counter or an action icon."
      :code="`<MTextField v-model=&quot;text&quot; label=&quot;Tweet&quot; :multiline=&quot;true&quot;>
  <template #trailing>
    <span class=&quot;text-label-small text-on-surface-variant&quot;>{{ text.length }}/280</span>
  </template>
</MTextField>`"
    >
      <div class="w-full sm:w-80">
        <MTextField v-model="textTrailing" label="Tweet" variant="outlined">
          <template #trailing>
            <span class="pr-1 text-label-small text-on-surface-variant">{{ textTrailing.length }}/280</span>
          </template>
        </MTextField>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Debounce"
      description="v-model updates immediately, but the @debounced event only fires after the user stops typing. Useful for search inputs that trigger API calls."
      :code='`<MTextField
  v-model=&quot;search&quot;
  label=&quot;Search API&quot;
  leading-icon=&quot;search&quot;
  :debounce=&quot;500&quot;
  @debounced=&quot;fetchResults&quot;
/>`'
      :script='`import { MTextField } from &apos;@m3ui-vue/m3ui-vue&apos;

const search = ref(&apos;&apos;)

function fetchResults(value: string) {
  // Only fires after 500ms of inactivity
  api.search(value)
}`'
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MTextField
          v-model="textDebounce"
          label="Search (500ms debounce)"
          leading-icon="search"
          :debounce="500"
          @debounced="onDebounced"
        />
        <div class="flex items-center">
          <p class="text-body-medium text-on-surface-variant">
            {{ debounceLog || 'Type something — @debounced fires after 500ms of inactivity' }}
          </p>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="textFieldProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="textFieldEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="textFieldSlots" />

    <ComponentPager current="MTextField" />
  </div>
</template>
