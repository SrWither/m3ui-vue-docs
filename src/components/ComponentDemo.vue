<script setup lang="ts">
import { ref } from 'vue'
import { MCard, MTabs } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

defineProps<{
  title: string
  description?: string
  code: string
}>()

const activeTab = ref<string | number>('preview')

const tabs = [
  { value: 'preview', label: 'Preview', icon: 'visibility' },
  { value: 'code', label: 'Code', icon: 'code' },
]
</script>

<template>
  <MCard class="mb-6">
    <div class="px-6 pt-5 pb-3">
      <h3 class="text-title-medium font-medium">{{ title }}</h3>
      <p v-if="description" class="mt-1 text-body-medium text-on-surface-variant">
        {{ description }}
      </p>
    </div>

    <div class="px-6">
      <MTabs v-model="activeTab" :tabs="tabs" variant="secondary" />
    </div>

    <div v-show="activeTab === 'preview'" class="flex flex-wrap items-center gap-4 p-6">
      <slot />
    </div>

    <div v-show="activeTab === 'code'" class="p-4">
      <MCodeEditor
        :model-value="code"
        language="vue"
        :readonly="true"
        :line-numbers="false"
        min-height="60px"
        max-height="400px"
      />
    </div>
  </MCard>
</template>
