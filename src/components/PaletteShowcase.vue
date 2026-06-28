<script setup lang="ts">
import { ref } from 'vue'
import {
  MButton, MIconButton, MCard, MChip, MAlert, MProgressBar,
  MSwitch, MCheckbox, MTextField, MBadge, MIcon, MFab,
  MSlider, MRating, MSelect, MTabs, MStatCard, MAvatar,
} from '@m3ui-vue/m3ui-vue'

const switchVal  = ref(true)
const checkVal   = ref(true)
const textVal    = ref('')
const progress   = ref(65)
const sliderVal  = ref(40)
const ratingVal  = ref(3)
const selectVal  = ref('')
const activeTab  = ref('design')

const selectOptions = [
  { label: 'Design system', value: 'design' },
  { label: 'Color tokens', value: 'tokens' },
  { label: 'Typography', value: 'type' },
  { label: 'Spacing', value: 'space' },
]

const tabs = [
  { value: 'design', label: 'Design',     icon: 'palette' },
  { value: 'tokens', label: 'Tokens',     icon: 'token' },
  { value: 'type',   label: 'Typography', icon: 'text_fields' },
]

const colorRoles = [
  { label: 'Primary',   color: 'primary',   container: 'primary-container' },
  { label: 'Secondary', color: 'secondary', container: 'secondary-container' },
  { label: 'Tertiary',  color: 'tertiary',  container: 'tertiary-container' },
  { label: 'Error',     color: 'error',     container: 'error-container' },
]

const surfaces = [
  { token: 'surface-container-lowest', label: 'Lowest' },
  { token: 'surface-container-low',    label: 'Low' },
  { token: 'surface-container',        label: 'Default' },
  { token: 'surface-container-high',   label: 'High' },
  { token: 'surface-container-highest',label: 'Highest' },
  { token: 'surface-dim',              label: 'Dim' },
  { token: 'surface-bright',           label: 'Bright' },
  { token: 'surface-variant',          label: 'Variant' },
]
</script>

