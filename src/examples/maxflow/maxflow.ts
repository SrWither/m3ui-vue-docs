// Maximum flow, step by step: Edmonds–Karp (Ford–Fulkerson with BFS augmenting paths) and Dinic (BFS level graph,
// then a blocking flow of DFS paths). Each algorithm runs to the end at once and records a frame per step, so the
// page can step forwards and backwards through them freely.

export interface Net {
  nodes: { id: string; label: string }[]
  edges: { id: string; source: string; target: string; capacity: number }[]
  source: string
  sink: string
}

/** One arc of a path: along its edge (`fwd`, adding flow) or against it (`back`, cancelling flow) */
export interface Arc { edge: string; dir: 'fwd' | 'back' }

export interface Frame {
  /** Flow on each edge after this step */
  flow: Record<string, number>
  total: number
  /** What the step did, in a sentence */
  title: string
  detail: string
  /** Vertices the search reached */
  visited?: string[]
  /** Dinic: each vertex's level in the current phase */
  levels?: Record<string, number>
  /** The augmenting path being pushed */
  path?: Arc[]
  bottleneck?: number
  /** At the end: the source side of a minimum cut, and the edges across it */
  cut?: { side: string[]; edges: string[] }
  done?: boolean
}

export type Algorithm = 'edmonds-karp' | 'dinic'

interface ResArc { edge: string; dir: 'fwd' | 'back'; to: string; cap: number }

function residual(net: Net, flow: Record<string, number>) {
  const out = new Map<string, ResArc[]>(net.nodes.map((n) => [n.id, []]))
  for (const e of net.edges) {
    const f = flow[e.id] ?? 0
    out.get(e.source)?.push({ edge: e.id, dir: 'fwd', to: e.target, cap: e.capacity - f })
    out.get(e.target)?.push({ edge: e.id, dir: 'back', to: e.source, cap: f })
  }
  return out
}

const label = (net: Net, id: string) => net.nodes.find((n) => n.id === id)?.label ?? id

function bfs(net: Net, flow: Record<string, number>) {
  const res = residual(net, flow)
  const parent = new Map<string, ResArc & { from: string }>()
  const level: Record<string, number> = { [net.source]: 0 }
  const order = [net.source]
  const queue = [net.source]
  while (queue.length) {
    const u = queue.shift()!
    for (const a of res.get(u) ?? []) {
      if (a.cap <= 0 || a.to in level) continue
      level[a.to] = level[u]! + 1
      parent.set(a.to, { ...a, from: u })
      order.push(a.to)
      queue.push(a.to)
    }
  }
  return { parent, level, order, res }
}

function cutOf(net: Net, flow: Record<string, number>, total: number): Frame {
  const { order } = bfs(net, flow)
  const side = new Set(order)
  const edges = net.edges.filter((e) => side.has(e.source) && !side.has(e.target)).map((e) => e.id)
  const caps = net.edges.filter((e) => edges.includes(e.id))
  return {
    flow: { ...flow },
    total,
    title: `Maximum flow: ${total}`,
    detail: `No augmenting path is left: from ${label(net, net.source)} the residual graph only reaches ${order.map((id) => label(net, id)).join(', ')}. `
      + `The edges leaving that side form a minimum cut, ${caps.map((e) => `${label(net, e.source)}→${label(net, e.target)} (${e.capacity})`).join(', ') || 'none'}, `
      + `whose capacities add up to ${caps.reduce((s, e) => s + e.capacity, 0)}: the same as the flow, as the max-flow min-cut theorem says.`,
    visited: order,
    cut: { side: order, edges },
    done: true,
  }
}

function pathText(net: Net, start: string, path: Arc[]) {
  const names = [label(net, start)]
  let at = start
  for (const a of path) {
    const e = net.edges.find((x) => x.id === a.edge)!
    at = a.dir === 'fwd' ? e.target : e.source
    names.push(label(net, at))
  }
  return names.join(' → ')
}

function augment(net: Net, flow: Record<string, number>, path: Arc[], amount: number) {
  const next = { ...flow }
  for (const a of path) next[a.edge] = (next[a.edge] ?? 0) + (a.dir === 'fwd' ? amount : -amount)
  return next
}

function bottleneckText(net: Net, path: Arc[], flow: Record<string, number>) {
  return path.map((a) => {
    const e = net.edges.find((x) => x.id === a.edge)!
    return a.dir === 'fwd' ? String(e.capacity - (flow[e.id] ?? 0)) : `${flow[e.id] ?? 0} back`
  }).join(', ')
}

const LIMIT = 400

