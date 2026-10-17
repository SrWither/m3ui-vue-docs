<script setup lang="ts">
import { ref } from 'vue'
import { MChip, MButton, MAvatar, MMenu, MMenuItem } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'

const chipProps: PropDef[] = [
  { name: 'tone', type: "'neutral' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | CSS color", default: "'neutral'", description: 'Color tone or any CSS color string' },
  { name: 'selected', type: 'boolean', default: 'false', description: "Selected/active state — the chip's shape morphs from a rounded rect to a full pill when selected" },
  { name: 'removable', type: 'boolean', default: 'false', description: 'Show a remove (X) button' },
  { name: 'clickable', type: 'boolean', default: 'false', description: 'Makes the chip an interactive <button> with hover/press/focus feedback (otherwise renders as a plain <span>)' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'icon', type: 'string', description: 'Leading Material Symbol icon' },
  { name: 'type', type: "'assist' | 'filter' | 'input' | 'suggestion'", description: "One of Material 3's four chips, styled by the spec and always interactive (tone doesn't apply): assist (an action), filter (on/off with v-model:selected; a check slides in while selected), input (a piece of user input, with an #avatar slot and removable), suggestion. Leave unset for the generic tone-colored chip" },
  { name: 'elevated', type: 'boolean', default: 'false', description: 'Typed assist, filter and suggestion chips: surface-container-low with elevation 1 instead of an outline' },
  { name: 'trailingIcon', type: 'string', description: 'Typed chips: a trailing Material Symbol icon (e.g. arrow_drop_down on a filter chip that opens a menu)' },
]

const chipEvents: EventDef[] = [
  { name: 'click', description: 'Emitted when a clickable, non-disabled chip is clicked' },
  { name: 'remove', description: 'Emitted when the remove (X) button is clicked (removable only)' },
  { name: 'update:selected', payload: 'boolean', description: 'Filter and input chips: emitted on click with the new selected state — powers v-model:selected' },
]

const chipSelected = ref(true)
const removableChips = ref(['Vue', 'React', 'Svelte'])

