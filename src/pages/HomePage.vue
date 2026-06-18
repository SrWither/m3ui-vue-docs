<script setup lang="ts">
import { ref } from 'vue'
import {
  MButton,
  MCard,
  MIcon,
  MTextField,
  MSwitch,
  MChip,
  MFab,
  MIconButton,
  MBadge,
  MAvatar,
} from '@m3ui-vue/m3ui-vue'

const email = ref('')
const notifications = ref(true)
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Hero -->
    <div class="mb-12 text-center">
      <div class="mb-4 flex items-center justify-center gap-3">
        <MIcon name="widgets" :size="48" class="text-primary" />
      </div>
      <h1 class="text-display-small font-medium text-on-surface">M3UI Vue</h1>
      <p class="mx-auto mt-3 max-w-xl text-body-large text-on-surface-variant">
        80+ Material Design 3 components for Vue 3 + Tailwind CSS v4.
        20 built-in color palettes, dark mode, and full TypeScript support.
      </p>
      <div class="mt-6 flex justify-center gap-3">
        <router-link to="/components/buttons">
          <MButton icon="smart_button">Get Started</MButton>
        </router-link>
        <a href="https://github.com/SrWither/m3ui-vue" target="_blank">
          <MButton variant="tonal" icon="open_in_new">GitHub</MButton>
        </a>
      </div>
    </div>

    <!-- Feature cards -->
    <div class="mb-12 grid w-full gap-4 sm:grid-cols-3">
      <MCard class="p-6 text-center">
        <MIcon name="palette" :size="36" class="mb-3 text-primary" />
        <h3 class="text-title-medium font-medium">20 Palettes</h3>
        <p class="mt-2 text-body-medium text-on-surface-variant">
          Switch color themes at runtime with light &amp; dark variants
        </p>
      </MCard>
      <MCard class="p-6 text-center">
        <MIcon name="widgets" :size="36" class="mb-3 text-primary" />
        <h3 class="text-title-medium font-medium">80+ Components</h3>
        <p class="mt-2 text-body-medium text-on-surface-variant">
          Buttons, inputs, tables, dialogs, editors, charts, and more
        </p>
      </MCard>
      <MCard class="p-6 text-center">
        <MIcon name="code" :size="36" class="mb-3 text-primary" />
        <h3 class="text-title-medium font-medium">TypeScript</h3>
        <p class="mt-2 text-body-medium text-on-surface-variant">
          Full type support with auto-complete in your editor
        </p>
      </MCard>
    </div>

    <!-- Live showcase -->
    <h2 class="mb-6 text-headline-small font-medium">Component Showcase</h2>

    <div class="grid w-full gap-6 md:grid-cols-2">
      <!-- Buttons showcase -->
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

      <!-- Inputs showcase -->
      <MCard class="p-6">
        <h3 class="mb-4 text-title-medium font-medium">Inputs</h3>
        <MTextField v-model="email" label="Email address" icon="mail" />
        <div class="mt-4 flex items-center justify-between">
          <span class="text-body-medium">Notifications</span>
          <MSwitch v-model="notifications" />
        </div>
      </MCard>

      <!-- Chips showcase -->
      <MCard class="p-6">
        <h3 class="mb-4 text-title-medium font-medium">Chips &amp; Badges</h3>
        <div class="flex flex-wrap items-center gap-3">
          <MChip icon="code">Vue 3</MChip>
          <MChip tone="primary">Tailwind</MChip>
          <MChip tone="tertiary">TypeScript</MChip>
          <MBadge :count="5">
            <MIconButton icon="notifications" label="Notifications" variant="tonal" />
          </MBadge>
        </div>
      </MCard>

      <!-- Avatars showcase -->
      <MCard class="p-6">
        <h3 class="mb-4 text-title-medium font-medium">Avatars</h3>
        <div class="flex items-center gap-3">
          <MAvatar name="Alice Brown" />
          <MAvatar name="Carlos Diaz" :size="48" />
          <MAvatar name="Eva Flores" :size="56" />
          <MAvatar name="Gabriel" />
        </div>
      </MCard>
    </div>
  </div>
</template>
