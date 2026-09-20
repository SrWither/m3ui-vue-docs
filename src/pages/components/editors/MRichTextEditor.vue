<script setup lang="ts">
import { ref } from 'vue'
import { MCard } from '@m3ui-vue/m3ui-vue'
import { MRichTextEditor } from '@m3ui-vue/m3ui-vue/rich-text-editor'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import EventsTable from '@/components/EventsTable.vue'
import TypesTable from '@/components/TypesTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { EventDef } from '@/components/EventsTable.vue'
import type { TypeDef } from '@/components/TypesTable.vue'

const richTextContent = ref('<p>This is <strong>bold</strong> and <em>italic</em> text.</p><p>Try editing this content!</p>')
const richTextDisabledContent = ref('<p>This editor is <strong>disabled</strong> — the toolbar and content are not editable.</p>')
const richTextEsContent = ref('<p>Editor con la barra de herramientas <strong>en español</strong>.</p>')

const richTextProps: PropDef[] = [
  { name: 'modelValue', type: 'string', description: 'HTML content (v-model)' },
  { name: 'placeholder', type: 'string', description: 'Placeholder text shown on an empty document' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables editing' },
  { name: 'minHeight', type: 'string', default: "'200px'", description: 'Minimum editor height' },
  { name: 'labels', type: 'RichTextEditorLabels', description: 'Object with all toolbar/dialog label overrides for i18n (see the type below) — defaults come from useLocale()' },
]

const richTextEvents: EventDef[] = [
  { name: 'update:modelValue', payload: 'string', description: 'Emitted with the editor HTML on every content change — powers v-model' },
]

const richTextTypes: TypeDef[] = [
  {
    name: 'RichTextEditorLabels',
    description: 'All fields optional — unset ones fall back to the active locale',
    fields: [
      { name: 'bold', type: 'string', description: "'Bold' toolbar button title" },
      { name: 'italic', type: 'string', description: "'Italic' toolbar button title" },
      { name: 'underline', type: 'string', description: "'Underline' toolbar button title" },
      { name: 'strikethrough', type: 'string', description: "'Strikethrough' toolbar button title" },
      { name: 'highlight', type: 'string', description: "'Highlight' toolbar button title" },
      { name: 'bulletList', type: 'string', description: "'Bullet list' toolbar button title" },
      { name: 'orderedList', type: 'string', description: "'Ordered list' toolbar button title" },
      { name: 'blockquote', type: 'string', description: "'Blockquote' toolbar button title" },
      { name: 'code', type: 'string', description: "'Code' toolbar button title" },
      { name: 'alignLeft', type: 'string', description: "'Align left' toolbar button title" },
      { name: 'alignCenter', type: 'string', description: "'Align center' toolbar button title" },
      { name: 'alignRight', type: 'string', description: "'Align right' toolbar button title" },
      { name: 'undo', type: 'string', description: "'Undo' toolbar button title" },
      { name: 'redo', type: 'string', description: "'Redo' toolbar button title" },
      { name: 'link', type: 'string', description: "'Link' toolbar button title" },
      { name: 'image', type: 'string', description: "'Image' toolbar button title" },
      { name: 'paragraph', type: 'string', description: "Heading-menu label for plain paragraph text" },
      { name: 'heading1', type: 'string', description: "Heading-menu label for H1" },
      { name: 'heading2', type: 'string', description: "Heading-menu label for H2" },
      { name: 'heading3', type: 'string', description: "Heading-menu label for H3" },
      { name: 'insertLink', type: 'string', description: "Link dialog title" },
      { name: 'insertImage', type: 'string', description: "Image dialog title" },
      { name: 'imageUrlLabel', type: 'string', description: "Image dialog field label" },
      { name: 'cancel', type: 'string', description: "Cancel button text in the link/image dialogs" },
      { name: 'insert', type: 'string', description: "Insert button text in the link/image dialogs" },
    ],
  },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MRichTextEditor</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A WYSIWYG editor built on tiptap, with a formatting toolbar covering text styles, lists, alignment,
      links, and images.
    </p>

    <ComponentDemo
      title="Rich Text Editor"
      description="WYSIWYG editor with formatting toolbar."
      :code="`<MRichTextEditor v-model=&quot;content&quot; placeholder=&quot;Start writing...&quot; />`"
      :script="`import { ref } from 'vue'
import { MRichTextEditor } from '@m3ui-vue/m3ui-vue/rich-text-editor'

const content = ref('<p>Hello <strong>world</strong>!</p>')`"
    >
      <div class="w-full">
        <MRichTextEditor v-model="richTextContent" placeholder="Start writing..." />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Disabled"
      description="With disabled, the toolbar disappears and the content becomes non-editable, shown at reduced opacity."
      :code="`<MRichTextEditor v-model=&quot;content&quot; :disabled=&quot;true&quot; />`"
    >
      <div class="w-full">
        <MRichTextEditor v-model="richTextDisabledContent" :disabled="true" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Labels (i18n)"
      description="Override any toolbar/dialog label via the labels prop, independent of the app-wide locale."
      :code="`<MRichTextEditor v-model=&quot;content&quot; :labels=&quot;labels&quot; />`"
      :script="`const labels = {
  bold: 'Negrita',
  italic: 'Cursiva',
  underline: 'Subrayado',
  link: 'Enlace',
  image: 'Imagen',
}`"
    >
      <div class="w-full">
        <MRichTextEditor
          v-model="richTextEsContent"
          :labels="{ bold: 'Negrita', italic: 'Cursiva', underline: 'Subrayado', link: 'Enlace', image: 'Imagen' }"
        />
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="richTextProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Events</h3>
    <EventsTable :events="richTextEvents" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Types</h3>
    <TypesTable :types="richTextTypes" />

    <MCard class="mt-4 overflow-hidden border-l-4 border-l-tertiary p-5">
      <p class="mb-2 text-title-small font-medium">Peer Dependencies</p>
      <pre class="rounded-lg bg-surface-container p-3 text-body-small"><code>@tiptap/vue-3  @tiptap/starter-kit  @tiptap/extension-underline
@tiptap/extension-text-align  @tiptap/extension-link
@tiptap/extension-image  @tiptap/extension-highlight
@tiptap/extension-placeholder  @tiptap/extension-text-style
@tiptap/extension-color</code></pre>
    </MCard>

    <ComponentPager current="MRichTextEditor" />
  </div>
</template>
