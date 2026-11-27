<script setup lang="ts">
import { ref } from 'vue'
import { MForm, MTextField, MNumberField, MButton, required, email, url, minLength, maxLength, min, max, pattern, sameAs, type ValidationRule } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import ComponentDemo from '@/components/ComponentDemo.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

// Built-ins demo
const f = ref({ email: '', site: '', code: '', age: null as number | null, password: '', confirm: '' })

// Custom rules demo
const slug = ref('')
const noSpaces: ValidationRule<string> = (v) => !/\s/.test(v) || 'No spaces, use dashes'
const lowercase: ValidationRule<string> = (v) => v === v.toLowerCase() || 'Lowercase only'
const taken = ['home', 'about', 'blog']
const free: ValidationRule<string> = (v) =>
  new Promise((resolve) => setTimeout(() => resolve(!taken.includes(v) || `/${v} already exists`), 400))

const builtins: TypeDef[] = [
  {
    name: 'Built-in rules',
    description: 'Each returns a rule. All but required pass on an empty value, so [email()] keeps a field optional and [required(), email()] does not. The last argument is always an optional custom message; without it the message comes from the locale (validation* keys), so it follows the app language.',
    fields: [
      { name: 'required(message?)', type: 'ValidationRule', description: 'Filled in: not null/undefined, not a blank string, not [], not false (an unticked checkbox). Fields can define their own "empty" (a date range needs both ends). In rules next to the required prop (kept for the asterisk), it replaces the prop\'s check, so its message is the one shown' },
      { name: 'email(message?)', type: 'ValidationRule', description: "An email address, with the browser's own <input type=email> rule plus a dot in the domain" },
      { name: 'url(message?)', type: 'ValidationRule', description: 'An absolute http(s) URL' },
      { name: 'minLength(n, message?)', type: 'ValidationRule', description: 'At least n characters, or n items for arrays (tags, files, multi-selects), with item wording' },
      { name: 'maxLength(n, message?)', type: 'ValidationRule', description: 'At most n characters or items' },
      { name: 'min(n, message?)', type: 'ValidationRule', description: 'A number (or numeric string) of at least n' },
      { name: 'max(n, message?)', type: 'ValidationRule', description: 'A number (or numeric string) of at most n' },
      { name: 'pattern(regex, message?)', type: 'ValidationRule', description: 'Matches a regular expression (a /g regex is safe: its lastIndex is reset)' },
      { name: "sameAs(name | getter, message?)", type: 'ValidationRule', description: "Equals another field of the same MForm by its name (a password confirmation), or a getter's value. Re-checked when that other field changes" },
      { name: 'isEmpty(value)', type: 'boolean', description: 'The "not filled in" test required uses, for your own rules' },
    ],
  },
]
const types: TypeDef[] = [
  {
    name: 'ValidationRule<T>',
    description: 'What rules accepts, on any form field and as an array or a single rule',
    fields: [
      { name: '(value: T, ctx: ValidationContext) => ValidationResult', type: 'function', description: 'May be async (return a Promise); only the latest check counts' },
      { name: 'StandardSchemaV1', type: 'object', description: 'Any Standard Schema: zod, valibot, arktype, yup 1.7+. Its first issue is the message' },
    ],
  },
  {
    name: 'ValidationResult',
    fields: [
      { name: 'true | undefined | null', type: '', description: 'Valid' },
      { name: 'string', type: '', description: 'Invalid, with that message' },
      { name: 'false', type: '', description: "Invalid, with the locale's generic validationInvalid message" },
    ],
  },
  {
    name: 'ValidationContext',
    fields: [
      { name: 'locale', type: 'M3Locale', description: 'The active locale, for messages in the app language' },
      { name: 'values', type: 'Record<string, unknown>', description: 'Every named field of the surrounding MForm (empty outside one). Reading a value here re-checks the rule when that field changes' },
    ],
  },
  {
    name: 'ValidateOn',
    fields: [
      { name: "'blur'", type: 'default', description: 'Shown once the field is left, then live while it changes' },
      { name: "'input'", type: '', description: 'Shown while typing, from the first change' },
      { name: "'submit'", type: '', description: "Shown only when MForm's submit (or validate()) checks it, then live" },
    ],
  },
]

const customSnippet = `<script setup lang="ts">
import { required, type ValidationRule } from '@m3ui-vue/m3ui-vue'

// A function: true (or nothing) passes, a string is the error
const noSpaces: ValidationRule<string> = (v) => !/\\s/.test(v) || 'No spaces, use dashes'

// The locale's messages, and other fields of the MForm
const notTheName: ValidationRule<string> = (v, { values }) =>
  v !== values.name || 'Pick something other than your name'

// Async: only the latest check counts
const free: ValidationRule<string> = async (v) =>
  !(await api.slugTaken(v)) || \`/\${v} already exists\`
<\/script>

<template>
  <MTextField v-model="slug" label="Slug" :rules="[required(), noSpaces, free]" />
</template>`

