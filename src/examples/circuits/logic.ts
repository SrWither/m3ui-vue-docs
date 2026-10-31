// Signals: up to 32 bits, each 0, 1, Z (floating: nothing drives it) or X (error: unknown, or drivers that
// disagree). Kept as bit masks, so a whole bus goes through a gate in one step.
//   m: the bus's bits    v: the value of the known bits    k: which bits are known (0 or 1)    e: which are X
// A bit in m that's neither in k nor in e is Z.
export interface Sig { m: number; v: number; k: number; e: number }

const u = (x: number) => x >>> 0
export const mask = (width: number) => (width >= 32 ? 0xffffffff : 2 ** width - 1)
export const all = (value: number, width: number): Sig => {
  const m = mask(width)
  return { m, v: u(value & m), k: m, e: 0 }
}
export const Z = (m: number): Sig => ({ m, v: 0, k: 0, e: 0 })
export const X = (m: number): Sig => ({ m, v: 0, k: 0, e: m })

/** Every bit 0 or 1 */
export const known = (s: Sig) => s.k === s.m
/** Every bit floating: nothing drives it */
export const isZ = (s: Sig) => s.k === 0 && s.e === 0
export const widthOf = (s: Sig) => Math.round(Math.log2(s.m + 1))

export function and(a: Sig, b: Sig, m: number): Sig {
  const one = a.v & a.k & b.v & b.k & m
  const zero = ((~a.v & a.k) | (~b.v & b.k)) & m
  const k = u(one | zero)
  return { m, v: u(one), k, e: u(m & ~k) }
}
export function or(a: Sig, b: Sig, m: number): Sig {
  const one = ((a.v & a.k) | (b.v & b.k)) & m
  const zero = ~a.v & a.k & ~b.v & b.k & m
  const k = u(one | zero)
  return { m, v: u(one), k, e: u(m & ~k) }
}
export function xor(a: Sig, b: Sig, m: number): Sig {
  const k = u(a.k & b.k & m)
  return { m, v: u((a.v ^ b.v) & k), k, e: u(m & ~k) }
}
export function not(a: Sig, m: number): Sig {
  const k = u(a.k & m)
  return { m, v: u(~a.v & k), k, e: u(m & ~k) }
}
export const same = (a: Sig, b: Sig) => a.v === b.v && a.k === b.k && a.e === b.e && a.m === b.m

/** What an input sees when several outputs drive it: agreeing bits pass, Z gives way, disagreeing bits are X */
export function resolve(drivers: Sig[], m: number): Sig {
  let v = 0
  let k = 0
  let e = 0
  for (const s of drivers) {
    const clash = k & s.k & (v ^ s.v)
    e |= s.e | clash
    v = (v & k) | (s.v & s.k)
    k |= s.k
  }
  e = u(e & m)
  k = u(k & m & ~e)
  return { m, v: u(v & k), k, e }
}

/** A signal as text: hex for buses, the bit for one wire; Z and X as letters */
export function format(s: Sig, base: 'hex' | 'dec' | 'bin' = 'hex'): string {
  const width = widthOf(s)
  if (width === 1) return s.k ? String(s.v) : s.e ? 'X' : 'Z'
  if (base === 'bin') {
    let out = ''
    for (let i = width - 1; i >= 0; i--) {
      const b = 2 ** i
      out += s.k & b ? (s.v & b ? '1' : '0') : s.e & b ? 'X' : 'Z'
    }
    return out
  }
  if (!known(s)) return isZ(s) ? 'Z' : 'X'
  return base === 'dec' ? String(s.v) : s.v.toString(16).toUpperCase().padStart(Math.ceil(width / 4), '0')
}

/** A rising clock edge since the last call: remembers the clock's last value in the part's state */
export function rose(state: { clk?: Sig }, clk: Sig) {
  const before = state.clk
  state.clk = clk
  return !!before && known(before) && before.v === 0 && known(clk) && clk.v === 1
}
/** An input that's 1 (an unconnected one counts as `unconnected`: on for an enable, off for a clear) */
export const on = (s: Sig, unconnected = false) => (isZ(s) ? unconnected : known(s) && s.v !== 0)
