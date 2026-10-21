<script setup lang="ts">
import { ref } from 'vue'
import { MContainerTransform, MCard, MIcon, MIconButton, MButton, MFab, MList, MListItem, MScheme, MTextField, MAnimatedNumber, MSparkline, MSegmentedButton, useContainerTransform } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

// A grid of places, one detail view for all of them
interface Place { name: string; country: string; seed: string; icon: string; text: string }
const places: Place[] = [
  { name: 'Lisbon', country: 'Portugal', seed: '#d97b3f', icon: 'tram', text: 'Seven hills, yellow trams and custard tarts still warm from the oven.' },
  { name: 'Kyoto', country: 'Japan', seed: '#b8435b', icon: 'temple_buddhist', text: 'Temples, moss gardens and the quiet lanes of Gion at dusk.' },
  { name: 'Reykjavík', country: 'Iceland', seed: '#3f7fb5', icon: 'ac_unit', text: 'Hot springs, northern lights and a coastline shaped by volcanoes.' },
  { name: 'Oaxaca', country: 'Mexico', seed: '#3d8a5a', icon: 'local_florist', text: 'Mole, mezcal and markets full of color.' },
]
const place = useContainerTransform<Place>()

// Mail: a list item opening as a centered panel
const mails = [
  { from: 'Ana', subject: 'Trip photos', text: 'I uploaded everything from Saturday, the ones from the lighthouse came out great.' },
  { from: 'Leo', subject: 'Dinner on Friday?', text: 'There is a new place near the station, want to try it?' },
]
const mail = useContainerTransform<(typeof mails)[number]>()

// A concert card opening a booking panel
const tickets = ref<number>(2)
const ticketOptions = [1, 2, 3, 4].map((n) => ({ value: n, label: String(n) }))

// Weather tiles: each grows into its forecast
interface City { name: string; now: number; icon: string; sky: string; hours: number[]; tone: string }
const cities: City[] = [
  { name: 'Buenos Aires', now: 22, icon: 'partly_cloudy_day', sky: 'Partly cloudy', hours: [17, 18, 20, 22, 23, 24, 23, 21, 19], tone: 'bg-primary-container text-on-primary-container' },
  { name: 'Oslo', now: 4, icon: 'ac_unit', sky: 'Light snow', hours: [1, 1, 2, 4, 5, 4, 3, 2, 1], tone: 'bg-secondary-container text-on-secondary-container' },
  { name: 'Cairo', now: 31, icon: 'sunny', sky: 'Clear', hours: [24, 26, 29, 31, 33, 34, 33, 30, 27], tone: 'bg-tertiary-container text-on-tertiary-container' },
  { name: 'Lima', now: 18, icon: 'foggy', sky: 'Fog', hours: [16, 16, 17, 18, 19, 19, 18, 17, 17], tone: 'bg-surface-container-highest text-on-surface' },
]
const city = useContainerTransform<City>()

