<script setup lang="ts">
import { MResult, MCard, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const statuses = ['success', 'error', 'warning', 'info', '404', '403', '500'] as const

const resultProps: PropDef[] = [
  { name: 'status', type: "'success' | 'error' | 'warning' | 'info' | '404' | '403' | '500'", description: 'Required. Picks the icon, its colors, and the default title/description. The three HTTP statuses also show the code in large type above the icon' },
  { name: 'title', type: 'string', description: 'Custom title, replaces the status default' },
  { name: 'description', type: 'string', description: 'Custom description, replaces the status default' },
]

const resultSlots: SlotDef[] = [
  { name: '#actions', description: 'Action buttons, in a centered row below the description' },
  { name: '#default', description: 'Extra content below the actions row, e.g. a secondary link or fine print' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MResult</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A full result screen for the end of a flow: success, errors, empty states and HTTP error pages.
      Each status comes with its own icon, colors, title and description, and you can override any of them.
      The default texts come from the active locale (<code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">useLocale</code>),
      so they follow the language passed to <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">createM3UI({ locale })</code>.
    </p>

    <ComponentDemo
      title="Statuses"
      description="The seven statuses with their default texts."
      :code="`<MResult status=&quot;success&quot; />
<MResult status=&quot;error&quot; />
<MResult status=&quot;warning&quot; />
<MResult status=&quot;info&quot; />
<MResult status=&quot;404&quot; />
<MResult status=&quot;403&quot; />
<MResult status=&quot;500&quot; />`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MCard v-for="s in statuses" :key="s" variant="outlined" class="overflow-hidden">
          <MResult :status="s" class="h-full" />
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Order confirmed"
      description="A success screen at the end of a checkout, with a custom title and description and two actions."
      :code="`<MResult
  status=&quot;success&quot;
  title=&quot;Order placed&quot;
  description=&quot;Order #48213 is confirmed. We'll email you when it ships.&quot;
>
  <template #actions>
    <MButton icon=&quot;receipt_long&quot;>View order</MButton>
    <MButton variant=&quot;text&quot;>Keep shopping</MButton>
  </template>
</MResult>`"
    >
      <MCard variant="outlined" class="w-full overflow-hidden">
        <MResult
          status="success"
          title="Order placed"
          description="Order #48213 is confirmed. We'll email you when it ships."
        >
          <template #actions>
            <MButton icon="receipt_long">View order</MButton>
            <MButton variant="text">Keep shopping</MButton>
          </template>
        </MResult>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Not found page"
      description="A 404 route with the default texts and a way back."
      :code="`<MResult status=&quot;404&quot;>
  <template #actions>
    <MButton variant=&quot;tonal&quot; icon=&quot;home&quot; @click=&quot;router.push('/')&quot;>Go home</MButton>
    <MButton variant=&quot;text&quot; icon=&quot;arrow_back&quot; @click=&quot;router.back()&quot;>Go back</MButton>
  </template>
</MResult>`"
    >
      <MCard variant="outlined" class="w-full overflow-hidden">
        <MResult status="404">
          <template #actions>
            <MButton variant="tonal" icon="home">Go home</MButton>
            <MButton variant="text" icon="arrow_back">Go back</MButton>
          </template>
        </MResult>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Access denied"
      description="A 403 for a page the signed-in user can't open, offering to request access or switch accounts."
      :code="`<MResult
  status=&quot;403&quot;
  description=&quot;Only workspace admins can view billing. Ask an admin for access, or sign in with another account.&quot;
>
  <template #actions>
    <MButton icon=&quot;mail&quot;>Request access</MButton>
    <MButton variant=&quot;outlined&quot; icon=&quot;switch_account&quot;>Switch account</MButton>
  </template>
</MResult>`"
    >
      <MCard variant="outlined" class="w-full overflow-hidden">
        <MResult
          status="403"
          description="Only workspace admins can view billing. Ask an admin for access, or sign in with another account."
        >
          <template #actions>
            <MButton icon="mail">Request access</MButton>
            <MButton variant="outlined" icon="switch_account">Switch account</MButton>
          </template>
        </MResult>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Server error"
      description="A 500 with a retry action. The default slot adds a status page link and an error reference to quote to support."
      :code="`<MResult status=&quot;500&quot;>
  <template #actions>
    <MButton icon=&quot;refresh&quot;>Try again</MButton>
  </template>
  <p class=&quot;text-body-small text-on-surface-variant&quot;>
    Check the <a href=&quot;#&quot; class=&quot;text-primary underline&quot;>status page</a> · Reference: ERR-7F3A21
  </p>
</MResult>`"
    >
      <MCard variant="outlined" class="w-full overflow-hidden">
        <MResult status="500">
          <template #actions>
            <MButton icon="refresh">Try again</MButton>
          </template>
          <p class="text-body-small text-on-surface-variant">
            Check the <a href="#" class="text-primary underline" @click.prevent>status page</a> · Reference: ERR-7F3A21
          </p>
        </MResult>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Empty state"
      description="The info status works as an empty state, with a custom title and description and a call to action."
      :code="`<MResult
  status=&quot;info&quot;
  title=&quot;No projects yet&quot;
  description=&quot;Projects keep your files, tasks and people in one place. Create one to get started.&quot;
>
  <template #actions>
    <MButton icon=&quot;add&quot;>New project</MButton>
  </template>
</MResult>`"
    >
      <MCard variant="outlined" class="w-full overflow-hidden">
        <MResult
          status="info"
          title="No projects yet"
          description="Projects keep your files, tasks and people in one place. Create one to get started."
        >
          <template #actions>
            <MButton icon="add">New project</MButton>
          </template>
        </MResult>
      </MCard>
    </ComponentDemo>

    <ComponentDemo
      title="Payment failed"
      description="An error screen with a fix-it action and a support link in the default slot."
      :code="`<MResult
  status=&quot;error&quot;
  title=&quot;Payment declined&quot;
  description=&quot;Your bank declined the charge. Try another card or check your card details.&quot;
>
  <template #actions>
    <MButton icon=&quot;credit_card&quot;>Use another card</MButton>
    <MButton variant=&quot;text&quot;>Edit details</MButton>
  </template>
  <p class=&quot;text-body-small text-on-surface-variant&quot;>
    Still stuck? <a href=&quot;#&quot; class=&quot;text-primary underline&quot;>Contact support</a>
  </p>
</MResult>`"
    >
      <MCard variant="outlined" class="w-full overflow-hidden">
        <MResult
          status="error"
          title="Payment declined"
          description="Your bank declined the charge. Try another card or check your card details."
        >
          <template #actions>
            <MButton icon="credit_card">Use another card</MButton>
            <MButton variant="text">Edit details</MButton>
          </template>
          <p class="text-body-small text-on-surface-variant">
            Still stuck? <a href="#" class="text-primary underline" @click.prevent>Contact support</a>
          </p>
        </MResult>
      </MCard>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="resultProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="resultSlots" />

    <ComponentPager current="MResult" />
  </div>
</template>
