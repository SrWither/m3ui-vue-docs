<script setup lang="ts">
import { MSpacer, MFlex, MText, MIconButton, MCard } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import ComponentPager from '@/components/ComponentPager.vue'
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MSpacer</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Pushes flex siblings apart — renders a simple <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">flex: 1</code> div. Use it inside MFlex/MStack (or any flex container) to push a group of items to the far edge.
    </p>

    <ComponentDemo
      title="Spacer"
      description="Pushes items apart in a flex container (flex: 1)."
      :code="`<template>
  <MFlex direction=&quot;row&quot; align=&quot;center&quot; gap=&quot;sm&quot;>
    <MText variant=&quot;title-medium&quot;>App Title</MText>
    <MSpacer />
    <MIconButton icon=&quot;search&quot; />
    <MIconButton icon=&quot;more_vert&quot; />
  </MFlex>
</template>`"
    >
      <div class="w-full rounded-lg bg-surface-container p-3">
        <MFlex direction="row" align="center" gap="sm">
          <MText variant="title-medium">App Title</MText>
          <MSpacer />
          <MIconButton icon="search" label="Search" />
          <MIconButton icon="more_vert" label="More options" />
        </MFlex>
      </div>
    </ComponentDemo>

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">No Props</p>
      <p class="text-body-medium text-on-surface-variant">MSpacer renders a simple flex-1 div with no configurable props.</p>
    </MCard>

    <ComponentPager current="MSpacer" />
  </div>
</template>
