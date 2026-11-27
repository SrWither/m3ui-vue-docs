<script setup lang="ts">
import { ref } from 'vue'
import { MForm, MTextField, MButton, MSelect, MDatePicker, MTimePicker, MPhoneInput, MNumberField, MTagInput, MCountrySelect, MCheckbox, MRadioGroup, MSwitch, MRating, MFileUpload, MSignaturePad, required, email, minLength, sameAs, min, maxLength, type ValidationRule } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

// Sign-up demo
const signup = ref({ name: '', email: '', password: '', confirm: '' })
const signupLog = ref('')
function onSignup(values: Record<string, unknown>) {
  signupLog.value = `@submit ${JSON.stringify({ ...values, password: '•••', confirm: '•••' })}`
}
function onSignupInvalid(errors: Record<string, string>) {
  signupLog.value = `@invalid ${JSON.stringify(errors)}`
}

// Every field demo
const booking = ref({ room: undefined as unknown, date: null as string | null, time: null as string | null, guests: null as number | null, phone: null as string | null, country: null as string | null, tags: [] as string[] })
const rooms = [{ value: 'single', label: 'Single' }, { value: 'double', label: 'Double' }, { value: 'suite', label: 'Suite' }]
const bookingLog = ref('')

// Choices demo
const signup2 = ref({ plan: null as string | null, rating: 0, terms: false, news: false, files: [] as any[] })
const plans = [{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'team', label: 'Team' }]
const choicesLog = ref('')

// Server errors demo
const login = ref({ email: 'taken@m3ui.dev', password: '' })
const serverErrors = ref<Record<string, string>>({})
const sending = ref(false)
function onLogin() {
  sending.value = true
  serverErrors.value = {}
  setTimeout(() => {
    sending.value = false
    serverErrors.value = login.value.email === 'taken@m3ui.dev'
      ? { email: 'This email is already registered' }
      : {}
  }, 700)
}

// Async rule demo
const username = ref('')
const takenNames = ['admin', 'root', 'material']
const available: ValidationRule<string> = (v) =>
  new Promise((resolve) => setTimeout(() => resolve(!takenNames.includes(v.toLowerCase()) || `"${v}" is taken`), 400))

