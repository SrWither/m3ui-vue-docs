<script setup lang="ts">
import { ref } from 'vue'
import {
  MButton, MCard, MIcon, MTextField, MSwitch, MChip, MFab,
  MIconButton, MBadge, MAvatar, MSelect, MProgressBar, MSpinner,
  MAlert, MTooltip, MSlider, MRating, MExpansionPanel, useToast,
} from '@m3ui-vue/m3ui-vue'

const toast = useToast()

const email = ref('')
const notifications = ref(true)
const selectVal = ref<string | number | null>(null)
const sliderVal = ref(60)
const ratingVal = ref(4)
const panelOpen = ref(true)
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Hero -->
    <div class="mb-14 text-center">
      <div class="mb-5 flex items-center justify-center">
        <span class="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-container">
          <MIcon name="widgets" :size="44" class="text-on-primary-container" />
        </span>
      </div>
      <h1 class="text-display-small font-medium text-on-surface">M3UI Vue</h1>
      <p class="mx-auto mt-4 max-w-2xl text-body-large text-on-surface-variant">
        70+ Material Design 3 components for Vue 3 + Tailwind CSS v4.
        Ship beautiful, accessible interfaces with 20 built-in color palettes,
        dark mode, and full TypeScript support.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <router-link to="/getting-started/setup">
          <MButton icon="rocket_launch">Get Started</MButton>
        </router-link>
        <router-link to="/components/buttons">
          <MButton variant="tonal" icon="smart_button">Components</MButton>
        </router-link>
        <a href="https://github.com/SrWither/m3ui-vue" target="_blank">
          <MButton variant="outlined" icon="open_in_new">GitHub</MButton>
        </a>
      </div>
    </div>

    <!-- Feature cards -->
    <div class="mb-14 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MCard class="p-5 text-center">
        <MIcon name="palette" :size="32" class="mb-3 text-primary" />
        <h3 class="text-title-small font-medium">20 Palettes</h3>
        <p class="mt-1 text-body-small text-on-surface-variant">
          Runtime color themes with light &amp; dark variants
        </p>
      </MCard>
      <MCard class="p-5 text-center">
        <MIcon name="widgets" :size="32" class="mb-3 text-primary" />
        <h3 class="text-title-small font-medium">70+ Components</h3>
        <p class="mt-1 text-body-small text-on-surface-variant">
          Buttons, inputs, tables, dialogs, editors, and more
        </p>
      </MCard>
      <MCard class="p-5 text-center">
        <MIcon name="code" :size="32" class="mb-3 text-primary" />
        <h3 class="text-title-small font-medium">TypeScript</h3>
        <p class="mt-1 text-body-small text-on-surface-variant">
          Full types with auto-complete in your editor
        </p>
      </MCard>
      <MCard class="p-5 text-center">
        <MIcon name="bolt" :size="32" class="mb-3 text-primary" />
        <h3 class="text-title-small font-medium">Tree-shakeable</h3>
        <p class="mt-1 text-body-small text-on-surface-variant">
          Import only what you use, zero runtime overhead
        </p>
      </MCard>
    </div>

    <!-- Showcase -->
    <h2 class="mb-6 w-full text-headline-small font-medium">Component Showcase</h2>

    <div class="grid w-full gap-6 md:grid-cols-2">
      <!-- Buttons -->
      <MCard class="p-6">
        <h3 class="mb-4 text-title-medium font-medium">Buttons</h3>
        <div class="flex flex-wrap gap-3">
          <MButton variant="filled">Filled</MButton>
          <MButton variant="tonal">Tonal</MButton>
          <MButton variant="outlined">Outlined</MButton>
          <MButton variant="elevated">Elevated</MButton>
          <MButton variant="text">Text</MButton>
        </div>
        <div class="mt-4 flex items-center gap-3">
          <MIconButton icon="favorite" label="Favorite" variant="filled" />
          <MIconButton icon="share" label="Share" variant="tonal" />
          <MIconButton icon="bookmark" label="Bookmark" variant="outlined" />
          <MFab icon="add" size="small" />
        </div>
      </MCard>

      <!-- Inputs -->
      <MCard class="p-6">
        <h3 class="mb-4 text-title-medium font-medium">Inputs</h3>
        <MTextField v-model="email" label="Email address" leading-icon="mail" />
        <div class="mt-3">
          <MSelect
            v-model="selectVal"
            :options="[
              { label: 'Vue 3', value: 'vue' },
              { label: 'React', value: 'react' },
              { label: 'Svelte', value: 'svelte' },
            ]"
            label="Framework"
            variant="outlined"
          />
        </div>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-body-medium">Notifications</span>
          <MSwitch v-model="notifications" />
        </div>
      </MCard>

      <!-- Chips & Badges -->
      <MCard class="p-6">
        <h3 class="mb-4 text-title-medium font-medium">Chips &amp; Badges</h3>
        <div class="flex flex-wrap items-center gap-3">
          <MChip icon="code">Vue 3</MChip>
          <MChip tone="primary">Tailwind</MChip>
          <MChip tone="tertiary">TypeScript</MChip>
          <MChip tone="secondary" :clickable="true">Clickable</MChip>
        </div>
        <div class="mt-4 flex items-center gap-4">
          <MBadge :count="5">
            <MIconButton icon="notifications" label="Notifications" variant="tonal" />
          </MBadge>
          <MBadge :count="128" :max="99">
            <MIconButton icon="mail" label="Mail" variant="tonal" />
          </MBadge>
          <MBadge dot>
            <MIconButton icon="chat" label="Chat" variant="tonal" />
          </MBadge>
        </div>
      </MCard>

      <!-- Feedback -->
      <MCard class="p-6">
        <h3 class="mb-4 text-title-medium font-medium">Feedback</h3>
        <MAlert type="success" title="All set!">Your changes have been saved.</MAlert>
        <div class="mt-4 flex flex-wrap gap-3">
          <MButton variant="tonal" icon="check_circle" @click="toast.success('Operation completed')">Toast</MButton>
          <MButton variant="tonal" icon="error" color="error" @click="toast.error('Something went wrong')">Error</MButton>
        </div>
        <div class="mt-4 flex items-center gap-4">
          <MTooltip text="I'm a tooltip!">
            <MIconButton icon="info" label="Info" variant="outlined" />
          </MTooltip>
          <MSpinner :size="24" />
          <MSpinner :size="24" wavy />
        </div>
      </MCard>

      <!-- Sliders & Rating -->
      <MCard class="p-6">
        <h3 class="mb-4 text-title-medium font-medium">Sliders &amp; Rating</h3>
        <MSlider v-model="sliderVal" label="Volume" :show-value="true" />
        <div class="mt-4 flex items-center gap-4">
          <MRating v-model="ratingVal" :half-increments="true" />
          <span class="text-body-medium text-on-surface-variant">{{ ratingVal }}</span>
        </div>
      </MCard>

      <!-- Progress -->
      <MCard class="p-6">
        <h3 class="mb-4 text-title-medium font-medium">Progress</h3>
        <MProgressBar :value="65" label="Uploading..." class="mb-4" />
        <MProgressBar :indeterminate="true" color="tertiary" class="mb-4" />
        <MProgressBar :value="80" variant="wavy" color="secondary" />
      </MCard>

      <!-- Avatars -->
      <MCard class="p-6">
        <h3 class="mb-4 text-title-medium font-medium">Avatars</h3>
        <div class="flex items-center -space-x-2">
          <MAvatar name="Alice Brown" :size="44" />
          <MAvatar name="Carlos Diaz" :size="44" />
          <MAvatar name="Eva Flores" :size="44" />
          <MAvatar name="Gabriel" :size="44" />
          <span class="flex h-11 w-11 items-center justify-center rounded-full border-2 border-surface bg-surface-container-high text-label-medium text-on-surface-variant">
            +12
          </span>
        </div>
      </MCard>

      <!-- Expansion Panel -->
      <MCard class="p-6">
        <h3 class="mb-4 text-title-medium font-medium">Expansion Panel</h3>
        <div class="space-y-2">
          <MExpansionPanel v-model="panelOpen" title="What is M3UI?" icon="help">
            A Material Design 3 component library for Vue 3 and Tailwind CSS v4.
          </MExpansionPanel>
          <MExpansionPanel title="Is it free?" icon="payments">
            Yes! M3UI is MIT licensed and free to use in any project.
          </MExpansionPanel>
        </div>
      </MCard>
    </div>

    <!-- CTA -->
    <MCard class="mt-14 w-full p-8 text-center" variant="filled">
      <MIcon name="rocket_launch" :size="40" class="mb-4 text-primary" />
      <h2 class="text-headline-small font-medium">Ready to build?</h2>
      <p class="mx-auto mt-2 max-w-lg text-body-medium text-on-surface-variant">
        Follow the setup guide to install M3UI Vue in your project and start using components in minutes.
      </p>
      <div class="mt-6 flex justify-center gap-3">
        <router-link to="/getting-started/setup">
          <MButton icon="build">Setup Guide</MButton>
        </router-link>
        <router-link to="/styles/palettes">
          <MButton variant="tonal" icon="palette">Browse Palettes</MButton>
        </router-link>
      </div>
    </MCard>
  </div>
</template>
