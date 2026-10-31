// What ROMs and RAMs hold, outside the circuit's nodes: a memory can be 16 MiB, far too big to live in a node's
// data (MFlow copies and compares that on every edit). Each ROM/RAM names its image in `params.image`; the cells
// are a typed array as wide as a word (bytes for byte addressing). Also reading and writing memory files:
// raw binary (.bin, .rom, .nes), Intel HEX, Logisim's "v2.0 raw" and plain hex words. Pure, no Vue.

export type Cells = Uint8Array | Uint16Array | Uint32Array
/** The most a single memory may hold */
export const MAX_BYTES = 16 * 2 ** 20

const images = new Map<string, Cells>()
let made = 0
export const newImageId = () => `img${Date.now().toString(36)}${(made++).toString(36)}`

export const bytesPerCell = (bits: number) => (bits <= 8 ? 1 : bits <= 16 ? 2 : 4)
function alloc(n: number, bits: number): Cells {
  const b = bytesPerCell(bits)
  return b === 1 ? new Uint8Array(n) : b === 2 ? new Uint16Array(n) : new Uint32Array(n)
}
/** Address bits a memory of `bits`-wide cells may have */
export const maxAddressBits = (bits: number) => Math.log2(MAX_BYTES / bytesPerCell(bits))

/** A memory's cells: `n` of them, `bits` wide. Made empty the first time; a size or width change keeps what fits */
export function cellsOf(id: string | undefined, n: number, bits: number): Cells {
  const key = id ?? ''
  const have = images.get(key)
  if (have && have.length === n && have.BYTES_PER_ELEMENT === bytesPerCell(bits)) return have
  const cells = alloc(n, bits)
  if (have) {
    const m = 2 ** bits - 1
    const len = Math.min(n, have.length)
    for (let i = 0; i < len; i++) cells[i] = have[i]! & m
  }
  images.set(key, cells)
  return cells
}
export const hasImage = (id: string) => images.has(id)
export function setCells(id: string, values: ArrayLike<number>, n: number, bits: number) {
  // In place: a ROM keeps its cells array from when it was set up
  const cells = cellsOf(id, n, bits).fill(0)
  const m = bits >= 32 ? 0xffffffff : 2 ** bits - 1
  const len = Math.min(n, values.length)
  for (let i = 0; i < len; i++) cells[i] = (values[i]! & m) >>> 0
  return cells
}
export function cloneImage(from: string, to: string) {
  const c = images.get(from)
  if (c) images.set(to, c.slice())
}

// ── Saving with the circuit ─────────────────────────────────────────────────────────────────────────────
function toBase64(bytes: Uint8Array) {
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s)
}
const fromBase64 = (s: string) => Uint8Array.from(atob(s), (ch) => ch.charCodeAt(0))
/** An image as base64 of its little-endian bytes, trailing zero cells left out */
export function encodeImage(id: string): { n: number; bytes: number; data: string } | undefined {
  const c = images.get(id)
  if (!c) return
  let end = c.length
  while (end && !c[end - 1]) end--
  const bytes = new Uint8Array(c.buffer, c.byteOffset, end * c.BYTES_PER_ELEMENT)
  return { n: c.length, bytes: c.BYTES_PER_ELEMENT, data: toBase64(bytes) }
}
export function decodeImage(id: string, saved: { n: number; bytes: number; data: string }) {
  const raw = fromBase64(saved.data)
  const Ctor = saved.bytes === 1 ? Uint8Array : saved.bytes === 2 ? Uint16Array : Uint32Array
  const cells = new Ctor(saved.n)
  new Uint8Array(cells.buffer).set(raw.subarray(0, cells.byteLength))
  images.set(id, cells)
}

// ── Memory files ────────────────────────────────────────────────────────────────────────────────────────
/** Bytes packed into cells little-endian, as many bytes per cell as the width needs */
function pack(bytes: Uint8Array, bits: number): number[] {
  const b = bytesPerCell(bits)
  const out: number[] = []
  for (let i = 0; i < bytes.length; i += b) {
    let v = 0
    for (let j = 0; j < b; j++) v += (bytes[i + j] ?? 0) * 2 ** (8 * j)
    out.push(v)
  }
  return out
}
function intelHex(text: string): Uint8Array {
  const bytes: number[] = []
  let base = 0
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line.startsWith(':')) continue
    const rec = line.slice(1).match(/../g)!.map((h) => parseInt(h, 16))
    const [len = 0, hi = 0, lo = 0, type] = rec
    const data = rec.slice(4, 4 + len)
    if (type === 0) data.forEach((d, i) => (bytes[base + (hi << 8) + lo + i] = d))
    else if (type === 1) break
    else if (type === 2) base = ((data[0]! << 8) | data[1]!) * 16
    else if (type === 4) base = ((data[0]! << 8) | data[1]!) * 65536
  }
  return Uint8Array.from(bytes, (b) => b ?? 0)
}
/** Hex words separated by spaces, commas or lines; `N*value` repeats one (Logisim); # ; and // start comments */
function hexWords(text: string): number[] | null {
  const body = text.replace(/^v2\.0 raw\s*/, '').replace(/(#|;|\/\/).*$/gm, '')
  const tokens = body.split(/[\s,]+/).filter(Boolean)
  const out: number[] = []
  for (const t of tokens) {
    const m = t.match(/^(?:(\d+)\*)?(?:0x)?([0-9a-f]+)$/i)
    if (!m) return null
    const v = parseInt(m[2]!, 16)
    for (let i = 0; i < (m[1] ? Number(m[1]) : 1); i++) out.push(v)
  }
  return out
}

/** A memory file's words for cells `bits` wide, and which format it was read as */
export function parseMemoryFile(bytes: Uint8Array, bits: number): { words: number[]; format: string } {
  const head = new TextDecoder().decode(bytes.subarray(0, 64))
  // iNES: a 16-byte header (and a 512-byte trainer when flagged) before PRG and CHR
  if (head.startsWith('NES\x1a')) return { words: pack(bytes.subarray(16 + (bytes[6]! & 4 ? 512 : 0)), bits), format: 'iNES (header skipped)' }
  const printable = bytes.every((b) => b === 9 || b === 10 || b === 13 || (b >= 32 && b < 127))
  if (printable) {
    const text = new TextDecoder().decode(bytes)
    if (/^\s*:[0-9a-f]{10}/i.test(text)) return { words: pack(intelHex(text), bits), format: 'Intel HEX' }
    const words = hexWords(text)
    if (words) return { words, format: text.startsWith('v2.0 raw') ? 'Logisim v2.0 raw' : 'hex words' }
  }
  return { words: pack(bytes, bits), format: 'binary' }
}
/** As raw little-endian bytes (.bin) */
export function toBinary(cells: Cells): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(cells.byteLength)
  out.set(new Uint8Array(cells.buffer, cells.byteOffset, cells.byteLength))
  return out
}
/** As Logisim's "v2.0 raw" text, runs of the same word as N*value */
export function toLogisim(cells: Cells): string {
  let end = cells.length
  while (end && !cells[end - 1]) end--
  const out: string[] = []
  for (let i = 0; i < end; ) {
    let j = i
    while (j < end && cells[j] === cells[i]) j++
    const h = cells[i]!.toString(16)
    out.push(j - i >= 4 ? `${j - i}*${h}` : Array(j - i).fill(h).join(' '))
    i = j
  }
  const lines: string[] = []
  for (let i = 0; i < out.length; i += 8) lines.push(out.slice(i, i + 8).join(' '))
  return `v2.0 raw\n${lines.join('\n')}\n`
}
