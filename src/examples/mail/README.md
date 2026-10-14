# Mail example

An email client built only with [m3ui-vue](https://m3ui.dev) components. Live at
[m3ui.dev/examples/mail](https://m3ui.dev/examples/mail).

## Structure

```
mail/
├── MailExample.vue          layout (the list, or the open conversation in its place), shortcuts, first new email
├── useMail.ts               mailbox state: folders, search, selection, actions with undo, drafts, sending
├── data.ts                  contacts, labels, the starting threads, new mail and canned replies
└── components/
    ├── TopBar.vue           wide screens: menu, search across all mail, shortcuts, theme, links
    ├── MailDrawer.vue       folders and labels in MNavigationDrawer (inline rail or modal), Compose
    ├── ThreadList.vue       toolbar or bulk actions, filter chips, MPullToRefresh, drafts and scheduled mail
    ├── ThreadRow.vue        one conversation: a single line on wide screens, a card with swipe on phones
    ├── Reader.vue           the open conversation, its actions and reply / forward; photos in MLightbox
    ├── MessageCard.vue      one message, collapsed or open; AttachmentCard.vue for its files
    ├── Composer.vue         MRichTextEditor, MMultiAutocomplete recipients, attachments, MSplitButton send
    ├── LaterMenu.vue        snooze presets; DateTimeDialog.vue picks any date and time
    ├── LabelMenu.vue        check labels on one or many conversations; LabelPill.vue shows them
    └── ShortcutsDialog.vue  the keyboard shortcuts, with MKbd
```

## How it works

- **Adaptive layout**: from 840px wide there's a top bar and an inline drawer that collapses to a rail
  from the menu button, and each conversation is one line with hover actions, like a desktop mail
  client. Below that, the drawer is modal and the search bar opens it. Either way a conversation
  opens in place of the list, which stays mounted underneath so its scroll and selection survive.
- **Folders are views** over one list of threads (`useMail.ts`): Starred, Snoozed and Sent are
  filters, while Inbox, Archive, Spam and Trash are where a thread lives. Labels work the same way.
  Search looks through every folder except Spam and Trash.
- **Actions** (archive, delete, snooze, spam, move to inbox) work on the open conversation or on a
  selection, and every one has an Undo in its toast. Acting on the open conversation takes you back
  to the list.
- **Touch**: swipe a row right to archive or left to delete, long-press to start selecting, and
  pull the list down to check for new mail.
- **Writing**: drafts save as you type and stay in Drafts when you close the composer. Send's arrow
  schedules it for later (Scheduled), and a timer sends it when the time comes. Replies quote the
  last message. Files you attach stay in the browser (object URLs).
- **Simulated people**: write to one of your contacts and they answer a few seconds later, which
  brings the conversation back to the Inbox. Refreshing "fetches" a few more emails.
- **Keyboard**: `c` compose, `j`/`k` older/newer, `e` archive, `#` delete, `r`/`a`/`f` reply, reply
  all, forward, `s` star, `/` search, `?` for the full list, and `Ctrl`+`Enter` sends.
