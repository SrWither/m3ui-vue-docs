const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 86_400_000],
  ['month', 30 * 86_400_000],
  ['week', 7 * 86_400_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]
/** "3 days ago", "yesterday", "now". */
export function ago(ts: number) {
  const diff = ts - Date.now()
  for (const [unit, ms] of units) if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit)
  return 'now'
}
export const duration = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`)
