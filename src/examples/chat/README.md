# Chat example

A messaging app built only with [m3ui-vue](https://m3ui.dev) components. Live at
[m3ui.dev/examples/chat](https://m3ui.dev/examples/chat).

## Structure

```
chat/
├── ChatExample.vue          MListDetail: chats and conversation side by side from 840px, one at a time below
├── useChat.ts               shared state (chats, messages, search, filters) and the simulated replies
└── components/
    ├── ChatList.vue         header, search, filter chips, chats with unread counts, "typing…", pinned and muted
    ├── Conversation.vue     header (status, last seen), day separators, MChatBubble runs, typing indicator, MLightbox
    ├── Composer.vue         auto-growing field, MEmojiSelector, photos from the device, voice note recorder
    ├── VoiceNote.vue        voice note bubble content: play/pause and a filling waveform
    └── EmptyConversation.vue the detail pane before a chat is picked (wide screens)
```

## How it works

- **Adaptive layout** comes from `MListDetail`: on a phone the chat list fills the screen and a chat slides over
  it (back returns to the list, keeping its scroll); from 840px wide both panes show.
- **Messages** are `MChatBubble`s. Only the first bubble of a run gets the tail (and, in groups, the avatar and
  name). Photos and voice notes go in the bubble's default slot; text uses its `text` prop.
- **Replies are simulated** in `useChat.ts`: your message goes sent → delivered → read, then the other side shows
  `MChatBubble`'s `typing` indicator (`'text'`, or `'audio'` while "recording") and answers from a canned list.
  The same activity drives the header status and the chat list preview.
- **Photos** you attach are real files shown through object URLs; they never leave the browser. Every photo in a
  chat can be browsed in `MLightbox`.
