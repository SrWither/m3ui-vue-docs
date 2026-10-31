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
  { id: 'form', label: 'Form submitted', icon: 'assignment', category: 'trigger', description: 'Starts when someone sends a form', fields: [
    { key: 'form', label: 'Form', type: 'select', options: ['Contact', 'Signup', 'Feedback'] },
  ] },
  { id: 'payment', label: 'New payment', icon: 'payments', category: 'trigger', description: 'Starts when a payment goes through', fields: [
    { key: 'min', label: 'At least', type: 'text', placeholder: '$100' },
  ] },
  { id: 'file-in', label: 'File uploaded', icon: 'upload_file', category: 'trigger', description: 'Starts when a file lands in a folder', fields: [
    { key: 'folder', label: 'Folder', type: 'text', placeholder: '/invoices' },
  ] },
  { id: 'manual', label: 'Run by hand', icon: 'touch_app', category: 'trigger', description: 'Starts when you press Run', fields: [] },
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
  { id: 'summarize', label: 'Summarize', icon: 'summarize', category: 'action', description: 'Writes a short summary of a text', seconds: 1.4, fields: [
    { key: 'text', label: 'Text', type: 'textarea', placeholder: '{{ email.body }}', required: true },
    { key: 'length', label: 'Length', type: 'select', options: ['One line', 'A paragraph', 'Bullet points'] },
  ] },
  { id: 'task', label: 'Create task', icon: 'add_task', category: 'action', description: 'Adds a task to a board', fields: [
    { key: 'board', label: 'Board', type: 'select', options: ['Support', 'Sales', 'Ops'] },
    { key: 'title', label: 'Title', type: 'text', required: true },
  ] },
  { id: 'sms', label: 'Send SMS', icon: 'sms', category: 'action', description: 'Texts a phone number', fields: [
    { key: 'to', label: 'To', type: 'text', placeholder: '{{ customer.phone }}', required: true },
    { key: 'text', label: 'Message', type: 'textarea' },
  ] },
  { id: 'crm', label: 'Update contact', icon: 'contact_page', category: 'action', description: 'Changes a contact in the CRM', fields: [
    { key: 'field', label: 'Field', type: 'select', options: ['Stage', 'Owner', 'Tags'] },
    { key: 'value', label: 'Value', type: 'text' },
  ] },
  { id: 'set', label: 'Set fields', icon: 'data_object', category: 'action', description: 'Shapes the data for the next steps', fields: [
    { key: 'fields', label: 'Fields', type: 'textarea', placeholder: 'name = {{ first }} {{ last }}' },
  ] },
  { id: 'code', label: 'Run code', icon: 'code', category: 'action', description: 'Runs a bit of JavaScript', seconds: 0.6, fields: [
    { key: 'code', label: 'Code', type: 'textarea', placeholder: 'return items.filter((i) => i.total > 100)', required: true },
  ] },
  { id: 'condition', label: 'Condition', icon: 'call_split', category: 'logic', description: 'Goes one way or the other', branches: ['yes', 'no'], fields: [
    { key: 'rule', label: 'When', type: 'text', placeholder: 'plan is "Pro"' },
    { key: 'test', label: 'In test runs, take', type: 'select', options: ['yes', 'no'] },
  ] },
  { id: 'delay', label: 'Wait', icon: 'hourglass_top', category: 'logic', description: 'Pauses before going on', seconds: 1.6, fields: [
    { key: 'for', label: 'For', type: 'select', options: ['1 minute', '1 hour', '1 day'] },
  ] },
  { id: 'switch', label: 'Switch', icon: 'alt_route', category: 'logic', description: 'Goes one of three ways', branches: ['low', 'mid', 'high'], fields: [
    { key: 'value', label: 'Value', type: 'text', placeholder: '{{ order.total }}' },
    { key: 'test', label: 'In test runs, take', type: 'select', options: ['low', 'mid', 'high'] },
  ] },
  { id: 'loop', label: 'For each', icon: 'repeat', category: 'logic', description: 'Runs the next steps once per item', seconds: 1.2, branches: ['each', 'done'], fields: [
    { key: 'items', label: 'Items', type: 'text', placeholder: '{{ order.lines }}' },
    { key: 'test', label: 'In test runs, take', type: 'select', options: ['each', 'done'] },
  ] },
  { id: 'approval', label: 'Approval', icon: 'how_to_reg', category: 'logic', description: 'Waits for someone to approve', seconds: 2, branches: ['approved', 'rejected'], fields: [
    { key: 'who', label: 'Ask', type: 'text', placeholder: 'manager@company.com' },
    { key: 'test', label: 'In test runs, take', type: 'select', options: ['approved', 'rejected'] },
  ] },
  { id: 'split', label: 'A/B split', icon: 'call_split', category: 'logic', description: 'Sends half one way, half the other', branches: ['a', 'b'], fields: [
    { key: 'test', label: 'In test runs, take', type: 'select', options: ['a', 'b'] },
  ] },
  { id: 'merge', label: 'Merge', icon: 'merge', category: 'logic', description: 'Joins branches back into one', fields: [] },
  { id: 'stop', label: 'Stop', icon: 'block', category: 'logic', description: 'Ends the run here', fields: [] },
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
