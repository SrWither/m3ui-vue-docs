<script setup lang="ts">
import { ref, computed } from 'vue'
import { MCard, MTabs } from '@m3ui-vue/m3ui-vue'
import { MCodeEditor } from '@m3ui-vue/m3ui-vue/code-editor'

const props = defineProps<{
  title: string
  description?: string
  code: string
  script?: string
  flush?: boolean
}>()

const activeTab = ref<string | number>('preview')

const tabs = computed(() => {
  const t = [
    { value: 'preview', label: 'Preview', icon: 'visibility' },
    { value: 'template', label: 'Template', icon: 'code' },
  ]
  if (props.script) {
    t.push({ value: 'script', label: 'Script', icon: 'data_object' })
  }
  return t
})
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

    <div v-show="activeTab === 'preview'" :class="flush ? 'flex flex-col' : 'flex flex-wrap items-center gap-4 p-6'">
      <slot />
    </div>

    <div v-show="activeTab === 'template'" class="p-4">
      <MCodeEditor
        :model-value="code"
        language="vue"
        :readonly="true"
        :line-numbers="false"
        min-height="60px"
        max-height="400px"
      />
    </div>

    <div v-if="script" v-show="activeTab === 'script'" class="p-4">
      <MCodeEditor
        :model-value="script"
        language="typescript"
        :readonly="true"
        :line-numbers="false"
        min-height="60px"
        max-height="400px"
      />
    </div>
  </MCard>
</template>
