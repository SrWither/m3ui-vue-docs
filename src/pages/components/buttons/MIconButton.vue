<script setup lang="ts">
import { ref } from 'vue'
import { MIconButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const toggles = ref({ standard: true, filled: true, tonal: false, outlined: true })
const playing = ref(false)
const bookmarked = ref(false)
const squared = ref({ filled: false, tonal: true })

const iconButtonProps: PropDef[] = [
  { name: 'icon', type: 'string', description: 'Material Symbol icon name' },
  { name: 'label', type: 'string', description: 'Accessible label (aria-label and title)' },
  { name: 'variant', type: "'standard' | 'filled' | 'tonal' | 'outlined'", default: "'standard'", description: 'Visual style' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary' | 'error' | string", description: 'An M3 role or any CSS color (#fff over a photo, rgb(0 0 0 / 0.3) for a scrim-like filled button, currentColor to follow the surrounding text). Standard and outlined use it for the icon; filled for the container with white (or the role\'s on-color) on it; tonal for a 20% container with the color on it. Disabled buttons and toggles keep their own colors' },
  { name: 'shape', type: "'rounded' | 'squared'", default: "'rounded'", description: 'Button shape — rounded (pill, always) or squared (corner radius scales with size: 12px xs/sm, 16px md, 28px lg/xl)' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'sm'", description: "M3's 5-tier icon button sizing (xs:32, sm:40, md:56, lg:96, xl:136), or a custom pixel value" },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'to', type: 'string | RouteLocationRaw', description: 'Vue Router destination — renders as RouterLink instead of button' },
  { name: 'rippleColor', type: 'string', description: "Any CSS color for the press ripple; defaults to the button's content color. Same ripple as the v-ripple directive" },
  { name: 'checked', type: 'boolean', description: 'Makes it a toggle button (v-model:checked): selected colors, a filled icon, and a shape that changes when pressed and when checked. Leave it unset for a plain icon button' },
  { name: 'checkedIcon', type: 'string', description: "Icon shown while checked, when it differs from icon (e.g. 'pause' for 'play_arrow')" },
  { name: 'iconFilled', type: 'boolean', default: 'false', description: "Draws the icon filled (Material Symbols' FILL axis) without making it a toggle, e.g. a player's skip buttons" },
]

const iconButtonEvents: EventDef[] = [
  { name: 'update:checked', payload: 'boolean', description: 'Emitted on click when checked is set — powers v-model:checked' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MIconButton</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A button that shows only an icon — four visual styles, the same 5-tier expressive sizing as MButton.
    </p>

    <ComponentDemo
      title="Variants"
      description="Four icon button styles."
      :code="`<template>
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;standard&quot; />
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;filled&quot; />
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;tonal&quot; />
  <MIconButton icon=&quot;settings&quot; label=&quot;Settings&quot; variant=&quot;outlined&quot; />
</template>`"
    >
      <MIconButton icon="settings" label="Settings" variant="standard" />
      <MIconButton icon="settings" label="Settings" variant="filled" />
      <MIconButton icon="settings" label="Settings" variant="tonal" />
      <MIconButton icon="settings" label="Settings" variant="outlined" />
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Five preset sizes or a custom pixel value."
      :code="`<MIconButton icon=&quot;favorite&quot; size=&quot;xs&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;sm&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;md&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;lg&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;favorite&quot; size=&quot;xl&quot; variant=&quot;tonal&quot; />`"
    >
      <div class="flex flex-col items-start gap-3">
        <MIconButton icon="favorite" label="XS" size="xs" variant="tonal" />
        <MIconButton icon="favorite" label="SM" size="sm" variant="tonal" />
        <MIconButton icon="favorite" label="MD" size="md" variant="tonal" />
        <MIconButton icon="favorite" label="LG" size="lg" variant="tonal" />
        <MIconButton icon="favorite" label="XL" size="xl" variant="tonal" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Shape"
      description="Rounded (default) or squared."
      :code="`<MIconButton icon=&quot;settings&quot; shape=&quot;rounded&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;settings&quot; shape=&quot;squared&quot; variant=&quot;tonal&quot; />`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MIconButton icon="settings" label="Rounded" shape="rounded" variant="filled" />
        <MIconButton icon="settings" label="Squared" shape="squared" variant="filled" />
        <MIconButton icon="settings" label="Rounded" shape="rounded" variant="tonal" />
        <MIconButton icon="settings" label="Squared" shape="squared" variant="tonal" />
        <MIconButton icon="settings" label="Rounded" shape="rounded" variant="outlined" />
        <MIconButton icon="settings" label="Squared" shape="squared" variant="outlined" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Color"
      description="color takes an M3 role or any CSS color. Standard and outlined buttons use it for the icon, filled ones for the container (white on a CSS color, the role's on-color on a role), tonal ones for a light container. Over media, a white standard button or a translucent black filled one stays readable on any frame."
      :code="`<MIconButton icon=&quot;send&quot; label=&quot;Send&quot; color=&quot;primary&quot; />
<MIconButton icon=&quot;delete&quot; label=&quot;Delete&quot; color=&quot;error&quot; variant=&quot;outlined&quot; />
<MIconButton icon=&quot;favorite&quot; label=&quot;Like&quot; color=&quot;#e5533d&quot; variant=&quot;tonal&quot; />
<MIconButton icon=&quot;bolt&quot; label=&quot;Boost&quot; color=&quot;tertiary&quot; variant=&quot;filled&quot; />

<!-- Over a video or a photo -->
<MIconButton icon=&quot;close&quot; label=&quot;Close&quot; color=&quot;#fff&quot; />
<MIconButton icon=&quot;play_arrow&quot; label=&quot;Play&quot; variant=&quot;filled&quot; color=&quot;rgb(0 0 0 / 0.3)&quot; size=&quot;md&quot; icon-filled />`"
    >
      <div class="flex w-full flex-col gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <MIconButton icon="send" label="Send" color="primary" />
          <MIconButton icon="delete" label="Delete" color="error" variant="outlined" />
          <MIconButton icon="favorite" label="Like" color="#e5533d" variant="tonal" />
          <MIconButton icon="bolt" label="Boost" color="tertiary" variant="filled" />
          <MIconButton icon="send" label="Send (disabled)" color="primary" disabled />
        </div>
        <div class="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-amber-300 via-rose-400 to-indigo-700">
          <MIconButton icon="close" label="Close" color="#fff" class="absolute top-2 right-2" />
          <div class="flex items-center gap-4">
            <MIconButton icon="replay_10" label="Back 10 seconds" variant="filled" color="rgb(0 0 0 / 0.3)" />
            <MIconButton icon="play_arrow" label="Play" variant="filled" color="rgb(0 0 0 / 0.3)" size="md" icon-filled />
            <MIconButton icon="forward_10" label="Forward 10 seconds" variant="filled" color="rgb(0 0 0 / 0.3)" />
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Toggle"
      description="Give it checked (v-model:checked) and it becomes an icon toggle button: it fills its icon and takes the selected colors when checked. A round button squares off while checked and a squared one turns round; both squeeze a little while pressed."
      :code="`<MIconButton v-model:checked=&quot;favorite&quot; icon=&quot;favorite&quot; label=&quot;Favorite&quot; />
<MIconButton v-model:checked=&quot;favorite&quot; icon=&quot;favorite&quot; label=&quot;Favorite&quot; variant=&quot;filled&quot; />
<MIconButton v-model:checked=&quot;favorite&quot; icon=&quot;favorite&quot; label=&quot;Favorite&quot; variant=&quot;tonal&quot; />
<MIconButton v-model:checked=&quot;favorite&quot; icon=&quot;favorite&quot; label=&quot;Favorite&quot; variant=&quot;outlined&quot; />

<!-- squared: round while checked -->
<MIconButton v-model:checked=&quot;pinned&quot; icon=&quot;push_pin&quot; label=&quot;Pin&quot; variant=&quot;filled&quot; shape=&quot;squared&quot; />`"
      :script="`import { ref } from 'vue'

const favorite = ref(true)
const pinned = ref(false)`"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <MIconButton v-model:checked="toggles.standard" icon="favorite" label="Favorite" />
          <MIconButton v-model:checked="toggles.filled" icon="favorite" label="Favorite" variant="filled" />
          <MIconButton v-model:checked="toggles.tonal" icon="favorite" label="Favorite" variant="tonal" />
          <MIconButton v-model:checked="toggles.outlined" icon="favorite" label="Favorite" variant="outlined" />
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <MIconButton v-model:checked="squared.filled" icon="push_pin" label="Pin" variant="filled" shape="squared" />
          <MIconButton v-model:checked="squared.tonal" icon="push_pin" label="Pin" variant="tonal" shape="squared" />
          <MIconButton v-model:checked="squared.filled" icon="push_pin" label="Pin" variant="filled" shape="squared" size="md" />
          <MIconButton v-model:checked="squared.tonal" icon="push_pin" label="Pin" variant="tonal" size="md" />
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Different icon when checked"
      description="checkedIcon swaps the glyph while checked, for pairs like play and pause."
      :code="`<MIconButton v-model:checked=&quot;playing&quot; icon=&quot;play_arrow&quot; checked-icon=&quot;pause&quot; label=&quot;Play&quot; variant=&quot;filled&quot; size=&quot;md&quot; />
<MIconButton v-model:checked=&quot;bookmarked&quot; icon=&quot;bookmark&quot; checked-icon=&quot;bookmark_added&quot; label=&quot;Bookmark&quot; />`"
      :script="`import { ref } from 'vue'

const playing = ref(false)
const bookmarked = ref(false)`"
    >
      <div class="flex flex-wrap items-center gap-3">
        <MIconButton v-model:checked="playing" icon="play_arrow" checked-icon="pause" label="Play" variant="filled" size="md" />
        <MIconButton v-model:checked="bookmarked" icon="bookmark" checked-icon="bookmark_added" label="Bookmark" />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="iconButtonProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="iconButtonEvents" />

    <ComponentPager current="MIconButton" />
  </div>
</template>