export function edmondsKarp(net: Net): Frame[] {
  let flow: Record<string, number> = Object.fromEntries(net.edges.map((e) => [e.id, 0]))
  let total = 0
  const frames: Frame[] = [{ flow, total, title: 'Start with no flow', detail: 'Edmonds–Karp is Ford–Fulkerson with the shortest augmenting path each time: a breadth-first search over the residual graph, where an edge can take its spare capacity forwards, or give back its flow backwards.' }]
  for (let round = 1; frames.length < LIMIT; round++) {
    const { parent, order } = bfs(net, flow)
    if (!parent.has(net.sink)) break
    const path: Arc[] = []
    for (let v = net.sink; v !== net.source;) {
      const p = parent.get(v)!
      path.unshift({ edge: p.edge, dir: p.dir })
      v = p.from
    }
    const amount = Math.min(...path.map((a) => {
      const e = net.edges.find((x) => x.id === a.edge)!
      return a.dir === 'fwd' ? e.capacity - (flow[e.id] ?? 0) : flow[e.id] ?? 0
    }))
    const back = path.some((a) => a.dir === 'back')
    frames.push({
      flow, total, visited: order, path, bottleneck: amount,
      title: `Path ${round}: ${pathText(net, net.source, path)}`,
      detail: `The BFS reaches ${label(net, net.sink)} in ${path.length} steps. Spare capacity along it: ${bottleneckText(net, path, flow)}, so it can carry ${amount}.`
        + (back ? ' One arc runs against an edge: pushing along it takes flow back from that edge, rerouting it.' : ''),
    })
    flow = augment(net, flow, path, amount)
    total += amount
    frames.push({ flow, total, path, bottleneck: amount, title: `Push ${amount}: the flow is now ${total}`, detail: `Every edge along the path changes by ${amount}${back ? ' (the backward one gives it back)' : ''}; at least one is now saturated or empty, so this exact path is gone.` })
  }
  frames.push(cutOf(net, flow, total))
  return frames
}

export function dinic(net: Net): Frame[] {
  let flow: Record<string, number> = Object.fromEntries(net.edges.map((e) => [e.id, 0]))
  let total = 0
  const frames: Frame[] = [{ flow, total, title: 'Start with no flow', detail: 'Dinic works in phases. Each phase labels every vertex with its BFS distance from the source (its level), then pushes a blocking flow using only arcs that go one level up, with depth-first searches.' }]
  for (let phase = 1; frames.length < LIMIT; phase++) {
    const { level, order } = bfs(net, flow)
    if (!(net.sink in level)) break
    frames.push({
      flow, total, visited: order, levels: level,
      title: `Phase ${phase}: level graph`,
      detail: `${label(net, net.sink)} is at level ${level[net.sink]}. Only residual arcs from level k to level k + 1 count in this phase, so every path it finds has exactly ${level[net.sink]} arcs.`,
    })
    // Blocking flow: DFS along level arcs, with each vertex's next arc remembered (dead ends aren't retried)
    const next = new Map<string, number>()
    for (let found = 0; frames.length < LIMIT; found++) {
      const res = residual(net, flow)
      const path: Arc[] = []
      const dfs = (u: string): boolean => {
        if (u === net.sink) return true
        const arcs = res.get(u) ?? []
        for (let i = next.get(u) ?? 0; i < arcs.length; i++, next.set(u, i)) {
          const a = arcs[i]!
          if (a.cap <= 0 || level[a.to] !== level[u]! + 1) continue
          path.push({ edge: a.edge, dir: a.dir })
          if (dfs(a.to)) return true
          path.pop()
        }
        next.set(u, arcs.length)
        return false
      }
      if (!dfs(net.source)) {
        frames.push({ flow, total, levels: level, title: `Phase ${phase} done: blocking flow`, detail: `${found} path${found === 1 ? '' : 's'} in this phase. Every path along level arcs now has a saturated arc, so the next phase's BFS finds ${label(net, net.sink)} further away, or not at all.` })
        break
      }
      const amount = Math.min(...path.map((a) => {
        const e = net.edges.find((x) => x.id === a.edge)!
        return a.dir === 'fwd' ? e.capacity - (flow[e.id] ?? 0) : flow[e.id] ?? 0
      }))
      frames.push({ flow, total, levels: level, path, bottleneck: amount, title: `DFS path: ${pathText(net, net.source, path)}`, detail: `It climbs one level per arc. Spare capacity along it: ${bottleneckText(net, path, flow)}, so it can carry ${amount}.` })
      flow = augment(net, flow, path, amount)
      total += amount
      frames.push({ flow, total, levels: level, path, bottleneck: amount, title: `Push ${amount}: the flow is now ${total}`, detail: 'The search goes on from the source, skipping the arcs that turned out to be dead ends.' })
    }
  }
  frames.push(cutOf(net, flow, total))
  return frames
}

export const run = (algorithm: Algorithm, net: Net) => (algorithm === 'dinic' ? dinic(net) : edmondsKarp(net))