const schemaSnippet = `<script setup lang="ts">
import { z } from 'zod'               // or valibot, arktype, yup 1.7+

const schema = z.string().min(3).regex(/^[a-z-]+$/, 'Lowercase and dashes')
<\/script>

<template>
  <!-- A schema is a rule too, alone or mixed with functions -->
  <MTextField v-model="slug" label="Slug" :rules="[required(), schema]" />
</template>`
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Validators</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      The rules every form field takes in its <code>rules</code> prop, inside an <RouterLink to="/components/inputs/mform" class="text-primary underline">MForm</RouterLink> or on its own.
      Built-in ones cover the usual checks and speak the app's language; your own are plain functions, async if needed,
      and a zod or valibot schema works as a rule too.
    </p>

    <ComponentDemo
      title="Built-in rules"
      description="Leave a field to see its error; after that it updates as you type."
      :code="`<template>
  <MForm>
    <MTextField v-model=&quot;f.email&quot; name=&quot;email&quot; label=&quot;Email&quot; :rules=&quot;[required(), email()]&quot; />
    <MTextField v-model=&quot;f.site&quot; name=&quot;site&quot; label=&quot;Website (optional)&quot; :rules=&quot;[url()]&quot; />
    <MTextField v-model=&quot;f.code&quot; name=&quot;code&quot; label=&quot;Postal code&quot; :rules=&quot;[pattern(/^\\d{4,5}$/, 'Four or five digits')]&quot; />
    <MNumberField v-model=&quot;f.age&quot; name=&quot;age&quot; label=&quot;Age&quot; :rules=&quot;[required(), min(18), max(120)]&quot; />
    <MTextField v-model=&quot;f.password&quot; name=&quot;password&quot; label=&quot;Password&quot; type=&quot;password&quot; :rules=&quot;[required(), minLength(8), maxLength(64)]&quot; />
    <MTextField v-model=&quot;f.confirm&quot; name=&quot;confirm&quot; label=&quot;Confirm&quot; type=&quot;password&quot; :rules=&quot;[required(), sameAs('password')]&quot; />
  </MForm>
</template>`"
      :script="`import { required, email, url, minLength, maxLength, min, max, pattern, sameAs } from '@m3ui-vue/m3ui-vue'`"
    >
      <MForm class="flex w-full max-w-md flex-col gap-4">
        <MTextField v-model="f.email" name="email" label="Email" :rules="[required(), email()]" />
        <MTextField v-model="f.site" name="site" label="Website (optional)" :rules="[url()]" />
        <MTextField v-model="f.code" name="code" label="Postal code" :rules="[pattern(/^\d{4,5}$/, 'Four or five digits')]" />
        <MNumberField v-model="f.age" name="age" label="Age" :rules="[required(), min(18), max(120)]" />
        <MTextField v-model="f.password" name="password" label="Password" type="password" :rules="[required(), minLength(8), maxLength(64)]" />
        <MTextField v-model="f.confirm" name="confirm" label="Confirm" type="password" :rules="[required(), sameAs('password')]" />
        <div class="flex justify-end gap-2">
          <MButton type="reset" variant="text">Reset</MButton>
          <MButton type="submit">Check</MButton>
        </div>
      </MForm>
    </ComponentDemo>

    <ComponentDemo
      title="Your own rules"
      description="Functions in order: the first failure shows. The last one is async; try home or blog."
      :code="`<MTextField v-model=&quot;slug&quot; label=&quot;Slug&quot; validate-on=&quot;input&quot; :rules=&quot;[required(), noSpaces, lowercase, free]&quot; />`"
      :script="`const noSpaces = (v) => !/\\s/.test(v) || 'No spaces, use dashes'
const lowercase = (v) => v === v.toLowerCase() || 'Lowercase only'
const free = async (v) => !(await slugTaken(v)) || \`/\${v} already exists\``"
    >
      <div class="w-full max-w-md">
        <MTextField v-model="slug" label="Slug" validate-on="input" :rules="[required(), noSpaces, lowercase, free]" hint="Used in the page URL" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Reference</h3>
    <TypesTable :types="builtins" />

    <h2 class="mb-3 mt-10 text-headline-small font-medium">Writing rules</h2>
    <p class="mb-4 text-body-large text-on-surface-variant">
      A rule gets the value and a context with the locale and the form's other values. Return <code>true</code> to pass
      or a string to fail with that message. Reading <code>values.x</code> makes the rule re-check when field
      <code>x</code> changes, which is how <code>sameAs</code> works.
    </p>
    <div class="mb-6 overflow-hidden rounded-md border border-outline-variant">
      <MCodeEditor :model-value="customSnippet" language="vue" readonly line-numbers min-height="60px" max-height="480px" />
    </div>
    <h3 class="mb-2 text-title-medium font-medium">Schemas as rules</h3>
    <div class="mb-6 overflow-hidden rounded-md border border-outline-variant">
      <MCodeEditor :model-value="schemaSnippet" language="vue" readonly line-numbers min-height="60px" max-height="480px" />
    </div>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="types" />

    <ComponentPager current="Validators" />
  </div>
</template>
