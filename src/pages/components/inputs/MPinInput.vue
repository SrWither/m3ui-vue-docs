<script setup lang="ts">
import { ref } from 'vue'
import { MPinInput } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const pinVal = ref('')
const pinOutlined = ref('')
const pinMasked = ref('')
const pinAlpha = ref('A1B2C3')
const pinComplete = ref('')
const pinCompleteLog = ref('')
function onPinComplete(v: string) { pinCompleteLog.value = `@complete: "${v}"` }
const pinGrouped = ref('')
const pinGroupedCustom = ref('')
const pinAlphaGrouped = ref('A1B2C3')

const pinInputProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'Bound code (v-model), e.g. "1234"' },
  { name: 'length', type: 'number', default: '6', description: 'Number of boxes (ignored when groups is set)' },
  { name: 'groups', type: 'number[]', description: "Segment sizes for a grouped layout, e.g. [2, 4, 2, 3, 1, 3] renders __ ____ __ ___ _ ___. Overrides length (derived as the sum)" },
  { name: 'separator', type: 'string', default: "'-'", description: 'Visual separator rendered between groups (only used when groups is set)' },
  { name: 'type', type: "'numeric' | 'alphanumeric'", default: "'numeric'", description: 'Restricts which characters are accepted' },
  { name: 'masked', type: 'boolean', default: 'false', description: 'Renders each box as a password field (dots instead of characters)' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style' },
  { name: 'error', type: 'boolean | string', description: 'Error state. A string is also the message' },
  { name: 'errorLabel', type: 'string', description: 'Error message shown when error is true' },
  { name: 'rules', type: 'ValidationRule | ValidationRule[]', description: "Validation rules: functions (value, ctx) => true | 'message' (may be async) or a Standard Schema (zod, valibot). See MForm" },
  { name: 'validateOn', type: "'blur' | 'input' | 'submit'", default: "'blur'", description: 'When the rules are checked and shown: on leaving the field (live after that), while typing, or only on submit' },
  { name: 'validateDebounce', type: 'number', description: "Wait this long (ms) after the value stops changing before re-checking: one request for an async rule, not one per key. Defaults to its MForm's" },
  { name: 'name', type: 'string', description: 'The key of this field in its MForm' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks as required — adds a red asterisk; inside an MForm or with rules, also validates it' },
  { name: 'hint', type: 'string', description: 'Hint text below the boxes' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every box' },
  { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Focuses the first box on mount' },
  { name: 'label', type: 'string', description: 'aria-label for the group of boxes' },
]

const pinInputEvents: EventDef[] = [
  { name: 'blur', payload: '—', description: "Focus left the field (its buttons and popup included): wire vee-validate's handleBlur or Vuelidate's $touch here" },
  { name: 'update:modelValue', payload: 'string', description: 'Emitted on every box change — powers v-model' },
  { name: 'complete', payload: 'string', description: 'Fires once with the full code as soon as every box is filled — the natural place to trigger auto-submit' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MPinInput</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      One box per character for OTP/PIN/verification codes. Typing advances to the next box, backspace on an empty
      box goes back, and pasting a full code fills every box at once.
    </p>

    <ComponentDemo
      title="OTP / PIN code"
      description="Typing advances to the next box, backspace on an empty box goes back, and pasting a full code fills every box at once — built for 2FA/verification flows."
      :code="`<MPinInput v-model=&quot;code&quot; :length=&quot;6&quot; label=&quot;Verification code&quot; />
<MPinInput v-model=&quot;code&quot; :length=&quot;6&quot; variant=&quot;outlined&quot; label=&quot;Verification code&quot; />`"
      :script="`import { MPinInput } from '@m3ui-vue/m3ui-vue'

const code = ref('')`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MPinInput v-model="pinVal" :length="6" label="Verification code" />
        <MPinInput v-model="pinOutlined" :length="6" variant="outlined" label="Verification code" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Masked & alphanumeric"
      description="Use masked for PIN codes you don't want shown on screen, and the alphanumeric type for recovery/backup codes that mix letters and digits."
      :code="`<MPinInput v-model=&quot;pin&quot; :length=&quot;4&quot; :masked=&quot;true&quot; label=&quot;PIN&quot; />
<MPinInput v-model=&quot;code&quot; :length=&quot;6&quot; type=&quot;alphanumeric&quot; label=&quot;Backup code&quot; />`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MPinInput v-model="pinMasked" :length="4" :masked="true" label="PIN" />
        <MPinInput v-model="pinAlpha" :length="6" type="alphanumeric" variant="outlined" label="Backup code" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Complete event"
      description="@complete fires once with the full code as soon as every box is filled — the natural place to trigger auto-submit."
      :code='`<MPinInput v-model=&quot;code&quot; :length=&quot;4&quot; @complete=&quot;verifyCode&quot; />`'
      :script="`function verifyCode(code: string) {
  // Called once, with the full 4-digit code
  api.verify(code)
}`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MPinInput v-model="pinComplete" :length="4" @complete="onPinComplete" />
        <div class="flex items-center">
          <p class="text-body-medium text-on-surface-variant">{{ pinCompleteLog || 'Fill in all 4 boxes to trigger @complete' }}</p>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Grouped with separators"
      description="Pass groups (segment sizes) for layouts like bank or pairing codes — length is derived as the sum of the groups. Customize the separator character with separator."
      :code="`<MPinInput v-model=&quot;code&quot; :groups=&quot;[3, 3]&quot; label=&quot;Verification code&quot; />
<MPinInput v-model=&quot;pin&quot; :groups=&quot;[2, 2]&quot; separator=&quot;•&quot; variant=&quot;outlined&quot; label=&quot;Pairing code&quot; />`"
      :script="`const code = ref('')
const pin = ref('')`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MPinInput v-model="pinGrouped" :groups="[3, 3]" label="Verification code" />
        <MPinInput v-model="pinGroupedCustom" :groups="[2, 2]" separator="•" variant="outlined" label="Pairing code" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Letters + groups"
      description='Combine type="alphanumeric" with groups for license/product-key style inputs that mix letters and digits.'
      :code="`<MPinInput v-model=&quot;key&quot; :groups=&quot;[3, 3]&quot; type=&quot;alphanumeric&quot; label=&quot;License key&quot; />`"
      :script="`const key = ref('A1B2C3')`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MPinInput v-model="pinAlphaGrouped" :groups="[3, 3]" type="alphanumeric" variant="outlined" label="License key" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="pinInputProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="pinInputEvents" />

    <ComponentPager current="MPinInput" />
  </div>
</template>