const ctProps: PropDef[] = [
  { name: 'open (v-model)', type: 'boolean', default: 'false', description: 'Whether the expanded view is open. Opening it from here grows it from the default slot\'s element (or the controller\'s last one)' },
  { name: 'controller', type: 'ContainerTransformController', description: 'A useContainerTransform() controller, to open it from elements that live elsewhere: controller.open($event, item)' },
  { name: 'mode', type: "'fullscreen' | 'dialog'", default: "'fullscreen'", description: 'Where the expanded view opens: over the whole screen, or as a centered panel (wider screens)' },
  { name: 'maxWidth', type: 'string', default: "'560px'", description: 'The centered panel\'s maximum width (dialog mode)' },
  { name: 'label', type: 'string', description: 'Accessible name of the expanded view' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Dialog mode: a scrim click doesn\'t close it' },
]
const ctSlots: SlotDef[] = [
  { name: '#default', description: 'The element that opens it, with { open, isOpen }: call open() from its click. Its root element is the one that grows' },
  { name: '#expanded', description: 'The expanded view, with { close, item } (item is what the controller\'s open was given). Its classes and attributes go on the expanded surface' },
]
const ctEvents = [
  { name: 'update:open', payload: 'boolean', description: 'The expanded view opened or closed' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MContainerTransform</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Material's container transform: whatever you tap (a card, a list item, a FAB) grows into the view it opens,
      its bounds and corners morphing while its content fades into the new one, and shrinks back into it on close.
      The expanded view opens over the page, full screen or as a centered panel, with a scrim, Escape and scroll lock,
      and focus goes back to the element on close. A port of Android's MaterialContainerTransform (its 500ms open,
      400ms close on the emphasized curve), played on the compositor.
    </p>

    <ComponentDemo
      title="Card to Detail"
      description="Wrap the element and call open() from its click; the expanded slot is what it turns into."
      :code="`<MContainerTransform label=&quot;Lisbon&quot;>
  <template #default=&quot;{ open }&quot;>
    <MCard clickable @click=&quot;open&quot;>…</MCard>
  </template>
  <template #expanded=&quot;{ close }&quot;>
    <MIconButton icon=&quot;arrow_back&quot; label=&quot;Back&quot; @click=&quot;close&quot; />
    …
  </template>
</MContainerTransform>`"
    >
      <MContainerTransform label="Lisbon">
        <template #default="{ open }">
          <MCard clickable variant="filled" class="w-64 overflow-hidden rounded-xl p-0" @click="open">
            <div class="flex h-32 items-center justify-center bg-tertiary-container text-on-tertiary-container">
              <MIcon name="tram" :size="48" />
            </div>
            <div class="p-4">
              <p class="text-title-medium">Lisbon</p>
              <p class="text-body-medium text-on-surface-variant">Portugal · 3 days</p>
            </div>
          </MCard>
        </template>
        <template #expanded="{ close }">
          <div class="flex items-center gap-2 p-2">
            <MIconButton icon="arrow_back" label="Back" @click="close" />
            <span class="text-title-large">Lisbon</span>
          </div>
          <div class="mx-auto max-w-2xl px-4 pb-8">
            <div class="flex h-56 items-center justify-center rounded-3xl bg-tertiary-container text-on-tertiary-container">
              <MIcon name="tram" :size="96" />
            </div>
            <h2 class="mt-6 text-headline-medium">Three days in Lisbon</h2>
            <p class="mt-2 text-body-large text-on-surface-variant">
              Ride tram 28 up to Alfama early, before the crowds. Lunch in Cais do Sodré, the sunset from the
              Miradouro da Senhora do Monte, and pastéis de nata in Belém on the last morning.
            </p>
            <MButton class="mt-6" icon="bookmark" @click="close">Save trip</MButton>
          </div>
        </template>
      </MContainerTransform>
    </ComponentDemo>

    <ComponentDemo
      title="A Grid, One Detail"
      description="With useContainerTransform(), any number of elements open the same expanded view: open($event, item) grows the one clicked, and the expanded slot gets its item."
      :code="`<script setup>
const place = useContainerTransform()
</script>

<MCard v-for=&quot;p in places&quot; clickable @click=&quot;place.open($event, p)&quot;>…</MCard>

<MContainerTransform :controller=&quot;place&quot;>
  <template #expanded=&quot;{ item, close }&quot;>…{{ item.name }}…</template>
</MContainerTransform>`"
    >
      <div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        <MScheme v-for="p in places" :key="p.name" :seed="p.seed" variant="content">
          <MCard clickable variant="filled" class="overflow-hidden rounded-xl bg-primary-container p-0 text-on-primary-container" @click="place.open($event, p)">
            <div class="flex h-24 items-center justify-center"><MIcon :name="p.icon" :size="40" /></div>
            <p class="px-3 pb-3 text-title-small">{{ p.name }}</p>
          </MCard>
        </MScheme>
      </div>
      <MContainerTransform :controller="place" :label="place.item.value?.name">
        <template #expanded="{ item, close }">
          <MScheme v-if="item" :seed="item.seed" variant="content" class="min-h-full bg-surface">
            <div class="flex h-64 flex-col justify-between bg-primary-container p-2 text-on-primary-container">
              <MIconButton icon="arrow_back" label="Back" @click="close" />
              <div class="flex items-end justify-between p-2">
                <div>
                  <p class="text-display-small">{{ item.name }}</p>
                  <p class="text-title-medium opacity-80">{{ item.country }}</p>
                </div>
                <MIcon :name="item.icon" :size="64" />
              </div>
            </div>
            <p class="mx-auto max-w-2xl p-6 text-body-large text-on-surface-variant">{{ item.text }}</p>
          </MScheme>
        </template>
      </MContainerTransform>
    </ComponentDemo>

    <ComponentDemo
      title="Centered Panel"
      description="mode=&quot;dialog&quot; opens a centered panel instead of the whole screen, for wider screens; a scrim click closes it unless persistent."
      :code="`<MListItem v-for=&quot;m in mails&quot; :title=&quot;m.from&quot; @click=&quot;mail.open($event, m)&quot; />
<MContainerTransform :controller=&quot;mail&quot; mode=&quot;dialog&quot;>…</MContainerTransform>`"
    >
      <MList class="w-full max-w-md rounded-xl bg-surface-container-low">
        <MListItem
          v-for="m in mails"
          :key="m.from"
          :title="m.from"
          :subtitle="m.subject"
          icon="mail"
          @click="mail.open($event, m)"
        />
      </MList>
      <MContainerTransform :controller="mail" mode="dialog" :label="mail.item.value?.subject">
        <template #expanded="{ item, close }">
          <div v-if="item" class="p-6">
            <p class="text-label-large text-on-surface-variant">{{ item.from }}</p>
            <h2 class="mt-1 text-headline-small">{{ item.subject }}</h2>
            <p class="mt-4 text-body-large text-on-surface-variant">{{ item.text }}</p>
            <div class="mt-6 flex justify-end gap-2">
              <MButton variant="text" @click="close">Close</MButton>
              <MButton icon="reply" @click="close">Reply</MButton>
            </div>
          </div>
        </template>
      </MContainerTransform>
    </ComponentDemo>

    <ComponentDemo
      title="Card to a Panel"
      description="mode=&quot;dialog&quot; keeps the page around it: the card grows into a centered panel, here a booking sheet with live controls."
      :code="`<MContainerTransform mode=&quot;dialog&quot; max-width=&quot;420px&quot; label=&quot;Tickets&quot;>
  <template #default=&quot;{ open }&quot;>
    <MCard clickable @click=&quot;open&quot;>…</MCard>
  </template>
  <template #expanded=&quot;{ close }&quot;>
    <MSegmentedButton v-model=&quot;tickets&quot; :options=&quot;ticketOptions&quot; />
    <MAnimatedNumber :value=&quot;tickets * 48&quot; :format=&quot;{ style: 'currency', currency: 'USD' }&quot; />
    …
  </template>
</MContainerTransform>`"
    >
      <MContainerTransform mode="dialog" max-width="420px" label="Tickets for Aurora Live">
        <template #default="{ open }">
          <MCard clickable variant="outlined" class="flex w-72 items-center gap-4 rounded-2xl p-4" @click="open">
            <div class="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-on-primary">
              <span class="text-label-small">NOV</span>
              <span class="text-title-large font-medium">14</span>
            </div>
            <div class="min-w-0">
              <p class="truncate text-title-medium">Aurora Live</p>
              <p class="text-body-medium text-on-surface-variant">Teatro Gran Rex · 21:00</p>
            </div>
          </MCard>
        </template>
        <template #expanded="{ close }">
          <div class="flex flex-col gap-5 p-6">
            <div class="flex items-center gap-4">
              <div class="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-on-primary">
                <span class="text-label-small">NOV</span>
                <span class="text-title-large font-medium">14</span>
              </div>
              <div>
                <p class="text-title-large">Aurora Live</p>
                <p class="text-body-medium text-on-surface-variant">Teatro Gran Rex · 21:00</p>
              </div>
            </div>
            <div>
              <p class="mb-2 text-label-large text-on-surface-variant">Tickets</p>
              <MSegmentedButton v-model="tickets" :options="ticketOptions" />
            </div>
            <div class="flex items-baseline justify-between">
              <span class="text-body-large text-on-surface-variant">Total</span>
              <MAnimatedNumber :value="tickets * 48" :format="{ style: 'currency', currency: 'USD' }" locale="en-US" class="text-headline-medium" />
            </div>
            <div class="flex justify-end gap-2">
              <MButton variant="text" @click="close">Cancel</MButton>
              <MButton icon="confirmation_number" @click="close">Buy</MButton>
            </div>
          </div>
        </template>
      </MContainerTransform>
    </ComponentDemo>

    <ComponentDemo
      title="Weather Tiles"
      description="Small tiles growing into a forecast panel: the temperature rolls in and the day's curve draws itself, each tile in its own color."
      :code="`<MCard v-for=&quot;c in cities&quot; clickable @click=&quot;city.open($event, c)&quot;>…</MCard>
<MContainerTransform :controller=&quot;city&quot; mode=&quot;dialog&quot; max-width=&quot;380px&quot;>
  <template #expanded=&quot;{ item }&quot;>
    <MAnimatedNumber :value=&quot;item.now&quot; :format=&quot;{ style: 'unit', unit: 'celsius' }&quot; />
    <MSparkline :data=&quot;item.hours&quot; type=&quot;area&quot; />
  </template>
</MContainerTransform>`"
    >
      <div class="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
        <MCard v-for="c in cities" :key="c.name" clickable variant="filled" class="flex aspect-square flex-col justify-between rounded-3xl p-4" :class="c.tone" @click="city.open($event, c)">
          <MIcon :name="c.icon" :size="32" />
          <div>
            <p class="text-headline-small">{{ c.now }}°</p>
            <p class="truncate text-label-medium opacity-80">{{ c.name }}</p>
          </div>
        </MCard>
      </div>
      <MContainerTransform :controller="city" mode="dialog" max-width="380px" :label="city.item.value?.name">
        <template #expanded="{ item, close }">
          <div v-if="item" class="flex flex-col gap-4 p-6" :class="item.tone">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-title-large">{{ item.name }}</p>
                <p class="text-body-medium opacity-80">{{ item.sky }}</p>
              </div>
              <MIconButton icon="close" label="Close" @click="close" />
            </div>
            <div class="flex items-center gap-4">
              <MIcon :name="item.icon" :size="64" />
              <MAnimatedNumber :value="item.now" :format="{ style: 'unit', unit: 'celsius' }" locale="en" class="text-display-medium" />
            </div>
            <MSparkline :data="item.hours" type="area" color="currentColor" class="h-20 w-full" :label="`${item.name} today`" />
            <div class="flex justify-between text-label-medium opacity-80">
              <span v-for="(h, i) in item.hours" :key="i">{{ h }}°</span>
            </div>
          </div>
        </template>
      </MContainerTransform>
    </ComponentDemo>

    <ComponentDemo
      title="FAB to a Screen"
      description="The classic one: the compose FAB grows into the new message screen."
      :code="`<MContainerTransform label=&quot;New message&quot;>
  <template #default=&quot;{ open }&quot;>
    <MFab icon=&quot;edit&quot; label=&quot;Compose&quot; @click=&quot;open&quot; />
  </template>
  <template #expanded=&quot;{ close }&quot;>…</template>
</MContainerTransform>`"
    >
      <MContainerTransform label="New message">
        <template #default="{ open }">
          <MFab icon="edit" label="Compose" @click="open" />
        </template>
        <template #expanded="{ close }">
          <div class="flex items-center gap-2 p-2">
            <MIconButton icon="close" label="Discard" @click="close" />
            <span class="flex-1 text-title-large">New message</span>
            <MIconButton icon="send" label="Send" variant="filled" @click="close" />
          </div>
          <div class="mx-auto flex max-w-2xl flex-col gap-4 p-4">
            <MTextField label="To" />
            <MTextField label="Subject" />
            <MTextField label="Message" multiline :rows="6" />
          </div>
        </template>
      </MContainerTransform>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="ctProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="ctSlots" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="ctEvents" />

    <ComponentPager current="MContainerTransform" />
  </div>
</template>
