<script setup lang="ts">
import { ref } from 'vue'
import { MChatBubble, MIcon, MButton } from '@m3ui-vue/m3ui-vue'
import ComponentDemo from '@/components/ComponentDemo.vue'
import PropsTable from '@/components/PropsTable.vue'
import SlotsTable from '@/components/SlotsTable.vue'
import ComponentPager from '@/components/ComponentPager.vue'
import type { PropDef } from '@/components/PropsTable.vue'
import type { SlotDef } from '@/components/SlotsTable.vue'

// Custom content demo
const loved = ref(false)
const saved = ref(false)

// Typing indicator demo: Alex types or records, then the message lands
type LiveMsg = { id: number; side: 'left' | 'right'; text?: string; voice?: string; time: string }
let liveSeq = 0
const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const live = ref<LiveMsg[]>([{ id: liveSeq++, side: 'right', text: 'Are you coming tonight?', time: nowTime() }])
const alexTyping = ref<'text' | 'audio' | null>(null)
const replies = ['Yes! On my way 🚗', 'Running 10 min late, sorry', 'Save me a seat 😄']
function simulate(kind: 'text' | 'audio') {
  if (alexTyping.value) return
  alexTyping.value = kind
  setTimeout(() => {
    live.value.push(
      kind === 'text'
        ? { id: liveSeq++, side: 'left', text: replies[liveSeq % replies.length], time: nowTime() }
        : { id: liveSeq++, side: 'left', voice: '0:07', time: nowTime() },
    )
    alexTyping.value = null
  }, kind === 'text' ? 2200 : 3200)
}

