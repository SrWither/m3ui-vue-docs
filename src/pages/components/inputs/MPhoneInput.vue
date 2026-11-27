<script setup lang="ts">
import { ref } from 'vue'
import { MPhoneInput, formatPhone } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const phone = ref<string | null>(null)
const country = ref<string>()
const valid = ref(false)

const ar = ref<string | null>('+5491123456789')
const outlined = ref<string | null>(null)

const stored = ['+541123456789', '+12125551234', '+5511987654321', '+34612345678', '+447911123456']

const props: PropDef[] = [
  { name: 'modelValue', type: 'string | null', default: 'null', description: 'The number in E.164 (+541123456789), or null when empty (v-model)' },
  { name: 'label', type: 'string', description: 'Field label (stays floated: the calling code is always shown)' },
  { name: 'country', type: 'string', description: 'ISO 3166-1 alpha-2 code of the country (v-model:country)' },
  { name: 'defaultCountry', type: 'string', description: "Country to start on with neither a number nor country; defaults to the region of the app's locale (es-AR → AR), else US" },
  { name: 'countries', type: 'string[]', description: 'Only these countries in the list' },
  { name: 'preferred', type: 'string[]', description: 'Countries pinned at the top of the list' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'filled'", description: 'Visual style, as MTextField' },
  { name: 'error', type: 'boolean | string', description: 'Error state. A string is also the message' },
  { name: 'errorLabel', type: 'string', description: 'Error message below the field' },
  { name: 'rules', type: 'ValidationRule | ValidationRule[]', description: "Validation rules: functions (value, ctx) => true | 'message' (may be async) or a Standard Schema (zod, valibot). See MForm" },
  { name: 'validateOn', type: "'blur' | 'input' | 'submit'", default: "'blur'", description: 'When the rules are checked and shown: on leaving the field (live after that), while typing, or only on submit' },
  { name: 'name', type: 'string', description: 'The key of this field in its MForm' },
  { name: 'hint', type: 'string', description: 'Hint text below the field' },
  { name: 'disabled', type: 'boolean', description: 'Disables the field' },
  { name: 'required', type: 'boolean', description: 'Marks as required — adds a red asterisk; inside an MForm or with rules, also validates it' },
  { name: 'validate', type: 'boolean', default: 'true', description: "After leaving the field, an error when the number doesn't fit its country's length" },
  { name: 'placeholder', type: 'string', description: "Defaults to an example in the country's format" },
  { name: 'flags', type: 'boolean', default: 'true', description: 'Show flag emoji (Windows has none: use #flag for images there)' },
  { name: 'fieldBg', type: 'string', description: 'Overrides the auto-detected background behind the outlined label' },
  { name: 'locale', type: 'string', description: "BCP-47 language for country names; defaults to the app's locale" },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MPhoneInput</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A phone number field with a country selector: flag, calling code and a searchable list of every country, named in
      your app's language. The number is formatted as it's typed with the country's format and bound as E.164
      (<code>+541123456789</code>), ready for an API or an SMS provider. Pasting a full international number
      (<code>+34…</code>, <code>0034…</code>) switches the country. Not libphonenumber: masks for the countries used
      most and E.164 length rules for the rest, in a few KB.
    </p>

    <ComponentDemo
      title="Phone Number"
      description="Starts on the region of your locale. Type a number, or paste one with its + code; v-model:country and v-model:valid follow along."
      :code="`<template>
  <MPhoneInput v-model=&quot;phone&quot; v-model:country=&quot;country&quot; v-model:valid=&quot;valid&quot; label=&quot;Phone&quot; />
</template>`"
    >
      <div class="flex w-full max-w-sm flex-col gap-3">
        <MPhoneInput v-model="phone" v-model:country="country" v-model:valid="valid" label="Phone" :preferred="['AR', 'MX', 'ES', 'US']" />
        <code class="text-body-small text-on-surface-variant">{{ phone ?? 'null' }} · {{ country }} · {{ valid ? 'valid' : 'incomplete' }}</code>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Mobiles, Outlined, Restricted"
      description="Argentina's mobiles keep their 9. The second field only lists a few countries and is outlined; leave it incomplete to see the validation."
      :code="`<template>
  <MPhoneInput v-model=&quot;mobile&quot; label=&quot;Mobile&quot; />
  <MPhoneInput
    v-model=&quot;contact&quot;
    label=&quot;Contact&quot;
    variant=&quot;outlined&quot;
    :countries=&quot;['AR', 'UY', 'CL', 'PY', 'BO']&quot;
    hint=&quot;Southern Cone only&quot;
    required
  />
</template>`"
    >
      <div class="flex w-full max-w-sm flex-col gap-4">
        <MPhoneInput v-model="ar" label="Mobile" />
        <MPhoneInput v-model="outlined" label="Contact" variant="outlined" :countries="['AR', 'UY', 'CL', 'PY', 'BO']" default-country="UY" hint="Southern Cone only" required />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Showing Stored Numbers"
      description="formatPhone() formats an E.164 number for display anywhere; isValidPhone() and parsePhone() are exported too."
      :code="`<script setup>
import { formatPhone } from '@m3ui-vue/m3ui-vue'
</script>

<template>
  <li v-for=&quot;n in numbers&quot;>{{ formatPhone(n) }}</li>
</template>`"
    >
      <ul class="flex flex-col gap-1 font-mono text-body-medium">
        <li v-for="n in stored" :key="n"><span class="text-on-surface-variant">{{ n }}</span> → {{ formatPhone(n) }}</li>
      </ul>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events, Slots and Helpers</h3>
    <ul class="mb-6 list-disc space-y-1 pl-6 text-body-medium text-on-surface-variant">
      <li><code>update:modelValue</code>, <code>update:country</code>, <code>update:valid</code>: v-model, v-model:country, v-model:valid</li>
      <li><code>#flag</code>: replaces the flag emoji on the button and in the list; gets <code>{ iso2 }</code></li>
      <li><code>formatPhone(e164)</code>, <code>isValidPhone(e164)</code>, <code>parsePhone(value)</code>, <code>phoneCountries()</code>, <code>flagEmoji(iso2)</code></li>
    </ul>

    <ComponentPager current="MPhoneInput" />
  </div>
</template>
