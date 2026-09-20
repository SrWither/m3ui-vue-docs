<script setup lang="ts">
import { MCard } from '@m3ui-vue/m3ui-vue'
import ComponentPager from '@/components/ComponentPager.vue'
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MRelative</h1>
    <p class="mb-6 text-body-large text-on-surface-variant">
      Wrapper that sets <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">position: relative</code> on a container.
      Use it as the positioning parent for MAbsolute children.
    </p>

    <MCard class="mb-8 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">No Props</p>
      <p class="text-body-medium text-on-surface-variant">
        MRelative has no props — it renders <code class="rounded bg-surface-container px-1.5 py-0.5 text-body-small">&lt;div class="relative"&gt;&lt;slot /&gt;&lt;/div&gt;</code>, simply creating a relative positioning context. See the MAbsolute page for a full example combining the two.
      </p>
    </MCard>

    <ComponentPager current="MRelative" />
  </div>
</template>
