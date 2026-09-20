<script setup lang="ts">
import { ref } from 'vue'
import { MTree, MCard } from '@m3ui-vue/m3ui-vue'
import type { TreeNode } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const treeProps: PropDef[] = [
  { name: 'nodes', type: 'TreeNode[]', description: 'Root nodes to render — required' },
  { name: 'selected', type: 'string | number | null', description: 'Currently selected node id (v-model:selected)' },
  { name: 'checked', type: '(string | number)[]', description: 'Checked leaf node ids (v-model:checked, checkable mode)' },
  { name: 'checkable', type: 'boolean', default: 'false', description: 'Show checkboxes with cascade selection (checking a branch checks/unchecks all its leaves)' },
  { name: 'defaultExpanded', type: "(string | number)[] | 'all' | 'none'", default: "'none'", description: 'Which nodes start expanded' },
  { name: 'emptyText', type: 'string', default: "'Sin elementos'", description: 'Text shown when nodes is empty' },
]

const treeEvents: EventDef[] = [
  { name: 'update:selected', payload: 'string | number | null', description: 'Fires when a node is clicked, toggling selection (clicking the already-selected node clears it)' },
  { name: 'update:checked', payload: '(string | number)[]', description: 'Fires when a checkbox toggles a node (checkable mode)' },
  { name: 'node-click', payload: 'TreeNode', description: 'Fires whenever a node row is clicked, alongside update:selected' },
]

const treeTypes: TypeDef[] = [
  {
    name: 'TreeNode',
    fields: [
      { name: 'id', type: 'string | number', required: true, description: 'Unique node id' },
      { name: 'label', type: 'string', required: true, description: 'Display text' },
      { name: 'icon', type: 'string', description: 'Material Symbol icon' },
      { name: 'children', type: 'TreeNode[]', description: 'Nested child nodes' },
      { name: 'disabled', type: 'boolean', description: 'Disables selection/expansion/checking for this node' },
    ],
  },
]

const treeSlots: SlotDef[] = [
  { name: '#label', description: "Custom label content, replacing a node's plain text label", scope: '{ node: TreeNode }' },
  { name: '#trailing', description: 'Extra trailing content per row (e.g. a count or action button)', scope: '{ node: TreeNode }' },
]

const treeNodes: TreeNode[] = [
  {
    id: 'src', label: 'src', icon: 'folder',
    children: [
      {
        id: 'components', label: 'components', icon: 'folder',
        children: [
          { id: 'button', label: 'MButton.vue', icon: 'code' },
          { id: 'card', label: 'MCard.vue', icon: 'code' },
          { id: 'dialog', label: 'MDialog.vue', icon: 'code' },
        ],
      },
      {
        id: 'composables', label: 'composables', icon: 'folder',
        children: [
          { id: 'useTheme', label: 'useTheme.ts', icon: 'code' },
          { id: 'useToast', label: 'useToast.ts', icon: 'code' },
        ],
      },
      { id: 'index', label: 'index.ts', icon: 'code' },
    ],
  },
  { id: 'package', label: 'package.json', icon: 'description' },
  { id: 'readme', label: 'README.md', icon: 'description' },
]

const selectedNode = ref<string | number | null>(null)
const checkedNodes = ref<(string | number)[]>([])
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MTree</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A hierarchical tree view with expand/collapse, single-node selection, and optional
      cascading checkbox selection.
    </p>

    <ComponentDemo
      title="Tree View"
      description="Hierarchical tree with expand/collapse and node selection."
      :code="`<template>
  <MTree :nodes=&quot;nodes&quot; :selected=&quot;selected&quot; default-expanded=&quot;all&quot; @update:selected=&quot;selected = $event&quot; />
</template>`"
      :script="`const selected = ref(null)
const nodes = [
  {
    id: 'src', label: 'src', icon: 'folder',
    children: [
      { id: 'components', label: 'components', icon: 'folder',
        children: [
          { id: 'button', label: 'MButton.vue', icon: 'code' },
          { id: 'card', label: 'MCard.vue', icon: 'code' },
        ],
      },
      { id: 'index', label: 'index.ts', icon: 'code' },
    ],
  },
]`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="p-2">
          <MTree
            :nodes="treeNodes"
            :selected="selectedNode"
            default-expanded="all"
            @update:selected="selectedNode = $event"
          />
        </MCard>
        <p v-if="selectedNode" class="mt-2 text-body-medium text-on-surface-variant">
          Selected: {{ selectedNode }}
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Checkable Tree"
      description="Tree with checkboxes and cascading selection."
      :code="`<template>
  <MTree :nodes=&quot;nodes&quot; :checkable=&quot;true&quot; :checked=&quot;checked&quot; default-expanded=&quot;all&quot; @update:checked=&quot;checked = $event&quot; />
</template>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="p-2">
          <MTree
            :nodes="treeNodes"
            :checkable="true"
            :checked="checkedNodes"
            default-expanded="all"
            @update:checked="checkedNodes = $event"
          />
        </MCard>
        <p v-if="checkedNodes.length" class="mt-2 text-body-medium text-on-surface-variant">
          Checked: {{ checkedNodes.join(', ') }}
        </p>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Label & Trailing Slots"
      description="The #label and #trailing scoped slots let you replace a node's text or append content (a count, a button) per row."
      :code="`<MTree :nodes=&quot;nodes&quot; default-expanded=&quot;all&quot;>
  <template #label=&quot;{ node }&quot;>
    <span class=&quot;font-mono&quot;>{{ node.label }}</span>
  </template>
  <template #trailing=&quot;{ node }&quot;>
    <MIcon v-if=&quot;!node.children&quot; name=&quot;more_vert&quot; :size=&quot;16&quot; />
  </template>
</MTree>`"
    >
      <div class="w-full max-w-sm">
        <MCard variant="outlined" class="p-2">
          <MTree :nodes="treeNodes" default-expanded="all">
            <template #label="{ node }">
              <span class="font-mono">{{ node.label }}</span>
            </template>
          </MTree>
        </MCard>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="treeProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="treeEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="treeTypes" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="treeSlots" />

    <ComponentPager current="MTree" />
  </div>
</template>
