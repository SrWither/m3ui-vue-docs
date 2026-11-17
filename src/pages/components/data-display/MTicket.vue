<script setup lang="ts">
import { MTicket, MChip } from '@m3ui-vue/m3ui-vue'
import { MQRCode } from '@m3ui-vue/m3ui-vue/qrcode'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const props: PropDef[] = [
  { name: 'title', type: 'string', description: 'Title in the colored band: the airline, the event, the movie' },
  { name: 'subtitle', type: 'string', description: 'A line under the title' },
  { name: 'icon', type: 'string', description: 'Material Symbol before the title' },
  { name: 'color', type: 'string', default: "'primary'", description: 'Band color: a role (primary, secondary, tertiary, error, success) or any CSS color' },
  { name: 'from', type: 'TicketStop', description: '{ code, name?, time? } where the trip starts' },
  { name: 'to', type: 'TicketStop', description: '{ code, name?, time? } where it ends' },
  { name: 'transport', type: 'string', default: "'flight'", description: 'Material Symbol between from and to (directions_bus, train, directions_boat…)' },
  { name: 'fields', type: 'TicketField[]', default: '[]', description: '{ label, value, strong? } in a grid' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Stub beside the main part, or under it like a phone boarding pass' },
  { name: 'stubSize', type: 'string', default: "'10rem'", description: 'Width of the stub in horizontal orientation' },
  { name: 'notch', type: 'number', default: '12', description: 'Radius of the notches at the perforation, in px' },
]

const slots: SlotDef[] = [
  { name: 'header', description: 'Replaces the title row in the band (a logo, a status chip)' },
  { name: 'default', description: 'Content of the main part, under the route and fields' },
  { name: 'stub', description: 'Content of the tear-off stub: a QR, a barcode, a number' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTicket</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A ticket with a tear-off stub: a boarding pass, a bus or train ticket, a concert or cinema entry, a coupon. A
      perforated line with two cut-out notches separates the stub, which usually holds the code to scan: put an
      <code>MQRCode</code> or <code>MBarcode</code> in its slot. The notches are real cut-outs (a mask), so the ticket
      works over any background.
    </p>

    <ComponentDemo
      title="Boarding pass"
      description="Vertical, the way a phone wallet shows it: route with times, fields with the seat emphasized, and a QR in the stub."
      :code="`<MTicket
  orientation=&quot;vertical&quot;
  icon=&quot;flight_takeoff&quot;
  title=&quot;Andes Air · AR 1402&quot;
  subtitle=&quot;Mon 23 Nov&quot;
  :from=&quot;{ code: 'EZE', name: 'Buenos Aires', time: '08:40' }&quot;
  :to=&quot;{ code: 'BRC', name: 'Bariloche', time: '11:05' }&quot;
  :fields=&quot;[
    { label: 'Passenger', value: 'Ana Gómez' },
    { label: 'Gate', value: 'B12' },
    { label: 'Boarding', value: '07:55' },
    { label: 'Seat', value: '14C', strong: true },
  ]&quot;
>
  <template #stub>
    <MQRCode value=&quot;M1GOMEZ/ANA EZEBRCAR1402&quot; :size=&quot;140&quot; />
  </template>
</MTicket>`"
    >
      <div class="flex w-full justify-center">
        <MTicket
          class="w-full max-w-sm"
          orientation="vertical"
          icon="flight_takeoff"
          title="Andes Air · AR 1402"
          subtitle="Mon 23 Nov"
          :from="{ code: 'EZE', name: 'Buenos Aires', time: '08:40' }"
          :to="{ code: 'BRC', name: 'Bariloche', time: '11:05' }"
          :fields="[
            { label: 'Passenger', value: 'Ana Gómez' },
            { label: 'Gate', value: 'B12' },
            { label: 'Boarding', value: '07:55' },
            { label: 'Seat', value: '14C', strong: true },
          ]"
        >
          <template #stub>
            <MQRCode value="M1GOMEZ/ANA EZEBRCAR1402" :size="140" />
            <span class="text-label-medium text-on-surface-variant">Group 3</span>
          </template>
        </MTicket>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Event entry and a bus ticket"
      description="Horizontal with the stub on the right. A custom header and color; the bus ticket uses transport=&quot;directions_bus&quot;."
      :code="`<MTicket color=&quot;tertiary&quot; :fields=&quot;[{ label: 'Gate', value: 'C' }, { label: 'Row', value: 'F' }, { label: 'Seat', value: '24', strong: true }]&quot;>
  <template #header>
    <div class=&quot;flex-1&quot;>
      <div class=&quot;text-title-large font-bold&quot;>Night Owls</div>
      <div class=&quot;text-body-medium opacity-80&quot;>Sat 12 Dec · 21:00 · Arena Norte</div>
    </div>
    <MChip>VIP</MChip>
  </template>
  <template #stub>
    <span class=&quot;text-label-medium&quot;>ADMIT ONE</span>
    <span class=&quot;font-mono text-title-medium&quot;>Nº 00731</span>
  </template>
</MTicket>`"
    >
      <div class="flex w-full flex-col items-center gap-6">
        <MTicket
          class="w-full max-w-xl"
          color="tertiary"
          :fields="[{ label: 'Gate', value: 'C' }, { label: 'Row', value: 'F' }, { label: 'Seat', value: '24', strong: true }]"
          stub-size="8rem"
        >
          <template #header>
            <div class="flex-1">
              <div class="text-title-large font-bold">Night Owls</div>
              <div class="text-body-medium opacity-80">Sat 12 Dec · 21:00 · Arena Norte</div>
            </div>
            <MChip>VIP</MChip>
          </template>
          <template #stub>
            <span class="text-label-medium text-on-surface-variant">ADMIT ONE</span>
            <span class="font-mono text-title-medium">Nº 00731</span>
          </template>
        </MTicket>

        <MTicket
          class="w-full max-w-xl"
          color="secondary"
          icon="directions_bus"
          title="Ruta Sur"
          transport="directions_bus"
          :from="{ code: 'RET', name: 'Retiro', time: '22:30' }"
          :to="{ code: 'MDQ', name: 'Mar del Plata', time: '04:10' }"
          :fields="[{ label: 'Platform', value: '41' }, { label: 'Seat', value: '7', strong: true }]"
          stub-size="8rem"
        >
          <template #stub>
            <MQRCode value="RUTASUR-RET-MDQ-7" :size="96" />
          </template>
        </MTicket>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="props" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="slots" />

    <ComponentPager current="MTicket" />
  </div>
</template>
