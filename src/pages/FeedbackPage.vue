<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MAlert', description: 'An inline banner for contextual status messages — info, success, warning, or error.' },
  { name: 'useToast', description: 'Programmatic, imperative toast messages — no component to mount.' },
  { name: 'useNotification', description: 'Programmatic notifications with squared corners, actions, and positioning.' },
  { name: 'MDialog', description: 'The generic M3 modal shell — centered card or full-screen, icon slot, scroll divider.' },
  { name: 'MConfirmDialog', description: 'A pre-built confirmation dialog with loading state and danger mode.' },
  { name: 'MTooltip', description: 'A hover/focus-triggered label — plain text, or a rich variant with actions.' },
  { name: 'MProgressBar', description: 'A linear progress indicator — determinate, indeterminate, or wavy.' },
  { name: 'MPageProgress', description: 'A thin route/page-level loading bar, auto-wired to vue-router.' },
  { name: 'MCircleProgressBar', description: 'A circular progress indicator — smooth arc or the wavy Expressive ring.' },
  { name: 'MSpinner', description: 'A small circular loading spinner, standard or wavy.' },
  { name: 'MLoadingIndicator', description: 'The M3 Expressive shape-morphing loading indicator.' },
  { name: 'MPullToRefresh', description: 'Wraps a scrollable container and fires a refresh event on pull.' },
  { name: 'MExpansionPanel', description: 'A collapsible section with a smooth height animation.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Feedback</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for communicating status, progress, and confirmations to the user.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/feedback/${c.name.toLowerCase()}`"
        class="no-underline"
      >
        <MCard clickable class="flex h-full flex-col gap-2 p-4">
          <div class="flex items-center gap-2">
            <MIcon :name="iconMap[c.name] ?? 'code'" :size="22" class="text-primary" />
            <span class="text-title-medium font-medium">{{ c.name }}</span>
          </div>
          <p class="text-body-small text-on-surface-variant">{{ c.description }}</p>
        </MCard>
      </router-link>
    </div>
  </div>
</template>
