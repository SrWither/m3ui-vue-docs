// The kinds of steps a workflow is made of: triggers start it, actions do something, logic routes it.
export type Category = 'trigger' | 'action' | 'logic'

export interface Field {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select'
  options?: string[]
  placeholder?: string
  /** A step can't run without it */
  required?: boolean
}

export interface Kind {
  id: string
  label: string
  icon: string
  category: Category
  description: string
  fields: Field[]
  /** Named outputs, each its own handle (a condition's yes / no) */
  branches?: string[]
  /** Seconds a test run spends on it */
  seconds?: number
}

export const kinds: Kind[] = [
  { id: 'webhook', label: 'Webhook', icon: 'webhook', category: 'trigger', description: 'Starts when an app calls its URL', fields: [
    { key: 'path', label: 'Path', type: 'text', placeholder: '/hooks/signup' },
  ] },
  { id: 'schedule', label: 'Schedule', icon: 'schedule', category: 'trigger', description: 'Starts on a timetable', fields: [
    { key: 'every', label: 'Every', type: 'select', options: ['15 minutes', 'Hour', 'Day at 9:00', 'Monday at 9:00'] },
  ] },
  { id: 'email-in', label: 'New email', icon: 'mark_email_unread', category: 'trigger', description: 'Starts when an email arrives', fields: [
    { key: 'from', label: 'From contains', type: 'text', placeholder: '@customer.com' },
  ] },
  { id: 'http', label: 'HTTP request', icon: 'http', category: 'action', description: 'Calls an API', seconds: 0.9, fields: [
    { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'] },
    { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.dev/v1/…', required: true },
  ] },
  { id: 'email', label: 'Send email', icon: 'send', category: 'action', description: 'Sends an email', fields: [
    { key: 'to', label: 'To', type: 'text', placeholder: '{{ customer.email }}', required: true },
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'body', label: 'Message', type: 'textarea' },
  ] },
  { id: 'chat', label: 'Post message', icon: 'forum', category: 'action', description: 'Posts to a team channel', fields: [
    { key: 'channel', label: 'Channel', type: 'text', placeholder: '#sales' },
    { key: 'text', label: 'Message', type: 'textarea' },
  ] },
  { id: 'row', label: 'Add row', icon: 'table_rows', category: 'action', description: 'Adds a row to a sheet', fields: [
    { key: 'sheet', label: 'Sheet', type: 'select', options: ['Signups', 'Leads', 'Orders'] },
  ] },
  { id: 'condition', label: 'Condition', icon: 'call_split', category: 'logic', description: 'Goes one way or the other', branches: ['yes', 'no'], fields: [
    { key: 'rule', label: 'When', type: 'text', placeholder: 'plan is "Pro"' },
    { key: 'test', label: 'In test runs, take', type: 'select', options: ['yes', 'no'] },
  ] },
  { id: 'delay', label: 'Wait', icon: 'hourglass_top', category: 'logic', description: 'Pauses before going on', seconds: 1.6, fields: [
    { key: 'for', label: 'For', type: 'select', options: ['1 minute', '1 hour', '1 day'] },
  ] },
  { id: 'filter', label: 'Filter', icon: 'filter_alt', category: 'logic', description: 'Only goes on when it matches', fields: [
    { key: 'rule', label: 'Only when', type: 'text', placeholder: 'country is "AR"' },
  ] },
]

export const kindById = new Map(kinds.map((k) => [k.id, k]))

export const categories: { id: Category; label: string; color: 'tertiary' | 'primary' | 'secondary' }[] = [
  { id: 'trigger', label: 'Triggers', color: 'tertiary' },
  { id: 'action', label: 'Actions', color: 'primary' },
  { id: 'logic', label: 'Logic', color: 'secondary' },
]
export const colorOf = (c: Category) => categories.find((x) => x.id === c)!.color
