<script setup lang="ts">
import { MToolbar, MIconButton, MButton, MDivider, MFab, MTextField } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

const toolbarProps: PropDef[] = [
  { name: 'variant', type: "'docked' | 'floating'", default: "'docked'", description: 'Docked (edge-attached, full width/height, bordered) or floating (rounded pill with shadow)' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction' },
  { name: 'color', type: "'surface' | 'primary' | 'secondary' | 'tertiary'", default: "'surface'", description: 'Background color scheme' },
  { name: 'fabPosition', type: "'start' | 'end' | 'none'", default: "'none'", description: 'Where the #fab slot renders relative to the toolbar body' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'between'", default: "'center'", description: 'Item alignment along the main axis' },
]

const toolbarSlots: SlotDef[] = [
  { name: '#default', description: 'Toolbar items — typically MIconButton/MButton, separated with MDivider' },
  { name: '#fab', description: 'A FAB rendered alongside the toolbar body, positioned by fabPosition' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MToolbar</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A container for grouping icon buttons and actions — docked to an edge or floating as a rounded pill,
      horizontal or vertical, with an optional paired FAB.
    </p>

    <ComponentDemo
      title="Floating Toolbar"
      description="Floating variant with rounded corners and shadow. Supports different color schemes."
      :code="`<MToolbar variant=&quot;floating&quot;>
  <MIconButton icon=&quot;format_bold&quot; />
  <MIconButton icon=&quot;format_italic&quot; />
  <MIconButton icon=&quot;format_underlined&quot; />
</MToolbar>`"
    >
      <div class="flex flex-col items-center gap-4">
        <MToolbar variant="floating">
          <MIconButton icon="format_bold" label="Bold" />
          <MIconButton icon="format_italic" label="Italic" />
          <MIconButton icon="format_underlined" label="Underline" />
          <MDivider vertical class="h-6" />
          <MIconButton icon="format_align_left" label="Align left" />
          <MIconButton icon="format_align_center" label="Align center" />
          <MIconButton icon="format_align_right" label="Align right" />
        </MToolbar>

        <MToolbar variant="floating" color="primary">
          <MIconButton icon="undo" label="Undo" />
          <MIconButton icon="redo" label="Redo" />
          <MDivider vertical class="h-6" />
          <MIconButton icon="content_cut" label="Cut" />
          <MIconButton icon="content_copy" label="Copy" />
          <MIconButton icon="content_paste" label="Paste" />
        </MToolbar>

        <MToolbar variant="floating" color="tertiary">
          <MIconButton icon="brush" label="Brush" />
          <MIconButton icon="palette" label="Color" />
          <MIconButton icon="format_paint" label="Fill" />
          <MIconButton icon="auto_fix_high" label="Magic" />
        </MToolbar>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="With FAB"
      description="Pair the toolbar with a FAB at start or end for emphasis on a primary action."
      :code="`<MToolbar variant=&quot;floating&quot; fab-position=&quot;end&quot;>
  <MIconButton icon=&quot;edit&quot; />
  <template #fab>
    <MFab icon=&quot;add&quot; />
  </template>
</MToolbar>`"
    >
      <div class="flex flex-col items-center gap-4">
        <MToolbar variant="floating" fab-position="end">
          <MIconButton icon="image" label="Photo" />
          <MIconButton icon="videocam" label="Video" />
          <MIconButton icon="mic" label="Audio" />
          <MIconButton icon="attach_file" label="File" />
          <template #fab>
            <MFab icon="send" size="small" />
          </template>
        </MToolbar>

        <MToolbar variant="floating" fab-position="start" color="secondary">
          <MIconButton icon="reply" label="Reply" />
          <MIconButton icon="forward" label="Forward" />
          <MIconButton icon="delete" label="Delete" />
          <template #fab>
            <MFab icon="edit" size="small" color="secondary" />
          </template>
        </MToolbar>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Vertical"
      description="Vertical floating toolbar — useful for side panels or drawing tools."
      :code="`<MToolbar variant=&quot;floating&quot; orientation=&quot;vertical&quot;>
  <MIconButton icon=&quot;brush&quot; />
  <MIconButton icon=&quot;square&quot; />
</MToolbar>`"
    >
      <div class="flex items-start gap-6">
        <MToolbar variant="floating" orientation="vertical">
          <MIconButton icon="brush" label="Brush" />
          <MIconButton icon="square" label="Rectangle" />
          <MIconButton icon="circle" label="Circle" />
          <MIconButton icon="pen_size_2" label="Pen" />
          <MDivider class="w-6" />
          <MIconButton icon="colorize" label="Eyedropper" />
          <MIconButton icon="delete" label="Eraser" />
        </MToolbar>

        <MToolbar variant="floating" orientation="vertical" color="tertiary" fab-position="end">
          <MIconButton icon="zoom_in" label="Zoom in" />
          <MIconButton icon="zoom_out" label="Zoom out" />
          <MIconButton icon="fit_screen" label="Fit" />
          <template #fab>
            <MFab icon="fullscreen" size="small" color="tertiary" />
          </template>
        </MToolbar>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Docked Toolbar"
      description="Docked variant attaches to an edge with a border. Spans full width (or height if vertical)."
      :code="`<MToolbar variant=&quot;docked&quot; align=&quot;between&quot;>
  <MIconButton icon=&quot;menu&quot; />
  <MTextField placeholder=&quot;Search&quot; />
  <MIconButton icon=&quot;account_circle&quot; />
</MToolbar>`"
    >
      <div class="w-full overflow-hidden rounded-xl border border-outline-variant">
        <MToolbar variant="docked" align="between">
          <div class="flex items-center gap-1">
            <MIconButton icon="menu" label="Menu" />
            <MIconButton icon="arrow_back" label="Back" />
          </div>
          <div class="flex items-center gap-1">
            <MIconButton icon="search" label="Search" />
            <MIconButton icon="more_vert" label="More" />
          </div>
        </MToolbar>
        <div class="flex h-32 items-center justify-center bg-surface-container text-body-medium text-on-surface-variant">
          Content area
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Image Editor"
      description="A complete image editor layout combining vertical side toolbar, horizontal bottom toolbar with FAB, and a docked top bar."
      :code="`<MToolbar variant=&quot;floating&quot; orientation=&quot;vertical&quot;>
  <!-- tools -->
</MToolbar>
<MToolbar variant=&quot;floating&quot; fab-position=&quot;end&quot;>
  <!-- actions -->
</MToolbar>`"
    >
      <div class="w-full overflow-hidden rounded-xl border border-outline-variant">
        <MToolbar variant="docked" align="between">
          <div class="flex items-center gap-2">
            <MIconButton icon="arrow_back" label="Back" />
            <span class="text-title-medium font-medium text-on-surface">Photo Editor</span>
          </div>
          <div class="flex items-center gap-1">
            <MButton variant="text" icon="undo">Undo</MButton>
            <MButton variant="text" icon="redo">Redo</MButton>
            <MButton variant="tonal" icon="save">Save</MButton>
          </div>
        </MToolbar>

        <div class="flex" style="height: 420px">
          <div class="flex items-center border-r border-outline-variant bg-surface px-1 py-3">
            <MToolbar variant="floating" orientation="vertical" color="surface">
              <MIconButton icon="crop" label="Crop" variant="tonal" />
              <MIconButton icon="rotate_right" label="Rotate" />
              <MIconButton icon="flip" label="Flip" />
              <MDivider class="w-6" />
              <MIconButton icon="brush" label="Brush" />
              <MIconButton icon="auto_fix_high" label="Enhance" />
              <MIconButton icon="blur_on" label="Blur" />
              <MDivider class="w-6" />
              <MIconButton icon="text_fields" label="Text" />
              <MIconButton icon="category" label="Shapes" />
            </MToolbar>
          </div>

          <div class="flex flex-1 items-center justify-center bg-surface-container-lowest">
            <div class="flex h-48 w-64 items-center justify-center rounded-lg bg-surface-container text-body-medium text-on-surface-variant">
              Canvas
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center border-t border-outline-variant bg-surface px-4 py-2">
          <MToolbar variant="floating" color="secondary" fab-position="end">
            <MIconButton icon="tune" label="Adjust" />
            <MIconButton icon="filter" label="Filter" />
            <MIconButton icon="wb_sunny" label="Light" />
            <MIconButton icon="contrast" label="Contrast" />
            <MIconButton icon="palette" label="Color" />
            <template #fab>
              <MFab icon="check" size="small" color="primary" />
            </template>
          </MToolbar>
        </div>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="toolbarProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="toolbarSlots" />

    <ComponentPager current="MToolbar" />
  </div>
</template>