const chatBubbleProps: PropDef[] = [
  { name: 'text', type: 'string', description: 'Message text (or use the default slot for custom content)' },
  { name: 'sender', type: 'string', description: 'Sender name shown above the bubble (left-side only)' },
  { name: 'time', type: 'string', description: 'Timestamp string (e.g. "10:32")' },
  { name: 'side', type: "'left' | 'right'", default: "'left'", description: 'Left = received, right = sent' },
  { name: 'avatar', type: 'string', description: 'Avatar name — shows an MAvatar with these initials (left-side only)' },
  { name: 'status', type: "'sent' | 'delivered' | 'read'", description: 'Message status icon next to the timestamp (right-side only)' },
  { name: 'color', type: "'primary' | 'secondary' | 'tertiary'", default: "'primary'", description: 'Bubble color for sent (right-side) messages' },
  { name: 'tail', type: 'boolean', default: 'true', description: 'Show the bubble tail (a sharper corner on the side nearest the sender)' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Text size (body-small / body-medium / body-large)' },
  { name: 'typing', type: "'text' | 'audio'", description: 'Shows a live indicator instead of the content: bouncing dots while the other person types, or a mic with a moving waveform while they record audio. Announced to screen readers with the locale\'s chatTyping / chatRecordingAudio text' },
  { name: 'maxWidth', type: 'string', default: "'320px'", description: 'Max bubble width (px, %, or var()) — supports a CSS variable for responsive control' },
]

const chatBubbleSlots: SlotDef[] = [
  { name: '#default', description: 'Custom content inside the bubble, replacing the text prop — images, files, buttons, or any layout' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-headline-large font-medium">MChatBubble</h1>
    <p class="mb-8 text-body-large text-on-surface-variant">
      A chat message bubble — sender name, avatar, timestamp, and read status, for left (received)
      or right (sent) messages.
    </p>

    <ComponentDemo
      title="Chat Conversation"
      description="Chat message bubbles with sender names, avatars, timestamps, and read status. Left side for received messages, right for sent."
      :code="`<MChatBubble
  text=&quot;Hey! How's the project going?&quot;
  sender=&quot;Alex&quot;
  avatar=&quot;Alex&quot;
  time=&quot;10:32&quot;
  side=&quot;left&quot;
/>
<MChatBubble
  text=&quot;Almost done, finishing the UI components.&quot;
  time=&quot;10:33&quot;
  side=&quot;right&quot;
  status=&quot;read&quot;
/>
<MChatBubble
  text=&quot;Nice! Can you show me a preview?&quot;
  sender=&quot;Alex&quot;
  avatar=&quot;Alex&quot;
  time=&quot;10:34&quot;
  side=&quot;left&quot;
/>
<MChatBubble
  text=&quot;Sure, give me 5 minutes 👍&quot;
  time=&quot;10:35&quot;
  side=&quot;right&quot;
  status=&quot;delivered&quot;
/>`"
    >
      <div class="mx-auto w-full max-w-md space-y-2 rounded-xl bg-surface-container-low p-4">
        <MChatBubble text="Hey! How's the project going? I saw the repo had some new commits this morning and wanted to check in." sender="Alex" avatar="Alex" time="10:32" side="left" />
        <MChatBubble text="Almost done! I've been working on the input components — autocomplete, tag input, and multi-select are all ready. Just polishing some edge cases with the icon alignment." time="10:33" side="right" status="read" />
        <MChatBubble text="Nice! Can you show me a preview? I'd love to see how the chat bubble component turned out, especially with the different color variants." sender="Alex" avatar="Alex" time="10:34" side="left" />
        <MChatBubble text="Sure, give me 5 minutes 👍" time="10:35" side="right" status="delivered" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Typing & recording indicator"
      description="typing='text' shows bouncing dots and typing='audio' a mic with a moving waveform, in place of the message. Mount it while the other person is typing or recording, and swap it for the real message when it arrives. Try the buttons below."
      :code="`<MChatBubble v-if=&quot;alexTyping&quot; :typing=&quot;alexTyping&quot; avatar=&quot;Alex&quot; />

<!-- static -->
<MChatBubble typing=&quot;text&quot; avatar=&quot;Alex&quot; />
<MChatBubble typing=&quot;audio&quot; avatar=&quot;Alex&quot; />`"
      :script="`// e.g. from your realtime channel
socket.on('typing', ({ kind }) => (alexTyping.value = kind)) // 'text' | 'audio'
socket.on('message', (msg) => {
  alexTyping.value = null
  messages.value.push(msg)
})`"
    >
      <div class="flex w-full flex-col gap-4">
        <div class="flex flex-wrap gap-2">
          <MButton variant="tonal" icon="keyboard" :disabled="!!alexTyping" @click="simulate('text')">Alex types</MButton>
          <MButton variant="tonal" icon="mic" :disabled="!!alexTyping" @click="simulate('audio')">Alex records audio</MButton>
        </div>
        <div class="mx-auto w-full max-w-md space-y-2 rounded-xl bg-surface-container-low p-4">
          <template v-for="m in live" :key="m.id">
            <MChatBubble v-if="m.text" :side="m.side" :text="m.text" :time="m.time" :avatar="m.side === 'left' ? 'Alex' : undefined" :status="m.side === 'right' ? 'read' : undefined" />
            <MChatBubble v-else side="left" avatar="Alex" :time="m.time">
              <div class="flex items-center gap-2">
                <MIcon name="play_arrow" :size="22" class="text-primary" style="font-variation-settings: 'FILL' 1" />
                <span class="flex h-4 items-center gap-[3px]">
                  <span v-for="(h, i) in [40, 70, 55, 90, 65, 35, 80, 50, 60, 30, 75, 45]" :key="i" class="w-[3px] rounded-full bg-on-surface-variant/60" :style="{ height: `${h}%` }" />
                </span>
                <span class="text-label-small text-on-surface-variant">{{ m.voice }}</span>
              </div>
            </MChatBubble>
          </template>
          <MChatBubble v-if="alexTyping" :typing="alexTyping" avatar="Alex" />
        </div>
        <div class="flex flex-wrap items-end gap-6">
          <div class="flex flex-col gap-1">
            <span class="text-label-medium text-on-surface-variant">typing="text"</span>
            <MChatBubble typing="text" avatar="Alex" />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-label-medium text-on-surface-variant">typing="audio"</span>
            <MChatBubble typing="audio" avatar="Alex" />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-label-medium text-on-surface-variant">color="tertiary"</span>
            <MChatBubble typing="audio" avatar="Alex" color="tertiary" />
          </div>
        </div>
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Colors & Status"
      description="Change the bubble color with the color prop. Status indicators show sent, delivered, and read states."
      :code="`<MChatBubble text=&quot;Primary bubble&quot; side=&quot;right&quot; color=&quot;primary&quot; status=&quot;read&quot; time=&quot;now&quot; />
<MChatBubble text=&quot;Secondary bubble&quot; side=&quot;right&quot; color=&quot;secondary&quot; status=&quot;delivered&quot; time=&quot;now&quot; />
<MChatBubble text=&quot;Tertiary bubble&quot; side=&quot;right&quot; color=&quot;tertiary&quot; status=&quot;sent&quot; time=&quot;now&quot; />`"
    >
      <div class="mx-auto w-full max-w-md space-y-2 rounded-xl bg-surface-container-low p-4">
        <MChatBubble text="Primary bubble (read)" side="right" color="primary" status="read" time="now" />
        <MChatBubble text="Secondary bubble (delivered)" side="right" color="secondary" status="delivered" time="now" />
        <MChatBubble text="Tertiary bubble (sent)" side="right" color="tertiary" status="sent" time="now" />
        <MChatBubble text="Received message — always uses surface colors" sender="Bot" avatar="Bot" side="left" time="now" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Without Tail"
      description="Set tail to false for a fully rounded bubble — useful for consecutive messages from the same sender."
      :code="`<MChatBubble text=&quot;First message&quot; sender=&quot;Alex&quot; avatar=&quot;Alex&quot; time=&quot;10:30&quot; />
<MChatBubble text=&quot;Second message&quot; :tail=&quot;false&quot; time=&quot;10:30&quot; />
<MChatBubble text=&quot;Third message&quot; :tail=&quot;false&quot; time=&quot;10:31&quot; />`"
    >
      <div class="mx-auto w-full max-w-md space-y-1 rounded-xl bg-surface-container-low p-4">
        <MChatBubble text="First message from Alex" sender="Alex" avatar="Alex" time="10:30" />
        <MChatBubble text="Followed by another one" :tail="false" time="10:30" side="left" />
        <MChatBubble text="And a third" :tail="false" time="10:31" side="left" />
        <MChatBubble text="Got it!" time="10:32" side="right" status="read" />
        <MChatBubble text="Will reply soon" :tail="false" time="10:32" side="right" status="read" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Max Width"
      description="Control the maximum bubble width with the maxWidth prop. Accepts px, %, or CSS variables for responsive control."
      :code="`<MChatBubble
  text=&quot;This bubble is limited to 200px max width, so longer text will wrap earlier.&quot;
  max-width=&quot;200px&quot;
  side=&quot;right&quot;
  time=&quot;now&quot;
  status=&quot;read&quot;
/>
<MChatBubble
  text=&quot;This one uses the default 320px max width, giving more room for longer messages before wrapping.&quot;
  side=&quot;left&quot;
  sender=&quot;Alex&quot;
  time=&quot;now&quot;
/>
<!-- Responsive via CSS variable -->
<div class=&quot;[--chat-w:240px] md:[--chat-w:320px]&quot;>
  <MChatBubble text=&quot;Responsive width&quot; max-width=&quot;var(--chat-w)&quot; />
</div>`"
    >
      <div class="mx-auto w-full max-w-md space-y-2 rounded-xl bg-surface-container-low p-4">
        <MChatBubble text="Narrow bubble (200px). Long text wraps much earlier than the default." max-width="200px" side="right" time="now" status="read" />
        <MChatBubble text="Default width (320px). This gives more room for longer messages before they start wrapping to a new line." side="left" sender="Alex" avatar="Alex" time="now" />
        <MChatBubble text="Wide bubble (400px). Plenty of space — only very long messages will wrap at this width." max-width="400px" side="right" time="now" status="delivered" />
      </div>
    </ComponentDemo>

    <ComponentDemo
      title="Custom Content"
      description="Use the default slot to put anything inside the bubble — images, cards, buttons, or any custom layout."
      :code="`<MChatBubble side=&quot;left&quot; sender=&quot;Alex&quot; avatar=&quot;Alex&quot; time=&quot;10:40&quot;>
  <p class=&quot;text-body-medium&quot;>Check out this photo from the trip!</p>
  <img src=&quot;...&quot; class=&quot;mt-2 rounded-lg&quot; />
</MChatBubble>

<MChatBubble side=&quot;right&quot; time=&quot;10:41&quot; status=&quot;read&quot; max-width=&quot;360px&quot;>
  <p class=&quot;text-body-medium&quot;>That looks amazing! 🤩</p>
  <!-- Tint actions with the bubble's own on-color so they read as part of it -->
  <div class=&quot;-mx-1 mt-2 flex gap-1.5 border-t border-on-primary/20 pt-2&quot;>
    <button
      type=&quot;button&quot;
      class=&quot;flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-on-primary/12 px-3 py-1.5 text-label-large text-on-primary transition-colors hover:bg-on-primary/20 active:bg-on-primary/24 focus-visible:outline-2 focus-visible:outline-on-primary&quot;
      :aria-pressed=&quot;loved&quot;
      @click=&quot;loved = !loved&quot;
    >
      <MIcon name=&quot;favorite&quot; :size=&quot;18&quot; :style=&quot;{ fontVariationSettings: \`'FILL' \${loved ? 1 : 0}\` }&quot; />
      {{ loved ? 'Loved' : 'Love it' }}
    </button>
    <!-- Save button: same classes, bookmark icon -->
  </div>
</MChatBubble>`"
    >
      <div class="mx-auto w-full max-w-md space-y-2 rounded-xl bg-surface-container-low p-4">
        <MChatBubble side="left" sender="Alex" avatar="Alex" time="10:40">
          <p class="text-body-medium">Check out this view from the office! 🏔️</p>
          <div class="mt-2 flex h-32 items-center justify-center rounded-lg bg-on-surface/10">
            <MIcon name="image" :size="32" class="text-on-surface-variant/40" />
          </div>
        </MChatBubble>
        <MChatBubble side="right" time="10:41" status="read" max-width="360px">
          <p class="text-body-medium">That looks amazing! 🤩</p>
          <div class="-mx-1 mt-2 flex gap-1.5 border-t border-on-primary/20 pt-2">
            <button
              type="button"
              class="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-on-primary/12 px-3 py-1.5 text-label-large text-on-primary transition-colors hover:bg-on-primary/20 focus-visible:outline-2 focus-visible:outline-on-primary active:bg-on-primary/24"
              :aria-pressed="loved"
              @click="loved = !loved"
            >
              <MIcon name="favorite" :size="18" :style="{ fontVariationSettings: `'FILL' ${loved ? 1 : 0}` }" />
              {{ loved ? 'Loved' : 'Love it' }}
            </button>
            <button
              type="button"
              class="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-on-primary/12 px-3 py-1.5 text-label-large text-on-primary transition-colors hover:bg-on-primary/20 focus-visible:outline-2 focus-visible:outline-on-primary active:bg-on-primary/24"
              :aria-pressed="saved"
              @click="saved = !saved"
            >
              <MIcon name="bookmark" :size="18" :style="{ fontVariationSettings: `'FILL' ${saved ? 1 : 0}` }" />
              {{ saved ? 'Saved' : 'Save' }}
            </button>
          </div>
        </MChatBubble>
        <MChatBubble side="left" sender="Alex" avatar="Alex" time="10:42" :tail="false">
          <div class="rounded-lg bg-on-surface/10 p-3">
            <p class="text-label-small font-medium">📎 project-specs.pdf</p>
            <p class="text-label-small text-on-surface-variant">2.4 MB — PDF Document</p>
          </div>
        </MChatBubble>
      </div>
    </ComponentDemo>

    <h3 class="mb-3 mt-6 text-title-large font-medium">Props</h3>
    <PropsTable :props="chatBubbleProps" />

    <h3 class="mb-3 mt-6 text-title-large font-medium">Slots</h3>
    <SlotsTable :slots="chatBubbleSlots" />

    <ComponentPager current="MChatBubble" />
  </div>
</template>