function removeChip(label: string) {
  removableChips.value = removableChips.value.filter((c) => c !== label)
}
const filters = ref<Record<string, boolean>>({ Vegetarian: true, 'Gluten-free': false, Spicy: false, 'Under 30 min': true })
const cuisine = ref<string | null>(null)
const cuisines = ['Italian', 'Mexican', 'Japanese', 'Indian']
const people = ref(['Ana', 'Bruno', 'Carla'])
const pickedPerson = ref('Bruno')
function resetChips() {
  removableChips.value = ['Vue', 'React', 'Svelte']
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MChip</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Compact elements for filters, input, or actions — named semantic tones or any CSS color, with
      optional icon, click, selection, and removal support. With <code>type</code> it's one of Material 3's four
      chips instead: assist, filter, input or suggestion.
    </p>

    <ComponentDemo
      title="Material 3 Chips"
      description="With type, MChip is one of Material 3's four chips. Assist chips start an action; suggestion chips offer one; filter chips toggle (v-model:selected) with a check that slides in; input chips hold something the user entered, with an avatar and a remove button. Assist, filter and suggestion chips also come elevated."
      :code="`<!-- Assist -->
<MChip type=&quot;assist&quot; icon=&quot;event&quot;>Add to calendar</MChip>
<MChip type=&quot;assist&quot; icon=&quot;map&quot; elevated>Directions</MChip>

<!-- Filter -->
<MChip v-for=&quot;(on, name) in filters&quot; :key=&quot;name&quot; type=&quot;filter&quot; v-model:selected=&quot;filters[name]&quot;>{{ name }}</MChip>
<MMenu>
  <template #trigger>
    <MChip type=&quot;filter&quot; trailing-icon=&quot;arrow_drop_down&quot; elevated :selected=&quot;!!cuisine&quot;>{{ cuisine ?? 'Cuisine' }}</MChip>
  </template>
  <MMenuItem :selected=&quot;!cuisine&quot; @click=&quot;cuisine = null&quot;>Any</MMenuItem>
  <MMenuItem v-for=&quot;c in cuisines&quot; :key=&quot;c&quot; :selected=&quot;cuisine === c&quot; @click=&quot;cuisine = c&quot;>{{ c }}</MMenuItem>
</MMenu>

<!-- Input -->
<MChip v-for=&quot;p in people&quot; :key=&quot;p&quot; type=&quot;input&quot; removable :selected=&quot;picked === p&quot; @click=&quot;picked = p&quot; @remove=&quot;people = people.filter(x => x !== p)&quot;>
  <template #avatar><MAvatar :name=&quot;p&quot; :size=&quot;24&quot; /></template>
  {{ p }}
</MChip>

<!-- Suggestion -->
<MChip type=&quot;suggestion&quot;>Pasta</MChip>
<MChip type=&quot;suggestion&quot; elevated>Salads</MChip>`"
      :script="`const filters = ref({ Vegetarian: true, 'Gluten-free': false, Spicy: false, 'Under 30 min': true })
const people = ref(['Ana', 'Bruno', 'Carla'])
const picked = ref('Bruno')
const cuisine = ref<string | null>(null)
const cuisines = ['Italian', 'Mexican', 'Japanese', 'Indian']`"
    >
      <div class="flex flex-col gap-5">
        <div>
          <p class="mb-2 text-label-large text-on-surface-variant">Assist</p>
          <div class="flex flex-wrap gap-2">
            <MChip type="assist" icon="event">Add to calendar</MChip>
            <MChip type="assist" icon="map" elevated>Directions</MChip>
            <MChip type="assist" icon="share" disabled>Share</MChip>
          </div>
        </div>
        <div>
          <p class="mb-2 text-label-large text-on-surface-variant">Filter</p>
          <div class="flex flex-wrap gap-2">
            <MChip v-for="(_, name) in filters" :key="name" v-model:selected="filters[name]" type="filter">{{ name }}</MChip>
            <MMenu align="left">
              <template #trigger>
                <MChip type="filter" trailing-icon="arrow_drop_down" elevated :selected="!!cuisine">{{ cuisine ?? 'Cuisine' }}</MChip>
              </template>
              <MMenuItem :selected="!cuisine" @click="cuisine = null">Any</MMenuItem>
              <MMenuItem v-for="c in cuisines" :key="c" :selected="cuisine === c" @click="cuisine = c">{{ c }}</MMenuItem>
            </MMenu>
          </div>
        </div>
        <div>
          <p class="mb-2 text-label-large text-on-surface-variant">Input</p>
          <div class="flex flex-wrap gap-2">
            <MChip
              v-for="p in people"
              :key="p"
              type="input"
              removable
              :selected="pickedPerson === p"
              @click="pickedPerson = p"
              @remove="people = people.filter((x) => x !== p)"
            >
              <template #avatar><MAvatar :name="p" :size="24" /></template>
              {{ p }}
            </MChip>
            <MButton v-if="people.length < 3" variant="text" @click="people = ['Ana', 'Bruno', 'Carla']">Reset</MButton>
          </div>
        </div>
        <div>
          <p class="mb-2 text-label-large text-on-surface-variant">Suggestion</p>
          <div class="flex flex-wrap gap-2">
            <MChip type="suggestion">Pasta</MChip>
            <MChip type="suggestion" elevated>Salads</MChip>
            <MChip type="suggestion" icon="local_pizza">Pizza</MChip>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Tones"
      description="Named semantic tones and custom CSS colors."
      :code="`<template>
  <MChip>Neutral</MChip>
  <MChip tone=&quot;primary&quot;>Primary</MChip>
  <MChip tone=&quot;secondary&quot;>Secondary</MChip>
  <MChip tone=&quot;tertiary&quot;>Tertiary</MChip>
  <MChip tone=&quot;success&quot;>Success</MChip>
  <MChip tone=&quot;error&quot;>Error</MChip>
  <MChip tone=&quot;#e91e63&quot;>Custom</MChip>
</template>`"
    >
      <MChip>Neutral</MChip>
      <MChip tone="primary">Primary</MChip>
      <MChip tone="secondary">Secondary</MChip>
      <MChip tone="tertiary">Tertiary</MChip>
      <MChip tone="success">Success</MChip>
      <MChip tone="error">Error</MChip>
      <MChip tone="#e91e63">Custom</MChip>
    </ComponentDemo>

    <ComponentDemo
      title="With Icons & Interaction"
      description="Clickable, selectable, and disabled chips. A selected chip's shape morphs into a full pill."
      :code="`<template>
  <MChip icon=&quot;code&quot;>With icon</MChip>
  <MChip :clickable=&quot;true&quot; tone=&quot;primary&quot; @click=&quot;handleClick&quot;>Clickable</MChip>
  <MChip :selected=&quot;selected&quot; :clickable=&quot;true&quot; tone=&quot;primary&quot; @click=&quot;selected = !selected&quot;>
    Selectable
  </MChip>
  <MChip :disabled=&quot;true&quot;>Disabled</MChip>
</template>`"
      :script="`const selected = ref(true)`"
    >
      <MChip icon="code">With icon</MChip>
      <MChip :clickable="true" tone="primary">Clickable</MChip>
      <MChip :selected="chipSelected" :clickable="true" tone="primary" @click="chipSelected = !chipSelected">
        {{ chipSelected ? 'Selected' : 'Unselected' }}
      </MChip>
      <MChip :disabled="true">Disabled</MChip>
    </ComponentDemo>

    <ComponentDemo
      title="Removable Chips"
      description="Chips that can be dismissed via the remove event."
      :code="`<template>
  <MChip
    v-for=&quot;chip in chips&quot;
    :key=&quot;chip&quot;
    :removable=&quot;true&quot;
    tone=&quot;primary&quot;
    @remove=&quot;remove(chip)&quot;
  >
    {{ chip }}
  </MChip>
</template>`"
      :script="`const chips = ref(['Vue', 'React', 'Svelte'])

function remove(label) {
  chips.value = chips.value.filter(c => c !== label)
}`"
    >
      <MChip
        v-for="chip in removableChips"
        :key="chip"
        :removable="true"
        tone="primary"
        @remove="removeChip(chip)"
      >
        {{ chip }}
      </MChip>
      <MButton v-if="removableChips.length === 0" variant="text" icon="refresh" @click="resetChips">Reset</MButton>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="chipProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="chipEvents" />

    <ComponentPager current="MChip" />
  </div>
</template>
