<script setup lang="ts">
import { MAppLayout, MCard, MBox, MText, MStack, MFlex, MIcon, MFab, MAbsolute } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const appLayoutProps: PropDef[] = [
  { name: 'height', type: 'string', default: "'100dvh'", description: 'Container height (CSS value). Use "100%" to fit inside a parent instead of the viewport.' },
  { name: 'drawerRight', type: 'boolean', default: 'false', description: 'Place the drawer slot on the right side of the layout' },
]

const appLayoutSlots: SlotDef[] = [
  { name: '#drawer', description: 'Side navigation (e.g. MNavigationDrawer). Use drawerRight prop to place it on the right.' },
  { name: '#header', description: 'Top bar (e.g. MTopAppBar)' },
  { name: '#default', description: 'Main scrollable content' },
  { name: '#footer', description: 'Bottom bar or status area' },
  { name: '#fab', description: 'Floating elements (e.g. MFab) rendered outside the scroll area' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MAppLayout</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      Full app shell — drawer, header, content, footer, and fab slots.
    </p>

    <ComponentDemo
      title="App Shell"
      description="Full app layout with drawer, header, content, footer, and fab slots. Use the height prop to embed inside a container instead of filling the viewport."
      :code="`<template>
  &lt;!-- Full viewport (default) --&gt;
  <MAppLayout>
    <template #drawer>
      <MNavigationDrawer ... />
    </template>
    <template #header>
      <MTopAppBar ... />
    </template>
    <MContainer>Page content</MContainer>
    <template #footer>
      <MBox surface=&quot;container&quot; padding=&quot;sm&quot;>Footer</MBox>
    </template>
    <template #fab>
      <MAbsolute placement=&quot;bottom-right&quot; :offset=&quot;24&quot;>
        <MFab icon=&quot;edit&quot; />
      </MAbsolute>
    </template>
  </MAppLayout>

  &lt;!-- Embedded with fixed height --&gt;
  <MAppLayout height=&quot;400px&quot;>
    ...
  </MAppLayout>
</template>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="h-72 overflow-hidden">
          <MAppLayout height="100%">
            <template #drawer>
              <MBox surface="container-low" padding="sm" class="h-full w-48 border-r border-outline-variant">
                <MText variant="title-small" weight="medium" class="mb-3">Drawer</MText>
                <MStack gap="xs">
                  <MBox surface="secondary-container" padding="xs" rounded="md">
                    <MFlex align="center" gap="sm">
                      <MIcon name="home" :size="18" />
                      <MText variant="label-large">Home</MText>
                    </MFlex>
                  </MBox>
                  <MFlex align="center" gap="sm" class="px-1">
                    <MIcon name="settings" :size="18" class="text-on-surface-variant" />
                    <MText variant="label-large" color="on-surface-variant">Settings</MText>
                  </MFlex>
                </MStack>
              </MBox>
            </template>

            <template #header>
              <MBox surface="container" padding="sm" class="border-b border-outline-variant">
                <MText variant="title-small" weight="medium">Header</MText>
              </MBox>
            </template>

            <MBox padding="md">
              <MText variant="body-medium" color="on-surface-variant">Main content area</MText>
            </MBox>

            <template #footer>
              <MBox surface="container" padding="xs" class="border-t border-outline-variant">
                <MText variant="body-small" color="on-surface-variant" align="center">Footer</MText>
              </MBox>
            </template>

            <template #fab>
              <MAbsolute placement="bottom-right" :offset="16">
                <MFab icon="edit" size="small" />
              </MAbsolute>
            </template>
          </MAppLayout>
        </MCard>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Drawer on the Right"
      description="Use drawerRight to place the drawer on the right side. Combine with MNavigationDrawer side=&quot;right&quot; for the correct border."
      :code="`<MAppLayout :drawer-right=&quot;true&quot;>
  <template #drawer>
    <MNavigationDrawer side=&quot;right&quot; ... />
  </template>
  <template #header>
    <MTopAppBar ... />
  </template>
  Main content
</MAppLayout>`"
    >
      <div class="w-full">
        <MCard variant="outlined" class="h-72 overflow-hidden">
          <MAppLayout height="100%" :drawer-right="true">
            <template #drawer>
              <MBox surface="container-low" padding="sm" class="h-full w-48 border-l border-outline-variant">
                <MText variant="title-small" weight="medium" class="mb-3">Drawer</MText>
                <MStack gap="xs">
                  <MBox surface="secondary-container" padding="xs" rounded="md">
                    <MFlex align="center" gap="sm">
                      <MIcon name="home" :size="18" />
                      <MText variant="label-large">Home</MText>
                    </MFlex>
                  </MBox>
                  <MFlex align="center" gap="sm" class="px-1">
                    <MIcon name="settings" :size="18" class="text-on-surface-variant" />
                    <MText variant="label-large" color="on-surface-variant">Settings</MText>
                  </MFlex>
                </MStack>
              </MBox>
            </template>

            <template #header>
              <MBox surface="container" padding="sm" class="border-b border-outline-variant">
                <MText variant="title-small" weight="medium">Header</MText>
              </MBox>
            </template>

            <MBox padding="md">
              <MText variant="body-medium" color="on-surface-variant">Main content area — drawer is on the right</MText>
            </MBox>
          </MAppLayout>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="appLayoutProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="appLayoutSlots" />

    <ComponentPager current="MAppLayout" />
  </div>
</template>
