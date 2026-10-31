// Networks to start from, with their vertices' positions on the canvas.
export interface Preset {
  id: string
  name: string
  description: string
  nodes: { id: string; label: string; x: number; y: number }[]
  edges: [source: string, target: string, capacity: number][]
}

export const presets: Preset[] = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Just a source and a sink: double click the canvas to add vertices, and drag from a vertex\'s right edge to another (or into empty space, to make a new one) to add edges.',
    nodes: [
      { id: 's', label: 's', x: 0, y: 140 },
      { id: 't', label: 't', x: 600, y: 140 },
    ],
    edges: [],
  },
  {
    id: 'clrs',
    name: 'Classic',
    description: 'The textbook network (Cormen et al., Introduction to Algorithms): edges both ways between the middle vertices, maximum flow 23.',
    nodes: [
      { id: 's', label: 's', x: 0, y: 140 },
      { id: 'v1', label: 'v1', x: 220, y: 0 },
      { id: 'v2', label: 'v2', x: 220, y: 280 },
      { id: 'v3', label: 'v3', x: 480, y: 0 },
      { id: 'v4', label: 'v4', x: 480, y: 280 },
      { id: 't', label: 't', x: 700, y: 140 },
    ],
    edges: [['s', 'v1', 16], ['s', 'v2', 13], ['v2', 'v1', 4], ['v1', 'v3', 12], ['v3', 'v2', 9], ['v2', 'v4', 14], ['v4', 'v3', 7], ['v3', 't', 20], ['v4', 't', 4]],
  },
  {
    id: 'trap',
    name: 'Why shortest paths',
    description: 'Plain Ford–Fulkerson can zigzag through the middle edge and push 1 at a time, 2000 times. Edmonds–Karp\'s shortest paths finish in 2.',
    nodes: [
      { id: 's', label: 's', x: 0, y: 140 },
      { id: 'a', label: 'a', x: 280, y: 0 },
      { id: 'b', label: 'b', x: 280, y: 280 },
      { id: 't', label: 't', x: 560, y: 140 },
    ],
    edges: [['s', 'a', 1000], ['s', 'b', 1000], ['a', 'b', 1], ['a', 't', 1000], ['b', 't', 1000]],
  },
  {
    id: 'matching',
    name: 'Matching',
    description: 'Who takes which shift: people on the left, shifts on the right, an edge where someone can work it, every capacity 1. The maximum flow is the largest assignment.',
    nodes: [
      { id: 's', label: 's', x: 0, y: 180 },
      { id: 'ana', label: 'Ana', x: 220, y: 0 },
      { id: 'bo', label: 'Bo', x: 220, y: 120 },
      { id: 'cy', label: 'Cy', x: 220, y: 240 },
      { id: 'di', label: 'Di', x: 220, y: 360 },
      { id: 'mon', label: 'Mon', x: 480, y: 0 },
      { id: 'tue', label: 'Tue', x: 480, y: 120 },
      { id: 'wed', label: 'Wed', x: 480, y: 240 },
      { id: 'thu', label: 'Thu', x: 480, y: 360 },
      { id: 't', label: 't', x: 700, y: 180 },
    ],
    edges: [
      ['s', 'ana', 1], ['s', 'bo', 1], ['s', 'cy', 1], ['s', 'di', 1],
      ['ana', 'mon', 1], ['ana', 'tue', 1], ['bo', 'mon', 1], ['cy', 'tue', 1], ['cy', 'wed', 1], ['di', 'wed', 1], ['di', 'thu', 1],
      ['mon', 't', 1], ['tue', 't', 1], ['wed', 't', 1], ['thu', 't', 1],
    ],
  },
  {
    id: 'layers',
    name: 'Layered',
    description: 'A wider network where Dinic shines: each phase pushes several paths of the same length before searching again.',
    nodes: [
      { id: 's', label: 's', x: 0, y: 200 },
      { id: 'a', label: 'a', x: 200, y: 40 },
      { id: 'b', label: 'b', x: 200, y: 200 },
      { id: 'c', label: 'c', x: 200, y: 360 },
      { id: 'd', label: 'd', x: 420, y: 40 },
      { id: 'e', label: 'e', x: 420, y: 200 },
      { id: 'f', label: 'f', x: 420, y: 360 },
      { id: 'g', label: 'g', x: 640, y: 120 },
      { id: 'h', label: 'h', x: 640, y: 300 },
      { id: 't', label: 't', x: 840, y: 200 },
    ],
    edges: [
      ['s', 'a', 10], ['s', 'b', 8], ['s', 'c', 10],
      ['a', 'd', 6], ['a', 'e', 5], ['b', 'd', 4], ['b', 'e', 6], ['b', 'f', 3], ['c', 'f', 9], ['c', 'e', 4],
      ['d', 'g', 9], ['e', 'g', 5], ['e', 'h', 7], ['f', 'h', 10], ['d', 'e', 3],
      ['g', 't', 12], ['h', 't', 14],
    ],
  },
]
