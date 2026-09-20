<script setup lang="ts">
import { MFooter, MText, MFlex, MIcon, MIconButton, MBox, MCenter, MStack, MGrid } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const footerProps: PropDef[] = [
  { name: 'bordered', type: 'boolean', default: 'false', description: 'Add a top border (border-outline-variant)' },
  { name: 'surface', type: "'default' | 'container' | 'container-low' | 'container-high' | 'inverse'", default: "'default'", description: 'Background surface color' },
]

const footerSlots: SlotDef[] = [
  { name: '#brand', description: 'Logo and tagline area (top)' },
  { name: '#default', description: 'Main content area (navigation columns, etc.)' },
  { name: '#social', description: 'Social media icon buttons (flex row with gap)' },
  { name: '#bottom', description: 'Bottom bar with copyright / legal links (separated by a top border)' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MFooter</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Page footer with slots for brand, content, social links, and a bottom bar. Responsive padding adapts to screen size.
    </p>

    <ComponentDemo
      title="Simple Footer"
      description="Minimal footer with just a bottom bar for copyright."
      :code="`<MFooter :bordered=&quot;true&quot; surface=&quot;container&quot;>
  <template #bottom>
    <MText variant=&quot;body-small&quot; color=&quot;on-surface-variant&quot;>
      &amp;copy; 2026 MyApp. All rights reserved.
    </MText>
  </template>
</MFooter>`"
    >
      <div class="w-full overflow-hidden rounded-xl border border-outline-variant">
        <MFooter :bordered="true" surface="container">
          <template #bottom>
            <MText variant="body-small" color="on-surface-variant">
              &copy; 2026 MyApp. All rights reserved.
            </MText>
          </template>
        </MFooter>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Full Footer"
      description="Complete footer with brand, navigation columns, social links, and a bottom bar."
      :code="`<MFooter :bordered=&quot;true&quot; surface=&quot;container-low&quot;>
  <template #brand>
    <MFlex align=&quot;center&quot; gap=&quot;sm&quot;>
      <MIcon name=&quot;widgets&quot; :size=&quot;28&quot; class=&quot;text-primary&quot; />
      <MText variant=&quot;title-large&quot; weight=&quot;medium&quot;>MyApp</MText>
    </MFlex>
    <MText variant=&quot;body-medium&quot; color=&quot;on-surface-variant&quot; class=&quot;mt-2 max-w-md&quot;>
      Building beautiful interfaces with Material Design 3.
    </MText>
  </template>

  <MGrid :cols=&quot;2&quot; :sm=&quot;3&quot; :lg=&quot;4&quot; gap=&quot;lg&quot;>
    &lt;!-- columns... --&gt;
  </MGrid>

  <template #social>
    <MIconButton icon=&quot;...&quot; label=&quot;...&quot; />
  </template>

  <template #bottom>
    <MFlex align=&quot;center&quot; justify=&quot;between&quot; gap=&quot;md&quot; wrap>
      &lt;!-- copyright + links --&gt;
    </MFlex>
  </template>
</MFooter>`"
    >
      <div class="w-full overflow-hidden rounded-xl border border-outline-variant">
        <MFooter :bordered="true" surface="container-low">
          <template #brand>
            <MFlex align="center" gap="sm">
              <MBox surface="primary-container" padding="sm" rounded="lg">
                <MCenter>
                  <MIcon name="widgets" :size="24" />
                </MCenter>
              </MBox>
              <MText variant="title-large" weight="medium">MyApp</MText>
            </MFlex>
            <MText variant="body-medium" color="on-surface-variant" class="mt-2 max-w-md">
              Building beautiful interfaces with Material Design 3 and Vue.
            </MText>
          </template>

          <MGrid :cols="2" :sm="3" :lg="4" gap="lg">
            <MStack gap="sm">
              <MText variant="label-large" weight="medium">Product</MText>
              <MText variant="body-small" color="on-surface-variant">Features</MText>
              <MText variant="body-small" color="on-surface-variant">Pricing</MText>
              <MText variant="body-small" color="on-surface-variant">Changelog</MText>
              <MText variant="body-small" color="on-surface-variant">Roadmap</MText>
            </MStack>
            <MStack gap="sm">
              <MText variant="label-large" weight="medium">Resources</MText>
              <MText variant="body-small" color="on-surface-variant">Documentation</MText>
              <MText variant="body-small" color="on-surface-variant">API Reference</MText>
              <MText variant="body-small" color="on-surface-variant">Examples</MText>
              <MText variant="body-small" color="on-surface-variant">Blog</MText>
            </MStack>
            <MStack gap="sm">
              <MText variant="label-large" weight="medium">Company</MText>
              <MText variant="body-small" color="on-surface-variant">About</MText>
              <MText variant="body-small" color="on-surface-variant">Careers</MText>
              <MText variant="body-small" color="on-surface-variant">Contact</MText>
            </MStack>
            <MStack gap="sm">
              <MText variant="label-large" weight="medium">Legal</MText>
              <MText variant="body-small" color="on-surface-variant">Privacy Policy</MText>
              <MText variant="body-small" color="on-surface-variant">Terms of Service</MText>
              <MText variant="body-small" color="on-surface-variant">Cookie Policy</MText>
            </MStack>
          </MGrid>

          <template #social>
            <MIconButton icon="code" label="GitHub" />
            <MIconButton icon="chat" label="Discord" />
            <MIconButton icon="alternate_email" label="Twitter" />
            <MIconButton icon="videocam" label="YouTube" />
          </template>

          <template #bottom>
            <MFlex align="center" justify="between" gap="md" :wrap="true">
              <MText variant="body-small" color="on-surface-variant">
                &copy; 2026 MyApp Inc. All rights reserved.
              </MText>
              <MFlex gap="lg">
                <MText variant="body-small" color="on-surface-variant">Privacy</MText>
                <MText variant="body-small" color="on-surface-variant">Terms</MText>
                <MText variant="body-small" color="on-surface-variant">Sitemap</MText>
              </MFlex>
            </MFlex>
          </template>
        </MFooter>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Inverse Surface"
      description="Dark footer using the inverse surface for contrast against light pages."
      :code="`<MFooter surface=&quot;inverse&quot;>
  ...
</MFooter>`"
    >
      <div class="w-full overflow-hidden rounded-xl border border-outline-variant">
        <MFooter surface="inverse">
          <template #brand>
            <MFlex align="center" gap="sm">
              <MIcon name="rocket_launch" :size="24" />
              <MText variant="title-medium" weight="medium">Startup</MText>
            </MFlex>
          </template>
          <MFlex gap="xl" :wrap="true">
            <MText variant="body-small">Docs</MText>
            <MText variant="body-small">Blog</MText>
            <MText variant="body-small">Pricing</MText>
            <MText variant="body-small">Support</MText>
          </MFlex>
          <template #bottom>
            <MText variant="body-small" class="opacity-60">
              &copy; 2026 Startup Inc.
            </MText>
          </template>
        </MFooter>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="footerProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="footerSlots" />

    <ComponentPager current="MFooter" />
  </div>
</template>
