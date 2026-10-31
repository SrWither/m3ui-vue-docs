// What the user does to a part (a switch flipped, a key typed, a RAM word edited), as data rather than a function,
// so the same change can be applied here and sent to the simulation's Worker. Pure, no Vue.

export type PokeOp =
  /** Set these fields of the part's state */
  | { set: Record<string, unknown> }
  /** Append to an array field (a keyboard's queue) */
  | { push: [key: string, value: unknown] }
  /** Write one element of an array field (a memory word) */
  | { index: [key: string, i: number, value: number] }
  /** Fill an array field (clearing a memory) */
  | { fill: [key: string, value: number] }
  /** Overwrite an array field from the start (a memory loaded from a file) */
  | { assign: [key: string, values: ArrayLike<number>] }

export function applyOp(state: any, op: PokeOp) {
  if (!state) return
  if ('set' in op) Object.assign(state, op.set)
  else if ('push' in op) state[op.push[0]]?.push(op.push[1])
  else if ('index' in op) {
    const a = state[op.index[0]]
    if (a) a[op.index[1]] = op.index[2]
  } else if ('fill' in op) state[op.fill[0]]?.fill(op.fill[1])
  else if ('assign' in op) state[op.assign[0]]?.set(op.assign[1])
}