<template>
  <div class="space-y-5">

    <!-- ── Color Roles ──────────────────────────────────────────────────────── -->
    <MCard class="p-5">
      <p class="mb-4 text-label-large font-medium text-on-surface-variant">Color Roles</p>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div v-for="role in colorRoles" :key="role.label" class="overflow-hidden rounded-xl">
          <div
            class="flex flex-col px-4 py-3"
            :style="{ background: `var(--color-${role.color})`, color: `var(--color-on-${role.color})` }"
          >
            <span class="text-label-medium font-medium">{{ role.label }}</span>
            <span class="text-label-small opacity-80">on-{{ role.color }}</span>
          </div>
          <div
            class="flex flex-col px-4 py-3"
            :style="{ background: `var(--color-${role.container})`, color: `var(--color-on-${role.container})` }"
          >
            <span class="text-label-medium font-medium">Container</span>
            <span class="text-label-small opacity-80">on-container</span>
          </div>
        </div>
      </div>
    </MCard>

    <!-- ── Surface Hierarchy ────────────────────────────────────────────────── -->
    <MCard class="p-5">
      <p class="mb-4 text-label-large font-medium text-on-surface-variant">Surface Hierarchy</p>
      <div class="grid grid-cols-4 gap-2 sm:grid-cols-8">
        <div
          v-for="s in surfaces"
          :key="s.token"
          class="flex flex-col items-center gap-1.5 rounded-xl border border-outline-variant/30 py-3"
          :style="{ background: `var(--color-${s.token})` }"
        >
          <div class="h-5 w-5 rounded-full border border-outline-variant/40" :style="{ background: `var(--color-${s.token})` }" />
          <span class="text-center text-label-small text-on-surface-variant" style="font-size: 10px; line-height: 1.3">{{ s.label }}</span>
        </div>
      </div>
      <p class="mt-3 text-label-small text-on-surface-variant">
        Outline colors: <span class="ml-2 inline-flex items-center gap-1.5">
          <span class="inline-block h-3 w-3 rounded-full border border-outline" :style="{ background: 'var(--color-outline)' }" /> outline
        </span>
        <span class="ml-3 inline-flex items-center gap-1.5">
          <span class="inline-block h-3 w-3 rounded-full border border-outline-variant" :style="{ background: 'var(--color-outline-variant)' }" /> outline-variant
        </span>
      </p>
    </MCard>

    <!-- ── Stat Cards ────────────────────────────────────────────────────────── -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MStatCard title="Revenue"    value="$12,400" icon="attach_money"  :trend="8.2"  trend-label="vs last month" color="primary" />
      <MStatCard title="Users"      value="3,210"   icon="group"         :trend="4.5"  trend-label="vs last month" color="secondary" />
      <MStatCard title="Sessions"   value="18,900"  icon="bar_chart"     :trend="-2.1" trend-label="vs last month" color="tertiary" />
      <MStatCard title="Errors"     value="24"      icon="bug_report"    :trend="-12"  trend-label="vs last month" color="error" />
    </div>

    <!-- ── Buttons & Actions ─────────────────────────────────────────────────── -->
    <MCard class="p-5">
      <p class="mb-3 text-label-large font-medium text-on-surface-variant">Buttons & Actions</p>
      <div class="flex flex-wrap items-center gap-3">
        <MButton>Filled</MButton>
        <MButton variant="tonal">Tonal</MButton>
        <MButton variant="outlined">Outlined</MButton>
        <MButton variant="elevated">Elevated</MButton>
        <MButton variant="text">Text</MButton>
        <MButton color="error">Error</MButton>
        <MButton disabled>Disabled</MButton>
        <div class="mx-1 h-6 w-px bg-outline-variant" />
        <MIconButton icon="favorite" label="Like" />
        <MIconButton icon="share"    label="Share" variant="tonal" />
        <MIconButton icon="bookmark" label="Save"  variant="outlined" />
        <MFab icon="add"  size="small" />
        <MFab icon="edit" />
      </div>
    </MCard>

    <!-- ── Chips & Badges ────────────────────────────────────────────────────── -->
    <MCard class="p-5">
      <p class="mb-3 text-label-large font-medium text-on-surface-variant">Chips & Badges</p>
      <div class="flex flex-wrap items-center gap-3">
        <MChip tone="primary"   clickable>Primary</MChip>
        <MChip tone="secondary" clickable>Secondary</MChip>
        <MChip tone="tertiary"  clickable>Tertiary</MChip>
        <MChip tone="success"   clickable>Success</MChip>
        <MChip tone="error"     clickable>Error</MChip>
        <MChip icon="check" selected clickable>Selected</MChip>
        <MBadge content="5" color="primary">
          <MIconButton icon="mail" label="Mail" variant="tonal" />
        </MBadge>
        <MBadge content="9" color="error">
          <MIconButton icon="notifications" label="Notifications" variant="tonal" />
        </MBadge>
      </div>
    </MCard>

    <!-- ── Tabs ──────────────────────────────────────────────────────────────── -->
    <MCard class="overflow-hidden pt-4">
      <MTabs v-model="activeTab" :tabs="tabs" />
      <div class="p-5 text-body-medium text-on-surface-variant">
        Active tab: <strong class="text-on-surface">{{ activeTab }}</strong>
      </div>
    </MCard>

    <!-- ── Form Controls ──────────────────────────────────────────────────────── -->
    <MCard class="p-5">
      <p class="mb-4 text-label-large font-medium text-on-surface-variant">Form Controls</p>
      <div class="grid gap-5 sm:grid-cols-2">
        <div class="space-y-4">
          <MTextField v-model="textVal" label="Text field" placeholder="Type something..." />
          <MSelect v-model="selectVal" :options="selectOptions" label="Select" placeholder="Choose an option" />
        </div>
        <div class="space-y-4">
          <div>
            <p class="mb-2 text-label-small text-on-surface-variant">Slider · {{ sliderVal }}%</p>
            <MSlider v-model="sliderVal" :min="0" :max="100" show-tooltip />
          </div>
          <div>
            <p class="mb-2 text-label-small text-on-surface-variant">Rating</p>
            <MRating v-model="ratingVal" />
          </div>
          <div class="flex flex-wrap gap-4">
            <MSwitch   v-model="switchVal" label="Switch" />
            <MCheckbox v-model="checkVal"  label="Checkbox" />
          </div>
        </div>
      </div>
    </MCard>

    <!-- ── Progress ───────────────────────────────────────────────────────────── -->
    <MCard class="p-5">
      <p class="mb-4 text-label-large font-medium text-on-surface-variant">Progress · {{ progress }}%</p>
      <div class="space-y-3">
        <MProgressBar :value="progress" color="primary" />
        <MProgressBar :value="progress" color="secondary" />
        <MProgressBar :value="progress" color="tertiary" />
        <MProgressBar :value="progress" color="error" />
        <MProgressBar indeterminate color="primary" />
      </div>
    </MCard>

    <!-- ── Alerts ─────────────────────────────────────────────────────────────── -->
    <div class="grid gap-3 sm:grid-cols-2">
      <MAlert type="info"    title="Info">Something informational happened.</MAlert>
      <MAlert type="success" title="Success">Operation completed successfully.</MAlert>
      <MAlert type="warning" title="Warning">Double-check before continuing.</MAlert>
      <MAlert type="error"   title="Error">Something went wrong.</MAlert>
    </div>

    <!-- ── Card Variants ──────────────────────────────────────────────────────── -->
    <div class="grid gap-4 sm:grid-cols-3">
      <MCard variant="elevated" class="p-4">
        <div class="mb-3 flex items-center gap-3">
          <MAvatar name="EL" />
          <div>
            <p class="text-title-medium font-medium">Elevated</p>
            <p class="text-label-small text-on-surface-variant">Shadow depth</p>
          </div>
        </div>
        <p class="text-body-medium text-on-surface-variant">Card with elevation shadow and surface background.</p>
        <div class="mt-3"><MButton variant="text" class="-ml-2">Learn more</MButton></div>
      </MCard>
      <MCard variant="filled" class="p-4">
        <div class="mb-3 flex items-center gap-3">
          <MAvatar name="FI" />
          <div>
            <p class="text-title-medium font-medium">Filled</p>
            <p class="text-label-small text-on-surface-variant">Container surface</p>
          </div>
        </div>
        <p class="text-body-medium text-on-surface-variant">Card with filled container using surface-container token.</p>
        <div class="mt-3"><MButton variant="text" class="-ml-2">Learn more</MButton></div>
      </MCard>
      <MCard variant="outlined" class="p-4">
        <div class="mb-3 flex items-center gap-3">
          <MAvatar name="OU" />
          <div>
            <p class="text-title-medium font-medium">Outlined</p>
            <p class="text-label-small text-on-surface-variant">outline-variant border</p>
          </div>
        </div>
        <p class="text-body-medium text-on-surface-variant">Card with outline-variant border, no shadow.</p>
        <div class="mt-3"><MButton variant="text" class="-ml-2">Learn more</MButton></div>
      </MCard>
    </div>

  </div>
</template>
