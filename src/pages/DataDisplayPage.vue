<script setup lang="ts">
import { ref } from 'vue'
import {
  MCard, MChip, MBadge, MAvatar, MIcon, MDivider, MButton, MIconButton,
} from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const chipSelected = ref(true)
const removableChips = ref(['Vue', 'React', 'Svelte'])

function removeChip(label: string) {
  removableChips.value = removableChips.value.filter((c) => c !== label)
}
function resetChips() {
  removableChips.value = ['Vue', 'React', 'Svelte']
}

const cardProps: PropDef[] = [
  { name: 'variant', type: "'elevated' | 'filled' | 'outlined'", default: "'elevated'", description: 'Card surface style' },
  { name: 'clickable', type: 'boolean', default: 'false', description: 'Adds hover elevation and cursor pointer' },
  { name: 'image', type: 'string', description: 'URL for a full-bleed header image' },
  { name: 'imageAlt', type: 'string', description: 'Alt text for the header image' },
  { name: 'imageHeight', type: 'string', description: 'Tailwind height class for the image (default h-48)' },
]

const chipProps: PropDef[] = [
  { name: 'tone', type: "'neutral' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | CSS color", default: "'neutral'", description: 'Color tone or any CSS color string' },
  { name: 'selected', type: 'boolean', default: 'false', description: 'Selected/active state' },
  { name: 'removable', type: 'boolean', default: 'false', description: 'Show remove (X) button' },
  { name: 'clickable', type: 'boolean', default: 'false', description: 'Makes the chip interactive' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
  { name: 'icon', type: 'string', description: 'Leading Material Symbol icon' },
]

const badgeProps: PropDef[] = [
  { name: 'count', type: 'number', description: 'Numeric badge value' },
  { name: 'dot', type: 'boolean', default: 'false', description: 'Show a small dot instead of a number' },
  { name: 'color', type: "'primary' | 'error' | 'secondary' | 'tertiary'", default: "'error'", description: 'Badge color' },
  { name: 'max', type: 'number', default: '99', description: 'Max value before showing "N+"' },
]

const avatarProps: PropDef[] = [
  { name: 'name', type: 'string', description: 'Full name — initials are extracted automatically' },
  { name: 'size', type: 'number', default: '40', description: 'Avatar size in px' },
]

const iconProps: PropDef[] = [
  { name: 'name', type: 'string', description: 'Material Symbol name (e.g. "settings", "favorite")' },
  { name: 'size', type: 'number', default: '24', description: 'Icon size in px' },
]

const dividerProps: PropDef[] = [
  { name: 'vertical', type: 'boolean', default: 'false', description: 'Render as vertical divider' },
  { name: 'label', type: 'string', description: 'Text label in the middle of the divider' },
  { name: 'inset', type: 'boolean', default: 'false', description: 'Add horizontal padding' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Data Display</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for presenting content, status indicators, and visual elements.
    </p>

    <!-- ── MCard ────────────────────────────────────────────────────────── -->
    <h2 class="mb-4 text-headline-small font-medium">MCard</h2>

    <ComponentDemo
      title="Variants"
      description="Three card surface styles following M3 elevation system."
      :code="`<template>
  <MCard variant=&quot;elevated&quot; class=&quot;p-6&quot;>Elevated</MCard>
  <MCard variant=&quot;filled&quot; class=&quot;p-6&quot;>Filled</MCard>
  <MCard variant=&quot;outlined&quot; class=&quot;p-6&quot;>Outlined</MCard>
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-3">
        <MCard variant="elevated" class="p-6">
          <h3 class="text-title-medium font-medium">Elevated</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Shadow-based elevation</p>
        </MCard>
        <MCard variant="filled" class="p-6">
          <h3 class="text-title-medium font-medium">Filled</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Tinted background</p>
        </MCard>
        <MCard variant="outlined" class="p-6">
          <h3 class="text-title-medium font-medium">Outlined</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Border-based</p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Clickable"
      description="Cards with hover elevation feedback."
      :code="`<template>
  <MCard :clickable=&quot;true&quot; class=&quot;p-6&quot;>
    Click me — I have hover feedback
  </MCard>
</template>`"
    >
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <MCard :clickable="true" class="p-6">
          <h3 class="text-title-medium font-medium">Clickable elevated</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Hover to see elevation change</p>
        </MCard>
        <MCard :clickable="true" variant="outlined" class="p-6">
          <h3 class="text-title-medium font-medium">Clickable outlined</h3>
          <p class="mt-1 text-body-medium text-on-surface-variant">Hover to see shadow appear</p>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With Image"
      description="Full-bleed header image via the image prop or media slot."
      :code="`<template>
  <MCard
    image=&quot;https://picsum.photos/seed/m3ui/400/200&quot;
    image-alt=&quot;Landscape&quot;
    class=&quot;w-72&quot;
  >
    <div class=&quot;p-4&quot;>
      <h3>Card Title</h3>
      <p>Card description here.</p>
    </div>
  </MCard>
</template>`"
    >
      <div class="flex flex-wrap gap-4">
        <MCard image="https://picsum.photos/seed/m3ui-a/400/200" image-alt="Photo" class="w-72">
          <div class="p-4">
            <h3 class="text-title-medium font-medium">Mountain View</h3>
            <p class="mt-1 text-body-medium text-on-surface-variant">A beautiful landscape</p>
          </div>
        </MCard>
        <MCard image="https://picsum.photos/seed/m3ui-b/400/200" image-alt="Photo" variant="outlined" class="w-72">
          <div class="p-4">
            <h3 class="text-title-medium font-medium">Ocean Breeze</h3>
            <p class="mt-1 text-body-medium text-on-surface-variant">Outlined variant with image</p>
          </div>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="cardProps" />

    <!-- ── MChip ────────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MChip</h2>

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
      description="Clickable, selectable, and removable chips."
      :code="`<script setup>
const selected = ref(true)
<\/script>

<template>
  <MChip icon=&quot;code&quot;>With icon</MChip>
  <MChip :clickable=&quot;true&quot; tone=&quot;primary&quot; @click=&quot;handleClick&quot;>Clickable</MChip>
  <MChip :selected=&quot;selected&quot; :clickable=&quot;true&quot; tone=&quot;primary&quot; @click=&quot;selected = !selected&quot;>
    Selectable
  </MChip>
  <MChip :removable=&quot;true&quot; tone=&quot;tertiary&quot; @remove=&quot;handleRemove&quot;>Removable</MChip>
</template>`"
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
      description="Chips that can be dismissed with an animated removal."
      :code="`<script setup>
const chips = ref(['Vue', 'React', 'Svelte'])

function remove(label) {
  chips.value = chips.value.filter(c => c !== label)
}
<\/script>

<template>
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

    <!-- ── MBadge ───────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MBadge</h2>

    <ComponentDemo
      title="Badge"
      description="Numeric badges, dot indicators, and color variants."
      :code="`<template>
  <MBadge :count=&quot;5&quot;>
    <MIconButton icon=&quot;mail&quot; label=&quot;Mail&quot; variant=&quot;tonal&quot; />
  </MBadge>
  <MBadge :count=&quot;128&quot; :max=&quot;99&quot;>
    <MIconButton icon=&quot;notifications&quot; label=&quot;Notifications&quot; variant=&quot;tonal&quot; />
  </MBadge>
  <MBadge dot>
    <MIconButton icon=&quot;chat&quot; label=&quot;Chat&quot; variant=&quot;tonal&quot; />
  </MBadge>
</template>`"
    >
      <MBadge :count="5">
        <MIconButton icon="mail" label="Mail" variant="tonal" />
      </MBadge>
      <MBadge :count="128" :max="99">
        <MIconButton icon="notifications" label="Notifications" variant="tonal" />
      </MBadge>
      <MBadge dot>
        <MIconButton icon="chat" label="Chat" variant="tonal" />
      </MBadge>
      <MBadge :count="3" color="primary">
        <MIconButton icon="inbox" label="Inbox" variant="tonal" />
      </MBadge>
      <MBadge :count="7" color="tertiary">
        <MIconButton icon="favorite" label="Favorites" variant="tonal" />
      </MBadge>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="badgeProps" />

    <!-- ── MAvatar ──────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MAvatar</h2>

    <ComponentDemo
      title="Avatars"
      description="Initials extracted from the name prop. Supports different sizes."
      :code="`<template>
  <MAvatar name=&quot;Alice Brown&quot; />
  <MAvatar name=&quot;Carlos Diaz&quot; :size=&quot;48&quot; />
  <MAvatar name=&quot;Eva&quot; :size=&quot;56&quot; />
  <MAvatar name=&quot;Gabriel Hernandez&quot; :size=&quot;64&quot; />
</template>`"
    >
      <MAvatar name="Alice Brown" />
      <MAvatar name="Carlos Diaz" :size="48" />
      <MAvatar name="Eva" :size="56" />
      <MAvatar name="Gabriel Hernandez" :size="64" />
    </ComponentDemo>

    <ComponentDemo
      title="Avatar Stack"
      description="Overlap avatars with negative spacing for group displays."
      :code="`<template>
  <div class=&quot;flex -space-x-3&quot;>
    <MAvatar name=&quot;Alice Brown&quot; :size=&quot;44&quot; />
    <MAvatar name=&quot;Carlos Diaz&quot; :size=&quot;44&quot; />
    <MAvatar name=&quot;Eva Flores&quot; :size=&quot;44&quot; />
    <span class=&quot;...&quot;>+5</span>
  </div>
</template>`"
    >
      <div class="flex -space-x-3">
        <MAvatar name="Alice Brown" :size="44" />
        <MAvatar name="Carlos Diaz" :size="44" />
        <MAvatar name="Eva Flores" :size="44" />
        <MAvatar name="Gabriel H" :size="44" />
        <span class="flex h-11 w-11 items-center justify-center rounded-full border-2 border-surface bg-surface-container-high text-label-medium text-on-surface-variant">
          +5
        </span>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="avatarProps" />

    <!-- ── MIcon ────────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MIcon</h2>

    <ComponentDemo
      title="Icons"
      description="Renders Material Symbols Outlined. Browse all icons at fonts.google.com/icons."
      :code="`<template>
  <MIcon name=&quot;home&quot; />
  <MIcon name=&quot;favorite&quot; :size=&quot;32&quot; class=&quot;text-error&quot; />
  <MIcon name=&quot;settings&quot; :size=&quot;32&quot; class=&quot;text-primary&quot; />
  <MIcon name=&quot;palette&quot; :size=&quot;32&quot; class=&quot;text-tertiary&quot; />
</template>`"
    >
      <MIcon name="home" :size="32" />
      <MIcon name="favorite" :size="32" class="text-error" />
      <MIcon name="settings" :size="32" class="text-primary" />
      <MIcon name="palette" :size="32" class="text-tertiary" />
      <MIcon name="notifications" :size="32" class="text-secondary" />
      <MIcon name="code" :size="32" class="text-on-surface-variant" />
      <MIcon name="widgets" :size="32" />
      <MIcon name="rocket_launch" :size="32" class="text-primary" />
    </ComponentDemo>

    <ComponentDemo
      title="Sizes"
      description="Scale icons to any pixel size."
      :code="`<template>
  <MIcon name=&quot;star&quot; :size=&quot;16&quot; />
  <MIcon name=&quot;star&quot; :size=&quot;24&quot; />
  <MIcon name=&quot;star&quot; :size=&quot;32&quot; />
  <MIcon name=&quot;star&quot; :size=&quot;48&quot; />
</template>`"
    >
      <div class="flex items-end gap-4">
        <div class="flex flex-col items-center gap-1">
          <MIcon name="star" :size="16" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">16</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <MIcon name="star" :size="24" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">24</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <MIcon name="star" :size="32" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">32</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <MIcon name="star" :size="48" class="text-primary" />
          <span class="text-label-small text-on-surface-variant">48</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="iconProps" />

    <!-- ── MDivider ─────────────────────────────────────────────────────── -->
    <h2 class="mb-4 mt-14 text-headline-small font-medium">MDivider</h2>

    <ComponentDemo
      title="Divider"
      description="Horizontal and vertical dividers with optional labels."
      :code="`<template>
  <MDivider />
  <MDivider label=&quot;OR&quot; />
  <MDivider :inset=&quot;true&quot; />
  <div class=&quot;flex h-10 items-center gap-4&quot;>
    <span>Left</span>
    <MDivider :vertical=&quot;true&quot; />
    <span>Right</span>
  </div>
</template>`"
    >
      <div class="w-full space-y-6">
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Default</p>
          <MDivider />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">With label</p>
          <MDivider label="OR" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Inset</p>
          <MDivider :inset="true" />
        </div>
        <div>
          <p class="mb-2 text-label-medium text-on-surface-variant">Vertical</p>
          <div class="flex h-10 items-center gap-4">
            <span class="text-body-medium">Left</span>
            <MDivider :vertical="true" />
            <span class="text-body-medium">Center</span>
            <MDivider :vertical="true" />
            <span class="text-body-medium">Right</span>
          </div>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="dividerProps" />
  </div>
</template>
