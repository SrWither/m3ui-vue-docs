<script setup lang="ts">
import { MCard, MIcon } from '@m3ui-vue/m3ui-vue'
import { iconMap } from '@/nav/sections'

const components = [
  { name: 'MCodeEditor', description: 'A syntax-highlighted code editor built on CodeMirror 6.' },
  { name: 'MJsonEditor', description: 'A JSON-aware editor with live validation and format/minify shortcuts.' },
  { name: 'MJsonViewer', description: 'A read-only, expandable tree view for inspecting JSON data.' },
  { name: 'MMarkdown', description: 'Renders markdown source as styled HTML, with syntax-highlighted code blocks.' },
  { name: 'MTerminal', description: 'A terminal emulator built on xterm.js, static or fully interactive.' },
  { name: 'MRichTextEditor', description: 'A WYSIWYG editor built on tiptap with a formatting toolbar.' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">Editors &amp; Viewers</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Components for editing and displaying code, JSON, markdown, and terminal output.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="c in components"
        :key="c.name"
        :to="`/components/editors/${c.name.toLowerCase()}`"
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
