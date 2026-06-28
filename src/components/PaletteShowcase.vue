<script setup lang="ts">
import { ref } from 'vue'
import {
  MButton, MCard, MChip, MAlert, MProgressBar,
  MSwitch, MCheckbox, MTextField, MBadge, MIcon, MFab,
} from '@m3ui-vue/m3ui-vue'

const switchVal   = ref(true)
const checkVal    = ref(true)
const textVal     = ref('')
const progress    = ref(65)
</script>

<template>
  <div class="space-y-5">
    <!-- Buttons -->
    <MCard class="p-5">
      <p class="mb-3 text-label-large font-medium text-on-surface-variant">Buttons</p>
      <div class="flex flex-wrap gap-3">
        <MButton>Filled</MButton>
        <MButton variant="tonal">Tonal</MButton>
        <MButton variant="outlined">Outlined</MButton>
        <MButton variant="elevated">Elevated</MButton>
        <MButton variant="text">Text</MButton>
        <MButton color="error">Error</MButton>
        <MButton disabled>Disabled</MButton>
      </div>
    </MCard>

    <!-- Chips + Badge + FAB -->
    <MCard class="p-5">
      <p class="mb-3 text-label-large font-medium text-on-surface-variant">Chips · Badge · FAB</p>
      <div class="flex flex-wrap items-center gap-3">
        <MChip tone="primary" clickable>Primary</MChip>
        <MChip tone="secondary" clickable>Secondary</MChip>
        <MChip tone="tertiary" clickable>Tertiary</MChip>
        <MChip tone="success" clickable>Success</MChip>
        <MChip tone="error" clickable>Error</MChip>
        <MChip icon="check" selected clickable>Selected</MChip>
        <MBadge content="9" color="error">
          <MButton variant="tonal">
            <MIcon name="notifications" :size="20" />
          </MButton>
        </MBadge>
        <MFab icon="add" size="small" />
      </div>
    </MCard>

    <!-- Alerts -->
    <div class="grid gap-3 sm:grid-cols-2">
      <MAlert type="info" title="Info">Something informational happened.</MAlert>
      <MAlert type="success" title="Success">Operation completed successfully.</MAlert>
      <MAlert type="warning" title="Warning">Double-check before continuing.</MAlert>
      <MAlert type="error" title="Error">Something went wrong.</MAlert>
    </div>

    <!-- Form elements -->
    <MCard class="p-5">
      <p class="mb-4 text-label-large font-medium text-on-surface-variant">Inputs</p>
      <div class="flex flex-wrap items-start gap-6">
        <div class="flex-1" style="min-width: 200px">
          <MTextField v-model="textVal" label="Text field" placeholder="Type something..." />
        </div>
        <div class="flex flex-col gap-3">
          <MSwitch v-model="switchVal" label="Switch" />
          <MCheckbox v-model="checkVal" label="Checkbox" />
        </div>
      </div>
    </MCard>

    <!-- Progress -->
    <MCard class="p-5">
      <p class="mb-4 text-label-large font-medium text-on-surface-variant">Progress</p>
      <div class="space-y-4">
        <MProgressBar :value="progress" color="primary" />
        <MProgressBar :value="progress" color="secondary" />
        <MProgressBar :value="progress" color="tertiary" />
        <MProgressBar indeterminate color="primary" />
      </div>
    </MCard>

    <!-- Card variants -->
    <div class="grid gap-4 sm:grid-cols-3">
      <MCard variant="elevated" class="p-4">
        <p class="text-title-medium font-medium">Elevated</p>
        <p class="mt-1 text-body-medium text-on-surface-variant">Card with elevation shadow.</p>
        <div class="mt-3">
          <MButton variant="text" class="-ml-2">Learn more</MButton>
        </div>
      </MCard>
      <MCard variant="filled" class="p-4">
        <p class="text-title-medium font-medium">Filled</p>
        <p class="mt-1 text-body-medium text-on-surface-variant">Card with filled container.</p>
        <div class="mt-3">
          <MButton variant="text" class="-ml-2">Learn more</MButton>
        </div>
      </MCard>
      <MCard variant="outlined" class="p-4">
        <p class="text-title-medium font-medium">Outlined</p>
        <p class="mt-1 text-body-medium text-on-surface-variant">Card with outlined border.</p>
        <div class="mt-3">
          <MButton variant="text" class="-ml-2">Learn more</MButton>
        </div>
      </MCard>
    </div>
  </div>
</template>
