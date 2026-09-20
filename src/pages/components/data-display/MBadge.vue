<script setup lang="ts">
import { MBadge, MIconButton, MAvatar } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'

const badgeProps: PropDef[] = [
  { name: 'count', type: 'number', description: 'Numeric badge value' },
  { name: 'dot', type: 'boolean', default: 'false', description: 'Show a small dot instead of a number' },
  { name: 'color', type: "'primary' | 'error' | 'secondary' | 'tertiary'", default: "'error'", description: 'Badge color' },
  { name: 'max', type: 'number', default: '99', description: 'Max value before showing "N+"' },
  { name: 'position', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'top-right'", description: 'Corner where the badge is placed' },
  { name: 'overlap', type: "'inside' | 'outside' | 'edge'", default: "'edge'", description: 'How much the badge overlaps the content' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MBadge</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A small numeric or dot indicator overlaid on another element, such as an icon button or avatar.
    </p>

    <ComponentDemo
      title="Badge"
      description="Numeric badges, dot indicators, and color variants."
      :code="`<template>
  <MBadge :count=&quot;5&quot;>
    <MIconButton icon=&quot;mail&quot; label=&quot;Mail&quot; variant=&quot;tonal&quot; />
  </MBadge>
  <MBadge :count=&quot;128&quot; :max=&quot;99&quot;>
    <MIconButton icon=&quot;notifications&quot; label=&quot;Notifications&quot; variant=&quot;tonal&quot; />
  </MBadge>
  <MBadge dot>
    <MIconButton icon=&quot;chat&quot; label=&quot;Chat&quot; variant=&quot;tonal&quot; />
  </MBadge>
</template>`"
    >
      <MBadge :count="5">
        <MIconButton icon="mail" label="Mail" variant="tonal" />
      </MBadge>
      <MBadge :count="128" :max="99">
        <MIconButton icon="notifications" label="Notifications" variant="tonal" />
      </MBadge>
      <MBadge dot>
        <MIconButton icon="chat" label="Chat" variant="tonal" />
      </MBadge>
      <MBadge :count="3" color="primary">
        <MIconButton icon="inbox" label="Inbox" variant="tonal" />
      </MBadge>
      <MBadge :count="7" color="tertiary">
        <MIconButton icon="favorite" label="Favorites" variant="tonal" />
      </MBadge>
    </ComponentDemo>

    <ComponentDemo
      title="Position"
      description="Place the badge on any corner with the position prop."
      :code="`<MBadge :count=&quot;3&quot; position=&quot;top-left&quot;>...
<MBadge :count=&quot;3&quot; position=&quot;top-right&quot;>...
<MBadge :count=&quot;3&quot; position=&quot;bottom-left&quot;>...
<MBadge :count=&quot;3&quot; position=&quot;bottom-right&quot;>...`"
    >
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" position="top-left">
            <MIconButton icon="mail" label="Mail" variant="tonal" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">top-left</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" position="top-right">
            <MIconButton icon="mail" label="Mail" variant="tonal" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">top-right</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" position="bottom-left">
            <MIconButton icon="mail" label="Mail" variant="tonal" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">bottom-left</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" position="bottom-right">
            <MIconButton icon="mail" label="Mail" variant="tonal" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">bottom-right</span>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Overlap"
      description="Control how much the badge overlaps the content: outside, edge, or inside."
      :code="`<MBadge :count=&quot;3&quot; overlap=&quot;outside&quot;>...
<MBadge :count=&quot;3&quot; overlap=&quot;edge&quot;>...
<MBadge :count=&quot;3&quot; overlap=&quot;inside&quot;>...`"
    >
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" overlap="outside">
            <MAvatar name="Alice" :size="48" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">outside</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" overlap="edge">
            <MAvatar name="Bob" :size="48" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">edge</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <MBadge :count="3" overlap="inside">
            <MAvatar name="Carol" :size="48" />
          </MBadge>
          <span class="text-label-small text-on-surface-variant">inside</span>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="badgeProps" />

    <ComponentPager current="MBadge" />
  </div>
</template>