const formProps: PropDef[] = [
  { name: 'errors', type: 'Record<string, string | string[]>', description: "Errors from outside, by field name (a server's response, vee-validate's errors). Shown over the fields' own rules; they don't block submit" },
  { name: 'schema', type: 'StandardSchemaV1', description: 'A schema for the whole form (zod, valibot, arktype…), run against the values by name. submit then gets its output' },
  { name: 'validateOn', type: "'blur' | 'input' | 'submit'", default: "'blur'", description: 'When the fields check and show their rules, unless a field sets its own. blur: on leaving the field, live after that' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every control inside and skips their validation' },
]
const fieldProps: PropDef[] = [
  { name: 'rules', type: 'ValidationRule | ValidationRule[]', description: "Functions (value, ctx) => true | 'message' (may be async), or a Standard Schema. Checked in order; the first failure is shown" },
  { name: 'name', type: 'string', description: 'The key of the field in the form values, errors and schema (also the native name)' },
  { name: 'validateOn', type: "'blur' | 'input' | 'submit'", description: "Overrides the form's validateOn for this field" },
  { name: 'required', type: 'boolean', description: 'Inside an MForm or next to rules, also validates that the field is filled in' },
  { name: 'error', type: 'boolean | string', description: "A string is also the message, so a validation library's error plugs straight in" },
]
const formEvents: EventDef[] = [
  { name: 'submit', payload: 'values, event', description: 'Every field is valid: the values by name (address.city nests as { address: { city } }), or the schema output' },
  { name: 'invalid', payload: 'Record<string, string>', description: 'A submit failed validation: the messages by name. The first field in error gets the focus' },
  { name: 'reset', payload: '—', description: 'reset() (or a type="reset" button) put every field back to its first value' },
]
const formSlots: SlotDef[] = [
  { name: 'default', description: 'The fields and buttons. A <MButton type="submit"> submits the form, as does Enter in a text field' },
]
const formExposed: PropDef[] = [
  { name: 'validate()', type: '() => Promise<boolean>', description: 'Checks every field and shows the errors' },
  { name: 'reset() / resetValidation()', type: 'function', description: 'Back to the first values and no errors / only hide the errors' },
  { name: 'valid', type: 'boolean', description: 'Whether every rule passes right now, shown or not (e.g. to disable a button)' },
  { name: 'pending', type: 'boolean', description: 'Async rules still running' },
  { name: 'errors / values', type: 'object', description: 'The messages on display and the values, by name' },
]
const rules: PropDef[] = [
  { name: 'required(message?)', type: 'rule', description: "Filled in: not empty, not blank, not [] and not false (an unticked checkbox)" },
  { name: 'email() / url()', type: 'rule', description: 'An email address / an http(s) URL' },
  { name: 'minLength(n) / maxLength(n)', type: 'rule', description: 'Characters of a string, or items of an array' },
  { name: 'min(n) / max(n)', type: 'rule', description: 'A number (or numeric string)' },
  { name: 'pattern(regex)', type: 'rule', description: 'Matches a regular expression' },
  { name: 'sameAs(name | getter)', type: 'rule', description: 'Equals another field of the form (a password confirmation)' },
]

// Snippets for the "Validation libraries" section
const zodSnippet = `<script setup lang="ts">
import { z } from 'zod'
import { MForm, MTextField, MButton } from '@m3ui-vue/m3ui-vue'

const form = ref({ email: '', age: '' })
const schema = z.object({
  email: z.string().email(),
  age: z.coerce.number().min(18),
})
// Gets the schema's output: { email: string, age: number }
function save(values: z.infer<typeof schema>) { /* ... */ }
<\/script>

<template>
  <MForm :schema="schema" @submit="save">
    <MTextField v-model="form.email" name="email" label="Email" />
    <MTextField v-model="form.age" name="age" label="Age" />
    <MButton type="submit">Save</MButton>
  </MForm>

  <!-- Or a schema per field -->
  <MTextField v-model="email" label="Email" :rules="z.string().email()" />
</template>`

const veeSnippet = `<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const { defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(z.object({ email: z.string().email() })),
})
// error: the field's first message; blur: vee-validate's touch
const [email, emailProps] = defineField('email', {
  props: (state) => ({ error: state.errors[0] }),
})
const save = handleSubmit((values) => { /* ... */ })
<\/script>

<template>
  <form @submit="save">
    <MTextField v-model="email" v-bind="emailProps" label="Email" />
    <MButton type="submit">Save</MButton>
  </form>
</template>`

const vuelidateSnippet = `<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const form = ref({ email: '' })
const v$ = useVuelidate({ email: { required, email } }, form)

async function save() {
  if (!(await v$.value.$validate())) return
  /* ... */
}
<\/script>

<template>
  <MTextField
    v-model="form.email"
    label="Email"
    :error="v$.email.$errors[0]?.$message"
    @blur="v$.email.$touch"
  />
  <MButton @click="save">Save</MButton>
</template>`
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MForm</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A form that validates the fields inside it. Each field checks its own <code>rules</code>; the form validates them all
      on submit, shows every error and focuses the first one, and only emits <code>submit</code> when everything passes.
      Built-in rules take their messages from the locale. Errors from a server or a validation library plug in too.
    </p>

    <ComponentDemo
      title="Rules"
      description="Errors show when you leave a field and update live after that. Submit shows them all and focuses the first one."
      :code="`<template>
  <MForm @submit=&quot;onSubmit&quot; @invalid=&quot;onInvalid&quot;>
    <MTextField v-model=&quot;form.name&quot; name=&quot;name&quot; label=&quot;Name&quot; required />
    <MTextField v-model=&quot;form.email&quot; name=&quot;email&quot; label=&quot;Email&quot; type=&quot;email&quot; :rules=&quot;[required(), email()]&quot; />
    <MTextField v-model=&quot;form.password&quot; name=&quot;password&quot; label=&quot;Password&quot; type=&quot;password&quot; :rules=&quot;[required(), minLength(8)]&quot; />
    <MTextField v-model=&quot;form.confirm&quot; name=&quot;confirm&quot; label=&quot;Confirm password&quot; type=&quot;password&quot; :rules=&quot;[required(), sameAs('password')]&quot; />
    <MButton type=&quot;reset&quot; variant=&quot;text&quot;>Reset</MButton>
    <MButton type=&quot;submit&quot;>Create account</MButton>
  </MForm>
</template>`"
      :script="`import { MForm, MTextField, MButton, required, email, minLength, sameAs } from '@m3ui-vue/m3ui-vue'

const form = ref({ name: '', email: '', password: '', confirm: '' })
function onSubmit(values) { /* every field is valid */ }
function onInvalid(errors) { /* { email: 'Enter a valid email address', ... } */ }`"
    >
      <MForm class="flex w-full max-w-md flex-col gap-4" @submit="onSignup" @invalid="onSignupInvalid">
        <MTextField v-model="signup.name" name="name" label="Name" required />
        <MTextField v-model="signup.email" name="email" label="Email" type="email" :rules="[required(), email()]" />
        <MTextField v-model="signup.password" name="password" label="Password" type="password" :rules="[required(), minLength(8)]" />
        <MTextField v-model="signup.confirm" name="confirm" label="Confirm password" type="password" :rules="[required(), sameAs('password')]" />
        <div class="flex justify-end gap-2">
          <MButton type="reset" variant="text">Reset</MButton>
          <MButton type="submit">Create account</MButton>
        </div>
        <p v-if="signupLog" class="font-mono text-body-small text-on-surface-variant break-all">{{ signupLog }}</p>
      </MForm>
    </ComponentDemo>

    <ComponentDemo
      title="Any form field"
      description="Selects, pickers, phone, number and tags validate the same way. Opening a picker's popup isn't leaving the field; the phone's own length check blocks submit too."
      :code="`<template>
  <MForm @submit=&quot;book&quot;>
    <MSelect v-model=&quot;form.room&quot; name=&quot;room&quot; label=&quot;Room&quot; :options=&quot;rooms&quot; required />
    <MDatePicker v-model=&quot;form.date&quot; name=&quot;date&quot; label=&quot;Check-in&quot; required />
    <MTimePicker v-model=&quot;form.time&quot; name=&quot;time&quot; label=&quot;Arrival&quot; />
    <MNumberField v-model=&quot;form.guests&quot; name=&quot;guests&quot; label=&quot;Guests&quot; :rules=&quot;[required(), min(1)]&quot; />
    <MPhoneInput v-model=&quot;form.phone&quot; name=&quot;phone&quot; label=&quot;Phone&quot; required />
    <MCountrySelect v-model=&quot;form.country&quot; name=&quot;country&quot; required />
    <MTagInput v-model=&quot;form.tags&quot; name=&quot;tags&quot; label=&quot;Requests&quot; :rules=&quot;[maxLength(3)]&quot; />
    <MButton type=&quot;submit&quot;>Book</MButton>
  </MForm>
</template>`"
    >
      <MForm class="flex w-full max-w-md flex-col gap-4" @submit="(v: unknown) => (bookingLog = `@submit ${JSON.stringify(v)}`)" @invalid="(e: unknown) => (bookingLog = `@invalid ${JSON.stringify(e)}`)">
        <MSelect v-model="booking.room" name="room" label="Room" :options="rooms" required />
        <MDatePicker v-model="booking.date" name="date" label="Check-in" required />
        <MTimePicker v-model="booking.time" name="time" label="Arrival" />
        <MNumberField v-model="booking.guests" name="guests" label="Guests" :rules="[required(), min(1)]" />
        <MPhoneInput v-model="booking.phone" name="phone" label="Phone" required />
        <MCountrySelect v-model="booking.country" name="country" required />
        <MTagInput v-model="booking.tags" name="tags" label="Requests" :rules="[maxLength(3)]" hint="Up to 3" />
        <div class="flex justify-end gap-2">
          <MButton type="reset" variant="text">Reset</MButton>
          <MButton type="submit">Book</MButton>
        </div>
        <p v-if="bookingLog" class="font-mono text-body-small text-on-surface-variant break-all">{{ bookingLog }}</p>
      </MForm>
    </ComponentDemo>

    <ComponentDemo
      title="Choices, files and signatures"
      description="Checkbox, radio group, switch, rating, file upload and signature pad validate too. Only the checkbox has an M3 error color; on the rest the message says so."
      :code="`<template>
  <MForm @submit=&quot;send&quot;>
    <MRadioGroup v-model=&quot;form.plan&quot; name=&quot;plan&quot; label=&quot;Plan&quot; :options=&quot;plans&quot; direction=&quot;row&quot; required />
    <MRating v-model=&quot;form.rating&quot; name=&quot;rating&quot; required />
    <MFileUpload v-model=&quot;form.files&quot; name=&quot;files&quot; accept=&quot;image/*&quot; multiple :rules=&quot;[required(), maxLength(2)]&quot; />
    <MSignaturePad name=&quot;signature&quot; :width=&quot;320&quot; :height=&quot;120&quot; class=&quot;self-start&quot; required />
    <MSwitch v-model=&quot;form.news&quot; name=&quot;news&quot; label=&quot;Send me news&quot; />
    <MCheckbox v-model=&quot;form.terms&quot; name=&quot;terms&quot; label=&quot;I accept the terms&quot; required />
    <MButton type=&quot;submit&quot;>Send</MButton>
  </MForm>
</template>`"
    >
      <MForm class="flex w-full max-w-md flex-col gap-4" @submit="(v: any) => (choicesLog = `@submit ${JSON.stringify({ ...v, signature: v.signature ? 'data:image/png…' : null, files: v.files?.length })}`)" @invalid="(e: unknown) => (choicesLog = `@invalid ${JSON.stringify(e)}`)">
        <MRadioGroup v-model="signup2.plan" name="plan" label="Plan" :options="plans" direction="row" required />
        <MRating v-model="signup2.rating" name="rating" required />
        <MFileUpload v-model="signup2.files" name="files" accept="image/*" multiple :rules="[required(), maxLength(2)]" />
        <MSignaturePad name="signature" :width="320" :height="120" class="self-start" required />
        <MSwitch v-model="signup2.news" name="news" label="Send me news" />
        <MCheckbox v-model="signup2.terms" name="terms" label="I accept the terms" required />
        <div class="flex justify-end gap-2">
          <MButton type="reset" variant="text">Reset</MButton>
          <MButton type="submit">Send</MButton>
        </div>
        <p v-if="choicesLog" class="font-mono text-body-small text-on-surface-variant break-all">{{ choicesLog }}</p>
      </MForm>
    </ComponentDemo>

    <ComponentDemo
      title="Server errors"
      description="Pass the server's errors by field name. Try submitting with taken@m3ui.dev, then another address."
      :code="`<template>
  <MForm :errors=&quot;serverErrors&quot; @submit=&quot;send&quot;>
    <MTextField v-model=&quot;login.email&quot; name=&quot;email&quot; label=&quot;Email&quot; :rules=&quot;[required(), email()]&quot; />
    <MTextField v-model=&quot;login.password&quot; name=&quot;password&quot; label=&quot;Password&quot; type=&quot;password&quot; required />
    <MButton type=&quot;submit&quot; :loading=&quot;sending&quot;>Sign up</MButton>
  </MForm>
</template>`"
      :script="`const serverErrors = ref({})

async function send(values) {
  serverErrors.value = {}
  const res = await fetch('/api/signup', { method: 'POST', body: JSON.stringify(values) })
  if (res.status === 422) serverErrors.value = (await res.json()).errors // { email: 'This email is already registered' }
}`"
    >
      <MForm class="flex w-full max-w-md flex-col gap-4" :errors="serverErrors" @submit="onLogin">
        <MTextField v-model="login.email" name="email" label="Email" :rules="[required(), email()]" />
        <MTextField v-model="login.password" name="password" label="Password" type="password" required />
        <div class="flex justify-end">
          <MButton type="submit" :loading="sending">Sign up</MButton>
        </div>
      </MForm>
    </ComponentDemo>

    <ComponentDemo
      title="Async rules, checked while typing"
      description="A rule may return a promise; only the latest check counts. validateOn=&quot;input&quot; shows the result without waiting for blur. Try admin."
      :code="`<template>
  <MTextField v-model=&quot;username&quot; label=&quot;Username&quot; validate-on=&quot;input&quot; :rules=&quot;[minLength(3), available]&quot; />
</template>`"
      :script="`const available = async (v) => !(await isTaken(v)) || \`&quot;\${v}&quot; is taken\``"
    >
      <div class="w-full max-w-md">
        <MTextField v-model="username" label="Username" validate-on="input" :rules="[minLength(3), available]" />
      </div>
    </ComponentDemo>

    <h2 class="mb-3 mt-10 text-headline-small font-medium">Validation libraries</h2>
    <p class="mb-4 text-body-large text-on-surface-variant">
      Nothing to install: fields take a string <code>error</code> and emit <code>blur</code>, and anything that implements
      Standard Schema (zod, valibot, arktype, yup) works as <code>rules</code> or as the form's <code>schema</code>.
    </p>
    <h3 class="mb-2 text-title-medium font-medium">zod / valibot</h3>
    <div class="mb-6 overflow-hidden rounded-md border border-outline-variant">
      <MCodeEditor :model-value="zodSnippet" language="vue" readonly line-numbers min-height="60px" max-height="480px" />
    </div>
    <h3 class="mb-2 text-title-medium font-medium">vee-validate</h3>
    <div class="mb-6 overflow-hidden rounded-md border border-outline-variant">
      <MCodeEditor :model-value="veeSnippet" language="vue" readonly line-numbers min-height="60px" max-height="480px" />
    </div>
    <h3 class="mb-2 text-title-medium font-medium">Vuelidate</h3>
    <div class="mb-6 overflow-hidden rounded-md border border-outline-variant">
      <MCodeEditor :model-value="vuelidateSnippet" language="vue" readonly line-numbers min-height="60px" max-height="480px" />
    </div>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="formProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Field props</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">Every form field takes them: MTextField, MNumberField, MMaskField, MPinInput, MTagInput, MMentionField, MSelect, MMultiSelect, MAutocomplete, MMultiAutocomplete, MCountrySelect, MTimezoneSelect, MPhoneInput, MAddressField, MDatePicker, MDateRangePicker, MTimePicker, MColorPicker, MCheckbox, MSwitch, MRadioGroup, MSlider, MRating, MSegmentedButton, MCronField, MFileUpload, MSignaturePad, MCreditCardInput and the editors (MRichTextEditor, MCodeEditor, MJsonEditor). Only MCheckbox has an M3 error look; on the others (M3 defines none) the message says it.</p>
    <PropsTable :props="fieldProps" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Built-in rules</h3>
    <p class="mb-3 text-body-medium text-on-surface-variant">Every rule but required passes on an empty value, so optional fields stay optional. Each takes a custom message as its last argument. More on writing your own in <RouterLink to="/composables/validators" class="text-primary underline">Validators</RouterLink>.</p>
    <PropsTable :props="rules" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="formEvents" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="formSlots" />
    <h3 class="mb-3 mt-6 text-title-large font-medium">Exposed (template ref)</h3>
    <PropsTable :props="formExposed" />

    <ComponentPager current="MForm" />
  </div>
</template>
