/*
 * A small line diff (longest common subsequence) for the pull request view, grouped into hunks
 * with three lines of context, like `git diff`.
 */
export interface DiffLine {
  type: ' ' | '+' | '-'
  text: string
  old?: number
  new?: number
}
export interface Hunk {
  header: string
  lines: DiffLine[]
}

export function diff(before: string, after: string, context = 3): { hunks: Hunk[]; added: number; removed: number } {
  const a = before.split('\n')
  const b = after.split('\n')
  // Trim the common head and tail first: edits are usually small, the table stays tiny.
  let start = 0
  while (start < a.length && start < b.length && a[start] === b[start]) start++
  let endA = a.length
  let endB = b.length
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--
    endB--
  }
  const A = a.slice(start, endA)
  const B = b.slice(start, endB)
  const lcs: number[][] = Array.from({ length: A.length + 1 }, () => new Array<number>(B.length + 1).fill(0))
  for (let i = A.length - 1; i >= 0; i--) for (let j = B.length - 1; j >= 0; j--) lcs[i]![j] = A[i] === B[j] ? lcs[i + 1]![j + 1]! + 1 : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!)

  const all: DiffLine[] = a.slice(0, start).map((text, k) => ({ type: ' ', text, old: k + 1, new: k + 1 }))
  let i = 0
  let j = 0
  while (i < A.length || j < B.length) {
    if (i < A.length && j < B.length && A[i] === B[j]) {
      all.push({ type: ' ', text: A[i]!, old: start + i + 1, new: start + j + 1 })
      i++
      j++
    } else if (j < B.length && (i >= A.length || lcs[i]![j + 1]! >= lcs[i + 1]![j]!)) {
      all.push({ type: '+', text: B[j]!, new: start + j + 1 })
      j++
    } else {
      all.push({ type: '-', text: A[i]!, old: start + i + 1 })
      i++
    }
  }
  a.slice(endA).forEach((text, k) => all.push({ type: ' ', text, old: endA + k + 1, new: endB + k + 1 }))

  // Keep changed lines plus `context` lines around them, split into hunks at the gaps.
  const keep = all.map(() => false)
  all.forEach((l, k) => {
    if (l.type === ' ') return
    for (let x = Math.max(0, k - context); x <= Math.min(all.length - 1, k + context); x++) keep[x] = true
  })
  const hunks: Hunk[] = []
  let current: DiffLine[] | null = null
  all.forEach((l, k) => {
    if (!keep[k]) return (current = null)
    if (!current) {
      current = []
      hunks.push({ header: '', lines: current })
    }
    current.push(l)
  })
  for (const h of hunks) {
    const first = h.lines[0]!
    const oldCount = h.lines.filter((l) => l.type !== '+').length
    const newCount = h.lines.filter((l) => l.type !== '-').length
    h.header = `@@ -${first.old ?? first.new} ,${oldCount} +${first.new ?? first.old},${newCount} @@`.replace(' ,', ',')
  }
  return { hunks, added: all.filter((l) => l.type === '+').length, removed: all.filter((l) => l.type === '-').length }
}
