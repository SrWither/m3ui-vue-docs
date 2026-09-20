<script setup lang="ts">
import { MResponsive, MBox } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const responsiveProps: PropDef[] = [
  { name: 'show', type: "'sm-up' | 'md-up' | 'lg-up' | 'xl-up' | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down'", description: 'Show content only at this breakpoint range' },
  { name: 'hide', type: "'sm-up' | 'md-up' | 'lg-up' | 'xl-up' | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down'", description: 'Hide content at this breakpoint range' },
  { name: 'tag', type: 'string', default: "'div'", description: 'HTML tag to render' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MResponsive</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Shows or hides content at specific breakpoints using pure CSS (Tailwind's <code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">hidden</code>/<code class="rounded bg-surface-container-high px-1.5 py-0.5 text-primary">block</code> utilities) — no JS resize listener.
    </p>

    <ComponentDemo
      title="Responsive Visibility"
      description="Show or hide elements at different breakpoints."
      :code="`<template>
  <MResponsive show=&quot;md-up&quot;>
    Visible on md screens and above
  </MResponsive>
  <MResponsive hide=&quot;lg-up&quot;>
    Hidden on lg screens and above
  </MResponsive>
</template>`"
    >
      <div class="w-full space-y-3">
        <MResponsive show="sm-up">
          <MBox surface="primary-container" padding="sm" rounded="md" class="text-body-small">
            Visible on sm and up (hidden on xs)
          </MBox>
        </MResponsive>
        <MResponsive show="md-up">
          <MBox surface="secondary-container" padding="sm" rounded="md" class="text-body-small">
            Visible on md and up
          </MBox>
        </MResponsive>
        <MResponsive show="lg-up">
          <MBox surface="tertiary-container" padding="sm" rounded="md" class="text-body-small">
            Visible on lg and up
          </MBox>
        </MResponsive>
        <MResponsive hide="md-up">
          <MBox surface="container-high" padding="sm" rounded="md" class="text-body-small">
            Hidden on md and up (mobile only)
          </MBox>
        </MResponsive>
        <MBox surface="container" padding="sm" rounded="md" class="text-body-small text-on-surface-variant">
          Resize the browser to see elements appear and disappear at different breakpoints.
        </MBox>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="responsiveProps" />

    <ComponentPager current="MResponsive" />
  </div>
</template>
