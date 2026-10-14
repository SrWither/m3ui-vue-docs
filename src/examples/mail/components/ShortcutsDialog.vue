<script setup lang="ts">
import { MDialog, MKbd } from '@m3ui-vue/m3ui-vue'

const open = defineModel<boolean>({ required: true })
const groups = [
  { title: 'Navigation', keys: [[['j'], 'Older conversation'], [['k'], 'Newer conversation'], [['Enter'], 'Open conversation'], [['u'], 'Back to the list'], [['/'], 'Search']] },
  { title: 'Actions', keys: [[['c'], 'Compose'], [['r'], 'Reply'], [['a'], 'Reply all'], [['f'], 'Forward'], [['e'], 'Archive'], [['#'], 'Delete'], [['s'], 'Star'], [['x'], 'Select conversation'], [['Shift', 'u'], 'Mark as unread']] },
  { title: 'Writing', keys: [[['Ctrl', 'Enter'], 'Send'], [['Esc'], 'Save & close']] },
] as const
</script>

<template>
  <MDialog v-model="open" title="Keyboard shortcuts" max-width="max-w-2xl">
    <div class="grid gap-6 sm:grid-cols-2">
      <section v-for="g in groups" :key="g.title">
        <h3 class="mb-2 text-title-small text-on-surface">{{ g.title }}</h3>
        <dl class="flex flex-col gap-2">
          <div v-for="[keys, what] in g.keys" :key="what" class="flex items-center justify-between gap-4">
            <dt class="text-body-medium text-on-surface-variant">{{ what }}</dt>
            <dd><MKbd :keys="[...keys]" size="sm" /></dd>
          </div>
        </dl>
      </section>
    </div>
  </MDialog>
</template>
